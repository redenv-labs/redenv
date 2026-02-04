import { cachified } from "@epic-web/cachified";
import type { CacheEntry } from "@epic-web/cachified";
import { Redis } from "@upstash/redis";
import { LRUCache } from "lru-cache";
import type { RedenvOptions } from "./types";
import {
  fetchAndDecrypt,
  populateEnv,
  setSecret,
  error,
  log,
  getSecretHistory,
  decryptVersion,
  getPEK,
} from "./utils";
import { RedenvError } from "@redenv/core";
import { Secrets } from "./secrets";

// Create a single LRU cache instance to be used for all clients.
const lru = new LRUCache<string, CacheEntry>({ max: 1000 });

/**
 * The main Redenv class used to configure and create clients.
 */
export class Redenv {
  private options: Required<
    Omit<RedenvOptions, "cache" | "environment" | "env">
  > & {
    environment: string;
    cache: { ttl: number; staleWhileRevalidate: number };
    env: { override: boolean };
  };
  private redis: Redis;

  constructor({ ...options }: RedenvOptions) {
    this.validateOptions(options);

    this.options = {
      ...options,
      environment: options.environment || "development",
      log: options.log ?? "low",
      cache: {
        ttl: options.cache?.ttl ?? 300,
        staleWhileRevalidate: options.cache?.swr ?? 86400,
      },
      env: {
        override: options.env?.override ?? true,
      },
    };
    this.redis = new Redis({
      url: options.upstash.url,
      token: options.upstash.token,
    });
  }

  private _pekPromise: Promise<CryptoKey> | undefined;

  private async getProjectKey(): Promise<CryptoKey> {
    if (!this._pekPromise) {
      this._pekPromise = getPEK(this.redis, this.options);
    }
    return this._pekPromise;
  }

  private validateOptions(options: RedenvOptions) {
    const required = ["project", "tokenId", "token", "upstash"];
    const missing = required.filter(
      (key) => !options[key as keyof RedenvOptions],
    );
    if (!options.upstash?.url || !options.upstash?.token) {
      missing.push("upstash.url", "upstash.token");
    }

    if (missing.length > 0) {
      const errorMessage = `[REDENV] Missing required configuration options: ${missing.join(
        ", ",
      )}`;
      throw new RedenvError(errorMessage, "MISSING_CONFIG");
    }
  }

  private getCacheKey(): string {
    return `redenv:${this.options.project}:${this.options.environment}`;
  }

  private getSecrets(): Promise<Secrets> {
    return cachified({
      key: this.getCacheKey(),
      cache: lru,
      getFreshValue: async () => {
        const pek = await this.getProjectKey();
        const secrets = await fetchAndDecrypt(this.redis, this.options, pek);
        await populateEnv(secrets, this.options);
        return secrets;
      },
      ttl: this.options.cache.ttl * 1000,
      staleWhileRevalidate: this.options.cache.staleWhileRevalidate * 1000,
    });
  }

  /**
   * Initializes the environment with secrets.
   */
  public async init(): Promise<Secrets> {
    return this.load();
  }

  /**
   * Fetches, caches, and injects secrets into the environment.
   * Returns a client instance for optional programmatic access.
   */
  public async load(): Promise<Secrets> {
    const secrets = await this.getSecrets();
    await populateEnv(secrets, this.options);
    return secrets;
  }

  /**
   * Adds or updates a secret. This requires a read/write token.
   * After writing, the local cache is cleared to ensure the next read fetches the new value.
   * @param key The secret key to set.
   * @param value The new value for the secret.
   */
  public async set(key: string, value: string): Promise<void> {
    try {
      const pek = await this.getProjectKey();
      await setSecret(this.redis, this.options, key, value, pek);
      log(`Successfully set secret for key "${key}".`);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown error occurred during set operation.";
      error(`Failed to set secret: ${errorMessage}`);
      throw new RedenvError(
        `Failed to set secret: ${errorMessage}`,
        "UNKNOWN_ERROR",
      );
    }
  }

  /**
   * Fetches a specific version of a secret.
   *
   * @param key The secret key.
   * @param version The version ID or index.
   * @param mode "id" (default) uses positive version numbers, negative for index from end.
   *             "index" treats version as a 0-based array index (0=latest).
   */
  public async getVersion(
    key: string,
    version: number,
    mode: "id" | "index" = "id",
  ): Promise<string | undefined> {
    const historyCacheKey = `history:${this.options.project}:${this.options.environment}:${key}`;

    const history = await cachified<any[]>({
      key: historyCacheKey,
      cache: lru,
      getFreshValue: async () => {
        log(`Fetching history for ${key}...`, this.options.log, "high");
        return getSecretHistory(this.redis, this.options, key);
      },
      ttl: this.options.cache.ttl * 1000,
      staleWhileRevalidate: this.options.cache.staleWhileRevalidate * 1000,
    });

    if (!history || history.length === 0) return undefined;

    let targetRecord: any = null;

    if (mode === "index") {
      targetRecord = history[version];
    } else {
      if (version < 0) {
        // Negative ID: use as index from end (history is [latest, ..., oldest])
        targetRecord = history.at(version);
      } else {
        // Positive ID: find matching version field
        targetRecord = history.find((item: any) => item.version === version);
      }
    }

    if (!targetRecord) return undefined;

    try {
      const pek = await this.getProjectKey();
      return await decryptVersion(
        this.redis,
        this.options,
        targetRecord.value,
        pek,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      error(
        `Failed to decrypt version ${version} of ${key}: ${msg}`,
        this.options.log,
      );
      return undefined;
    }
  }
}

export * from "./types";
export * from "./secrets";
