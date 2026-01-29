"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  href?: string;
  title?: string;
  icon?: ReactNode;
  description?: string;
}

export function Card({ children, href, title, icon, description }: CardProps) {
  const isExternal = href?.startsWith("http");

  const content = (
    <div
      className={cn(
        "group relative h-full rounded-xl border border-border/50 bg-secondary/20 p-5 transition-all duration-300",
        href && "hover:border-primary/40 hover:bg-primary/5 cursor-pointer hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {/* Gradient overlay on hover */}
      {href && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      )}

      <div className="relative">
        {icon && (
          <div className="mb-4 inline-flex p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/15 transition-colors">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
            {title}
            {href && (
              isExternal ? (
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
              ) : (
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              )
            )}
          </h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
        )}
        <div className="text-sm text-muted-foreground [&>p]:mb-0">{children}</div>
      </div>
    </div>
  );

  if (href) {
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

interface CardsProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export function Cards({ children, cols = 2 }: CardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4 my-6 not-prose",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 sm:grid-cols-2",
        cols === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}
    >
      {children}
    </div>
  );
}
