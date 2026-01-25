import {
  deriveKey,
  decrypt,
  importKey,
  hexToBuffer,
  writeSecret,
  expandSecrets,
} from "@redenv/core";
import { Redis } from "@upstash/redis";
import type { LogPreference, RedenvOptions } from "../types";
import { RedenvError } from "@redenv/core";
import { Secrets } from "../secrets";

/**
 * A stateless helper function that fetches and decrypts the Project Encryption Key (PEK).
 *
 * @param redis - An instance of the Upstash Redis client.
 * @param options - The Redenv configuration options.
 * @returns The decrypted PEK as a CryptoKey.
 */
export async function getPEK(
  redis: Redis,
  options: Pick<RedenvOptions, "project" | "tokenId" | "token">
): Promise<CryptoKey> {
  const metaKey = `meta@${options.project}`;
  const metadata = await redis.hgetall<Record<string, any>>(metaKey);
  if (!metadata) throw new RedenvError(`Project "${options.project}" not found.`, "PROJECT_NOT_FOUND");

  const serviceTokens =
    typeof metadata.serviceTokens === "string"
      ? JSON.parse(metadata.serviceTokens)
      : metadata.serviceTokens;
  
  let tokenInfo = serviceTokens?.[options.tokenId];

  // If not found in standard service tokens, check for ephemeral token field
  if (!tokenInfo) {
    const ephemeralField = `ephemeral:${options.tokenId}`;
    const rawEphemeral = metadata[ephemeralField];
    if (rawEphemeral) {
      tokenInfo = typeof rawEphemeral === 'string' ? JSON.parse(rawEphemeral) : rawEphemeral;
    }
  }

  if (!tokenInfo) throw new RedenvError("Invalid Redenv Token ID.", "INVALID_TOKEN_ID");

  const salt = hexToBuffer(tokenInfo.salt);
  const tokenKey = await deriveKey(options.token, salt);
  const decryptedPEKHex = await decrypt(tokenInfo.encryptedPEK, tokenKey);

  return importKey(decryptedPEKHex);
}

/**
 * A stateless helper function that fetches all secrets for a given environment,
 * decrypts them, and optionally populates the runtime environment.
 *
 * @param redis - An instance of the Upstash Redis client.
 * @param options - The Redenv configuration options.
 * @returns A Secrets object containing the decrypted secrets.
 */
export async function fetchAndDecrypt(
  redis: Redis,
  options: Pick<
    RedenvOptions,
    "project" | "tokenId" | "token" | "environment" | "log"
  >,
  pek?: CryptoKey
): Promise<Secrets> {
  log("Expired Cache: Fetching secrets from source...", options.log, "high");
  const projectKey = pek ?? await getPEK(redis, options);
  const envKey = `${options.environment}:${options.project}`;
  const versionedSecrets = await redis.hgetall<Record<string, any>>(envKey);

  const secrets: Record<string, string> = {};
  if (!versionedSecrets) {
    log("No secrets found for this environment.", options.log);
    return new Secrets({});
  }

  const decryptionPromises = Object.entries(versionedSecrets).map(
    async ([key, history]) => {
      try {
        if (!Array.isArray(history) || history.length === 0) return null;
        const decryptedValue = await decrypt(history[0].value, projectKey);
        return { key, value: decryptedValue };
      } catch {
        error(`Failed to decrypt secret "${key}".`, options.log);
        return null;
      }
    }
  );

  const decryptedResults = await Promise.all(decryptionPromises);
  for (const result of decryptedResults) {
    if (result) {
      secrets[result.key] = result.value;
    }
  }

  // Capture raw decrypted secrets before expansion
  const rawDecrypted = { ...secrets };

  // Expand variables
  const expandedSecrets = expandSecrets(rawDecrypted);

  log(
    `Successfully loaded ${Object.keys(expandedSecrets).length} secrets.`,
    options.log
  );
  
  // Return Secrets instance with both expanded and raw data
  return new Secrets(expandedSecrets, rawDecrypted);
}

/**
 * A stateless helper function that writes a secret to Redis.
 *
 * @param redis - An instance of the Upstash Redis client.
 * @param options - The Redenv configuration options.
 * @param key - The secret key to set.
 * @param value - The new value for the secret.
 */
export async function setSecret(
  redis: Redis,
  options: Pick<RedenvOptions, "project" | "tokenId" | "token" | "environment">,
  key: string,
  value: string,
  pek?: CryptoKey
): Promise<void> {
  const projectKey = pek ?? await getPEK(redis, options);
  await writeSecret(
    redis,
    options.project,
    options.environment || "development",
    key,
    value,
    projectKey,
    options.tokenId // Use tokenId for auditing
  );
}

/**
 * Injects secrets into the current runtime's environment.
 * Supports Node.js (`process.env`) and Deno (`Deno.env`).
 */
export async function populateEnv(
  secrets: Secrets | Record<string, string>,
  options: Pick<RedenvOptions, "log" | "env">
): Promise<void> {
  log("Populating environment with secrets...", options.log);
  let injectedCount = 0;
  const override = options.env?.override ?? true;

  const isDeno =
    // @ts-expect-error: Check for Deno global
    typeof Deno !== "undefined" && typeof Deno.env !== "undefined";

  for (const key in secrets) {
    if (Object.prototype.hasOwnProperty.call(secrets, key)) {
      const value = secrets[key];
      
      if (isDeno) {
        // @ts-expect-error: Deno.env.get
        if (!override && Deno.env.get(key) !== undefined) continue;
        // @ts-expect-error: Deno.env.set
        Deno.env.set(key, value);
      } else {
        if (!override && process.env[key] !== undefined) continue;
        process.env[key] = value;
      }
      injectedCount++;
    }
  }
  log(`Injection complete. ${injectedCount} variables were set.`, options.log);
}

export function log(
  message: string,
  logPreference: LogPreference = "low",
  priority: Omit<LogPreference, "none"> = "low"
) {
  switch (logPreference) {
    case "low":
      if (priority !== "high") break;
      console.log(`[REDENV] ${message}`);
      break;
    case "high":
      console.log(`[REDENV] ${message}`);
      break;
    case "none":
      break;
  }
}

export function error(message: string, logPreference: LogPreference = "low") {
  if (logPreference !== "none") console.error(`[REDENV] Error: ${message}`);
}

/**
 * Fetches the history of a specific secret from Redis.
 */
export async function getSecretHistory(
  redis: Redis,
  options: Pick<RedenvOptions, "project" | "environment" | "log">,
  key: string
): Promise<any[]> {
  const envKey = `${options.environment}:${options.project}`;
  // Upstash Redis might return the object directly if it's JSON, or string
  const result = await redis.hget<string | any[]>(envKey, key);

  if (!result) return [];
  
  if (Array.isArray(result)) return result;
  
  try {
    return typeof result === "string" ? JSON.parse(result) : result;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    error(`Failed to parse history for ${key}: ${msg}`, options.log);
    return [];
  }
}

/**
 * Decrypts a specific encrypted value using the Project Encryption Key.
 */
export async function decryptVersion(
  redis: Redis,
  options: Pick<RedenvOptions, "project" | "tokenId" | "token" | "log">,
  encryptedValue: string,
  pek?: CryptoKey
): Promise<string> {
  try {
    const projectKey = pek ?? await getPEK(redis, options);
    return decrypt(encryptedValue, projectKey);
  } catch (e) {
     const msg = e instanceof Error ? e.message : String(e);
     throw new RedenvError(`Decryption failed: ${msg}`, "DECRYPTION_FAILED");
  }
}
