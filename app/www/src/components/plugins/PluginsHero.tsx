"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

const container = {
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
  onSearchChange: (value: string) => void;
}) {
  return (
    <section className="relative pt-32 pb-16 px-6">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,51,51,0.15),transparent)]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-4xl mx-auto text-center"
      >
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/3 text-xs font-medium text-white/50 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Ecosystem
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-white mb-6"
        >
          Extend{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-red-400 to-orange-400">
            Redenv
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-white/35 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Plugins that integrate with your workflow, from CI/CD pipelines to
          visual dashboards and secret rotation.
        </motion.p>

        {/* Search */}
        <motion.div variants={item} className="relative max-w-xl mx-auto">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
            />
            <input
              type="search"
              aria-label="Search plugins"
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/3 backdrop-blur-xl border border-white/8 rounded-full pl-12 pr-6 py-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20 focus:bg-white/5 transition-all"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
