export type PluginCategory =
  | "dashboard"
  | "ci-cd"
  | "security"
  | "developer-tools"
  | "monitoring";

export type PluginStatus = "stable" | "beta" | "new";

export interface Plugin {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  version: string;
  author: string;
  category: PluginCategory;
  official: boolean;
  status: PluginStatus;
  installCommand: string;
  githubUrl?: string;
  docsUrl?: string;
  featured?: boolean;
}

export const categoryLabels: Record<PluginCategory, string> = {
  dashboard: "Dashboard",
  "ci-cd": "CI/CD",
  security: "Security",
  "developer-tools": "Dev Tools",
  monitoring: "Monitoring",
};
