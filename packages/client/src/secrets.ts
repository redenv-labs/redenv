import { RedenvError } from "@redenv/core";

/**
 * A wrapper for a specific secret value that provides fluent type conversion methods.
 * It implements Symbol.toPrimitive and custom inspection symbols to behave like a 
 * raw value when printed or used in string/number contexts.
 */
export class SecretValue {
  constructor(private _value: string | undefined, private _defaultValue?: any) {}

  /**
   * Returns the value as a string.
   */
  public toString(): string {
    const v = this._value ?? this._defaultValue;
    return v !== undefined ? String(v) : "";
  }

  /**
   * Parses the value as an integer.
   */
  public toInt(): number | undefined {
    const v = this._value ?? this._defaultValue;
    if (v === undefined) return undefined;
    
    if (this._value === undefined && typeof this._defaultValue === 'number') {
        return this._defaultValue;
    }

    const parsed = parseInt(String(v), 10);
    return isNaN(parsed) ? (typeof this._defaultValue === 'number' ? this._defaultValue : undefined) : parsed;
  }
  
  /**
   * Parses the value as a boolean.
   */
  public toBool(): boolean | undefined {
    const v = this._value ?? this._defaultValue;
    if (v === undefined) return undefined;

    if (this._value === undefined && typeof this._defaultValue === 'boolean') {
        return this._defaultValue;
    }

    const s = String(v).toLowerCase();
    const isTrue = ["true", "1", "yes", "on", "t"].includes(s);
    if (isTrue) return true;
    
    const isFalse = ["false", "0", "no", "off", "f"].includes(s);
    if (isFalse) return false;

    return typeof this._defaultValue === 'boolean' ? this._defaultValue : undefined;
  }

  /**
   * Parses the value as JSON.
   */
  public toJSON<T = any>(): T | undefined {
    const v = this._value ?? this._defaultValue;
    if (v === undefined) return undefined;
    if (this._value === undefined) return this._defaultValue;

    try {
      return JSON.parse(String(v));
    } catch {
      return this._defaultValue;
    }
  }

  /**
   * Returns the value for use in arithmetic or string concatenation.
   */
  public valueOf() {
    return this._value ?? this._defaultValue;
  }

  /**
   * Allows the object to be treated as a string or number automatically.
   */
  public [Symbol.toPrimitive](hint: string) {
    if (hint === "number") return this.toInt();
    return this.toString();
  }

  /**
   * Custom inspection for Node.js and Bun.
   * This makes console.log(secrets.get("KEY")) print the value directly.
   */
  public [Symbol.for("nodejs.util.inspect.custom")]() {
    return this._value ?? this._defaultValue;
  }

  /**
   * Custom inspection for Deno.
   */
  public [Symbol.for("Deno.customInspect")]() {
    return this._value ?? this._defaultValue;
  }
}

/**
 * A specialized class for managing decrypted secrets with 
 * type-casting, scoping, and validation capabilities.
 */
export class Secrets {
  [key: string]: any;

  private _data: Record<string, string>;
  private _raw_data: Record<string, string>;

  constructor(data: Record<string, string>, raw?: Record<string, string>) {
    this._data = { ...data };
    this._raw_data = raw ? { ...raw } : { ...data };

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === "string") {
          if (prop in target) {
            return Reflect.get(target, prop, receiver);
          }
          return target._data[prop];
        }
        return Reflect.get(target, prop, receiver);
      },
      ownKeys(target) {
        return Reflect.ownKeys(target._data);
      },
      getOwnPropertyDescriptor(target, prop) {
        if (typeof prop === "string" && prop in target._data) {
          return {
            enumerable: true,
            configurable: true,
            value: target._data[prop],
          };
        }
        return Reflect.getOwnPropertyDescriptor(target, prop);
      },
    });
  }

  public get raw(): Secrets {
    return new Secrets(this._raw_data, this._raw_data);
  }

  public get(key: string, defaultValue?: any): SecretValue {
    return new SecretValue(this._data[key], defaultValue);
  }

  /**
   * Throws an error if any of the given keys are missing.
   */
  public require(...keys: string[]): this {
    const missing = keys.filter((k) => this._data[k] === undefined);
    if (missing.length > 0) {
      throw new RedenvError(
        `Missing required secrets: ${missing.join(", ")}`,
        "SECRET_NOT_FOUND"
      );
    }
    return this;
  }

  /**
   * Returns a new Secrets object with only the secrets that start with the given prefix.
   */
  public scope(prefix: string): Secrets {
    const scopedData: Record<string, string> = {};
    const scopedRaw: Record<string, string> = {};

    for (const [key, val] of Object.entries(this._data)) {
      if (key.startsWith(prefix)) {
        scopedData[key.slice(prefix.length)] = val;
      }
    }

    for (const [key, val] of Object.entries(this._raw_data)) {
      if (key.startsWith(prefix)) {
        scopedRaw[key.slice(prefix.length)] = val;
      }
    }

    return new Secrets(scopedData, scopedRaw);
  }

  /**
   * Returns the unmasked secrets as a plain JavaScript object.
   * Use this for debugging or when you need the raw values.
   */
  public toObject(): Record<string, string> {
    return { ...this._data };
  }

  /**
   * Returns the masked secrets as a JSON string.
   * Use this for debugging or when you need the raw values.
   */
  public toString(): string {
    const keys = Object.keys(this._data);
    const masked: Record<string, string> = {};
    for (const key of keys) {
      masked[key] = "********";
    }
    return `Secrets ${JSON.stringify(masked, null, 2)}`;
  }

  /**
   * Returns the masked secrets as a JSON object.
   * Use this for debugging or when you need the raw values.
   */
  public toJSON() {
    const masked: Record<string, string> = {};
    for (const key of Object.keys(this._data)) {
      masked[key] = "********";
    }
    return masked;
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString();
  }
}
