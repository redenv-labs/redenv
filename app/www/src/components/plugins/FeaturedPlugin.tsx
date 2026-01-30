"use client";

import { MotionValue } from "framer-motion";
import { SpotlightCard } from "@/components/home/feature-grid/SpotlightCard";
import { CopyButton } from "@/components/CopyButton";
import { PluginBadge } from "./PluginBadge";
import type { Plugin } from "@/types/plugins";
import { ExternalLink } from "lucide-react";
import { Link } from "@/components/Link";

export function FeaturedPlugin({
  plugin,
  mouseX,
  mouseY,
  spotlightOpacity,
  isInView,
}: {
  plugin: Plugin;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  spotlightOpacity: MotionValue<number>;
  isInView: boolean;
}) {
  return (
    <div className="relative mb-16">
      {/* glow */}
      <div className="absolute -inset-20 bg-primary/6 rounded-full blur-[140px] pointer-events-none" />

      <SpotlightCard
        spotlightColor="rgba(255, 51, 51, 0.12)"
        mouseX={mouseX}
        mouseY={mouseY}
        spotlightOpacity={spotlightOpacity}
        index={0}
        isInView={isInView}
      >
        <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          {/* Left content */}
          <div className="flex-1 min-w-0">
            {/* Featured badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/3 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">
                Featured Plugin
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              {plugin.name}
            </h2>

            <p className="text-base text-white/40 leading-relaxed mb-6 max-w-lg">
              {plugin.longDescription || plugin.description}
            </p>

            <div className="flex items-center gap-3 mb-6">
              <PluginBadge type="official" />
              <PluginBadge type={plugin.status} />
              <span className="text-xs text-white/25 font-mono">
                v{plugin.version}
              </span>
            </div>

            {/* Install command */}
            <div className="inline-flex items-center bg-neutral-900/80 backdrop-blur-sm rounded-full border border-white/10 pl-5 pr-2 h-11 gap-3">
              <code className="font-mono text-sm text-white/50">
                <span className="select-none text-white/20">$ </span>
                {plugin.installCommand}
              </code>
              <CopyButton text={plugin.installCommand} />
            </div>

            {/* Links */}
            {(plugin.docsUrl || plugin.githubUrl) && (
              <div className="flex items-center gap-4 mt-6">
                {plugin.docsUrl && (
                  <Link
                    href={plugin.docsUrl}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1.5"
                  >
                    Documentation
                    <ExternalLink size={10} />
                  </Link>
                )}
                {plugin.githubUrl && (
                  <Link
                    href={plugin.githubUrl}
                    target="_blank"
                    className="text-xs text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1.5"
                  >
                    GitHub
                    <ExternalLink size={10} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
