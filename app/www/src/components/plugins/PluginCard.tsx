"use client";

import { MotionValue } from "framer-motion";
import { SpotlightCard } from "@/components/home/feature-grid/SpotlightCard";
import { CopyButton } from "@/components/CopyButton";
import { PluginBadge } from "./PluginBadge";
import { categoryLabels, type Plugin } from "@/data/plugins";

export function PluginCard({
  plugin,
  mouseX,
  mouseY,
  spotlightOpacity,
  index,
  isInView,
}: {
  plugin: Plugin;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  spotlightOpacity: MotionValue<number>;
  index: number;
  isInView: boolean;
}) {
  return (
    <SpotlightCard
      spotlightColor="rgba(255, 255, 255, 0.08)"
      mouseX={mouseX}
      mouseY={mouseY}
      spotlightOpacity={spotlightOpacity}
      index={index}
      enable3dRotation={false}
      isInView={isInView}
      className="min-h-70"
    >
      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white truncate">
                {plugin.name}
              </h3>
              <p className="text-[11px] text-white/25 font-mono">
                v{plugin.version}
              </p>
            </div>
          </div>
          <PluginBadge type={plugin.official ? "official" : "community"} />
        </div>

        {/* Description */}
        <p className="text-sm text-white/35 leading-relaxed mb-5 flex-1 line-clamp-3">
          {plugin.description}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-white/40 uppercase tracking-wider font-medium">
              {categoryLabels[plugin.category]}
            </span>
            {plugin.status !== "stable" && (
              <PluginBadge type={plugin.status} />
            )}
          </div>
        </div>

        {/* Install command */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <code className="text-[11px] font-mono text-white/30 truncate">
              <span className="text-white/15 select-none">$ </span>
              {plugin.installCommand}
            </code>
            <CopyButton text={plugin.installCommand} />
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
