import { describe, it, expect } from "vitest";
import { expandSecrets } from "./expand";
import { RedenvError } from "./error";

describe("Secret Expansion", () => {
  it("should return identical secrets if no references exist", () => {
    const secrets = { A: "1", B: "2" };
    expect(expandSecrets(secrets)).toEqual(secrets);
  });

  it("should expand a simple reference", () => {
    const secrets = {
      BASE: "http://localhost",
      API: "${BASE}/api",
    };
    expect(expandSecrets(secrets)).toEqual({
      BASE: "http://localhost",
      API: "http://localhost/api",
    });
  });

  it("should expand recursive references", () => {
    const secrets = {
      A: "foo",
      B: "${A}bar",
      C: "${B}baz",
    };
    expect(expandSecrets(secrets)).toEqual({
      A: "foo",
      B: "foobar",
      C: "foobarbaz",
    });
  });

  it("should handle multiple references in one value", () => {
    const secrets = {
      HOST: "localhost",
      PORT: "8080",
      URL: "http://${HOST}:${PORT}",
    };
    expect(expandSecrets(secrets)).toEqual({
      HOST: "localhost",
      PORT: "8080",
      URL: "http://localhost:8080",
    });
  });

  it("should throw on circular dependencies", () => {
    const secrets = {
      A: "${B}",
      B: "${A}",
    };
    expect(() => expandSecrets(secrets)).toThrow(RedenvError);
    expect(() => expandSecrets(secrets)).toThrow("Circular dependency");
  });

  it("should throw on self-reference", () => {
    const secrets = {
      A: "${A}",
    };
    expect(() => expandSecrets(secrets)).toThrow("Circular dependency");
  });

  it("should ignore missing keys", () => {
    const secrets = {
      A: "${MISSING}",
    };
    expect(expandSecrets(secrets)).toEqual({
      A: "${MISSING}",
    });
  });

  it("should handle escaped references (odd backslashes)", () => {
    const secrets = {
      A: "value",
      B: "\\${A}", // 1 backslash: Escaped -> ${A}
      C: "\\\\\\${A}", // 3 backslashes: Escaped -> \${A}
    };
    expect(expandSecrets(secrets)).toEqual({
      A: "value",
      B: "${A}",
      C: "\\${A}",
    });
  });

  it("should handle unescaped backslashes (even backslashes)", () => {
    const secrets = {
      A: "value",
      B: "\\\\${A}", // 2 backslashes: Not escaped -> \value
      C: "\\\\\\\\${A}", // 4 backslashes: Not escaped -> \\value
    };
    expect(expandSecrets(secrets)).toEqual({
      A: "value",
      B: "\\value",
      C: "\\\\value",
    });
  });

  it("should handle complex mixed cases", () => {
    const secrets = {
      PROTO: "https",
      DOMAIN: "example.com",
      BASE: "${PROTO}://${DOMAIN}",
      // Escaped one + real one
      TEMPLATE: "Use \\${BASE} to connect to ${BASE}",
    };
    expect(expandSecrets(secrets)).toEqual({
      PROTO: "https",
      DOMAIN: "example.com",
      BASE: "https://example.com",
      TEMPLATE: "Use ${BASE} to connect to https://example.com",
    });
  });
});