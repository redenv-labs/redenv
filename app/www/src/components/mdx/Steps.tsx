"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  children: ReactNode;
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="my-8 relative">
      {/* Connecting line */}
      <div className="absolute left-[15px] top-6 bottom-6 w-px bg-gradient-to-b from-primary/50 via-border/50 to-border/20" />
      <div className="space-y-6">{children}</div>
    </div>
  );
}

interface StepProps {
  children: ReactNode;
  title: string;
  step?: number;
}

export function Step({ children, title, step }: StepProps) {
  return (
    <div className="relative pl-12">
      {/* Step number */}
      <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 ring-4 ring-background">
        {step}
      </div>
      {/* Content */}
      <div className="pt-0.5">
        <h4 className="font-semibold text-foreground text-lg mb-2">{title}</h4>
        <div className="text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>pre]:my-4">
          {children}
        </div>
      </div>
    </div>
  );
}
