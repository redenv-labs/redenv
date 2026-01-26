# DESIGN-001: Secret Referencing & Expansion

**Status:** Implemented  
**Scope:** System-wide (CLI, Studio, JS Client, Python Client, Go Client)

## 1. Abstract
Introduce support for `${VAR_NAME}` syntax within secret values. This allows one secret to reference another within the same environment, reducing duplication and enabling centralized configuration management.

## 2. Motivation
Currently, if multiple secrets share a common component (e.g., a base URL), that component must be repeated in every secret. If it changes, every secret must be updated manually. Variable expansion solves this by allowing a single source of truth.

## 3. Proposed Syntax
Secrets can contain references to other keys using the `${}` syntax:
- `BASE_URL`: `https://api.example.com`
- `AUTH_SERVICE`: `${BASE_URL}/auth`
- `USER_SERVICE`: `${BASE_URL}/users`

## 4. Implementation Strategy
Each SDK and the CLI must implement an "Expansion Pass" after decryption:
1. Fetch and decrypt all secrets for the environment.
2. Iterate through values searching for `${...}` patterns.
3. Replace patterns with the decrypted value of the referenced key.
4. (Optional) Handle circular dependencies by limiting depth or throwing an error.

## 5. Backward Compatibility
This feature is backward compatible as existing secrets without the `${}` syntax will remain unaffected. Values containing `${}` that are intended to be literal must be escaped (e.g., `\${`).



> ================================ IMPLEMENTED ================================ 