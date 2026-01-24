import { RedenvError } from "./error";

// Regex to capture ${VAR_NAME}
const REFERENCE_REGEX = /\$\{([a-zA-Z0-9_]+)\}/g;

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

  function resolve(key: string, value: string): string {
    if (cache.has(key)) return cache.get(key)!;
    if (stack.has(key)) {
      throw new RedenvError(`Circular dependency detected: ${Array.from(stack).join(" -> ")} -> ${key}`, "INVALID_INPUT");
    }

    stack.add(key);

    // Replace function
    const resolvedValue = value.replace(REFERENCE_REGEX, (match, refKey, offset, string) => {
      // Check for escaping: look at the char before the match
      // Use double backslash to match a literal backslash char
      if (offset > 0 && string[offset - 1] === "\\") {
        return match;
      }

      // If the referenced key exists in the secrets object
      if (Object.prototype.hasOwnProperty.call(secrets, refKey)) {
        return resolve(refKey, secrets[refKey]!);
      }

      return match;
    });

    // Cleanup escape characters: \${VAR} -> ${VAR}
    // We replace "backslash + ${" with "${"
    const finalValue = resolvedValue.replace(/\\\$\{/g, "${");

    stack.delete(key);
    cache.set(key, finalValue);
    return finalValue;
  }

  for (const key in secrets) {
    if (Object.prototype.hasOwnProperty.call(secrets, key)) {
      expanded[key] = resolve(key, secrets[key]!);
    }
  }

  return expanded;
}
