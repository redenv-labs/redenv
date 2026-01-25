# Feature Parity: Python SDK vs JS Client

The following features have been implemented in the Python SDK and must be ported to the `@redenv/client` package.

[x] 1. Secret Expansion
- **Description:** Support for referencing other secrets using `${VAR_NAME}` syntax.
- **Requirements:**
  - Recursive resolution (A -> B -> C).
  - Circular dependency detection (Error: A -> B -> A).
  - Escaping support:
    - `\${VAR}` -> `${VAR}` (Literal, no expansion).
    - `\\${VAR}` -> `\value` (Backslash + Expansion).
    - `\\\${VAR}` -> `\${VAR}` (Backslash + Literal).
  - Optimization: Fast path for strings without `${`.

[x] 2. Secrets Class Wrapper
- **Description:** Replace the plain `Record<string, string>` return type with a specialized `Secrets` class.
- **Requirements:**
  - **Safe Access:** Accessing a missing key returns `undefined` (or `null`) gracefully.
  - **Masking:** `toString()` and `console.log()` / inspection should hide actual values (e.g., show `********`).

[x] 3. Raw Values
- **Description:** Access to the unexpanded "formula" of a secret.
- **Implementation:**
  - `secrets.raw` property returning a `Secrets` instance (or similar structure) containing original values.
  - Must support scoping (scoped secrets preserve raw values).

[x] 4. Smart Casting
- **Description:** Utility to retrieve secrets as specific types.
- **Implementation:**
  - `secrets.get("PORT", asInt)` or `secrets.getAsInt("PORT")`.
  - `secrets.getAsBool("DEBUG")` (handling "true", "1", "yes").
  - `secrets.getAsJson("CONFIG")`.

[x] 5. Scoping
- **Description:** Create a view of the secrets filtered by a prefix.
- **Implementation:**
  - `secrets.scope("STRIPE_")` returns a new `Secrets` object.
  - Keys in the new object have the prefix stripped (e.g., `STRIPE_KEY` -> `KEY`).

[x] 6. Validation
- **Description:** Fail-fast mechanism for required secrets.
- **Implementation:**
  - `secrets.require("API_KEY", "DB_URL")`.
  - Throws `RedenvError` if any listed keys are missing.
  - Returns `this` for chaining.

## 7. Time Travel (Version History)
- **Description:** Fetch historical versions of a specific secret.
- **Implementation:**
  - `client.getVersion(key, versionOrIndex)`.
  - Support absolute version ID (positive integers).
  - Support relative index (negative integers, e.g., -1 for previous).

[x] 8. Safe Access Defaults
- **Description:** Ensure behavior matches Python's new standard.
- **Implementation:** `secrets.get("MISSING")` returns `undefined` (standard JS behavior, but explicit `get` method should support a default value argument).
