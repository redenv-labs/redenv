export type PluginStatus = "stable" | "beta" | "new";

export interface Plugin {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  version: string;
  author: string;
  category: string;
  official: boolean;
  status: PluginStatus;
  installCommand: string;
  githubUrl?: string;
  docsUrl?: string;
  featured?: boolean;
}
