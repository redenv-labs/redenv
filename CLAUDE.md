# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Redenv is a zero-knowledge, end-to-end encrypted secret management CLI that replaces traditional `.env` files. It uses Upstash Redis as a centralized backend with client-side encryption (AES-256-GCM, PBKDF2 key derivation via Web Crypto API).

## Monorepo Structure

This is a **pnpm monorepo** with workspace packages:

```
packages/
├── core/           # @redenv/core - Cryptographic primitives, shared utilities
├── cli/            # @redenv/cli - Command-line interface
├── client/         # @redenv/client - TypeScript/JavaScript runtime SDK
└── python-client/  # Python SDK (hatchling build)

app/www/            # Next.js 16 landing page/docs site
tests/nextjs/       # Integration tests
```

## Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests (vitest)
pnpm test

# Lint
pnpm lint

# Run CLI in development (no build needed)
pnpm --filter @redenv/cli dev -- <command>
# Example: pnpm --filter @redenv/cli dev -- list

# Run web app
pnpm --filter www dev

# Versioning (Changesets workflow)
pnpm changeset     # Create changeset entry
pnpm version       # Bump versions and generate changelog
pnpm release       # Publish to npm
```

## Architecture

### Security Model (Zero-Knowledge)
- **Per-Project Encryption Key (PEK)**: Unique key per project, wrapped by master password
- **Key Derivation**: PBKDF2-HMAC-SHA256 (310,000 iterations per OWASP)
- **Encryption**: AES-256-GCM via Web Crypto API
- **Service Tokens**: Public ID + Secret Key for programmatic access (decrypts PEK)

### Redis Data Model
- `meta@<project-name>`: Hash with encrypted PEK, salt, history limit, token configs
- `<environment>:<project-name>`: Hash where each field is a secret key with versioned JSON array

### Package Responsibilities
- **@redenv/core**: Crypto operations (`crypto.ts`), secret expansion (`expand.ts`), atomic writes via Lua (`write.ts`), config parsing, plugin system
- **@redenv/cli**: All CLI commands in `src/commands/`, config management in `src/core/`, uses Commander framework
- **@redenv/client**: Runtime secret fetching with stale-while-revalidate caching (@epic-web/cachified), Secrets class with type casting

### Secret Expansion
Secrets can reference other secrets using `${VAR_NAME}` syntax. Circular dependencies are detected. Escape with `\${` for literals.

### Plugin System
CLI extensibility via plugins defined in `redenv.config.ts`. Example: `@redenv/studio` adds visual dashboard.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript (ES2022, strict mode) |
| Package Manager | pnpm 10.16.1 |
| Build | tsup |
| Test | vitest |
| CLI Framework | Commander |
| Backend | Upstash Redis (HTTP API) |
| Web App | Next.js 16, React 19, Tailwind 4, Framer Motion, GSAP |

## Code Conventions

- Tests colocated with source files (e.g., `crypto.ts` and `crypto.test.ts`)
- ESM modules throughout
- Workspace dependencies use `workspace:*` protocol
- CLI commands are individual files in `packages/cli/src/commands/`

## Key Files

- `packages/core/src/crypto.ts` - All encryption/decryption logic
- `packages/core/src/expand.ts` - Secret reference expansion
- `packages/core/src/write.ts` - Atomic Redis writes via Lua script
- `packages/cli/src/core/config.ts` - Global and project configuration
- `packages/cli/src/core/keys.ts` - Redis key naming conventions
- `packages/client/src/secrets.ts` - Secrets class with caching
