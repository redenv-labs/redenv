# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-01-22

### Added

- **Initial Release:** First public beta release of the `redenv` Python SDK.
- **Zero-Knowledge Security:** All cryptographic operations (AES-256-GCM, PBKDF2) are performed locally, matching the `@redenv/client` (TypeScript) implementation.
- **Async Support:** Built on `asyncio` and `upstash-redis` for high-performance non-blocking operations.
- **SWR Caching:** Implemented a robust `Stale-While-Revalidate` caching strategy using `cachetools.LRUCache`.
- **Environment Injection:** Automatically populates `os.environ` with decrypted secrets on `load()`.
- **Flexible Configuration:** Support for `ttl` and `swr` cache control and informational logging levels.
