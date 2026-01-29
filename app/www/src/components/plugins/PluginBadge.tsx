"use client";

import { cn } from "@heroui/react";

type BadgeType = "official" | "community" | "stable" | "beta" | "new";

const badgeStyles: Record<BadgeType, string> = {
  official: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  community: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  stable: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  beta: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  new: "bg-primary/10 border-primary/20 text-primary",
};

export function PluginBadge({ type }: { type: BadgeType }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider",
        badgeStyles[type],
      )}
    >
      {type === "new" && (
        <span className="absolute -top-0.5 -right-0.5">
          <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
        </span>
      )}
      {type}
    </span>
  );
}
