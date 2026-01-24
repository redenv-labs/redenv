import chalk from "chalk";
import { Command } from "commander";
import { loadProjectConfig } from "../core/config";
import { redis } from "../core/upstash";
import ora from "ora";
import { select } from "@inquirer/prompts";
import { safePrompt, sanitizeName } from "../utils";
import { fetchEnvironments } from "../utils/redis";
import { unlockProject } from "../core/keys";
import { decrypt, RedenvError, expandSecrets } from "@redenv/core";

export function viewCommand(program: Command) {
  program
    .command("view")
    .argument("<key>", "ENV key to view")
    .description("View the value of a specific ENV variable")
    .option("-p, --project <name>", "Specify the project name")
    .option("-e, --env <env>", "Specify environment")
    .action(action);
}

export const action = async (key: string, options: any) => {
  const projectConfig = await loadProjectConfig();

  if (key.startsWith("__")) {
    console.log(
      chalk.red(
        "✘ Secrets starting with '__' are reserved for internal metadata and cannot be viewed directly.",
      ),
    );
    return;
  }

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
        choices: envs,
      }),
    );
  }

  try {
    const pek = options.pek ?? (await unlockProject(projectName as string));

    const spinner = ora(
      `Fetching value for ${chalk.cyan(key)} in ${chalk.yellow(projectName)}...`,
    ).start();

    const redisKey = `${environment}:${projectName}`;
    const history = await redis.hget(redisKey, key);

    if (history === null || history === undefined) {
      spinner.fail(
        chalk.red(`Key '${key}' not found in ${projectName} (${environment}).`),
      );
      return;
    }

    spinner.succeed(
      chalk.greenBright(`Found key in ${projectName} (${environment})`),
    );

    let decryptedValue: string;
    try {
      const historyArray = Array.isArray(history)
        ? history
        : JSON.parse(history as string);
      if (!Array.isArray(historyArray) || historyArray.length === 0) {
        throw new RedenvError(
          "History format is invalid or empty.",
          "UNKNOWN_ERROR",
        );
      }
      const latestVersion = historyArray[0];
      decryptedValue = await decrypt(latestVersion.value, pek);
    } catch {
      console.log(
        chalk.yellow(
          `\n⚠️  Could not decrypt the value for '${key}'. It might be corrupted or the project key is incorrect.`,
        ),
      );
      decryptedValue = JSON.stringify(history, null, 2);
    }

    // --- Expansion Logic ---
    let expandedValue = decryptedValue;
    let hasExpansion = false;

    // Corrected condition (removed trailing space)
    if (decryptedValue.includes("${")) {
      const expandSpinner = ora("Resolving references...").start();
      try {
        const allEnvs = await redis.hgetall<Record<string, any>>(redisKey);
        const filteredEnvs = Object.fromEntries(
          Object.entries(allEnvs || {}).filter(([k]) => !k.startsWith("__")),
        );

        const decryptedMap: Record<string, string> = {};
        await Promise.all(
          Object.entries(filteredEnvs).map(async ([k, hist]) => {
            try {
              const h = Array.isArray(hist) ? hist : JSON.parse(hist as string);
              if (Array.isArray(h) && h.length > 0) {
                decryptedMap[k] = await decrypt(h[0].value, pek);
              }
            } catch {
              // Ignore decryption errors for other keys
            }
          }),
        );

        const finalMap = expandSecrets(decryptedMap);
        expandedValue = finalMap[key]!;
        hasExpansion = expandedValue !== decryptedValue;
        expandSpinner.stop();
      } catch {
        expandSpinner.fail(chalk.yellow("Failed to resolve references."));
      }
    }

    console.log(`\n${chalk.blue.bold(key)}`);
    console.log(chalk.gray("│"));

    if (hasExpansion) {
      console.log(
        `${chalk.gray("└─")} ${chalk.green(decryptedValue)} ${chalk.gray(`(${expandedValue})`)}`,
      );
    } else {
      const lines = decryptedValue.split("\n");
      lines.forEach((line, i) => {
        if (i === 0) {
          console.log(`${chalk.gray("└─")} ${chalk.green(line)}`);
        } else {
          console.log(`${chalk.gray("   ")} ${chalk.green(line)}`);
        }
      });
    }
    console.log("");
  } catch (err) {
    // Errors from unlockProject are handled within the function, so this will catch other errors.
    if ((err as Error).name !== "ExitPromptError") {
      console.log(
        chalk.red(
          `\n✘ An unexpected error occurred: ${(err as Error).message}`,
        ),
      );
    }
  }
};
