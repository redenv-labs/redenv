import pytest
import json
from unittest.mock import AsyncMock, patch
from redenv import Redenv
from redenv.crypto import encrypt, derive_key, buffer_to_hex, random_bytes

# --- Test Data Setup ---
PASSWORD = "masterpassword"
SALT = random_bytes(16)
TOKEN_SALT = random_bytes(16)
TOKEN_SECRET = "redenv_sk_test"
TOKEN_ID = "stk_test"

# 1. Derive PEK
PEK = derive_key(PASSWORD, SALT) # Project Encryption Key

# 2. Encrypt PEK with Service Token
token_key = derive_key(TOKEN_SECRET, TOKEN_SALT)
encrypted_pek = encrypt(buffer_to_hex(PEK), token_key) # Wait, exportKey not implemented in python utils, we used bytes.
# In utils.py get_pek: decrypted_pek_hex = decrypt(..., token_key) -> return hex_to_buffer(decrypted_pek_hex)
# So we need to encrypt the HEX string of the PEK.
pek_hex = buffer_to_hex(PEK)
encrypted_pek_str = encrypt(pek_hex, token_key)

# 3. Create Metadata
METADATA = {
    "serviceTokens": json.dumps({
        TOKEN_ID: {
            "salt": buffer_to_hex(TOKEN_SALT),
            "encryptedPEK": encrypted_pek_str,
            "name": "Test Token"
        }
    }),
    "historyLimit": "10"
}

# 4. Create Secret Data
SECRET_KEY = "API_KEY"
SECRET_VAL = "super-secret-value"
encrypted_secret = encrypt(SECRET_VAL, PEK)

SECRET_HISTORY = [
    {
        "version": 1,
        "value": encrypted_secret,
        "user": "test-user",
        "createdAt": "2023-01-01T00:00:00Z"
    }
]

ENVIRONMENT_DATA = {
    SECRET_KEY: json.dumps(SECRET_HISTORY)
}

# --- Client Setup ---
@pytest.fixture
def mock_redis():
    mock = AsyncMock()
    # Mock hgetall responses
    def side_effect(key):
        if key == "meta@test-project":
            return METADATA
        if key == "dev:test-project":
            return ENVIRONMENT_DATA
        return {}
    
    mock.hgetall.side_effect = side_effect
    
    # Mock hget response (for set_secret and get_version)
    async def hget_side_effect(key, field):
        if key == "dev:test-project" and field == SECRET_KEY:
            return json.dumps(SECRET_HISTORY)
        return None
        
    mock.hget.side_effect = hget_side_effect
    
    return mock

@pytest.fixture
def client(mock_redis):
    with patch("redenv.client.Redis", return_value=mock_redis):
        client = Redenv({
            "project": "test-project",
            "token_id": TOKEN_ID,
            "token": TOKEN_SECRET,
            "environment": "dev",
            "upstash": {"url": "https://mock", "token": "mock"},
            "log": "none"
        })
        return client

@pytest.mark.asyncio
async def test_load_decrypts_successfully(client, mock_redis):
    secrets = await client.load()
    assert secrets[SECRET_KEY] == SECRET_VAL
    assert mock_redis.hgetall.call_count == 2 # 1 meta, 1 env

@pytest.mark.asyncio
async def test_caching_behavior(client, mock_redis):
    # First load
    await client.load()
    assert mock_redis.hgetall.call_count == 2
    
    # Second load (should hit cache)
    await client.load()
    assert mock_redis.hgetall.call_count == 2 # Counts shouldn't increase

@pytest.mark.asyncio
async def test_write_secret(client, mock_redis):
    new_val = "new-value"
    await client.set(SECRET_KEY, new_val)
    
    # Verify eval was called (for Lua script)
    assert mock_redis.eval.called
    
    args = mock_redis.eval.call_args
    script = args[0][0]
    keys = args[0][1]
    argv = args[0][2]
    
    # Check script content basics
    assert "local env_key = KEYS[1]" in script
    assert "redis.call('HSET', env_key, field, encoded)" in script
    
    # Check keys
    assert keys[0] == "dev:test-project"
    
    # Check args: [key, encrypted_value, user, created_at, history_limit]
    assert argv[0] == SECRET_KEY
    # We can't verify encrypted value exactly without decrypting, but it should be a string
    assert isinstance(argv[1], str)
    assert argv[2] == TOKEN_ID
    # History Limit
    assert int(argv[4]) == 10

@pytest.mark.asyncio
async def test_get_version(client, mock_redis):
    # Version 1 exists in our mock data
    val = await client.get_version(SECRET_KEY, 1)
    assert val == SECRET_VAL
    
    # Version 99 does not exist
    val_missing = await client.get_version(SECRET_KEY, 99)
    assert val_missing is None
