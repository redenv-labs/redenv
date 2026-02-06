import type { NextConfig } from "next";
import chokidar from "chokidar";
import path from "path";
import { glob } from "glob";
import { updateMDFrontmatter } from "./update";
import matter from "gray-matter";
import * as fs from "fs/promises";
export interface WithFrontmatterOptions {
  /**
   * Directories to watch
   */
  dir: string[];

  /**
   * Update frequency in seconds
   */
  frequency?: number;
}

const WATCH_FLAG = "_REDENV_UPDATED_AT";
const MD_EXTENSIONS = [".mdx", ".md"];

/**
 * Frontmatter Auto-Updater Plugin for Next.js (Dev Only)
 *
 * This plugin watches specified directories for file changes and automatically updates the `frontmatter` metadata,
 * injecting a fresh `updatedAt` timestamp whenever a file or one of its deep dependencies is modified.
 *
 * Designed specifically for Redenv to keep tool and blog metadata always up to date during development.
 *
 * @remarks
 * - This only runs in development mode (`next dev`).
 * - It's best practice to **restart the dev server** whenever you add new tools or pages so dependency tracking stays in sync.
 * - Works with both `.mdx`, `.md` (markdown).
 */
export function withFrontmatter({ dir, frequency }: WithFrontmatterOptions) {
  const isDev = process.env.NODE_ENV === "development";
  const isBuild = process.env.npm_lifecycle_event === "build";

  if ((isDev || isBuild) && process.env[WATCH_FLAG] !== "1") {
    process.env[WATCH_FLAG] = "1";
    void startWatcher(dir, frequency, !isBuild);
  }

  return (nextConfig: NextConfig = {}): NextConfig => {
    return {
      ...nextConfig,
      pageExtensions: nextConfig.pageExtensions ?? ["mdx", "md"],
    };
  };
}

async function startWatcher(
  dir: string[],
  frequency?: number,
  persistent: boolean = true,
) {
  const globPatterns = (await Promise.all(dir.map((d) => glob(d)))).flat();

  const watchFiles = [...new Set([...globPatterns])];
  const watcher = chokidar.watch(watchFiles, {
    ignoreInitial: true,
    persistent: persistent,
  });

  console.log("[FrontMatter] Watching for file changes...");

  watcher.on("add", async (filePath) => {
    const ext = path.extname(filePath);

    if (MD_EXTENSIONS.includes(ext)) {
      const raw = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(raw);

      const now = new Date();
      const nowISO = now.toISOString();

      const updated = matter.stringify(content, {
        ...data,
        createdAt: nowISO,
      });

      await fs.writeFile(filePath, updated);
    }
  });

  watcher.on("change", async (filePath) => {
    const ext = path.extname(filePath);

    if (MD_EXTENSIONS.includes(ext)) {
      void updateMDFrontmatter(filePath, { frequency });
    }
  });
}
