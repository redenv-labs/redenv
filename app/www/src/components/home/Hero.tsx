"use client";

import { Button, Link } from "@heroui/react";
import { ArrowRight, Copy, Check, Shield, Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { TerminalDemo } from "@/components/home/components/TerminalDemo";
import { useState } from "react";
import { GridBeams } from "@/components/GridBeams";

const HeroSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("bun add -g @redenv/cli");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stagger animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center md:px-6 py-32 overflow-hidden">
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,51,51,0.15),transparent)]" />
        <GridBeams gridSize={100} beamCount={100} />
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto text-center"
      >
        {/* Floating Badge */}
        <motion.div variants={item} className="mb-10">
          <Link
            href="/docs"
            className="group inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/3 hover:bg-white/6 hover:border-white/20 transition-all duration-300 text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-white/60 group-hover:text-white/80 transition-colors">
              Zero-knowledge encryption
            </span>
            <ArrowRight
              size={14}
              className="text-white/30 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={item} className="mb-8">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-0.02em] text-white leading-[1.05]">
            Stop rebuilding
          </span>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-0.02em] leading-[1.05] text-transparent bg-clip-text bg-linear-to-r from-white via-white/90 to-white/50">
            to rotate secrets.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Dynamic, zero-knowledge secret management for the serverless era.
          Rotate API keys in seconds, not deployments. Powered by Upstash Redis.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Button
            as={Link}
            href="/docs"
            size="lg"
            className="font-semibold px-8 h-13 bg-white text-neutral-950 hover:bg-white/90 rounded-full text-base shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-all duration-300 group"
            endContent={
              <ArrowRight
                size={18}
                className="group-hover:translate-x-0.5 transition-all duration-300"
              />
            }
          >
            Get Started
          </Button>

          <div className="group relative flex items-center">
            <div className="absolute -inset-0.5 bg-linear-to-r from-primary/40 to-warning/40 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative flex items-center bg-neutral-900/80 backdrop-blur rounded-full border border-white/10 pl-5 pr-1 h-13 gap-3 justify-between w-full">
              <code className="font-mono text-sm text-white/50">
                <span className="select-none text-white/30">$ </span>
                bun add -g @redenv/cli
              </code>
              <Button
                isIconOnly
                onPress={handleCopy}
                className="p-2 bg-transparent hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                aria-label="Copy command"
              >
                {copied ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <Copy size={14} />
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/40"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/3 border border-white/5">
            <Shield size={12} className="text-success/70" />
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/3 border border-white/5">
            <Zap size={12} className="text-warning/70" />
            <span>Works with any framework</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/3 border border-white/5">
            <Lock size={12} className="text-primary/70" />
            <span>Zero-knowledge</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Terminal Showcase */}
      <motion.div
        className="w-full max-w-5xl mx-auto mt-20 px-4"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className="relative group">
          {/* Ambient glow */}
          <div className="absolute -inset-24 bg-primary/15 blur-[120px] opacity-40 pointer-events-none rounded-full" />

          <TerminalDemo />

          {/* Reflection */}
          <div className="absolute top-[102%] left-[10%] right-[10%] h-32 bg-linear-to-b from-primary/10 to-transparent blur-2xl opacity-40" />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-white/40"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
