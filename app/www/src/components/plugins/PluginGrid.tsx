"use client";

import { useMemo, type MouseEvent } from "react";
import { motion, MotionValue } from "framer-motion";
import { PluginCard } from "./PluginCard";
import type { Plugin } from "@/data/plugins";
import { Search } from "lucide-react";

export function PluginGrid({
  plugins,
  searchQuery,
  activeCategory,
  mouseX,
  mouseY,
  spotlightOpacity,
  isInView,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: {
  plugins: Plugin[];
  searchQuery: string;
  activeCategory: string;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  spotlightOpacity: MotionValue<number>;
  isInView: boolean;
  onMouseMove: (e: MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const filtered = useMemo(() => {
    return plugins.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [plugins, searchQuery, activeCategory]);

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/8 flex items-center justify-center mb-5">
          <Search size={24} className="text-white/20" />
        </div>
        <p className="text-white/35 text-lg font-medium mb-2">
          No plugins found
        </p>
        <p className="text-white/20 text-sm">
          Try adjusting your search or filters
        </p>
      </motion.div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {filtered.map((plugin, index) => (
        <PluginCard
          key={plugin.id}
          plugin={plugin}
          mouseX={mouseX}
          mouseY={mouseY}
          spotlightOpacity={spotlightOpacity}
          index={index}
          isInView={isInView}
        />
      ))}
    </div>
  );
}
