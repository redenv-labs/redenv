# Redenv Python SDK

The official Python client for Redenv, a zero-knowledge, end-to-end encrypted secret management system.

## Installation

```bash
pip install redenv
```

## Usage

```python
import asyncio
import os
from redenv import Redenv

async def main():
    # Initialize the client
    client = Redenv({
        "project": "your-project-id",
        "token_id": "your-token-id",
        "token": "your-token",
        "upstash": {
            "url": "your-upstash-redis-url",
            "token": "your-upstash-redis-token"
        },
        # Optional
        "environment": "development", # defaults to development
        "cache": {
            "ttl": 300, # 5 minutes
            "swr": 86400 # 24 hours
        }
    })

    # Fetch and decrypt secrets.
    # This automatically injects them into os.environ
    secrets = await client.load()

    print(f"Loaded {len(secrets)} secrets.")
    print(f"DATABASE_URL: {os.environ.get('DATABASE_URL')}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Features

- **End-to-End Encryption**: Secrets are decrypted only in memory using `AES-256-GCM` and `PBKDF2`.
- **Zero Knowledge**: The backend (Redis) only stores encrypted data.
- **Caching**: Implements Stale-While-Revalidate caching to minimize latency and database calls.
- **Universal Support**: Works with standard Python `asyncio`.
