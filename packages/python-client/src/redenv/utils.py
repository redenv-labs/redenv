import json
import os
from typing import Dict, Optional, Any, List, Union
from upstash_redis.asyncio import Redis as AsyncRedis
from .crypto import derive_key, decrypt, hex_to_buffer, encrypt
from .types import RedenvOptions, LogPreference
from .errors import RedenvError

def log(message: str, preference: LogPreference = "low", priority: str = "low"):
    if preference == "none":
        return
    if preference == "low" and priority == "high":
        print(f"[REDENV] {message}")
    elif preference == "high":
        print(f"[REDENV] {message}")

def error(message: str, preference: LogPreference = "low"):
    if preference != "none":
        print(f"[REDENV] Error: {message}")

async def get_pek(redis: AsyncRedis, options: RedenvOptions) -> bytes:
    """
    Fetches and decrypts the Project Encryption Key (PEK).
    """
    meta_key = f"meta@{options.project}"
    metadata = await redis.hgetall(meta_key)
    if not metadata:
        raise RedenvError(f'Project "{options.project}" not found.', "PROJECT_NOT_FOUND")

    service_tokens = metadata.get("serviceTokens")
    if isinstance(service_tokens, str):
        service_tokens = json.loads(service_tokens)
    
    token_info = service_tokens.get(options.token_id) if service_tokens else None

    # If not found in standard service tokens, check for ephemeral token field
    if not token_info:
        ephemeral_field = f"ephemeral:{options.token_id}"
        # Redis returns hgetall keys/values as strings usually, but check implementation.
        # hgetall returns dictionary.
        # If accessing specific field that might not be in the map if we used HGETALL on meta_key.
        # But wait, metadata contains ALL fields of the hash.
        raw_ephemeral = metadata.get(ephemeral_field)
        if raw_ephemeral:
            token_info = json.loads(raw_ephemeral) if isinstance(raw_ephemeral, str) else raw_ephemeral

    if not token_info:
        raise RedenvError("Invalid Redenv Token ID.", "INVALID_TOKEN_ID")

    salt = hex_to_buffer(token_info["salt"])
    # Note: derive_key in python takes string password and bytes salt
    token_key = derive_key(options.token, salt)
    
    decrypted_pek_hex = decrypt(token_info["encryptedPEK"], token_key)
    
    return hex_to_buffer(decrypted_pek_hex)

async def fetch_and_decrypt(redis: AsyncRedis, options: RedenvOptions) -> Dict[str, str]:
    """
    Fetches all secrets for a given environment and decrypts them.
    """
    log("Expired Cache: Fetching secrets from source...", options.log, "high")
    
    try:
        pek = await get_pek(redis, options)
    except Exception as e:
        error(f"Failed to get PEK: {e}", options.log)
        raise e

    env_key = f"{options.environment}:{options.project}"
    versioned_secrets = await redis.hgetall(env_key)

    secrets: Dict[str, str] = {}
    if not versioned_secrets:
        log("No secrets found for this environment.", options.log)
        return secrets

    # versioned_secrets is Dict[str, str] where values are JSON strings of arrays
    
    for key, history_str in versioned_secrets.items():
        try:
            history = json.loads(history_str) if isinstance(history_str, str) else history_str
            if not isinstance(history, list) or len(history) == 0:
                continue
            
            # history[0] is the latest
            encrypted_value = history[0]["value"]
            decrypted_value = decrypt(encrypted_value, pek)
            secrets[key] = decrypted_value
        except Exception:
            error(f'Failed to decrypt secret "{key}".', options.log)
            continue

    log(f"Successfully loaded {len(secrets)} secrets.", options.log)
    return secrets

async def populate_env(secrets: Dict[str, str], options: RedenvOptions):
    """
    Injects secrets into the current runtime's environment.
    """
    log("Populating environment with secrets...", options.log)
    injected_count = 0
    
    for key, value in secrets.items():
        os.environ[key] = value
        injected_count += 1
        
    log(f"Injection complete. {injected_count} variables were set.", options.log)

async def set_secret(redis: AsyncRedis, options: RedenvOptions, key: str, value: str):
    # This involves writing to Redis which requires more logic (handling versioning, auditing etc).
    # The JS client `setSecret` calls `writeSecret` in core.
    # Since `core` has `write.ts`, I would need to port `write.ts` too.
    # For a basic SDK that fetches secrets, maybe I can skip `set` for now or default it.
    # The user asked for "build new sdk", "assist me".
    # I should start with Read-Only capability as that's the primary use case for SDKs (running in apps).
    # Writing is usually done via CLI.
    # But `Redenv` class has `set`.
    # I will mark `set` as NotImplemented for now or try to implement it if easy.
    # `writeSecret` in `core` is logic heavy.
    raise NotImplementedError("Setting secrets is not yet implemented in Python SDK")
