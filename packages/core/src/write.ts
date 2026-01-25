import type { Redis } from "@upstash/redis";
import { encrypt } from "./crypto";
import { RedenvError } from "./error";

/**
 * Handles the complete "read-modify-write" cycle for updating a secret's
 * version history in Redis. This performs an "upsert" operation.
 *
 * @param redis An instance of the Upstash Redis client.
 * @param projectName The name of the project.
 * @param environment The environment to write to.
 * @param key The secret key to write.
 * @param newValue The new plaintext value for the secret.
 * @param pek The Project Encryption Key (CryptoKey) for encrypting the value.
 * @param user A string identifying the user or service performing the action, for auditing.
 */
export async function writeSecret(
  redis: Redis,
  projectName: string,
  environment: string,
  key: string,
  newValue: string,
  pek: CryptoKey,
  user: string
) {
  const redisKey = `${environment}:${projectName}`;
  const metaKey = `meta@${projectName}`;

  // We do this outside Lua to avoid CROSSSLOT errors in Redis Cluster/Upstash
  const metadata = await redis.hgetall<{ historyLimit?: number }>(metaKey);

  if (!metadata) {
    throw new RedenvError(
      `Could not retrieve metadata for project "${projectName}". The project may not exist.`,
      "PROJECT_NOT_FOUND"
    );
  }

  const encryptedValue = await encrypt(newValue, pek);
  const createdAt = new Date().toISOString();
  const historyLimit = metadata.historyLimit ?? 10;

  // This script only touches ONE key (redisKey), ensuring cluster safety.
  // KEYS[1] = env_key
  // ARGV[1] = field, ARGV[2] = encrypted_value, ARGV[3] = user, ARGV[4] = created_at, ARGV[5] = history_limit
  const script = `
    local env_key = KEYS[1]
    local field = ARGV[1]
    local encrypted_value = ARGV[2]
    local user = ARGV[3]
    local created_at = ARGV[4]
    local history_limit = tonumber(ARGV[5])

    -- Fetch Current History
    local current_data = redis.call('HGET', env_key, field)
    local history = {}

    if current_data then
        local status, res = pcall(cjson.decode, current_data)
        if status then
            history = res
        end
    end

    -- Determine Next Version
    local last_version = 0
    if #history > 0 and history[1] and history[1]['version'] then
        last_version = history[1]['version']
    end

    -- Create New Record
    local new_version = {
        version = last_version + 1,
        value = encrypted_value,
        user = user,
        createdAt = created_at
    }

    -- Prepend (Newest First)
    table.insert(history, 1, new_version)

    -- Trim History
    if history_limit > 0 then
        while #history > history_limit do
            table.remove(history)
        end
    end

    -- Save and Return
    local encoded = cjson.encode(history)
    redis.call('HSET', env_key, field, encoded)

    return encoded
  `;

  await redis.eval(
    script,
    [redisKey],
    [key, encryptedValue, user, createdAt, historyLimit]
  );
}
