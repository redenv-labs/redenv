"use client";

import { motion } from "framer-motion";
import { History, Sparkles } from "lucide-react";

interface ChangelogHeroProps {
  totalUpdates: number;
  latestDate: string;
}

export function ChangelogHero({ totalUpdates, latestDate }: ChangelogHeroProps) {
  return (
    <div className="relative pb-16 pt-12 md:pt-16 lg:pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-20 right-0 w-75 h-75 bg-violet-500/10 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium mb-6 shadow-lg shadow-primary/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>What&apos;s New</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4"
        >
          Changelog
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-8 leading-relaxed"
        >
          All the latest updates, improvements, and fixes across the Redenv ecosystem.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/8">
            <History className="w-4 h-4 text-primary/80" />
            <span className="text-white/60">
              <span className="text-white font-semibold">{totalUpdates}</span> releases
            </span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/8">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-white/60">
              Last updated <span className="text-white/80 font-medium">{latestDate}</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
