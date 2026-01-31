"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function PluginsHero({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="relative pt-32 pb-16 px-6">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,51,51,0.15),transparent)]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative max-w-4xl mx-auto text-center"
      >
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-muted-foreground/10 bg-white/3 text-xs font-medium text-muted-foreground/70 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Ecosystem
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-foreground mb-6"
        >
          Extend{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-red-400 to-orange-400">
            Redenv
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Plugins that integrate with your workflow, from CI/CD pipelines to
          visual dashboards and secret rotation.
        </motion.p>

        {/* Inline search input */}
        <motion.div
          variants={item}
          className="relative max-w-xl mx-auto"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
        >
          <div className="group relative flex items-center gap-3 w-full rounded-2xl px-4 py-4 text-sm overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl p-px overflow-hidden">
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  isFocused && "opacity-100",
                )}
                style={{
                  background: `conic-gradient(from 180deg at 50% 50%,
                    transparent 0deg,
                    color-mix(in srgb, var(--primary) 30%, transparent) 60deg,
                    color-mix(in srgb, var(--primary) 50%, transparent) 120deg,
                    transparent 180deg,
                    transparent 360deg
                  )`,
                  animation: "spin 4s linear infinite",
                }}
              />
              <div className="absolute inset-px rounded-2xl bg-secondary/95 backdrop-blur-xl" />
            </div>

            {/* Radial gradient */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: isHovered
                  ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, color-mix(in srgb, var(--primary) 20%, transparent), transparent 40%)`
                  : "none",
              }}
            />

            {/* Glass surface */}
            <div className="absolute inset-px rounded-2xl bg-linear-to-b from-muted-foreground/10 to-transparent pointer-events-none" />

            {/* Static border */}
            <div className="absolute inset-0 rounded-2xl border-border/50 transition-colors duration-300 pointer-events-none" />

            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                x: ["0%", "200%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <div
                className="absolute inset-y-0 w-1/3 -left-1/3"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                }}
              />
            </motion.div>

            {/* Content */}
            <div className="relative flex items-center gap-3 w-full z-10">
              <div className="relative">
                <Search
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors duration-300"
                />
              </div>

              <input
                ref={inputRef}
                type="text"
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search plugins..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none tracking-wide"
              />

              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/30 hover:text-white/50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
