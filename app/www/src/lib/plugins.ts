import type { Plugin, PluginCategory, PluginStatus } from "@/data/plugins";
import registry from "~/public/plugins.registry.json";

/**
 * An entry in the central plugins.registry.json maintained in the repo.
 */
export interface RegistryEntry {
  /** URL to the plugin author's registry.json */
  url: string;
  /** Whether this is an official @redenv plugin */
  official?: boolean;
  /** Whether to feature this plugin at the top of the page */
  featured?: boolean;
  /** Category override (takes precedence over author's registry.json) */
  category?: PluginCategory;
}

/**
 * The schema of a plugin author's hosted registry.json.
 */
interface PluginRegistryJSON {
  $schema?: string;
  name: string;
  displayName?: string;
  description: string;
  version: string;
  author: string;
  category: PluginCategory;
  status?: PluginStatus;
  installCommand: string;
  repository?: string;
  docs?: string;
}

const VALID_CATEGORIES = new Set<PluginCategory>([
  "dashboard",
  "ci-cd",
  "security",
  "developer-tools",
  "monitoring",
]);

const VALID_STATUSES = new Set<PluginStatus>(["stable", "beta", "new"]);

/**
 * Validates and narrows an unknown value to PluginRegistryJSON.
 * Returns null if validation fails.
 */
function validateRegistryJSON(data: unknown): PluginRegistryJSON | null {
  if (!data || typeof data !== "object") return null;

  const d = data as Record<string, unknown>;

  if (typeof d.name !== "string" || !d.name) return null;
  if (typeof d.description !== "string" || !d.description) return null;
  if (typeof d.version !== "string" || !d.version) return null;
  if (typeof d.author !== "string" || !d.author) return null;
  if (typeof d.installCommand !== "string" || !d.installCommand) return null;
  if (
    typeof d.category !== "string" ||
    !VALID_CATEGORIES.has(d.category as PluginCategory)
  )
    return null;

  return {
    name: d.name,
    displayName: typeof d.displayName === "string" ? d.displayName : undefined,
    description: d.description,
    version: d.version,
    author: d.author,
    category: d.category as PluginCategory,
    status:
      typeof d.status === "string" &&
      VALID_STATUSES.has(d.status as PluginStatus)
        ? (d.status as PluginStatus)
        : "stable",
    installCommand: d.installCommand,
    repository: typeof d.repository === "string" ? d.repository : undefined,
    docs: typeof d.docs === "string" ? d.docs : undefined,
  };
}

/**
 * Fetches a single plugin's registry.json from the author's URL.
 * Returns null on any failure (network, parse, validation).
 */
async function fetchPluginRegistry(
  entry: RegistryEntry,
): Promise<Plugin | null> {
  try {
    const res = await fetch(entry.url, {
      next: { revalidate: 3600 }, // 1 hour ISR
    });

    if (!res.ok) return null;

    const raw = await res.json();
    const data = validateRegistryJSON(raw);
    if (!data) return null;

    if (data.category.toLowerCase().includes("official")) {
      return null;
    }

    return {
      id: data.name,
      name: data.displayName || data.name,
      slug: data.name,
      description: data.description,
      version: data.version,
      author: data.author,
      category: entry.category || data.category,
      official: entry.official ?? false,
      status: data.status || "stable",
      installCommand: data.installCommand,
      githubUrl: data.repository,
      docsUrl: data.docs,
      featured: entry.featured ?? false,
    };
  } catch {
    return null;
  }
}

/**
 * Reads the central registry index and fetches all plugin registries in parallel.
 * Gracefully skips any that fail.
 */
export async function getPlugins(): Promise<Plugin[]> {
  const entries = registry as RegistryEntry[];

  const results = await Promise.allSettled(
    entries.map((entry) => fetchPluginRegistry(entry)),
  );

  const plugins = results
    .filter(
      (r): r is PromiseFulfilledResult<Plugin | null> =>
        r.status === "fulfilled",
    )
    .map((r) => r.value)
    .filter((p): p is Plugin => p !== null);

  return plugins.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.official !== b.official) return a.official ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
