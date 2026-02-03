import { password, confirm } from "@inquirer/prompts";
import { safePrompt } from "../utils";
import { redis } from "./upstash";
import {
  deriveKey,
  decrypt,
  encrypt,
  exportKey,
  importKey,
  generateRandomKey,
  generateSalt,
  bufferToHex,
  RedenvError,
} from "@redenv/core";
import ora, { type Ora } from "ora";
import keytar from "keytar";
import chalk from "chalk";

const KEYTAR_SERVICE = "redenv-cli";

// The cache now stores CryptoKey objects.
const keyCache = new Map<string, CryptoKey>();

/**
 * Unlocks a project's Project Encryption Key (PEK) by checking the OS keychain,
 * or prompting for the master password as a fallback.
 * Caches the key in memory for the lifetime of the CLI process.
 * @param projectName The name of the project to unlock.
 * @returns The decrypted Project Encryption Key as a CryptoKey.
 */
export async function unlockProject(projectName: string): Promise<CryptoKey> {
  // 1. Check in-memory cache first
  if (keyCache.has(projectName)) {
    return keyCache.get(projectName)!;
  }

  // 2. Check OS keychain
  const cachedPEKHex = await keytar.getPassword(KEYTAR_SERVICE, projectName);
  if (cachedPEKHex) {
    const pek = await importKey(cachedPEKHex);
    keyCache.set(projectName, pek);
    // Use a subtle message for this common case
    ora().succeed(
      chalk.green(`Unlocked project "${projectName}" using keychain.`)
    );
    return pek;
  }

  // 3. Fallback to prompting for master password
  const masterPassword = await safePrompt(() =>
    password({
      message: `Enter Master Password for project "${projectName}":`,
      mask: "*",
    })
  );

  const spinner = ora("Decrypting project key...").start();

  try {
    const metaKey = `meta@${projectName}`;
    const metadata = await redis.hgetall<{
      encryptedPEK: string;
      salt: string;
    }>(metaKey);

    if (!metadata || !metadata.encryptedPEK || !metadata.salt) {
      throw new RedenvError(
        `Could not find encryption metadata for project "${projectName}". The project may not be registered correctly.`,
        "PROJECT_NOT_FOUND"
      );
    }

    const salt = Buffer.from(metadata.salt, "hex");
    const passwordDerivedKey = await deriveKey(masterPassword, salt);
    const decryptedPEKHex = await decrypt(
      metadata.encryptedPEK,
      passwordDerivedKey
    );
    const pek = await importKey(decryptedPEKHex);

    spinner.succeed("Project unlocked successfully");

    // 4. Offer to save the key to the keychain for next time
    const shouldCache = await safePrompt(() =>
      confirm({
        message: "Remember password for this project in your OS keychain?",
        default: true,
      })
    );

    if (shouldCache) {
      const exportedPEK = await exportKey(pek);
      await keytar.setPassword(KEYTAR_SERVICE, projectName, exportedPEK);
      console.log(chalk.green("✔ Password remembered for future sessions."));
      console.log(chalk.gray("  (Use `redenv logout` to forget)"));
    }

    // 5. Cache in memory for the current session
    keyCache.set(projectName, pek);

    return pek;
  } catch (err) {
    spinner.fail(
      err instanceof Error ? err.message : "An unknown error occurred."
    );
    process.exit(1);
  }
}

/**
 * A high-security function that ALWAYS prompts for a password to verify project ownership.
 * It does not use the keychain or in-memory cache.
 * Throws an error if the password is incorrect.
 * @param projectName The name of the project to verify.
 */
export async function verifyPassword(projectName: string): Promise<void> {
  let spinner: Ora | undefined;
  try {
    const masterPassword = await safePrompt(() =>
      password({
        message: `Enter Master Password for "${projectName}" to confirm this destructive action:`,
        mask: "*",
      })
    );

    spinner = ora("Verifying password...").start();
    const metaKey = `meta@${projectName}`;
    const metadata = await redis.hgetall<{
      encryptedPEK: string;
      salt: string;
    }>(metaKey);

    if (!metadata || !metadata.encryptedPEK || !metadata.salt) {
      throw new RedenvError(
        `Could not find metadata for project "${projectName}".`,
        "PROJECT_NOT_FOUND"
      );
    }

    const salt = Buffer.from(metadata.salt, "hex");
    const passwordDerivedKey = await deriveKey(masterPassword, salt);
    // We don't need the result, we just need to know if it throws an error.
    // The `decrypt` function will throw a specific error on failure.
    await decrypt(metadata.encryptedPEK, passwordDerivedKey);
    spinner.succeed("Password verified.");
  } catch (e) {
    spinner?.fail("Incorrect password. Please try again.");
    throw e;
  }
}

/**
 * Removes a project's cached PEK from the OS keychain.
 * @param projectName The name of the project to log out from.
 */
export async function forgetProjectKey(projectName: string): Promise<boolean> {
  keyCache.delete(projectName);
  return keytar.deletePassword(KEYTAR_SERVICE, projectName);
}

/**
 * Creates a new project with a master password.
 * Generates PEK, encrypts it, and stores metadata in Redis.
 * @param projectName The name of the project to create.
 * @param options Optional settings like historyLimit.
 * @returns The Project Encryption Key (PEK) as a CryptoKey.
 */
export async function createProject(
  projectName: string,
  options: { historyLimit?: number } = {}
): Promise<CryptoKey> {
  const historyLimit = options.historyLimit ?? 10;

  const masterPassword = await safePrompt(() =>
    password({
      message: `Create a Master Password for project "${projectName}":`,
      mask: "*",
      validate: (p) =>
        p.length >= 8 || "Password must be at least 8 characters long.",
    })
  );

  await safePrompt(() =>
    password({
      message: "Confirm Master Password:",
      mask: "*",
      validate: (value) =>
        value === masterPassword || "Passwords do not match.",
    })
  );

  const spinner = ora("Encrypting and registering project...").start();

  try {
    const salt = generateSalt();
    const projectEncryptionKey = await generateRandomKey();
    const passwordDerivedKey = await deriveKey(masterPassword, salt);

    const exportedPEK = await exportKey(projectEncryptionKey);
    const encryptedPEK = await encrypt(exportedPEK, passwordDerivedKey);

    const metaKey = `meta@${projectName}`;
    const metadata = {
      encryptedPEK: encryptedPEK,
      salt: bufferToHex(salt as any),
      historyLimit: historyLimit,
      kdf: "pbkdf2",
      algorithm: "aes-256-gcm",
      createdAt: new Date().toISOString(),
    };
    await redis.hset(metaKey, metadata);

    spinner.succeed(
      chalk.green(
        `Project "${projectName}" registered and encrypted successfully!`
      )
    );
    console.log(
      chalk.yellow("  Remember your Master Password. It cannot be recovered.")
    );

    // cache in memory
    keyCache.set(projectName, projectEncryptionKey);

    return projectEncryptionKey;
  } catch (err) {
    spinner.fail(
      chalk.red(`Failed to register project: ${(err as Error).message}`)
    );
    throw err;
  }
}
