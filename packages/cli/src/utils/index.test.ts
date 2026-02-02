import { describe, it, expect } from "vitest";
import {
  normalize,
  sanitizeName,
  secretKeyValidator,
  updateConfigFields,
} from "./index";

describe("Utility Functions", () => {
  describe("normalize", () => {
    it("should return an empty string for null", () => {
      expect(normalize(null)).toBe("");
    });

    it("should return an empty string for undefined", () => {
      expect(normalize(undefined)).toBe("");
    });

    it("should trim leading and trailing whitespace", () => {
      expect(normalize("  hello world  ")).toBe("hello world");
    });

    it("should convert CRLF to LF line endings", () => {
      expect(normalize("line1\r\nline2")).toBe("line1\nline2");
    });

    it("should handle numbers by converting them to strings", () => {
      expect(normalize(123)).toBe("123");
    });
  });

  describe("sanitizeName", () => {
    it("should replace all colons with hyphens", () => {
      expect(sanitizeName("my:project:name")).toBe("my-project-name");
    });

    it("should not modify a string without colons", () => {
      expect(sanitizeName("my-project-name")).toBe("my-project-name");
    });

    it("should return the same value if it is undefined", () => {
      expect(sanitizeName(undefined)).toBeUndefined();
    });

    it("should handle an empty string", () => {
      expect(sanitizeName("")).toBe("");
    });
  });

  describe("secretKeyValidator", () => {
    it("should return true for a valid secret name", () => {
      expect(secretKeyValidator("MY_SECRET_KEY")).toBe(true);
    });

    it("should return an error message for a secret name containing a colon", () => {
      expect(secretKeyValidator("my:secret")).toBe(
        "Project and environment names cannot contain colons (:).",
      );
    });

    it("should return an error message for a secret name starting with double underscore", () => {
      expect(secretKeyValidator("__INTERNAL_KEY")).toBe(
        "Secret names cannot start with '__' (double underscore)",
      );
    });

    it("should return an error message for a secret name starting with double underscore and containing a colon", () => {
      expect(secretKeyValidator("__INTERNAL:KEY")).toBe(
        "Secret names cannot start with '__' (double underscore)",
      );
    });
  });

  describe("updateConfigFields", () => {
    const baseConfig = `import { defineConfig } from "@redenv/core";
import { studioPlugin } from "../studio/dist";

export default defineConfig({
  environment: "development",
  name: "pras",
  plugins: [studioPlugin],
});
`;

    it("should update a single field", () => {
      const result = updateConfigFields(baseConfig, { environment: "prod" });
      expect(result).toContain('environment: "prod"');
      expect(result).toContain('name: "pras"');
    });

    it("should update multiple fields", () => {
      const result = updateConfigFields(baseConfig, {
        environment: "staging",
        name: "new-project",
      });
      expect(result).toContain('environment: "staging"');
      expect(result).toContain('name: "new-project"');
    });

    it("should preserve plugins array reference", () => {
      const result = updateConfigFields(baseConfig, { environment: "prod" });
      expect(result).toContain("plugins: [studioPlugin]");
    });

    it("should preserve import statements", () => {
      const result = updateConfigFields(baseConfig, { name: "other" });
      expect(result).toContain('import { studioPlugin } from "../studio/dist"');
      expect(result).toContain('import { defineConfig } from "@redenv/core"');
    });

    it("should skip non-string values", () => {
      const result = updateConfigFields(baseConfig, {
        environment: "prod",
        plugins: ["should-not-touch"],
      });
      expect(result).toContain("plugins: [studioPlugin]");
      expect(result).toContain('environment: "prod"');
    });

    it("should return content unchanged when no fields match", () => {
      const result = updateConfigFields(baseConfig, { nonexistent: "value" });
      expect(result).toBe(baseConfig);
    });

    it("should handle single-quoted values", () => {
      const singleQuoted = `export default defineConfig({
  environment: 'development',
  name: 'pras',
});
`;
      const result = updateConfigFields(singleQuoted, { environment: "prod" });
      expect(result).toContain('environment: "prod"');
      expect(result).not.toContain("'development'");
    });

    it("should handle extra whitespace around colons", () => {
      const spacey = `export default defineConfig({
  environment :  "development",
  name:    "pras",
});
`;
      const result = updateConfigFields(spacey, {
        environment: "prod",
        name: "new",
      });
      expect(result).toContain('environment :  "prod"');
      expect(result).toContain('name:    "new"');
    });

    it("should not corrupt values containing special regex characters", () => {
      const result = updateConfigFields(baseConfig, {
        name: "my-project.v2",
      });
      expect(result).toContain('name: "my-project.v2"');
    });

    it("should handle empty string values", () => {
      const result = updateConfigFields(baseConfig, { name: "" });
      expect(result).toContain('name: ""');
    });

    it("should only replace the first occurrence of a field", () => {
      const duplicated = `export default defineConfig({
  name: "first",
});
// name: "comment"
`;
      const result = updateConfigFields(duplicated, { name: "updated" });
      expect(result).toContain('name: "updated"');
      // The comment line should stay since regex only replaces first match
      expect(result).toContain('// name: "comment"');
    });

    it("should handle config with no plugins", () => {
      const minimal = `export default defineConfig({
  environment: "development",
  name: "test",
});
`;
      const result = updateConfigFields(minimal, {
        environment: "production",
        name: "live",
      });
      expect(result).toContain('environment: "production"');
      expect(result).toContain('name: "live"');
    });

    it("should not modify unrelated fields", () => {
      const extended = `export default defineConfig({
  environment: "development",
  name: "pras",
  customField: "keep-me",
});
`;
      const result = updateConfigFields(extended, { environment: "prod" });
      expect(result).toContain('customField: "keep-me"');
    });
  });
});
