"use client";

import { cn } from "@/lib/utils";
import type { ChangeType } from "@/lib/changelog";
import { Plus, RefreshCw, Wrench, Trash2 } from "lucide-react";

const CHANGE_TYPE_STYLES: Record<
  ChangeType,
  { bg: string; text: string; border: string; icon: React.ElementType; label: string }
> = {
  added: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-300",
    border: "border border-emerald-400/30",
    icon: Plus,
    label: "Added",
  },
  changed: {
    bg: "bg-amber-500/20",
    text: "text-amber-300",
    border: "border border-amber-400/30",
    icon: RefreshCw,
    label: "Changed",
  },
  fixed: {
    bg: "bg-sky-500/20",
    text: "text-sky-300",
    border: "border border-sky-400/30",
    icon: Wrench,
    label: "Fixed",
  },
  removed: {
    bg: "bg-red-500/20",
    text: "text-red-300",
    border: "border border-red-400/30",
    icon: Trash2,
    label: "Removed",
  },
};

interface ChangeTypeBadgeProps {
  type: ChangeType;
  className?: string;
}

export function ChangeTypeBadge({ type, className }: ChangeTypeBadgeProps) {
  const styles = CHANGE_TYPE_STYLES[type];
  const Icon = styles.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
        styles.bg,
        styles.text,
        styles.border,
        className,
      )}
    >
      <Icon className="w-3 h-3" />
      <span>{styles.label}</span>
    </div>
  );
}
