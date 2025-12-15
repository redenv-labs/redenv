import { Hono } from "hono";
import { serve } from "bun";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
// NEW IMPORTS FOR WEBSOCKETS
import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from "bun";
// ------------------------------------
import path from "path";
import {
  decrypt,
  writeSecret,
  type EnvironmentVariableValue,
  type PluginContext,
} from "@redenv/core";
import { getPEK } from "@redenv/client/utils";
import chalk from "chalk";

// filter out keys name start with __
const filterOutMetaKey = (
  keys: Record<string, EnvironmentVariableValue>
): Record<string, EnvironmentVariableValue> => {
  return Object.keys(keys).reduce((acc, key) => {
    if (!key.startsWith("__")) {
      (acc as any)[key] = keys[key];
    }
    return acc;
  }, {});
};

// Define the path to the built frontend assets
const FRONTEND_DIR = path.join(import.meta.dir, "..", "dist", "ui");

// WEBSOCKET SETUP: Define the WebSocket object once
const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

export async function startServer(port: number, ctx: PluginContext) {
  let ephemeralToken = await ctx.getEphemeralToken();
  const app = new Hono();

  // Middleware
  app.use("/*", cors());

  // --- API AND WEBSOCKET ENDPOINTS ---
  app.get("/api/config", (c) => {
    return c.json({
      projectName: ctx.config?.name || "Unknown",
      plugins: ctx.config?.plugins?.map((p) => p.name) || [],
    });
  });

  app.get("/api/schema", async (c) => {
    const redis = ctx.redis;

    try {
      const projectName = ctx.config.name;
      const metaKey = `meta@${projectName}`;

      // Fetch Metadata
      const meta = await redis.hgetall(metaKey);

      // Fetch Environments (Pattern: <env>:<projectName>)
      // We scan for keys ending with :<projectName>
      // Note: SCAN is better for production, but KEYS is okay for this specific pattern in a studio context
      // However, Upstash/Redis KEYS command might be blocked or slow.
      // Let's assume standard naming convention and try to fetch common envs or use SCAN if possible.
      // For now, we'll use KEYS with a pattern.
      const envKeys = await redis.keys(`*:${projectName}`);

      const environments = envKeys.map((key: string) => {
        const [envName] = key.split(":");
        return { name: envName, key };
      });
      return c.json({
        projectName,
        meta: {
          key: metaKey,
          data: meta,
        },
        environments,
      });
    } catch (error) {
      console.error("Schema fetch error:", error);
      return c.json({ error: "Failed to fetch schema" }, 500);
    }
  });

  app.get("/api/data/:env", async (c) => {
    const env = c.req.param("env");
    try {
      const pek = await getPEK(ctx.redis, {
        project: ctx.config?.name,
        tokenId: ephemeralToken.tokenId,
        token: ephemeralToken.token,
      });

      const envKey = `${env}:${ctx.config?.name}`;
      const versionedSecrets = await ctx.redis.hgetall<Record<string, any>>(
        envKey
      );
      const filteredSecrets = filterOutMetaKey(versionedSecrets as any);

      if (!filteredSecrets) {
        return c.json({ secrets: {} });
      }

      const secrets: Record<string, any> = {};

      for (const [key, history] of Object.entries(filteredSecrets)) {
        // Handle both stringified JSON (Redis standard) and pre-parsed objects (if any)
        let parsedHistory = history;
        if (typeof history === "string") {
          try {
            parsedHistory = JSON.parse(history);
          } catch {
            continue;
          }
        }

        if (!Array.isArray(parsedHistory)) continue;

        const decryptedHistory = await Promise.all(
          parsedHistory.map(async (item: any) => {
            try {
              const value = await decrypt(item.value, pek);
              return { ...item, value };
            } catch {
              return { ...item, value: "[DECRYPTION FAILED]" };
            }
          })
        );
        secrets[key] = decryptedHistory;
      }

      return c.json({ secrets });
    } catch (error: any) {
      if (
        error.message === "Invalid Redenv Token ID" ||
        error.code === "INVALID_TOKEN_ID"
      ) {
        return c.json(
          { error: "Session expired", code: "SESSION_EXPIRED" },
          401
        );
      }
      console.error(`Failed to fetch secrets for env ${env}:`, error);
      return c.json({ error: error.message || "Failed to fetch secrets" }, 500);
    }
  });

  app.post("/api/data/:env", async (c) => {
    const env = c.req.param("env");
    const { key, value } = await c.req.json();

    if (!key || value === undefined) {
      return c.json({ error: "Missing key or value" }, 400);
    }

    try {
      const pek = await getPEK(ctx.redis, {
        project: ctx.config?.name,
        tokenId: ephemeralToken.tokenId,
        token: ephemeralToken.token,
      });

      await writeSecret(
        ctx.redis,
        ctx.config?.name,
        env,
        key,
        value,
        pek,
        ephemeralToken.tokenId // Use tokenId for auditing
      );
      return c.json({ success: true });
    } catch (error: any) {
      if (
        error.message === "Invalid Redenv Token ID" ||
        error.code === "INVALID_TOKEN_ID"
      ) {
        return c.json(
          { error: "Session expired", code: "SESSION_EXPIRED" },
          401
        );
      }
      console.error(`Failed to set secret ${key} for env ${env}:`, error);
      return c.json({ error: error.message || "Failed to set secret" }, 500);
    }
  });

  app.delete("/api/data/:env", async (c) => {
    const env = c.req.param("env");
    const { keys } = await c.req.json<{ keys: string[] }>();

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return c.json({ error: "Missing or invalid keys" }, 400);
    }

    try {
      // Validate token first by getting PEK (even though we don't need it for delete, we need to auth)
      await getPEK(ctx.redis, {
        project: ctx.config?.name,
        tokenId: ephemeralToken.tokenId,
        token: ephemeralToken.token,
      });

      const envKey = `${env}:${ctx.config?.name}`;
      await ctx.redis.hdel(envKey, ...keys);

      return c.json({ success: true });
    } catch (error: any) {
      if (
        error.message === "Invalid Redenv Token ID" ||
        error.code === "INVALID_TOKEN_ID"
      ) {
        return c.json(
          { error: "Session expired", code: "SESSION_EXPIRED" },
          401
        );
      }
      console.error(`Failed to delete secrets for env ${env}:`, error);
      return c.json(
        { error: error.message || "Failed to delete secrets" },
        500
      );
    }
  });

  app.delete("/api/environments", async (c) => {
    const { key } = await c.req.json<{ key: string }>();
    try {
      // Validate token first by getting PEK (even though we don't need it for delete, we need to auth)
      await getPEK(ctx.redis, {
        project: ctx.config?.name,
        tokenId: ephemeralToken.tokenId,
        token: ephemeralToken.token,
      });

      await ctx.redis.del(key);

      return c.json({ success: true });
    } catch (error: any) {
      if (
        error.message === "Invalid Redenv Token ID" ||
        error.code === "INVALID_TOKEN_ID"
      ) {
        return c.json(
          { error: "Session expired", code: "SESSION_EXPIRED" },
          401
        );
      }
      console.error(`Failed to delete environment ${key}:`, error);
      return c.json(
        { error: error.message || "Failed to delete environment" },
        500
      );
    }
  });

  app.post("/api/environments", async (c) => {
    const { name } = await c.req.json();

    if (!name) {
      return c.json({ error: "Name is required" }, 400);
    }

    try {
      // Validate token
      await getPEK(ctx.redis, {
        project: ctx.config?.name,
        tokenId: ephemeralToken.tokenId,
        token: ephemeralToken.token,
      });

      const envKey = `${name}:${ctx.config?.name}`;
      const exists = await ctx.redis.exists(envKey);

      if (exists) {
        return c.json({ error: "Environment already exists" }, 409);
      }

      // Create the environment by setting a metadata field
      // We use a hidden field that won't interfere with secrets (which are usually simple keys)
      // or we can just rely on the fact that it's a hash.
      // Let's set a `__created_by` field.
      await ctx.redis.hset(envKey, {
        __created_by: ephemeralToken.tokenId,
      });

      return c.json({ success: true });
    } catch (error: any) {
      if (
        error.message === "Invalid Redenv Token ID" ||
        error.code === "INVALID_TOKEN_ID"
      ) {
        return c.json(
          { error: "Session expired", code: "SESSION_EXPIRED" },
          401
        );
      }
      console.error("Failed to create environment:", error);
      return c.json(
        { error: error.message || "Failed to create environment" },
        500
      );
    }
  });

  app.get(
    "/ws/status",
    upgradeWebSocket(() => {
      const redis = ctx.redis;
      const hkey = `meta@${ctx?.config?.name}`;
      const field = `ephemeral:${ephemeralToken.tokenId}`;
      return {
        onOpen: async (_event, ws) => {
          ws.send(
            JSON.stringify({ type: "STATUS", message: "backend_online" })
          );

          // Heartbeat + Redis TTL Watcher
          const intervalId = setInterval(async () => {
            try {
              const ttl = await redis.httl(hkey, field);
              // ===== EXPIRED =====
              if (ttl[0] === -2) {
                console.log("[WS] Token expired. Sending event...");
                ws.send(
                  JSON.stringify({ type: "STATUS", message: "session_expired" })
                );
                // Stop the heartbeat but keep connection open for reload signal
                clearInterval((ws as any).intervalId);
                return;
              }

              // ===== Still alive =====
              ws.send(
                JSON.stringify({
                  type: "PING",
                  ttlRemaining: ttl,
                  timestamp: Date.now(),
                })
              );
            } catch (err) {
              console.error("[WS] Redis error:", err);
            }
          }, 60 * 1000); // 60 seconds

          (ws as any).intervalId = intervalId;
        },

        onMessage: async (event, ws) => {
          try {
            const data = JSON.parse(event.data as string);
            if (data.type === "RELOAD_SESSION") {
              console.log(chalk.cyan("[WS] Reloading session..."));
              // Generate a new token
              ephemeralToken = await ctx.getEphemeralToken({ new: true });

              // Notify client that backend is back online
              ws.send(
                JSON.stringify({ type: "STATUS", message: "backend_online" })
              );
            }
          } catch (e) {
            console.error("[WS] Failed to parse message:", e);
          }
        },

        onClose: (_event, ws) => {
          clearInterval((ws as any).intervalId);
        },

        onError: (event) => {
          console.error("[WS] Error:", (event as any).error?.message);
        },
      };
    })
  );

  // --- PRODUCTION FILE SERVING ---
  // PRODUCTION STATIC SERVING: Serves built assets from dist/ui
  app.use(
    "/*",
    serveStatic({
      root: FRONTEND_DIR,
      rewriteRequestPath: (path) => {
        // Log the path to see what's being requested
        console.log(path);

        // Explicitly check for assets and return the path without modification.
        // If the file is not found, serveStatic will automatically let it fall to a 404.
        if (
          path.endsWith(".js") ||
          path.endsWith(".css") ||
          path.endsWith(".svg") ||
          path.endsWith(".png") ||
          path.startsWith("/api/") ||
          path.startsWith("/ws/")
        ) {
          // Allow serveStatic to handle the file lookup, returning the correct asset or a 404
          return path;
        }

        // SPA Fallback: Only rewrite non-asset, non-API paths to the entry point
        return "/index.html";
      },
    })
  );

  return serve({
    fetch: app.fetch,
    port: port,
    websocket,
  });
}
