"use client";

import { motion } from "framer-motion";
import {
  categoryLabels,
  type Plugin,
  type PluginCategory,
} from "@/data/plugins";

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
  plugins,
}: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  plugins: Plugin[];
}) {
  const categories = Object.keys(categoryLabels) as PluginCategory[];

  const counts: Record<string, number> = { all: plugins.length };
  for (const p of plugins) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  }

  const allCategories = [
    ...categories
      .filter((c) => counts[c])
      .map((c) => ({ key: c, label: categoryLabels[c] })),
  ] as { key: string; label: string }[];

  if (counts.all > 0) {
    allCategories.unshift({ key: "all", label: "All" });
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-1 mb-10">
      {allCategories?.filter(Boolean)?.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onCategoryChange(key)}
          className="relative px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {activeCategory === key && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 bg-white/10 border border-primary/40 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 ${
              activeCategory === key
                ? "text-white font-medium"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {label}
            <span className="ml-1.5 text-[10px] font-mono opacity-50">
              {counts[key] || 0}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
