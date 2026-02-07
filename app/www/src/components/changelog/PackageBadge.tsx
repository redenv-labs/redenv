"use client";

import { cn } from "@/lib/utils";
import type { PackageType } from "@/lib/changelog";
import { Terminal, Box, Code2, } from "lucide-react";
import { Python } from "@/components/icons/Python";

const PACKAGE_STYLES: Record<
  PackageType,
  { bg: string; text: string; border: string; glow: string; icon: React.ElementType }
> = {
  cli: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "border-emerald-400/30",
    glow: "shadow-emerald-500/20",
    icon: Terminal,
  },
  core: {
    bg: "bg-violet-500/15",
    text: "text-violet-300",
    border: "border-violet-400/30",
    glow: "shadow-violet-500/20",
    icon: Box,
  },
  client: {
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    border: "border-sky-400/30",
    glow: "shadow-sky-500/20",
    icon: Code2,
  },
  python: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-400/30",
    glow: "shadow-amber-500/20",
    icon: Python,
  },
};

interface PackageBadgeProps {
  package: PackageType;
  displayName: string;
  version: string;
  className?: string;
}

export function PackageBadge({
  package: pkg,
  displayName,
  version,
  className,
}: PackageBadgeProps) {
  const styles = PACKAGE_STYLES[pkg];
  const Icon = styles.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium shadow-lg",
        styles.bg,
        styles.text,
        styles.border,
        styles.glow,
        className,
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{displayName}</span>
      <span className="opacity-70 font-mono text-xs">v{version}</span>
    </div>
  );
}
