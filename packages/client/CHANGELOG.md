# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-02-02

### Changed

- Updated `@redenv/core` to v1.2.0 to include improved atomic writng logic

## [1.1.0] - 2026-01-25

### Added

- **Secrets Class Wrapper:** Replaced the plain `Record<string, string>` return type of `.load()` with a specialized `Secrets` class.
- **Feature Parity with Python SDK:**
  - **Secret Expansion:** Automatic resolution of `${VAR_NAME}` references within secrets.
  - **Smart Casting:** New `.get(key)` method returning a wrapper with `.toInt()`, `.toBool()`, `.toJSON()`, and `.toString()` helpers.
  - **Scoping:** `.scope(prefix)` method to create a view of secrets with a specific prefix stripped.
  - **Validation:** `.require(...keys)` method for fail-fast checks of mandatory secrets.
  - **Raw Access:** `.raw` property to access original values before expansion.
  - **Automatic Masking:** Sensitive values are now automatically masked (`********`) when using `console.log(secrets)`, `secrets.toString()`, or `JSON.stringify(secrets)`.
  - **Time Travel:** Added `.getVersion(key, version)` to fetch historical secrets. Supports absolute version IDs and relative indexing (e.g., -1 for oldest).
  - **Environment Override:** Added `env.override` option (default: `true`) to control whether `process.env` (or `Deno.env`) is overwritten.
- **Unmasked Access:** Added `secrets.toObject()` to retrieve the plain, unmasked secrets object when needed for debugging or specific integrations.

## [1.0.7] - 2025-12-07

### Added

- Added support for ephemeral tokens for plugins.

## [1.0.6] - 2025-11-28

### Fixed

- Fixed `package.json` dependencies.

## [1.0.5] - 2025-11-26

### Added

- Introduced a dedicated entry point for core utility functions: `@redenv/client/utils`. These functions (e.g., `fetchAndDecrypt`, `setSecret`) are now accessible for advanced use cases and building framework-specific clients.

### Changed

- Back to [1.0.1](#101---2025-11-26) for the latest stable release.

## [1.0.1] - 2025-11-26

### Changed

- load() now returns a Record<string, string> instead of get() and getAll(). so from now on use load() to get secrets.

## [1.0.0] - 2025-11-25

### Added

- **Initial Release:** First public release of the `@redenv/client`.
- **Zero-Knowledge Architecture:** Implemented a secure client that performs all cryptographic operations locally, ensuring secrets are never exposed to the backend or any intermediaries.
- **High-Performance Caching:** Integrated an in-memory `stale-while-revalidate` caching strategy using `cachified` to ensure fast and resilient secret retrieval with minimal impact on application performance.
- **Dual Access Patterns:**
  - **Programmatic Access:** Provides `.load()` which returns a `get()` and `getAll()` accessor for type-safe, explicit secret management.
  - **Environment Population:** Supports populating `process.env` for easy integration with legacy applications.
- **Write-Back Functionality:** Includes a `.set(key, value)` method to allow applications with sufficient permissions to add or update secrets dynamically.
- **Configuration:** The client is configurable via constructor options, including project details, environment, and cache settings (`ttl`, `swr`).
