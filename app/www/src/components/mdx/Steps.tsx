"use client";

import { ReactNode, Children, isValidElement, cloneElement } from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  children: ReactNode;
}

export function Steps({ children }: StepsProps) {
  const items = Children.toArray(children);
  return (
    <div className="my-8">
      {items.map((child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as any, {
            step: index + 1,
            isLast: index === items.length - 1,
          });
        }
        return child;
      })}
    </div>
  );
}

interface StepProps {
  children: ReactNode;
  title: string;
  step?: number;
  isLast?: boolean;
}

export function Step({ children, title, step, isLast }: StepProps) {
  return (
    <div className={cn("relative pl-12", !isLast && "pb-6")}>
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-0 w-px bg-primary/20" />
      )}
      {/* Step number */}
      <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shadow-lg shadow-primary/20 ring-4 ring-background select-none">
        {step}
      </div>
      {/* Content */}
      <div className="pt-1">
        <h4 className="font-semibold text-foreground text-lg">{title}</h4>
        <div className="text-muted-foreground [&>p]:mb-3 [&>p:last-child]:mb-0 [&>pre]:my-4">
          {children}
        </div>
      </div>
    </div>
  );
}
