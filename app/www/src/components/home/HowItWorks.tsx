"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Terminal, Lock, Rocket, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Link your Upstash Redis database with a single command. Your secrets stay yours.",
    icon: Terminal,
    command: "redenv setup",
    color: "emerald",
  },
  {
    number: "02",
    title: "Encrypt",
    description: "Add secrets with AES-256-GCM encryption. Zero-knowledge — we never see plaintext.",
    icon: Lock,
    command: "redenv add API_KEY sk-...",
    color: "primary",
  },
  {
    number: "03",
    title: "Ship",
    description: "Fetch secrets at runtime. No rebuilds, no redeployments. Just ship.",
    icon: Rocket,
    command: "await redenv.load()",
    color: "blue",
  },
];

const colorMap = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    line: "from-emerald-500",
  },
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
    glow: "shadow-primary/20",
    line: "from-primary",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
    line: "from-blue-500",
  },
};

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,51,51,0.06),transparent)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Three steps to secure secrets
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            From zero to production-ready in under 60 seconds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const colors = colorMap[step.color as keyof typeof colorMap];

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connector arrow (desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-24 z-10 w-6 h-6 items-center justify-center">
                      <ChevronRight className="text-white/20" size={20} />
                    </div>
                  )}

                  {/* Card */}
                  <div className="relative group">
                    {/* Glow on hover */}
                    <div className={`absolute -inset-px rounded-2xl ${colors.bg} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />

                    <div className="relative bg-neutral-950/60 border border-white/[0.08] rounded-2xl p-6 md:p-8 backdrop-blur-sm h-full">
                      {/* Step number */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <step.icon className={colors.text} size={22} />
                        </div>
                        <span className="text-5xl font-bold text-white/[0.03]">
                          {step.number}
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Command */}
                      <div className="bg-black/40 border border-white/5 rounded-lg px-4 py-3 font-mono text-sm">
                        <span className="text-white/30 select-none">$ </span>
                        <span className={colors.text}>{step.command}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
