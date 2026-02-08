import {
  BookOpen,
  History,
  LineSquiggle,
  LucideIcon,
  Puzzle,
} from "lucide-react";

export const REDENV_GITHUB_URL = "https://github.com/redenv-labs/redenv";
export const REDENV_LABS_URL = "https://github.com/redenv-labs";

export const REDENV_PYPI_URL = "https://pypi.org/project/redenv";
export const REDENV_JS_CLIENT_URL =
  "https://www.npmjs.com/package/@redenv/client";

export const PACKAGE_CONFIG: Record<
  "cli" | "core" | "client" | "python",
  { path: string; displayName: string }
> = {
  cli: { path: "packages/cli/CHANGELOG.md", displayName: "CLI" },
  core: { path: "packages/core/CHANGELOG.md", displayName: "Core" },
  client: { path: "packages/client/CHANGELOG.md", displayName: "JS SDK" },
  python: {
    path: "packages/python-client/CHANGELOG.md",
    displayName: "Python SDK",
  },
};

export const PAGES: Array<{
  label: string;
  href: string;
  category: string;
  icon: LucideIcon;
  description: string;
  disabled?: boolean;
  searchable?: boolean;
  external?: boolean;
}> = [
  {
    label: "Docs",
    href: "/docs",
    category: "resources",
    icon: BookOpen,
    searchable: true,
    description: "Learn how to integrate and use Redenv",
    external: false,
  },
  {
    label: "Plugins",
    href: "/plugins",
    category: "resources",
    icon: Puzzle,
    searchable: true,
    description: "Extend Redenv with community plugins",
    external: false,
  },
  {
    label: "Changelog",
    href: "/changelog",
    category: "resources",
    icon: History,
    searchable: true,
    description: "See what's new in each release",
    external: false,
  },
  {
    label: "Roadmap",
    href: "/roadmap",
    category: "resources",
    disabled: true,
    icon: LineSquiggle,
    description: "Upcoming features and improvements",
    external: false,
  },
] as const;
