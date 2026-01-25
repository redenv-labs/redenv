import { RedenvError } from "./error";

const REFERENCE_REGEX = /(\\*)\$\{([a-zA-Z0-9_]+)\}/g;

/**
 * Expands variable references in a dictionary of secrets.
 * Supports recursion and cycle detection.
 * 
 * @param secrets A record of decrypted secrets.
 * @returns A new record with values expanded.
 */
export function expandSecrets(secrets: Record<string, string>): Record<string, string> {
  const expanded: Record<string, string> = {};
  const cache = new Map<string, string>();
  const stack = new Set<string>();

  function resolve(key: string): string {
    if (cache.has(key)) return cache.get(key)!;

    if (stack.has(key)) {
      throw new RedenvError(
        `Circular dependency detected: ${Array.from(stack).join(" -> ")} -> ${key}`,
        "INVALID_INPUT"
      );
    }

    stack.add(key);
    const value = secrets[key];

    if (!value) {
      return "";
    }

    const resolved = value.replace(
      REFERENCE_REGEX,
      (_, slashes: string, refKey: string) => {
        const slashCount = slashes.length;

        // Odd backslashes → escaped
        if (slashCount % 2 === 1) {
          // Keep half the slashes (floor) + literal ${VAR}
          return slashes.slice(0, Math.floor(slashCount / 2)) + "${" + refKey + "}";
        }

        // Even backslashes → unescaped
        const prefix = slashes.slice(0, slashCount / 2);

        if (Object.prototype.hasOwnProperty.call(secrets, refKey)) {
          return prefix + resolve(refKey);
        }

        return prefix + "${" + refKey + "}";
      }
    );

    stack.delete(key);
    cache.set(key, resolved);
    return resolved;
  }

  for (const key in secrets) {
    if (Object.prototype.hasOwnProperty.call(secrets, key)) {
      expanded[key] = resolve(key);
    }
  }

  return expanded;
}
