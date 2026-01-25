import { describe, it, expect } from "vitest";
import { Secrets } from "./secrets";
import { RedenvError } from "@redenv/core";

describe("Secrets Class", () => {
  const rawData = {
    HOST: "localhost",
    PORT: "8080",
    DEBUG: "true",
    JSON: '{"foo": "bar"}',
    API: "${HOST}/api",
    MISSING: "${UNKNOWN}",
  };

  const expandedData = {
    HOST: "localhost",
    PORT: "8080",
    DEBUG: "true",
    JSON: '{"foo": "bar"}',
    API: "localhost/api",
    MISSING: "${UNKNOWN}",
  };

  const secrets = new Secrets(expandedData, rawData);

  it("should access properties directly via proxy", () => {
    expect(secrets.HOST).toBe("localhost");
    expect(secrets["PORT"]).toBe("8080");
  });

  it("should return undefined for missing keys", () => {
    expect(secrets.UNKNOWN_KEY).toBeUndefined();
    expect(secrets["UNKNOWN_KEY"]).toBeUndefined();
  });

  it("should access raw values via .raw property", () => {
    expect(secrets.raw.API).toBe("${HOST}/api");
    expect(secrets.API).toBe("localhost/api");
  });

  it("should iterate over keys", () => {
    const keys = [];
    for (const key in secrets) {
      keys.push(key);
    }
    expect(keys).toContain("HOST");
    expect(keys).toContain("API");
    expect(Object.keys(secrets)).toHaveLength(Object.keys(expandedData).length);
  });

  describe("Smart Casting (.get)", () => {
    it("should return string by default", () => {
      expect(secrets.get("PORT").toString()).toBe("8080");
      // toString() returns empty string for missing values to be safe
      expect(secrets.get("MISSING_KEY").toString()).toBe(""); 
      expect(secrets.get("MISSING_KEY", "default").toString()).toBe("default");
    });

    it("should cast to integer", () => {
      expect(secrets.get("PORT").toInt()).toBe(8080);
      expect(secrets.get("HOST").toInt()).toBeUndefined(); // NaN -> undefined
      expect(secrets.get("HOST", 3000).toInt()).toBe(3000); // NaN -> default
      expect(secrets.get("MISSING_KEY", 9090).toInt()).toBe(9090);
    });

    it("should cast to boolean", () => {
      expect(secrets.get("DEBUG").toBool()).toBe(true);
      // "localhost" is not a boolean string -> undefined
      expect(secrets.get("HOST").toBool()).toBeUndefined();
      expect(secrets.get("MISSING_KEY", true).toBool()).toBe(true);
    });

    it("should cast to JSON", () => {
      expect(secrets.get("JSON").toJSON()).toEqual({ foo: "bar" });
      // "localhost" is not valid JSON, so it should return undefined (defaultValue)
      expect(secrets.get("HOST").toJSON()).toBeUndefined();
      expect(secrets.get("HOST", { fallback: true }).toJSON()).toEqual({ fallback: true });
    });
  });

  describe("Validation (.require)", () => {
    it("should pass if keys exist", () => {
      expect(() => secrets.require("HOST", "PORT")).not.toThrow();
    });

    it("should throw if key is missing", () => {
      expect(() => secrets.require("HOST", "UNKNOWN_KEY")).toThrow(RedenvError);
    });

    it("should return this for chaining", () => {
      expect(secrets.require("HOST")).toBe(secrets);
    });
  });

  describe("Scoping (.scope)", () => {
    const scoped = secrets.scope("HO");
    
    it("should strip prefix", () => {
      expect(scoped.ST).toBe("localhost");
    });

    it("should preserve raw values", () => {
      // Create data where prefix matters
      const s = new Secrets(
        { "STRIPE_KEY": "val" },
        { "STRIPE_KEY": "${REF}" }
      );
      const sub = s.scope("STRIPE_");
      expect(sub.KEY).toBe("val");
      expect(sub.raw.KEY).toBe("${REF}");
    });
  });
  
  describe("Masking", () => {
      it("should mask values in toString/toJSON", () => {
          const str = secrets.toString();
          expect(str).toContain("********");
          expect(str).not.toContain("localhost");
          
          const json = JSON.stringify(secrets);
          expect(json).toContain("********");
          expect(json).not.toContain("8080");
      });
  });

  describe("Unmasked Access", () => {
    it("should return unmasked object via toObject()", () => {
      const obj = secrets.toObject();
      expect(obj.HOST).toBe("localhost");
      expect(obj.PORT).toBe("8080");
      expect(obj.API).toBe("localhost/api");
      // Verify it's a plain object, not Secrets instance
      expect(obj).not.toBeInstanceOf(Secrets);
      // Verify it's a copy
      obj.HOST = "modified";
      expect(secrets.HOST).toBe("localhost");
    });
  });
});