"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TableOfContents } from "fumadocs-core/toc";

interface DocsTOCProps {
  toc: TableOfContents;
}

export function DocsTOC({ toc }: DocsTOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const headingsRef = useRef<{ id: string; top: number }[]>([]);
  const rafRef = useRef<number>(0);

  const updateActiveHeading = useCallback(() => {
    const scrollY = window.scrollY;
    const offset = 120;
    const headings = headingsRef.current;

    if (headings.length === 0) return;

    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 10) {
      setActiveId(headings[headings.length - 1].id);
      return;
    }

    let activeHeading = headings[0].id;
    for (const heading of headings) {
      if (heading.top - offset <= scrollY) {
        activeHeading = heading.id;
      } else {
        break;
      }
    }
    setActiveId(activeHeading);
  }, []);

  useEffect(() => {
    // Collect heading positions
    const collectPositions = () => {
      headingsRef.current = toc
        .map((item: any) => {
          const el = document.getElementById(item.url.slice(1));
          if (!el) return null;
          return { id: item.url.slice(1), top: el.getBoundingClientRect().top + window.scrollY };
        })
        .filter(Boolean) as { id: string; top: number }[];
    };

    collectPositions();
    updateActiveHeading();

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateActiveHeading);
    };

    // Recalculate positions on resize
    const onResize = () => {
      collectPositions();
      updateActiveHeading();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [toc, updateActiveHeading]);

  if (toc.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-24">
        <div className="pb-4">
          <h4 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-4">
            On this page
          </h4>
        </div>

        <nav className="relative">
          {/* Active indicator line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border/30" />

          <ul className="space-y-1">
            {toc.map((item: any) => {
              const isActive = activeId === item.url.slice(1);
              const depth = item.depth - 2;

              return (
                <li key={item.url} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="toc-active-indicator"
                      className="absolute left-0 w-px h-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <a
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(item.url.slice(1));
                      if (element) {
                        const y = element.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: "smooth" });
                        setActiveId(item.url.slice(1));
                      }
                    }}
                    className={cn(
                      "block py-1.5 text-sm transition-all duration-200",
                      isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground/60 hover:text-muted-foreground",
                      depth === 0 && "pl-4",
                      depth === 1 && "pl-7",
                      depth >= 2 && "pl-10"
                    )}
                  >
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick actions */}
        <div className="mt-8 pt-4 border-t border-border/30">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <span>Back to top</span>
            <kbd className="px-1 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono text-[10px]">
              ↑
            </kbd>
          </a>
        </div>
      </div>
    </aside>
  );
}
