import { createPlugin } from "@redenv/core";
import { startServer } from "./server";
import chalk from "chalk";
import open from "open";

export const studioPlugin = createPlugin({
  name: "studio",
  version: "1.0.0",
  commands: [
    {
      name: "start",
      description: "Start the visual management dashboard",
      flags: [
        {
          name: "port",
          short: "p",
          description: "Port to run the studio on",
          defaultValue: 7874,
        },
      ],
      action: async (args, options, context) => {
        const port = parseInt(options.port || "7874");
        process.env.REDENV_STUDIO_PORT = port.toString();

        console.log(chalk.blue(`[REDENV] Starting Studio on port ${port}...`));

        try {
          // Start the API Server
          startServer(port, context);

          const url = `http://localhost:${port}`;
          console.log(chalk.green(`[REDENV] Studio is ready! 🚀`));
          console.log(chalk.dim(`Access it at: ${url}`));

          // Open default browser
          if (process.env.NODE_ENV === "production") {
            await open(url);
          }

          // Keep process alive (Server logic handles this, but explicit is good)
          // We don't exit here.
        } catch (e) {
          console.error(chalk.red("Failed to start studio:"), e);
        }
      },
    },
  ],
});
