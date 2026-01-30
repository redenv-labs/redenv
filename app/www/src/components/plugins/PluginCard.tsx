"use client";

import { MotionValue } from "framer-motion";
import { SpotlightCard } from "@/components/home/feature-grid/SpotlightCard";
import { CopyButton } from "@/components/CopyButton";
import { PluginBadge } from "./PluginBadge";
import { type Plugin } from "@/types/plugins";
import { ExternalLink, GitFork, User } from "lucide-react";
import { Link } from "@heroui/react";

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
    >
      <div className="relative p-6 flex flex-col h-full">
        {/* badges row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PluginBadge type={plugin.official ? "official" : "community"} />
            {plugin.status !== "stable" && <PluginBadge type={plugin.status} />}
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-white/30 uppercase tracking-wider font-medium">
            {plugin.category}
          </span>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white leading-tight">
            {plugin.name}
          </h3>
          <span className="text-[11px] text-white/20 font-mono">
            v{plugin.version}
          </span>
        </div>

        {/* description */}
        <p className="text-sm text-white/35 leading-relaxed flex-1 line-clamp-3 mb-5">
          {plugin.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-white/25">
            <User size={12} />
            <span className="text-[11px] font-medium">{plugin.author}</span>
          </div>
          <div className="flex items-center gap-3">
            {plugin.docsUrl && (
              <Link
                href={plugin.docsUrl}
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                <ExternalLink size={13} />
              </Link>
            )}
            {plugin.githubUrl && (
              <Link
                href={plugin.githubUrl}
                target="_blank"
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                <GitFork size={13} />
              </Link>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between bg-white/2 rounded-lg px-3 py-2">
            <code className="text-xs font-mono text-white/35 truncate">
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
