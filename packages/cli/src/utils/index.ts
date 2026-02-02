import chalk from "chalk";
import { exit } from "process";
import { loadGlobalConfig, loadProjectConfig } from "../core/config";
import fs from "fs";
import os from "os";
import { RedenvError } from "@redenv/core";

export const UserCancelledError = "PROMPT_CANCELLED_BY_USER";

export class ContextSwitchRequest extends Error {
  public readonly newProject?: string;
  public readonly newEnv?: string;

  constructor(
    message: string,
    newContext: { newProject?: string; newEnv?: string },
  ) {
    super(message);
    this.name = "ContextSwitchRequest";
    this.newProject = newContext.newProject;
    this.newEnv = newContext.newEnv;
  }
}

export async function safePrompt<T>(promptFn: () => Promise<T>): Promise<T> {
  try {
    return await promptFn();
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "AbortError" || err.name === "ExitPromptError")
    ) {
      console.log(chalk.yellow("\nCancelled")); // Add newline for better formatting
      if (process.env.REDENV_SHELL_ACTIVE) {
        throw new RedenvError(UserCancelledError, "PROMPT_CANCELLED");
      } else {
        exit(0);
      }
    }
    throw err;
  }
}

export function getAuditUser(): string {
  const globalConfig = loadGlobalConfig();
  if (globalConfig && globalConfig.email) {
    return globalConfig.email;
  }
  try {
    const userInfo = os.userInfo();
    const hostname = os.hostname();
    return `${userInfo.username}@${hostname}`;
  } catch {
    // Failsafe in very restricted environments
    return "unknown-user";
  }
}

export const normalize = (val: any): string => {
  if (val === undefined || val === null) return "";
  return val.toString().trim().replace(/\r\n/g, "\n");
};

export const sanitizeName = (name: string | undefined) => {
  if (!name) return name;
  return name.replace(/:/g, "-");
};

export const nameValidator = (input: string) => {
  if (input.includes(":")) {
    return "Project and environment names cannot contain colons (:).";
  }
  return true;
};

export const secretKeyValidator = (input: string) => {
  if (input.startsWith("__")) {
    return "Secret names cannot start with '__' (double underscore)";
  }
  return nameValidator(input);
};

export const getReferences = (value: string): string[] => {
  const regex = /\$\{([a-zA-Z0-9_]+)\}/g;
  const matches = [...value.matchAll(regex)];
  return matches.map((m) => m[1]!);
};

export const writeProjectConfig = async ({
  _filepath,
  ...config
}: Record<string, unknown>) => {
  void _filepath; // ignore filepath
  const currentConfig = await loadProjectConfig();
  const existingPath = currentConfig?._filepath;

  if (existingPath) {
    let content: string;
    try {
      content = fs.readFileSync(existingPath, "utf8");
    } catch (err) {
      throw new RedenvError(
        `Failed to read project config: ${(err as Error).message}`,
        "MISSING_CONFIG",
      );
    }

    const updated = updateConfigFields(content, config);

    if (updated === content) {
      throw new RedenvError(
        `Could not update fields in ${existingPath}. Please update it manually.`,
        "MISSING_CONFIG",
      );
    }

    fs.writeFileSync(existingPath, updated);
    console.log(chalk.green(`✔ Updated configuration: ${existingPath}`));
    return;
  }

  // No config found → create new TS config
  const targetPath = "redenv.config.ts";

  if (fs.existsSync(targetPath)) {
    console.log(
      chalk.yellow(`⚠  ${targetPath} already exists. Skipping creation.`),
    );
    return;
  }

  const configContent = sortObject({
    name: config.name,
    environment: config.environment || "development",
    ...config,
  });

  const tsContent = `import { defineConfig } from "@redenv/core";

export default defineConfig(${JSON.stringify(configContent, null, 2)});
`;

  fs.writeFileSync(targetPath, tsContent);
};

/**
 * Replaces scalar string fields in a config file's text content.
 * Only touches `key: "value"` or `key: 'value'` patterns, preserving
 * everything else (plugins, imports, formatting, etc).
 */
export function updateConfigFields(
  content: string,
  fields: Record<string, unknown>,
): string {
  let updated = content;
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string") continue;

    const fieldRegex = new RegExp(`(${key}\\s*:\\s*)(['"]).*?\\2`);

    if (fieldRegex.test(updated)) {
      updated = updated.replace(fieldRegex, `$1"${value}"`);
    }
  }
  return updated;
}

function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0])),
  );
}
