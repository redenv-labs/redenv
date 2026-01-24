import chalk from "chalk";
import ora, { type Ora } from "ora";
import { Command } from "commander";
import { loadProjectConfig } from "../core/config";
import {
  sanitizeName,
  safePrompt,
  getAuditUser,
  secretKeyValidator,
  getReferences,
} from "../utils";
import { unlockProject } from "../core/keys";
import { fetchEnvironments } from "../utils/redis";
import { select } from "@inquirer/prompts";
import { RedenvError, writeSecret } from "@redenv/core";
import { redis } from "../core/upstash";
import { multiline } from "@cli-prompts/multiline";

export function addCommand(program: Command) {
  program
    .command("add")
    .argument("<key>", "The ENV key to add")
    .description("Add a new environment variable to your project")
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
    const envs = await fetchEnvironments(projectName, true);
    environment = await safePrompt(() =>
      select({
        message: "Select environment:",
        choices: envs.map((e) => ({ name: e, value: e })),
      }),
    );
  }

  let spinner: Ora | undefined;
  try {
    const keyValidation = secretKeyValidator(key);
    if (typeof keyValidation === "string") {
      console.log(chalk.red(`✘ ${keyValidation}`));
      if (process.env.REDENV_SHELL_ACTIVE)
        throw new RedenvError(keyValidation, "INVALID_INPUT");
      return;
    }

    let value = "";
    let isValid = false;

    // Pre-fetch keys once to avoid network lag in loop
    const redisKey = `${environment}:${projectName}`;
    // We need to unlock first to check existence? No, hexists doesn't need PEK.
    // But we need to check if key exists to prevent overwrite.
    const [exists, existingKeys] = await Promise.all([
      redis.hexists(redisKey, key).then((r) => r > 0),
      redis.hkeys(redisKey),
    ]);

    if (exists) {
      console.log(
        chalk.yellow(
          `Key '${key}' already exists. Use ${chalk.cyan(
            "redenv edit",
          )} to update it.`,
        ),
      );
      return;
    }

    const availableKeys = existingKeys.filter((k) => !k.startsWith("__"));

    while (!isValid) {
      value = await safePrompt(() =>
        multiline({
          prompt: `Enter value for ${key}:`,
          required: true,
          validate(value) {
            if (!value.trim()) return "You must enter something.";
            return true;
          },
        }),
      );

      // Reference Validation
      const refs = getReferences(value);
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
        continue; // Loop back
      }

      isValid = true;
    }

    const pek = options.pek ?? (await unlockProject(projectName));
    spinner = ora(
      `Adding ${chalk.cyan(key)} to ${chalk.yellow(
        projectName,
      )} (${environment})...`,
    ).start();

    await writeSecret(
      redis,
      projectName,
      environment,
      key,
      value,
      pek,
      getAuditUser(),
    );

    spinner.succeed(
      chalk.greenBright(
        `Added '${key}' → ${chalk.cyan(
          value,
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
        chalk.red(`
✘ An unexpected error occurred: ${error.message}`),
      );
    }
    process.exit(1);
  }
};
