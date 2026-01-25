# @redenv/client

A lightweight, zero-knowledge client for securely fetching secrets from Redenv in any server-side JavaScript or TypeScript application.

This client is designed for high performance and security. It features an in-memory cache with `stale-while-revalidate` logic and performs all cryptographic operations locally, ensuring your secrets are never exposed.

---

## Features

- **Zero-Knowledge:** All secrets are decrypted on the client side. The backend is treated as an untrusted data store.
- **High-Performance Caching:** An in-memory `stale-while-revalidate` cache serves secrets instantly, providing resilience and low latency.
- **Smart Secrets:** Type-safe access with casting (`.toInt()`, `.toBool()`), validation (`.require()`), and scoping (`.scope()`).
- **Secret Expansion:** Automatically resolves references (`${VAR}`) within secrets.
- **Time Travel:** Fetch historical versions of secrets for auditing or rollbacks.
- **Dynamic Updates:** Fetch the latest version of secrets without redeploying your application.
- **Secure Write-Back:** Allows applications to add or update secrets programmatically.

## Installation

Install the package using your preferred package manager:

```bash
# With npm
npm install @redenv/client

# With pnpm
pnpm add @redenv/client

# With yarn
yarn add @redenv/client

# With bun
bun add @redenv/client
```

## Usage Guide

### 1. Instantiation and Initialization

The best practice is to create a single, shared instance of the client and initialize it once when your application starts. This "warms up" the cache for fast access later.

**`redenv.ts`**

```typescript
import { Redenv } from "@redenv/client";

export const redenv = new Redenv({
  // It is highly recommended to load these from environment variables
  project: process.env.REDENV_PROJECT_NAME!,
  tokenId: process.env.REDENV_TOKEN_ID!,
  token: process.env.REDENV_SECRET_TOKEN_KEY!,
  upstash: {
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
  },
  environment: process.env.NODE_ENV,
});

// Initialize Redenv once as soon as the module is loaded.
// This fetches all secrets and populates the cache for fast access.
// It also performs an initial population of process.env.
await redenv.init();
```

### 2. Accessing Secrets

The client returns a powerful `Secrets` object that provides much more than just key-value access.

#### Basic & Smart Access

```typescript
const secrets = await redenv.load();

// 1. Direct Access (Masked in logs)
// Note: Console logging 'secrets' directly will show masked values (********)
const apiKey = secrets.API_KEY;

// 2. Smart Casting (.get)
// Returns a wrapper with helper methods
const port = secrets.get("PORT", 3000).toInt();      // returns number
const isDebug = secrets.get("DEBUG").toBool();       // returns boolean
const config = secrets.get("APP_CONFIG").toJSON();   // returns object

// 3. Validation
// Throws an error immediately if any of these keys are missing
secrets.require("DATABASE_URL", "STRIPE_SECRET_KEY");

// 4. Scoping
// Useful for passing a subset of configuration to a module
// e.g. secrets.scope("AWS_") returns an object where "AWS_KEY" becomes just "KEY"
const awsConfig = secrets.scope("AWS_");
```

#### Secret Expansion

Redenv supports referencing other secrets using `${VAR_NAME}` syntax. These are automatically resolved.

```typescript
// If BASE_URL="https://api.example.com" and AUTH_URL="${BASE_URL}/auth"
console.log(secrets.AUTH_URL); // "https://api.example.com/auth"

// Access the raw formula
console.log(secrets.raw.AUTH_URL); // "${BASE_URL}/auth"
```

#### Unmasked Access

For security, `secrets.toString()` and `JSON.stringify(secrets)` mask values. To get the raw data for debugging or legacy libraries:

```typescript
const rawObject = secrets.toObject();
console.log(rawObject); // { API_KEY: "actual-secret-value", ... }
```

### 3. Time Travel (Version History)

You can fetch historical versions of any secret using `getVersion`.

```typescript
// Fetch by absolute version ID
const v10 = await redenv.getVersion("API_KEY", 10);

// Fetch previous version (1 step back)
// Mode "index": 0=Latest, 1=Previous, etc.
const previous = await redenv.getVersion("API_KEY", 1, "index");

// Fetch oldest version
// Negative ID treats as index from the end
const oldest = await redenv.getVersion("API_KEY", -1);
```

### 4. Writing Secrets

You can add or update a secret using the `.set()` method. This requires a Service Token with write permissions. Using this method will automatically clear the client's local cache, ensuring the next read is fresh.

```typescript
import { redenv } from "./redenv";

// Update the log level dynamically in response to an admin action
await redenv.set("LOG_LEVEL", "debug");
```

## Configuration Options

The `Redenv` constructor accepts the following options:

| Option        | Type                             | Description                                                                                                                  | Required |
| ------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | :------: |
| `project`     | `string`                         | The name of your Redenv project.                                                                                             |   Yes    |
| `tokenId`     | `string`                         | The public ID of your Redenv service token (e.g., `stk_...`).                                                                |   Yes    |
| `token`       | `string`                         | The secret key of your Redenv service token (e.g., `redenv_sk_...`).                                                         |   Yes    |
| `upstash`     | `{ url: string, token: string }` | Your Upstash Redis REST credentials (URL and Token).                                                                         |   Yes    |
| `environment` | `string`                         | The environment within the project to fetch secrets from (e.g., "production", "staging"). Defaults to `'development'`.       |    No    |
| `cache`       | `{ ttl?: number, swr?: number }` | Caching behavior in seconds. `ttl` is time-to-live, `swr` is stale-while-revalidate. Defaults to `{ ttl: 300, swr: 86400 }`. |    No    |
| `env`         | `{ override?: boolean }`         | If `true` (default), overwrites existing environment variables. If `false`, preserves them.                                  |    No    |
| `log`         | `LogPreference`                  | If `"none"`, suppresses informational logs from the client. Defaults to `"low"`.                                             |    No    |

## Caching Behavior

The client uses a powerful `stale-while-revalidate` caching strategy to ensure your application remains fast and responsive.

- When you request a secret, it's served instantly from an in-memory cache if available.
- If the cached data is older than the `ttl` (time-to-live), it is considered "stale". The client will return the stale data immediately and trigger a non-blocking background fetch to get fresh secrets from Redis.
- This ensures your application's performance is not impacted by fetching secrets, while also guaranteeing that the secrets are eventually consistent and stay up-to-date.
