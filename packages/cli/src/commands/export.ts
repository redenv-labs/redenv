import chalk from "chalk";
import ora from "ora";
import fs from "fs";
import path from "path";
import { Command } from "commander";
import { redis } from "../core/upstash";
import { loadProjectConfig } from "../core/config";
import { confirm, checkbox, select } from "@inquirer/prompts";
import { normalize, safePrompt, sanitizeName } from "../utils";
import { fetchEnvironments, fetchProjects } from "../utils/redis";
import dotenv from "dotenv";
import { unlockProject } from "../core/keys";
import { decrypt, expandSecrets } from "@redenv/core";

export function exportCommand(program: Command) {
  program
    .command("export")
    .description("Export environment variables into a .env file")
    .option("--skip-config", "Ignore project config file")
    .option("-p, --project <name>", "Specify project name")
    .option("-e, --env <env>", "Specify environment")
    .option("-f, --file <path>", "Output file", ".env")
    .option("--raw", "Export raw values without resolving variable references")
    .action(action);
}

export const action = async (options: any) => {
  const config = options.skipConfig ? null : await loadProjectConfig();
  let projectName = sanitizeName(options.project) || config?.name;
  let environment = sanitizeName(options.env) || config?.environment;
  const outputFile = options.file;

  if (!projectName) {
    const projects = await fetchProjects();
    if (!projects.length) {
      console.log(chalk.red("✘ No projects found in Redis."));
      return;
    }
    projectName = await safePrompt(() =>
      select({
        message: "Select project:",
        choices: projects.map((p) => ({ name: p, value: p })),
      }),
    );
  }

  if (!environment) {
    const envs = await fetchEnvironments(projectName, true);
    environment = await safePrompt(() =>
      select({
        message: "Select environment:",
        choices: envs.map((e) => ({ name: e, value: e })),
      }),
    );
  }

  const pek = options.pek ?? (await unlockProject(projectName as string));

  const redisKey = `${environment}:${projectName}`;
  const spinner =
    ora(`Fetching variables from ${projectName} (${environment})...
`).start();
  let versionedVars: Record<string, any> = {};
  try {
    const rawVars = await redis.hgetall(redisKey);
    versionedVars = Object.fromEntries(
      Object.entries(rawVars ?? {}).filter(([key]) => !key.startsWith("__")),
    );
    spinner.succeed(chalk.green("Variables fetched"));
  } catch (err) {
    spinner.fail(
      chalk.red(`Failed to fetch variables: ${(err as Error).message}`),
    );

    if (process.env.REDENV_SHELL_ACTIVE) {
      throw err;
    }
    return;
  }

  if (!Object.keys(versionedVars).length) {
    console.log(chalk.yellow("⚠ No variables found to export."));
    return;
  }

  let selectedKeys: string[];
  try {
    const exportAll = await safePrompt(() =>
      confirm({ message: "Export ALL keys?", default: true }),
    );
    if (exportAll) {
      selectedKeys = Object.keys(versionedVars);
    } else {
      selectedKeys = await safePrompt(() =>
        checkbox({
          message: "Select keys to export:",
          choices: Object.keys(versionedVars)
            .filter((k) => !k.startsWith("__"))
            .map((k) => ({
              name: k,
              value: k,
            })),
          loop: false,
        }),
      );
      if (!selectedKeys.length) {
        console.log(chalk.yellow("⚠ No keys selected. Cancelled."));
        return;
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === "ExitPromptError") {
      console.log(chalk.yellow("Cancelled"));
      return;
    }
    throw err;
  }
  const filePath = path.resolve(process.cwd(), outputFile);
  let existingContent = "";
  let existingVars: Record<string, string> = {};
  if (fs.existsSync(filePath)) {
    existingContent = fs.readFileSync(filePath, "utf8");
    existingVars = dotenv.parse(existingContent);
  }

  // --- PROCESSING: Decrypt EVERYTHING first ---
  // We decrypt all keys in the environment to ensure references resolve correctly.
  const decryptedMap: Record<string, string> = {};
  const allKeys = Object.keys(versionedVars);

  const decryptionPromises = allKeys.map(async (key) => {
    try {
      const history = versionedVars[key];
      if (Array.isArray(history) && history.length > 0) {
        decryptedMap[key] = await decrypt(history[0].value, pek);
      }
    } catch {
      // Skip failed decryptions
    }
  });
  await new Promise((resolve) => setTimeout(resolve, 100));
  await Promise.all(decryptionPromises);

  // Expand (Unless --raw)
  let finalMap = decryptedMap;
  if (!options.raw) {
    try {
      finalMap = expandSecrets(decryptedMap);
    } catch (e) {
      console.log(
        chalk.yellow(
          `\n⚠ Warning: ${(e as Error).message}. Exporting raw values.\n`,
        ),
      );
    }
  }

  // --- DIFF DETECTION ---
  const conflicts = selectedKeys.filter((key) =>
    Object.prototype.hasOwnProperty.call(existingVars, key),
  );

  const diffValues = conflicts.filter((key) => {
    const fileVal = normalize(existingVars[key]);
    const redVal = normalize(finalMap[key]);
    return fileVal !== redVal;
  });

  let override = false;
  if (diffValues.length > 0) {
    override = await safePrompt(() =>
      confirm({
        message: `The following keys already exist with different values: ${chalk.magenta(
          diffValues.join(", "),
        )}. Override them?`,
        default: false,
      }),
    );
  }

  const newKeys = selectedKeys.filter((k) => !conflicts.includes(k));
  const keysToWrite = [...newKeys];
  if (override) {
    keysToWrite.push(...diffValues);
  }

  if (keysToWrite.length === 0) {
    console.log(
      chalk.green("✔ Nothing to export. Everything is already in sync."),
    );
    return;
  }

  // --- WRITE ---
  let finalContent = existingContent;
  const keysToOverride = override ? diffValues : [];

  if (keysToOverride.length > 0) {
    const lines = finalContent.split("\n");
    const newLines = lines.map((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("#") || !trimmedLine.includes("="))
        return line;
      const keyMatch = trimmedLine.match(/^([^=]+)=/);
      if (keyMatch) {
        const key = keyMatch[1]?.trim();
        if (!key) return line;
        if (keysToOverride.includes(key)) {
          return `# ${line} # overridden by redenv`;
        }
      }
      return line;
    });
    finalContent = newLines.join("\n");
  }

  let contentToAppend = "";
  if (keysToWrite.length > 0) {
    contentToAppend +=
      finalContent.endsWith("\n\n") || finalContent.length === 0 ? "" : "\n";
    contentToAppend += `\n# Variables exported by redenv from ${projectName} (${environment}) at ${new Date().toISOString()}\n`;

    const linesToAppend = keysToWrite.map((key) => {
      const val = finalMap[key] ?? "";
      // Simple escaping logic for .env
      const escapedVal =
        val.includes("\n") || val.includes('"')
          ? `"${val.replace(/"/g, '\\"')}"`
          : val;
      return `${key}=${escapedVal}\n`;
    });

    contentToAppend += linesToAppend.join("");
  }

  finalContent += contentToAppend;

  try {
    fs.writeFileSync(filePath, finalContent);
    console.log(
      chalk.green(
        `✔ Exported ${keysToWrite.length} keys to ${chalk.blue(outputFile)}`,
      ),
    );
  } catch (err) {
    console.log(chalk.red(`✘ Failed to write file: ${(err as Error).message}`));
    if (process.env.REDENV_SHELL_ACTIVE) {
      throw err;
    }
    process.exit(1);
  }
};
