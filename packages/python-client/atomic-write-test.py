import asyncio
import json
import time
from upstash_redis.asyncio import Redis
from redenv.utils import set_secret
from redenv.crypto import derive_key, generate_salt, random_bytes, encrypt, buffer_to_hex, decrypt
from redenv.types import RedenvOptions, UpstashConfig

# Credentials from client/example.ts
UPSTASH_URL = "https://lenient-lion-15790.upstash.io"
UPSTASH_TOKEN = "AT2uAAIncDJkZjNkODk5M2E4OWI0NzI5YTBkODEzZDY2ZmI4M2FkMXAyMTU3OTA"

async def main():
    project_name = f"test-atomic-py-{int(time.time())}"
    environment = "dev"
    key = "ATOMIC_KEY_PY"
    value1 = "value-1"
    value2 = "value-2"
    user = "python-integration-test"

    # Direct Redis access for verification
    redis = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)

    # Setup Options object manually since we are testing set_secret util directly
    options = RedenvOptions(
        project=project_name,
        token_id="stk_test",
        token="redenv_sk_test",
        upstash=UpstashConfig(url=UPSTASH_URL, token=UPSTASH_TOKEN),
        environment=environment,
        log="none"
    )

    print(f"\n--- Starting Python Real Integration Test ---")
    print(f"Project: {project_name}")

    try:
        # 1. Setup Metadata & Keys
        print("1. Creating project metadata...")
        
        # We need a valid PEK encrypted in metadata for get_pek to work
        # Generate real PEK
        salt = generate_salt()
        pek = random_bytes(32) # PEK is 32 bytes (256 bits)
        
        # Wrap PEK with our mock service token
        token_key = derive_key("redenv_sk_test", salt)
        # Encrypt the HEX representation of PEK
        encrypted_pek = encrypt(buffer_to_hex(pek), token_key)

        await redis.hset(f"meta@{project_name}", values={
            "historyLimit": 5,
            "serviceTokens": json.dumps({
                "stk_test": {
                    "salt": buffer_to_hex(salt),
                    "encryptedPEK": encrypted_pek,
                    "name": "Test Token"
                }
            })
        })

        # 2. First Write
        print(f"2. Writing first version: '{value1}'...")
        await set_secret(redis, options, key, value1)
        print("   ✓ Write successful")

        # 3. Second Write
        print(f"3. Writing second version: '{value2}'...")
        await set_secret(redis, options, key, value2)
        print("   ✓ Update successful")

        # 4. Verification
        print("4. Verifying data in Redis...")
        raw_data = await redis.hget(f"{environment}:{project_name}", key)
        history = json.loads(raw_data) if isinstance(raw_data, str) else raw_data
        
        print(f"   History length: {len(history)} (Expected: 2)")
        if len(history) != 2:
            raise Exception(f"History length mismatch! Got {len(history)}")

        # Check V2 (Latest)
        v2 = history[0]
        decrypted_v2 = decrypt(v2["value"], pek)
        print(f"   v{v2['version']} Value: '{decrypted_v2}' (Expected: '{value2}')")
        if decrypted_v2 != value2:
            raise Exception("Latest value mismatch!")

        # Check V1
        v1 = history[1]
        decrypted_v1 = decrypt(v1["value"], pek)
        print(f"   v{v1['version']} Value: '{decrypted_v1}' (Expected: '{value1}')")
        if decrypted_v1 != value1:
            raise Exception("Previous value mismatch!")

        # 5. Concurrency Test
        print("\n5. Testing Concurrency (Race Conditions)...")
        parallel_writes = 5
        print(f"   Firing {parallel_writes} writes in parallel...")

        tasks = []
        for i in range(parallel_writes):
            tasks.append(set_secret(redis, options, key, f"concurrent-{i}"))
        
        await asyncio.gather(*tasks)
        print("   ✓ Parallel writes completed")

        # 6. Verify Concurrency
        print("6. Verifying concurrency results...")
        raw_data_concurrent = await redis.hget(f"{environment}:{project_name}", key)
        history = json.loads(raw_data_concurrent) if isinstance(raw_data_concurrent, str) else raw_data_concurrent
        
        # Initial 2 + 5 = 7 total versions created.
        # But historyLimit is 5.
        print(f"   History length: {len(history)} (Expected Cap: 5)")
        if len(history) != 5:
             raise Exception(f"History should be capped at 5! Got {len(history)}")

        latest_version = history[0]['version']
        expected_version = 2 + parallel_writes # 7
        print(f"   Latest Version: {latest_version} (Expected: {expected_version})")

        if latest_version != expected_version:
            raise Exception(f"Race condition detected! Expected version {expected_version}, got {latest_version}. Updates were lost.")

        # Ensure all versions are unique
        versions = [h['version'] for h in history]
        unique_versions = set(versions)
        if len(versions) != len(unique_versions):
            raise Exception("Duplicate version numbers detected!")

        print("\n✅ SUCCESS: Python Atomic set_secret is working correctly on real Redis.")

    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        print("\nCleaning up...")
        await redis.delete(f"meta@{project_name}")
        await redis.delete(f"{environment}:{project_name}")

if __name__ == "__main__":
    asyncio.run(main())