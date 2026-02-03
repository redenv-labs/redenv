import chalk from "chalk";
import { loadProjectConfig } from "../core/config";
import { Command } from "commander";
import { sanitizeName, writeProjectConfig } from "../utils";
import ora from "ora";
import { redis } from "../core/upstash";
import { unlockProject, createProject } from "../core/keys";

export function registerCommand(program: Command) {
  program
    .command("register")
    .argument("<project>", "Project name")
    .argument("[env]", "Project environment", "development")
    .option(
      "-l, --history-limit <number>",
      "Number of history entries to keep per secret",
      "10"
    )
    .description("Register a new project or connect to an existing one")
    .action(action);
}

export const action = async (
  project: string,
  env: string,
  options: any
) => {
  const sanitizedProject = sanitizeName(project);
  const sanitizedEnv = sanitizeName(env);

  if (
    project !== sanitizedProject ||
    env !== sanitizedEnv
  ) {
    console.log(
      chalk.yellow(
        "Colons (:) are not allowed in names and have been replaced with hyphens (-)."
      )
    );
  }

  const spinner = ora("Checking project status...").start();
  const metaKey = `meta@${sanitizedProject}`;
  const projectExists = (await redis.exists(metaKey)) > 0;
  spinner.stop();

  const localConfig = await loadProjectConfig();
  if (localConfig && localConfig.name === sanitizedProject && projectExists) {
    console.log(
      chalk.yellow(
        `This directory is already registered with project "${sanitizedProject}".`
      )
    );
    return;
  }

  // --- Flow for connecting to an EXISTING remote project ---
  if (projectExists) {
    console.log(
      chalk.blue(`Project "${sanitizedProject}" already exists remotely.`)
    );
    if (!options.pek) await unlockProject(sanitizedProject as string);

    const data = {
      name: sanitizedProject,
      environment: sanitizedEnv,
    };
    await writeProjectConfig(data);
    console.log(
      chalk.green(
        `\n✔ Successfully connected local directory to project "${sanitizedProject}".`
      )
    );
    return;
  }

  // --- Flow for creating a NEW project ---
  console.log(chalk.blue(`Creating new project "${sanitizedProject}"...`));

  const historyLimit = parseInt(options.historyLimit, 10);
  if (isNaN(historyLimit) || historyLimit < 0) {
    console.log(chalk.red("✘ History limit must be a non-negative number."));
    return;
  }

  try {
    await createProject(sanitizedProject as string, { historyLimit });

    const data = {
      name: sanitizedProject,
      environment: sanitizedEnv,
    };
    await writeProjectConfig(data);
  } catch {
    // Error already logged by createProject
  }
};
