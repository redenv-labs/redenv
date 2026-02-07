import { PACKAGE_CONFIG } from "@/consts";
import fs from "fs/promises";
import path from "path";

export type ChangeType = "added" | "changed" | "fixed" | "removed";
export type PackageType = "cli" | "core" | "client" | "python";

export interface ChangeGroup {
  type: ChangeType;
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string | null; // null for [Unreleased]
  package: PackageType;
  packageDisplayName: string;
  changes: ChangeGroup[];
}

export interface GroupedChangelog {
  date: string;
  displayDate: string;
  entries: ChangelogEntry[];
}

function parseChangeType(header: string): ChangeType | null {
  const normalized = header.toLowerCase().trim();
  if (normalized.includes("added")) return "added";
  if (normalized.includes("changed")) return "changed";
  if (normalized.includes("fixed")) return "fixed";
  if (normalized.includes("removed")) return "removed";
  return null;
}

function parseVersion(line: string): { version: string; date: string | null } | null {
  // Match: ## [1.8.0] - 2026-02-03 or ## [Unreleased]
  const match = line.match(/^##\s*\[([^\]]+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/);
  if (!match) return null;

  return {
    version: match[1],
    date: match[2] || null,
  };
}

function parseChangelogContent(
  content: string,
  pkg: PackageType,
): ChangelogEntry[] {
  const lines = content.split("\n");
  const entries: ChangelogEntry[] = [];

  let currentEntry: ChangelogEntry | null = null;
  let currentChangeType: ChangeType | null = null;
  let currentItems: string[] = [];

  const flushChangeGroup = () => {
    if (currentEntry && currentChangeType && currentItems.length > 0) {
      currentEntry.changes.push({
        type: currentChangeType,
        items: [...currentItems],
      });
      currentItems = [];
    }
  };

  const flushEntry = () => {
    flushChangeGroup();
    if (currentEntry && currentEntry.changes.length > 0) {
      entries.push(currentEntry);
    }
    currentEntry = null;
    currentChangeType = null;
  };

  for (const line of lines) {
    // Check for version header
    if (line.startsWith("## ")) {
      flushEntry();

      const parsed = parseVersion(line);
      if (parsed && parsed.date) {
        // Skip unreleased
        currentEntry = {
          version: parsed.version,
          date: parsed.date,
          package: pkg,
          packageDisplayName: PACKAGE_CONFIG[pkg].displayName,
          changes: [],
        };
      }
      continue;
    }

    // Check for change type header (### Added, ### Changed, etc.)
    if (line.startsWith("### ") && currentEntry) {
      flushChangeGroup();
      currentChangeType = parseChangeType(line);
      continue;
    }

    // Check for list item
    if (line.startsWith("- ") && currentEntry && currentChangeType) {
      // Clean up the item - remove leading "- " and any bold markers for inline headers
      let item = line.slice(2).trim();
      // Convert **text:** to just the description if it's a header pattern
      item = item.replace(/^\*\*([^*]+):\*\*\s*/, "$1: ");
      currentItems.push(item);
      continue;
    }

    // Check for continued list item (indented)
    if (
      line.startsWith("  ") &&
      currentEntry &&
      currentChangeType &&
      currentItems.length > 0
    ) {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ")) {
        // Sub-item, append to last item
        currentItems[currentItems.length - 1] += ` ${trimmed.slice(2)}`;
      }
    }
  }

  flushEntry();
  return entries;
}

export async function getChangelog(): Promise<ChangelogEntry[]> {
  const allEntries: ChangelogEntry[] = [];

  // Get the monorepo root (go up from app/www)
  const monorepoRoot = path.resolve(process.cwd(), "../..");

  for (const [pkg, config] of Object.entries(PACKAGE_CONFIG)) {
    try {
      const filePath = path.join(monorepoRoot, config.path);
      const content = await fs.readFile(filePath, "utf-8");
      const entries = parseChangelogContent(content, pkg as PackageType);
      allEntries.push(...entries);
    } catch (error) {
      console.warn(`Failed to read changelog for ${pkg}:`, error);
    }
  }

  // Sort by date descending, then by package name for same-day releases
  allEntries.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return a.packageDisplayName.localeCompare(b.packageDisplayName);
  });

  return allEntries;
}

export function groupChangelogByDate(
  entries: ChangelogEntry[],
): GroupedChangelog[] {
  const grouped = new Map<string, ChangelogEntry[]>();

  for (const entry of entries) {
    if (!entry.date) continue;
    const existing = grouped.get(entry.date) || [];
    existing.push(entry);
    grouped.set(entry.date, existing);
  }

  return Array.from(grouped.entries())
    .map(([date, entries]) => ({
      date,
      displayDate: formatDate(date),
      entries,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
