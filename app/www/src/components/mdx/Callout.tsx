"use client";

import { ReactNode } from "react";
import {
  Info,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning" | "error" | "tip" | "success" | "note";

interface CalloutProps {
  children: ReactNode;
  title?: string;
  variant?: CalloutVariant;
}

const calloutConfig: Record<
  CalloutVariant,
  {
    icon: typeof Info;
    bg: string;
    border: string;
    iconColor: string;
    titleColor: string;
    defaultTitle: string;
  }
> = {
  info: {
    icon: Info,
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    titleColor: "text-blue-400",
    defaultTitle: "Info",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
    titleColor: "text-amber-400",
    defaultTitle: "Warning",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-500/5",
    border: "border-red-500/20",
    iconColor: "text-red-400",
    titleColor: "text-red-400",
    defaultTitle: "Error",
  },
  tip: {
    icon: Lightbulb,
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
    iconColor: "text-purple-400",
    titleColor: "text-purple-400",
    defaultTitle: "Tip",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    titleColor: "text-emerald-400",
    defaultTitle: "Success",
  },
  note: {
    icon: Zap,
    bg: "bg-primary/5",
    border: "border-primary/20",
    iconColor: "text-primary",
    titleColor: "text-primary",
    defaultTitle: "Note",
  },
};

export function Callout({ children, title, variant = "info" }: CalloutProps) {
  const config = calloutConfig[variant];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={cn(
        "my-6 flex gap-4 rounded-xl border p-4",
        config.bg,
        config.border
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={cn(
            "p-1.5 rounded-lg",
            config.bg.replace("/5", "/10")
          )}
        >
          <Icon size={18} className={config.iconColor} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-semibold text-sm mb-1.5", config.titleColor)}>
          {displayTitle}
        </p>
        <div className="text-sm text-muted-foreground leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ol]:my-2">
          {children}
        </div>
      </div>
    </div>
  );
}
