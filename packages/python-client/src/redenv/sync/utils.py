import json
import os
from typing import Dict, Optional, Any, List, Union
from upstash_redis import Redis as SyncRedis
from ..crypto import derive_key, decrypt, hex_to_buffer, encrypt
from ..types import RedenvOptions, LogPreference
from ..errors import RedenvError
from ..secrets import Secrets
from ..utils import log, error

def get_pek(redis: SyncRedis, options: RedenvOptions, metadata: Optional[Dict[str, Any]] = None) -> bytes:
    """
    Fetches and decrypts the Project Encryption Key (PEK).
    """
    if not metadata:
        meta_key = f"meta@{options.project}"
        metadata = redis.hgetall(meta_key)
    
    if not metadata:
        raise RedenvError(f'Project "{options.project}" not found.', "PROJECT_NOT_FOUND")

    service_tokens = metadata.get("serviceTokens")
    if isinstance(service_tokens, str):
        service_tokens = json.loads(service_tokens)
    
    token_info = service_tokens.get(options.token_id) if service_tokens else None

    if not token_info:
        ephemeral_field = f"ephemeral:{options.token_id}"
        raw_ephemeral = metadata.get(ephemeral_field)
        if raw_ephemeral:
            token_info = json.loads(raw_ephemeral) if isinstance(raw_ephemeral, str) else raw_ephemeral

    if not token_info:
        raise RedenvError("Invalid Redenv Token ID.", "INVALID_TOKEN_ID")

    salt = hex_to_buffer(token_info["salt"])
    token_key = derive_key(options.token, salt)
    
    decrypted_pek_hex = decrypt(token_info["encryptedPEK"], token_key)
    
    return hex_to_buffer(decrypted_pek_hex)

def fetch_and_decrypt(redis: SyncRedis, options: RedenvOptions) -> Secrets:
    """
    Fetches all secrets for a given environment and decrypts them.
    """
    log("Expired Cache: Fetching secrets from source...", options.log, "high")
    
    try:
        pek = get_pek(redis, options)
    except Exception as e:
        error(f"Failed to get PEK: {e}", options.log)
        raise e

    env_key = f"{options.environment}:{options.project}"
    versioned_secrets = redis.hgetall(env_key)

    secrets = Secrets()
    if not versioned_secrets:
        log("No secrets found for this environment.", options.log)
        return secrets
    
    for key, history_str in versioned_secrets.items():
        if key.startswith("__"):
            continue

        try:
            history = json.loads(history_str) if isinstance(history_str, str) else history_str
            if not isinstance(history, list) or len(history) == 0:
                continue
            
            encrypted_value = history[0]["value"]
            decrypted_value = decrypt(encrypted_value, pek)
            secrets[key] = decrypted_value
        except Exception:
            error(f'Failed to decrypt secret "{key}".', options.log)
            continue

    log(f"Successfully loaded {len(secrets)} secrets.", options.log)
    return secrets

def populate_env(secrets: Union[Dict[str, str], Secrets], options: RedenvOptions):
    """
    Injects secrets into the current runtime's environment.
    """
    log("Populating environment with secrets...", options.log)
    injected_count = 0
    
    for key, value in secrets.items():
        if not options.env.override and key in os.environ:
            continue
            
        os.environ[key] = value
        injected_count += 1
        
    log(f"Injection complete. {injected_count} variables were set.", options.log)

def set_secret(redis: SyncRedis, options: RedenvOptions, key: str, value: str):
    """
    Sets a secret in Redis with versioning and history.
    """
    env_key = f"{options.environment}:{options.project}"
    meta_key = f"meta@{options.project}"
    
    # Sequential fetch (Simpler for sync, parallel requires threads)
    metadata = redis.hgetall(meta_key)
    current_history_str = redis.hget(env_key, key)
    
    if not metadata:
        raise RedenvError(f'Project "{options.project}" not found.', "PROJECT_NOT_FOUND")
        
    pek = get_pek(redis, options, metadata)
    
    history_limit = int(metadata.get("historyLimit", 10))
    
    history = []
    if current_history_str:
        history = json.loads(current_history_str) if isinstance(current_history_str, str) else current_history_str
        
    if not isinstance(history, list):
        history = []
        
    last_version = history[0]["version"] if len(history) > 0 else 0
    
    encrypted_value = encrypt(value, pek)
    
    from datetime import datetime, timezone
    
    new_version = {
        "version": last_version + 1,
        "value": encrypted_value,
        "user": options.token_id,
        "createdAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    }
    
    history.insert(0, new_version)
    
    if history_limit > 0:
        history = history[:history_limit]
        
    return redis.hset(env_key, key, json.dumps(history))
