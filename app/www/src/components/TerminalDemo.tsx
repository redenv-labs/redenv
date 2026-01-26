"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { clsx } from "clsx";

interface TerminalDemoProps {
  className?: string;
}

export function TerminalDemo({ className }: TerminalDemoProps) {
  return (
    <div className={clsx("relative group", className)}>
      {/* Glow Effect behind terminal */}
      <div className="absolute -inset-1 bg-linear-to-r from-primary/50 to-warning/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-muted/95 backdrop-blur-xl shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-b border-white/5">
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-white/10" />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/20">
            <Terminal size={12} />
            <span>redenv — bash</span>
          </div>
          <div className="w-14" />
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-[13px] leading-relaxed space-y-4">
          {/* Command 1: Setup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-command select-none">❯</span>
              <span className="text-white/90">redenv setup</span>
            </div>
            <div className="text-white/40 ml-5 mt-1">
              <span className="text-info">●</span> Connected to Upstash Redis
            </div>
          </motion.div>

          {/* Command 2: Register */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-command select-none">❯</span>
              <span className="text-white/90">redenv register my-app</span>
            </div>
            <div className="text-white/40 ml-5 mt-1 space-y-0.5">
              <div>
                <span className="text-warning">●</span> Creating encrypted
                vault...
              </div>
              <div>
                <span className="text-success">✓</span> Project{" "}
                <span className="text-white/70 font-medium">my-app</span>{" "}
                registered
              </div>
            </div>
          </motion.div>

          {/* Command 3: Add Secret */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-command select-none">❯</span>
              <span className="text-white/90">
                redenv add{" "}
                <span className="text-command-arg">DATABASE_URL</span>{" "}
                <span className="text-string">"postgres://..."</span>
              </span>
            </div>
            <div className="text-white/40 ml-5 mt-1 space-y-0.5">
              <div>
                <span className="text-info">●</span> Encrypting with AES-256-GCM
              </div>
              <div className="text-emerald-400">
                <span>✓</span> Secret{" "}
                <span className="text-white/70 font-medium">DATABASE_URL</span>{" "}
                added to <span className="text-primary/80">production</span>
              </div>
            </div>
          </motion.div>

          {/* Command 4: Current prompt with cursor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="text-command select-none">❯</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-white/70"
            />
          </motion.div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/2 border-t border-white/5 text-[10px] font-mono text-white/20">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              connected
            </span>
            <span>production</span>
          </div>
          <div className="flex items-center gap-3">
            <span>3 secrets</span>
            <span>AES-256-GCM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
