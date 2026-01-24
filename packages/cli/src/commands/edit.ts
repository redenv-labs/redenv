import chalk from "chalk";
import { Command } from "commander";
import ora, { type Ora } from "ora";
import { loadProjectConfig } from "../core/config";
import {
  safePrompt,
  sanitizeName,
  getAuditUser,
  secretKeyValidator,
  getReferences,
} from "../utils";
import { fetchEnvironments } from "../utils/redis";
import { select } from "@inquirer/prompts";
import { multiline } from "@cli-prompts/multiline";
import { unlockProject } from "../core/keys";
import { RedenvError, writeSecret } from "@redenv/core";
import { redis } from "../core/upstash";
import { decrypt } from "@redenv/core";

export function editCommand(program: Command) {
  program
    .command("edit")
    .argument("<key>", "The ENV key to modify")
    .description("Update an existing environment variable’s value")
    .option("-p, --project <name>", "Specify the project name")
    .option("-e, --env <env>", "Specify the environment")
    .action(action);
}

export const action = async (key: string, options: any) => {
  const projectConfig = await loadProjectConfig();

  if (!projectConfig && !options.project) {
    console.log(
      chalk.red(
        "✘ No project registered. Use `redenv register <name>` or pass `--project <name>`.",
      ),
    );
    return;
  }

  const projectName =
    sanitizeName(options.project) || projectConfig?.name || "";
  let environment = sanitizeName(options.env) || projectConfig?.environment;

  if (!environment) {
    const envs = (await fetchEnvironments(projectName, true)) || [];
    environment = await safePrompt(() =>
      select({
        message: "Select environment:",
        loop: false,
        choices: envs.map((e) => ({ name: e, value: e })),
      }),
    );
  }

  const keyValidation = secretKeyValidator(key);
  if (typeof keyValidation === "string") {
    console.log(chalk.red(`✘ ${keyValidation}`));
    if (process.env.REDENV_SHELL_ACTIVE)
      throw new RedenvError(keyValidation, "INVALID_INPUT");
    return;
  }

  // 1. Optimized parallel fetch for validation and default value
  const redisKey = `${environment}:${projectName}`;
  const [existingKeys, historyJSON] = await Promise.all([
    redis.hkeys(redisKey),
    redis.hget(redisKey, key),
  ]);

  if (!historyJSON) {
    throw new RedenvError(
      `Key '${key}' does not exist in ${projectName} (${environment}). Use 'redenv add ${key}' to create it.`,
      "MISSING_KEY",
    );
  }

  // 2. Unlock project once and get PEK
  const pek = options.pek ?? (await unlockProject(projectName as string));

  // 3. Decrypt current value for the default prompt
  let defaultValue = "";
  try {
    const history = Array.isArray(historyJSON)
      ? historyJSON
      : JSON.parse(historyJSON as string);
    if (history.length > 0) {
      defaultValue = await decrypt(history[0].value, pek);
    }
  } catch {
    // no log needed
  }

  const availableKeys = existingKeys.filter((k) => !k.startsWith("__"));
  let newValue = "";
  let isValid = false;

  // 4. Prompt Loop
  while (!isValid) {
    newValue = await safePrompt(() =>
      multiline({
        prompt: `Enter new value for ${chalk.cyan(key)}:`,
        default: defaultValue,
        required: true,
        validate(value) {
          if (!value.trim()) return "You must enter something.";
          return true;
        },
      }),
    );

    // Reference Validation
    const refs = getReferences(newValue);
    const missingRefs = refs.filter((r) => !existingKeys.includes(r));

    if (missingRefs.length > 0) {
      console.log(
        chalk.red(`\n✘ Unknown key(s) referenced: ${missingRefs.join(", ")}`),
      );
      console.log(
        chalk.gray(
          `  Available keys: ${availableKeys.sort().join(", ") || "(none)"}\n`,
        ),
      );
      console.log(chalk.yellow("  Please try again."));
      continue;
    }

    isValid = true;
  }

  let spinner: Ora | undefined;
  try {
    spinner = ora(
      `Updating ${chalk.cyan(key)} in ${chalk.yellow(
        projectName,
      )} (${environment})...`,
    ).start();

    await writeSecret(
      redis,
      projectName!,
      environment,
      key,
      newValue,
      pek,
      getAuditUser(),
    );

    spinner.succeed(
      chalk.greenBright(
        `Updated '${key}' → ${chalk.cyan(
          newValue,
        )} in ${projectName} (${environment})`,
      ),
    );
  } catch (err) {
    const error = err as Error;
    if (spinner && spinner.isSpinning) {
      spinner.fail(chalk.red(error.message));
    }

    if (process.env.REDENV_SHELL_ACTIVE) {
      throw error;
    }

    if (error.name !== "ExitPromptError") {
      console.log(
        chalk.red(`\n✘ An unexpected error occurred: ${error.message}`),
      );
    }
    process.exit(1);
  }
};
