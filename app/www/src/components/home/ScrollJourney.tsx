"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Lock, Globe, Server, Zap, Terminal, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@heroui/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- Journey Steps ---
const journeySteps = [
  {
    id: "write",
    title: "Write your secret",
    description: "Add secrets via CLI. Simple, fast, secure.",
    icon: Terminal,
    color: "emerald",
  },
  {
    id: "encrypt",
    title: "Client-side encryption",
    description: "AES-256-GCM on YOUR device. We never see plaintext.",
    icon: Lock,
    color: "primary",
  },
  {
    id: "store",
    title: "Secure storage",
    description: "Encrypted data stored in Upstash Redis.",
    icon: Server,
    color: "blue",
  },
  {
    id: "distribute",
    title: "Global edge",
    description: "Replicated worldwide. Millisecond access.",
    icon: Globe,
    color: "purple",
  },
  {
    id: "use",
    title: "Use anywhere",
    description: "Fetch & decrypt at runtime. No rebuilds.",
    icon: Zap,
    color: "amber",
  },
];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  primary: {
    bg: "bg-primary/20",
    border: "border-primary/30",
    text: "text-primary",
    glow: "rgba(255, 51, 51, 0.4)",
  },
  blue: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  purple: {
    bg: "bg-purple-500/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  amber: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "rgba(245, 158, 11, 0.4)",
  },
};

// The actual secret that gets typed, encrypted, stored, and used
const SECRET_VALUE = "sk-proj-x7Kj9mN2pQ4r";
const ENCRYPTED_VALUE = "aGVsbG8gd29ybGQ=...";

// --- Step 1: Terminal Visual ---
function TerminalVisual({ progress }: { progress: number }) {
  const stepProgress = Math.min(1, progress * 5); // 0-20% of total
  // Typing completes faster (at 40% of step progress instead of 100%)
  const typingProgress = Math.min(1, stepProgress * 2.5);
  const typedChars = Math.floor(typingProgress * (SECRET_VALUE.length + 15));
  const command = `redenv add API_KEY ${SECRET_VALUE}`;
  const displayedText = command.slice(0, typedChars);
  const showCursor = typingProgress < 1;
  // Show success AFTER typing completes
  const showSuccess = typingProgress >= 1;

  return (
    <div className="w-full max-w-md">
      {/* Terminal window */}
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-emerald-500/10">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-white/30 ml-2">terminal</span>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm">
          <div className="flex items-start">
            <span className="text-emerald-400 select-none">$ </span>
            <span className="text-white/80">{displayedText}</span>
            {showCursor && (
              <span className="w-2 h-5 bg-emerald-400 ml-0.5 animate-pulse" />
            )}
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-3 flex items-center gap-2 text-emerald-400"
              >
                <Check size={14} />
                <span>Secret added successfully</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Step 2: Encryption Visual ---
function EncryptionVisual({ progress }: { progress: number }) {
  const stepProgress = Math.max(0, Math.min(1, (progress - 0.2) * 5)); // 20-40%
  const [scrambled, setScrambled] = useState(SECRET_VALUE);

  useEffect(() => {
    if (stepProgress <= 0 || stepProgress >= 1) {
      setScrambled(stepProgress >= 1 ? ENCRYPTED_VALUE : SECRET_VALUE);
      return;
    }

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // Slower scrambling - use eased progress
    const easedProgress = stepProgress * stepProgress; // Quadratic easing
    const scrambleCount = Math.floor(easedProgress * SECRET_VALUE.length);

    let result = "";
    for (let i = 0; i < SECRET_VALUE.length; i++) {
      if (i < scrambleCount) {
        result += chars[Math.floor(Math.random() * chars.length)];
      } else {
        result += SECRET_VALUE[i];
      }
    }
    setScrambled(result + (stepProgress > 0.8 ? "..." : ""));
  }, [stepProgress]);

  // Slower animations
  const lockScale = 0.9 + stepProgress * 0.2; // Subtler scale (0.9 to 1.1)
  const lockRotation = stepProgress * 180; // Half rotation instead of full

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6">
      {/* Lock animation */}
      <div
        className="relative w-24 h-24 flex items-center justify-center"
        style={{ transform: `scale(${lockScale})` }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 bg-primary/30 rounded-full blur-2xl"
          style={{ opacity: stepProgress }}
        />

        {/* Lock icon */}
        <div
          className="relative w-16 h-16 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center"
          style={{ transform: `rotate(${lockRotation}deg)` }}
        >
          <Lock className="w-8 h-8 text-primary" />
        </div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => {
          // Slower orbit - reduced from 4π to 2π
          const angle = (i / 6) * Math.PI * 2 + stepProgress * Math.PI * 2;
          const x = Math.cos(angle) * 40;
          const y = Math.sin(angle) * 40;
          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                opacity: stepProgress * 0.8,
                boxShadow: "0 0 10px rgba(255, 51, 51, 0.6)",
              }}
            />
          );
        })}
      </div>

      {/* Text transformation */}
      <div className="bg-[#0a0a0a] rounded-lg border border-white/10 px-6 py-4 font-mono text-sm">
        <div className="flex items-center gap-3">
          <span className="text-white/30">value:</span>
          <span
            className={cn(
              "transition-colors duration-300",
              stepProgress > 0.5 ? "text-primary" : "text-white/60",
            )}
          >
            {scrambled}
          </span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span>AES-256-GCM</span>
        <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${stepProgress * 100}%` }}
          />
        </div>
        <span>{Math.floor(stepProgress * 100)}%</span>
      </div>
    </div>
  );
}

// --- Step 3: Storage Visual ---
function StorageVisual({ progress }: { progress: number }) {
  const stepProgress = Math.max(0, Math.min(1, (progress - 0.4) * 5)); // 40-60%
  const packetY = -100 + stepProgress * 100;
  const serverGlow = stepProgress > 0.7 ? (stepProgress - 0.7) * 3.33 : 0;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      {/* Flying data packet */}
      <div
        className="relative h-24 w-full flex justify-center"
        style={{
          opacity: stepProgress < 0.9 ? 1 : 1 - (stepProgress - 0.9) * 10,
        }}
      >
        <div
          className="absolute flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg"
          style={{
            transform: `translateY(${packetY}px)`,
            boxShadow: "0 0 20px rgba(255, 51, 51, 0.3)",
          }}
        >
          <Lock size={14} className="text-primary" />
          <span className="font-mono text-xs text-white/60">
            {ENCRYPTED_VALUE}
          </span>
        </div>
      </div>

      {/* Server */}
      <div className="relative">
        {/* Server glow */}
        <div
          className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-2xl"
          style={{ opacity: serverGlow }}
        />

        <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/10 p-6 flex flex-col items-center gap-4">
          {/* Server icon */}
          <div className="w-16 h-16 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Server className="w-8 h-8 text-blue-400" />
          </div>

          {/* Server status */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                stepProgress > 0.7 ? "bg-emerald-400" : "bg-white/20",
              )}
            />
            <span className="text-xs text-white/40">
              {stepProgress > 0.7 ? "Stored securely" : "Receiving..."}
            </span>
          </div>

          {/* Upstash badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="text-xs font-medium text-emerald-400">
              Upstash Redis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Step 4: Global Distribution Visual ---
function GlobalVisual({ progress }: { progress: number }) {
  const stepProgress = Math.max(0, Math.min(1, (progress - 0.6) * 5)); // 60-80%

  // Node positions around the globe
  const nodes = [
    { x: 50, y: 20, label: "US-East", delay: 0 },
    { x: 85, y: 35, label: "EU-West", delay: 0.1 },
    { x: 75, y: 65, label: "Asia", delay: 0.2 },
    { x: 25, y: 50, label: "US-West", delay: 0.15 },
    { x: 60, y: 80, label: "Australia", delay: 0.25 },
  ];

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Globe visualization */}
      <div className="relative w-64 h-64">
        {/* Globe background */}
        <div className="absolute inset-0 rounded-full border border-purple-500/20 bg-purple-500/5" />

        {/* Latitude lines */}
        {[25, 50, 75].map((top) => (
          <div
            key={top}
            className="absolute left-4 right-4 border-t border-dashed border-purple-500/10"
            style={{ top: `${top}%` }}
          />
        ))}

        {/* Longitude lines */}
        {[25, 50, 75].map((left) => (
          <div
            key={left}
            className="absolute top-4 bottom-4 border-l border-dashed border-purple-500/10"
            style={{ left: `${left}%` }}
          />
        ))}

        {/* Connection lines between nodes */}
        <svg className="absolute inset-0 w-full h-full">
          {nodes.map((node, i) => {
            const nextNode = nodes[(i + 1) % nodes.length];
            const lineProgress = Math.max(0, (stepProgress - node.delay) * 2);
            return (
              <line
                key={i}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke="rgba(168, 85, 247, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
                style={{ opacity: Math.min(1, lineProgress) }}
              />
            );
          })}
        </svg>

        {/* Edge nodes */}
        {nodes.map((node, i) => {
          const nodeProgress = Math.max(0, (stepProgress - node.delay) * 2);
          const scale = 0.5 + Math.min(1, nodeProgress) * 0.5;
          const opacity = Math.min(1, nodeProgress);

          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
              }}
            >
              {/* Pulse effect */}
              <div
                className="absolute w-8 h-8 rounded-full bg-purple-500/30 animate-ping"
                style={{ animationDelay: `${node.delay}s` }}
              />
              {/* Node dot */}
              <div className="relative w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50" />
              {/* Label */}
              <span className="absolute top-5 text-[10px] text-purple-300/60 whitespace-nowrap">
                {node.label}
              </span>
            </div>
          );
        })}

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <Globe className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Latency indicator */}
      <div className="mt-6 flex items-center gap-4 text-xs text-white/40">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-amber-400" />
          <span>&lt;50ms global latency</span>
        </div>
      </div>
    </div>
  );
}

// --- Step 5: Usage Visual ---
function UsageVisual({ progress }: { progress: number }) {
  const stepProgress = Math.max(0, Math.min(1, (progress - 0.8) * 5)); // 80-100%
  const codeLines = [
    { text: "const secrets = await redenv.load();", delay: 0 },
    { text: "", delay: 0.2 },
    { text: 'const apiKey = secrets.get("API_KEY");', delay: 0.4 },
    { text: `// → "${SECRET_VALUE}"`, delay: 0.6, isComment: true },
  ];

  return (
    <div className="w-full max-w-md">
      {/* Code editor */}
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-amber-500/10">
        {/* Editor header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-white/30 ml-2">api/route.ts</span>
        </div>

        {/* Code content */}
        <div className="p-4 font-mono text-sm space-y-1">
          {codeLines.map((line, i) => {
            const lineProgress = Math.max(0, (stepProgress - line.delay) * 2.5);
            const opacity = Math.min(1, lineProgress);
            const translateX = (1 - Math.min(1, lineProgress)) * 20;

            if (!line.text) return <div key={i} className="h-4" />;

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `translateX(${translateX}px)`,
                  transition: "all 0.3s ease-out",
                }}
                className={
                  line.isComment ? "text-amber-400/60" : "text-white/70"
                }
              >
                {line.text}
              </div>
            );
          })}
        </div>

        {/* Success indicator */}
        {stepProgress > 0.9 && (
          <div className="px-4 py-3 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center gap-2">
            <Check size={14} className="text-emerald-400" />
            <span className="text-xs text-emerald-400">
              Decrypted at runtime
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Visual Renderer ---
function JourneyVisual({ progress }: { progress: number }) {
  // Show step-specific visuals based on scroll progress

  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center min-h-[320px]">
      {/* Step 1: Terminal */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress < 0.2 ? 1 : 0,
          pointerEvents: progress < 0.2 ? "auto" : "none",
        }}
      >
        <TerminalVisual progress={progress} />
      </div>

      {/* Step 2: Encryption */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress >= 0.2 && progress < 0.4 ? 1 : 0,
          pointerEvents: progress >= 0.2 && progress < 0.4 ? "auto" : "none",
        }}
      >
        <EncryptionVisual progress={progress} />
      </div>

      {/* Step 3: Storage */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress >= 0.4 && progress < 0.6 ? 1 : 0,
          pointerEvents: progress >= 0.4 && progress < 0.6 ? "auto" : "none",
        }}
      >
        <StorageVisual progress={progress} />
      </div>

      {/* Step 4: Global */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress >= 0.6 && progress < 0.8 ? 1 : 0,
          pointerEvents: progress >= 0.6 && progress < 0.8 ? "auto" : "none",
        }}
      >
        <GlobalVisual progress={progress} />
      </div>

      {/* Step 5: Usage */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{
          opacity: progress >= 0.8 ? 1 : 0,
          pointerEvents: progress >= 0.8 ? "auto" : "none",
        }}
      >
        <UsageVisual progress={progress} />
      </div>
    </div>
  );
}

// --- Step Indicator (Enhanced Horizontal) ---
function StepIndicator({
  progress,
  steps,
}: {
  progress: number;
  steps: typeof journeySteps;
}) {
  return (
    <div className="relative flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const stepStart = index / steps.length;
        const stepEnd = (index + 1) / steps.length;
        const isActive = progress >= stepStart && progress < stepEnd;
        const isComplete = progress >= stepEnd;
        const colors = colorClasses[step.color as keyof typeof colorClasses];
        const Icon = step.icon;

        return (
          <div
            key={step.id}
            className="relative flex flex-col items-center gap-2 z-10"
          >
            {/* Step circle */}
            <div
              className={cn(
                "relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500",
                isActive
                  ? `${colors.bg} ${colors.border} border-2 scale-110`
                  : isComplete
                    ? "bg-white/10 border border-white/20"
                    : "bg-neutral-900 border border-white/10",
              )}
              style={{
                boxShadow: isActive ? `0 0 20px ${colors.glow}` : "none",
              }}
            >
              {isComplete ? (
                <Check size={18} className="text-emerald-400" />
              ) : (
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? colors.text : "text-white/30",
                  )}
                />
              )}

              {/* Pulse ring for active step */}
              {isActive && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-30",
                    colors.bg,
                  )}
                  style={{ animationDuration: "2s" }}
                />
              )}
            </div>

            {/* Step label */}
            <span
              className={cn(
                "hidden sm:block text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 max-w-20 text-center",
                isActive
                  ? "text-white"
                  : isComplete
                    ? "text-white/50"
                    : "text-white/30",
              )}
            >
              {step.title.split(" ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// --- Step Content (Simplified) ---
function StepContent({
  progress,
  steps,
}: {
  progress: number;
  steps: typeof journeySteps;
}) {
  const currentIndex = Math.min(
    Math.floor(progress * steps.length),
    steps.length - 1,
  );
  const currentStep = steps[currentIndex];
  const colors = colorClasses[currentStep.color as keyof typeof colorClasses];

  return (
    <div className="text-center">
      <h3
        className={cn(
          "text-xl md:text-2xl font-semibold mb-2 transition-colors duration-500",
          colors.text,
        )}
      >
        {currentStep.title}
      </h3>
      <p className="text-sm md:text-base text-white/50 max-w-sm mx-auto">
        {currentStep.description}
      </p>
    </div>
  );
}

// --- Main Component ---
export function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      if (!containerRef.current || !stickyRef.current) return;

      // Create the ScrollTrigger with pinning
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom", // 3 viewport heights of scrolling = slower animation
        pin: true,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef },
  );

  const headerOpacity = Math.max(0, 1 - progress * 6.67);
  const headerY = -progress * 333;
  const scrollHintOpacity = Math.max(0, 1 - progress * 10);

  return (
    <section ref={containerRef} className="relative h-[500vh]">
      {/* Sticky container - will be pinned by GSAP */}
      <div ref={stickyRef} className="h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-neutral-950" />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,51,51,0.08),transparent)]"
          style={{ opacity: 0.5 + Math.sin(progress * Math.PI) * 0.5 }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-6xl mx-auto">
            {/* Section Header - Fades out as you scroll */}
            <div
              className="text-center mb-8 lg:mb-12"
              style={{
                opacity: headerOpacity,
                transform: `translateY(${headerY}px)`,
              }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/3 mb-6">
                <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                  The Journey
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                From secret to secure
              </h2>
              <p className="text-base md:text-lg text-white/40 max-w-xl mx-auto">
                See how Redenv protects your secrets at every step.
              </p>
            </div>

            {/* Main content area - Simplified to focus on the journey visuals */}
            <div className="flex flex-col items-center justify-center gap-8">
              {/* Center: Dynamic Journey Visual */}
              <JourneyVisual progress={progress} />

              {/* Step title and description below visual */}
              <StepContent progress={progress} steps={journeySteps} />

              {/* Step indicators */}
              <StepIndicator progress={progress} steps={journeySteps} />
            </div>

            {/* Scroll hint */}
            <p
              className="text-xs text-white/30 mt-6"
              style={{ opacity: scrollHintOpacity }}
            >
              Scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
