import { Redis } from "@upstash/redis";
import { writeSecret } from "./src/write";
import { generateRandomKey, decrypt } from "./src/crypto";

const redis = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
});

async function main() {
  const projectName = "test-atomic-" + Date.now();
  const environment = "dev";
  const key = "ATOMIC_KEY";
  const value1 = "value-1";
  const value2 = "value-2";
  const user = "integration-test";

  console.log(`\n--- Starting Real Integration Test ---`);
  console.log(`Project: ${projectName}`);

  try {
    // 1. Setup Metadata (Pre-requisite)
    console.log("1. Creating project metadata...");
    await redis.hset(`meta@${projectName}`, {
      historyLimit: 5,
    });

    // 2. Generate Key
    const pek = await generateRandomKey();

    // 3. First Write
    console.log(`2. Writing first version: "${value1}"...`);
    await writeSecret(redis, projectName, environment, key, value1, pek, user);
    console.log("   ✓ Write successful");

    // 4. Second Write (Update)
    console.log(`3. Writing second version: "${value2}"...`);
    await writeSecret(redis, projectName, environment, key, value2, pek, user);
    console.log("   ✓ Update successful");

    // 5. Verification
    console.log("4. Verifying data in Redis...");
    const rawData = await redis.hget(`${environment}:${projectName}`, key);
    
    if (!rawData) throw new Error("FATAL: Key not found in Redis!");
    
    // Upstash Redis client auto-parses JSON
    let history = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    
    console.log(`   History length: ${history.length} (Expected: 2)`);
    
    if (history.length !== 2) throw new Error(`History length mismatch! Got ${history.length}, expected 2`);

    // Check V2 (Latest)
    const v2 = history[0];
    const decryptedV2 = await decrypt(v2.value, pek);
    console.log(`   v${v2.version} Value: "${decryptedV2}" (Expected: "${value2}")`);
    
    if (decryptedV2 !== value2) throw new Error("Latest value mismatch!");

    // Check V1
    const v1 = history[1];
    const decryptedV1 = await decrypt(v1.value, pek);
    console.log(`   v${v1.version} Value: "${decryptedV1}" (Expected: "${value1}")`);

    if (decryptedV1 !== value1) throw new Error("Previous value mismatch!");

    // --- 6. Concurrency / Race Condition Test ---
    console.log("\n5. Testing Concurrency (Race Conditions)...");
    const parallelWrites = 5;
    console.log(`   Firing ${parallelWrites} writes in parallel...`);

    const promises = [];
    for (let i = 0; i < parallelWrites; i++) {
      promises.push(writeSecret(redis, projectName, environment, key, `concurrent-${i}`, pek, user));
    }

    await Promise.all(promises);
    console.log("   ✓ Parallel writes completed");

    // Verify Concurrency
    const rawDataConcurrent = await redis.hget(`${environment}:${projectName}`, key);
    history = typeof rawDataConcurrent === 'string' ? JSON.parse(rawDataConcurrent) : rawDataConcurrent;

    // Note: If historyLimit was 5 (set in step 1), the length will be capped at 5.
    // We set historyLimit to 5 earlier.
    const expectedCap = 5;

    console.log(`   History length: ${history.length} (Expected Cap: ${expectedCap})`);
    
    // Check version numbers. The latest should be v7 (2 + 5).
    const latestVersion = history[0].version;
    const expectedVersion = 2 + parallelWrites;
    console.log(`   Latest Version: ${latestVersion} (Expected: ${expectedVersion})`);

    if (latestVersion !== expectedVersion) {
        throw new Error(`Race condition detected! Expected version ${expectedVersion}, got ${latestVersion}. Updates were lost.`);
    }

    // Ensure all versions are unique
    const versions = history.map((h: any) => h.version);
    const uniqueVersions = new Set(versions);
    if (versions.length !== uniqueVersions.size) {
        throw new Error("Duplicate version numbers detected!");
    }

    console.log("\n✅ SUCCESS: Atomic write logic is working correctly on real Redis.");
  } catch (e) {
    console.error("\n❌ FAILED:", e);
    process.exit(1);
  } finally {
    // Cleanup
    console.log("\nCleaning up...");
    await redis.del(`meta@${projectName}`);
    await redis.del(`${environment}:${projectName}`);
    process.exit(0);
  }
}

main();
