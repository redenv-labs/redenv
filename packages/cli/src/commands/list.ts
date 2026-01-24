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

async function fetchAndDisplayVariables(
  redisKey: string,
  decryptionKey: CryptoKey
) {
  const [environment, projectName] = redisKey.split(":");
  const spinner = ora(
    `Fetching variables for ${projectName} (${environment})...`
  ).start();
  try {
    const envs = await redis.hgetall<Record<string, any>>(redisKey);
    spinner.stop();

    const filteredEnvs = Object.fromEntries(
      Object.entries(envs || {}).filter(([key]) => !key.startsWith("__"))
    );

    if (Object.keys(filteredEnvs).length === 0) {
      console.log(
        chalk.yellow(
          `No environment variables found for project ${projectName} (${environment}).`
        )
      );
      return;
    }

    console.log(
      chalk.cyan.bold(`\n📦 Variables for ${projectName} (${environment}):\n`)
    );

    const sorted = Object.entries(filteredEnvs).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    // 1. Decrypt all values first
    const decryptedMap: Record<string, string> = {};
    
    // Decrypt all values in parallel for performance
    await Promise.all(sorted.map(async ([key, history]) => {
      try {
        if (!Array.isArray(history) || history.length === 0) {
          throw new RedenvError("Invalid history format", "UNKNOWN_ERROR");
        }
        const latestVersion = history[0];
        const decryptedValue = await decrypt(
          latestVersion.value,
          decryptionKey
        );
        decryptedMap[key] = decryptedValue;
      } catch {
        decryptedMap[key] = "[Corrupted or invalid data]";
      }
    }));

    // 2. Expand variables
    let finalMap = decryptedMap;
    try {
      finalMap = expandSecrets(decryptedMap);
    } catch (e) {
      console.log(chalk.yellow(`\n⚠ Warning: ${(e as Error).message}\n`));
      // Fallback to unexpanded if cycle detected
    }

    // 3. Display (Tree-style View)
    for (const [key] of sorted) {
      const original = decryptedMap[key];
      const expanded = finalMap[key];
      
      console.log(chalk.blue.bold(key));
      console.log(chalk.gray("│"));
      
      let valOutput = expanded;
      if (original !== expanded && original !== "[Corrupted or invalid data]") {
         valOutput = `${chalk.green(original)} ${chalk.gray(`(${expanded})`)}`;
      } else {
         valOutput = chalk.green(expanded);
      }

      // Handle multiline values with tree branch prefix
      const lines = valOutput.split("\n");
      lines.forEach((line, i) => {
          if (i === 0) {
              console.log(`${chalk.gray("└─")} ${line}`);
          } else {
              console.log(`${chalk.gray("   ")} ${line}`);
          }
      });
      
      console.log(""); // Empty line separator
    }

  } catch (err) {
    spinner.fail(
      chalk.red(`Failed to fetch variables: ${(err as Error).message}`)
    );
  }
}

export function listCommand(program: Command) {
  program
    .command("list")
    .description("List all ENV variables for a project")
    .option("-p, --project <name>", "Specify project name")
    .option("-e, --env <env>", "Specify the environment")
    .action(action);
}

export const action = async (options: any) => {
  const projectConfig = await loadProjectConfig();
  const projectOption = sanitizeName(options.project);
  const envOption = sanitizeName(options.env);

  const projectName = projectOption || projectConfig?.name;
  if (!projectName) {
    console.log(
      chalk.red(
        "No project specified. Use `redenv list -p <project-name>` or run from a registered project directory."
      )
    );
    return;
  }

  try {
    const pek = options.pek ?? (await unlockProject(projectName as string));
    let environment = envOption || projectConfig?.environment;

    if (!environment) {
                const envs = (await fetchEnvironments(projectName, true)).filter(
                  (e) => !e.startsWith("__")
                );
                if (envs.length === 0) {
                  console.log(
                    chalk.yellow(
                      `No environments found for project "${projectName}".`
                    )
                  );
                  return;
                }
      environment = await safePrompt(() =>
        select({
          message: "Select environment:",
          choices: envs.map((e) => ({ name: e, value: e })),
        })
      );
    }

    const redisKey = `${environment}:${projectName}`;
    await fetchAndDisplayVariables(redisKey, pek);
  } catch (err) {
    // Errors from unlockProject are handled, so we don't need to log them again
    if ((err as Error).name !== "ExitPromptError") {
      console.log(
        chalk.red(`\n✘ An unexpected error occurred: ${(err as Error).message}`)
      );
    }
  }
};