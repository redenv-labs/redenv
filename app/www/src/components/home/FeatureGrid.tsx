"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useInView,
  useSpring,
  useTransform,
  MotionValue,
  animate,
} from "framer-motion";
import {
  Shield,
  Globe,
  History,
  Code,
  Lock,
  Server,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@heroui/react";
import {
  MouseEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// --- Animated Counter Hook ---
function useAnimatedCounter(
  target: number,
  duration: number = 2000,
  isInView: boolean,
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, isInView]);

  return count;
}

// --- Shared Spotlight Card with 3D Tilt ---
function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.15)",
  mouseX,
  mouseY,
  spotlightOpacity,
  index = 0,
  isInView = false,
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  spotlightOpacity: MotionValue<number>;
  index?: number;
  isInView?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);

  // 3D tilt effect
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  useMotionValueEvent(mouseX, "change", (latestX: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = latestX - rect.left;
    const y = mouseY.get() - rect.top;
    localX.set(x);
    localY.set(y);

    // Calculate tilt (subtle)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    rotateY.set(((x - centerX) / centerX) * 3);
    rotateX.set(((centerY - y) / centerY) * 3);
  });

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={cn(
        "group relative border border-white/[0.08] bg-neutral-950/60 overflow-hidden rounded-[1.5rem] backdrop-blur-sm",
        className,
      )}
    >
      {/* Spotlight Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[1.5rem] transition duration-300 z-10"
        style={{
          opacity: spotlightOpacity,
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${localX}px ${localY}px,
              ${spotlightColor},
              transparent 70%
            )
          `,
        }}
      />

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Inner glow */}
      <div className="absolute inset-px rounded-[1.5rem] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative h-full z-20">{children}</div>
    </motion.div>
  );
}

// --- Visual: Decrypting Text Effect ---
const DecryptingText = ({ targetText }: { targetText: string }) => {
  const [displayText, setDisplayText] = useState(targetText);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef0123456789+/=";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const runAnimation = () => {
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplayText(() =>
          targetText
            .split("")
            .map((letter, index) => {
              if (index < iteration) return targetText[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );
        if (iteration >= targetText.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    };
    runAnimation();
    const loop = setInterval(runAnimation, 4000);
    return () => {
      clearInterval(interval);
      clearInterval(loop);
    };
  }, [targetText]);

  return <span className="font-mono text-emerald-400/80">{displayText}</span>;
};

// --- Enhanced Globe with Nodes and Connections ---
const EnhancedGlobe = () => {
  const nodes = useMemo(
    () => [
      { x: 50, y: 20, label: "US-East", delay: 0 },
      { x: 80, y: 35, label: "EU-West", delay: 0.5 },
      { x: 25, y: 45, label: "US-West", delay: 1 },
      { x: 70, y: 65, label: "Asia", delay: 1.5 },
      { x: 40, y: 75, label: "SA", delay: 2 },
    ],
    [],
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%)]" />

      {/* Globe wireframe */}
      <div className="relative w-44 h-44">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-blue-500/20"
        />

        {/* Middle ring - tilted */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-blue-500/15"
          style={{ transform: "rotateX(60deg)" }}
        />

        {/* Inner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-6 rounded-full border border-dashed border-blue-500/10"
        />

        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />

        {/* Center core */}
        <div className="absolute inset-[35%] rounded-full bg-blue-500/10 blur-xl" />

        {/* Data nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: node.delay, duration: 0.5 }}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute -inset-2 rounded-full border border-blue-400/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: node.delay,
              }}
            />
            {/* Node dot */}
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          </motion.div>
        ))}

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59,130,246,0)" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.4)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
          </defs>
          {/* Draw some connection paths */}
          <motion.path
            d="M 88 62 Q 110 90 70 115"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <motion.path
            d="M 44 35 Q 60 50 88 62"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </svg>
      </div>
    </div>
  );
};

// --- Enhanced Timeline ---
const TimelineVisual = () => {
  const [activeVersion, setActiveVersion] = useState(3);
  const versions = [
    { v: "1.0.0", date: "Jan 12", status: "archived" },
    { v: "1.1.0", date: "Jan 18", status: "archived" },
    { v: "1.2.0", date: "Jan 22", status: "previous" },
    { v: "1.3.0", date: "Jan 25", status: "current" },
  ];

  // Calculate progress percentage based on dot positions (justify-between)
  const progressPercent = (activeVersion / (versions.length - 1)) * 100;

  return (
    <div className="mt-auto relative w-full">
      {/* Timeline track */}
      <div className="relative h-16 flex items-center">
        {/* Background line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />

        {/* Active progress - aligned to dot positions */}
        <motion.div
          className="absolute left-0 top-1/2 h-px bg-gradient-to-r from-amber-500/50 to-amber-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Version nodes */}
        <div className="relative flex justify-between w-full">
          {versions.map((version, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveVersion(i)}
              className="relative flex flex-col items-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{
                  opacity: activeVersion === i ? 1 : 0,
                  y: activeVersion === i ? 0 : 5,
                }}
                className="absolute -top-10 px-2 py-1 bg-neutral-800 border border-white/10 rounded text-[10px] whitespace-nowrap"
              >
                <span className="text-white/60">{version.date}</span>
                <span className="text-amber-400 ml-1 font-mono">{version.v}</span>
              </motion.div>

              {/* Node */}
              <div
                className={cn(
                  "w-3 h-3 rounded-full border-2 transition-all duration-300 cursor-pointer",
                  i === activeVersion
                    ? "bg-amber-500 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                    : i < activeVersion
                      ? "bg-amber-500/30 border-amber-500/50"
                      : "bg-neutral-900 border-white/20 group-hover:border-amber-500/50",
                )}
              />

              {/* Label below */}
              <span
                className={cn(
                  "mt-2 text-[10px] font-mono transition-colors",
                  i === activeVersion ? "text-amber-400" : "text-white/30",
                )}
              >
                v{i + 1}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Typing Code Animation ---
const TypedCode = () => {
  const [step, setStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 4) setStep(step + 1);
      else setShowTooltip(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [step]);

  // Reset animation periodically
  useEffect(() => {
    const resetTimer = setInterval(() => {
      setStep(0);
      setShowTooltip(false);
    }, 8000);
    return () => clearInterval(resetTimer);
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden font-mono text-[13px]">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="text-white/30 text-xs">app.ts</div>
        <div className="w-12" />
      </div>

      {/* Code content */}
      <div className="p-5 min-h-[180px] relative">
        {/* Line 1: Import */}
        <div className="flex items-center">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">1</span>
          {step >= 1 && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-pink-400">import</span>
              <span className="text-white/80">{" { "}</span>
              <span className="text-sky-400">redenv</span>
              <span className="text-white/80">{" } "}</span>
              <span className="text-pink-400">from</span>
              <span className="text-emerald-400">{" '@/lib/redenv'"}</span>
              <span className="text-white/40">;</span>
            </motion.span>
          )}
        </div>

        {/* Line 2: Empty */}
        <div className="flex items-center h-5">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">2</span>
        </div>

        {/* Line 3: Load secrets */}
        <div className="flex items-center">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">3</span>
          {step >= 2 && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-purple-400">const</span>
              <span className="text-white/80">{" secrets = "}</span>
              <span className="text-pink-400">await</span>
              <span className="text-white/80">{" redenv"}</span>
              <span className="text-white/40">.</span>
              <span className="text-amber-300">load</span>
              <span className="text-white/40">();</span>
            </motion.span>
          )}
        </div>

        {/* Line 4: Empty */}
        <div className="flex items-center h-5">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">4</span>
        </div>

        {/* Line 5: toInt example */}
        <div className="flex items-center relative">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">5</span>
          {step >= 3 && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-purple-400">const</span>
              <span className="text-white/80">{" port = "}</span>
              <span className="text-sky-400">secrets</span>
              <span className="text-white/40">.</span>
              <span className="text-amber-300">get</span>
              <span className="text-white/40">(</span>
              <span className="text-emerald-400">"PORT"</span>
              <span className="text-white/40">).</span>
              <span className="text-amber-300 relative">
                toInt
                {/* Tooltip for toInt */}
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-neutral-800 border border-white/10 rounded-lg shadow-xl whitespace-nowrap"
                  >
                    <div className="text-[10px] flex items-center gap-1.5">
                      <span className="text-amber-300">toInt</span>
                      <span className="text-white/30">→</span>
                      <span className="text-sky-400">number</span>
                      <span className="text-white/30">|</span>
                      <span className="text-orange-400">undefined</span>
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
                  </motion.div>
                )}
              </span>
              <span className="text-white/40">();</span>
            </motion.span>
          )}
        </div>

        {/* Line 6: toBool example */}
        <div className="flex items-center">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">6</span>
          {step >= 4 && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="text-purple-400">const</span>
              <span className="text-white/80">{" debug = "}</span>
              <span className="text-sky-400">secrets</span>
              <span className="text-white/40">.</span>
              <span className="text-amber-300">get</span>
              <span className="text-white/40">(</span>
              <span className="text-emerald-400">"DEBUG"</span>
              <span className="text-white/40">).</span>
              <span className="text-amber-300">toBool</span>
              <span className="text-white/40">();</span>
            </motion.span>
          )}
        </div>

        {/* Line 7: toJSON example */}
        <div className="flex items-center">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">7</span>
          {step >= 4 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-purple-400">const</span>
              <span className="text-white/80">{" cfg = "}</span>
              <span className="text-sky-400">secrets</span>
              <span className="text-white/40">.</span>
              <span className="text-amber-300">get</span>
              <span className="text-white/40">(</span>
              <span className="text-emerald-400">"CFG"</span>
              <span className="text-white/40">).</span>
              <span className="text-amber-300">toJSON</span>
              <span className="text-white/40">&lt;</span>
              <span className="text-sky-400">T</span>
              <span className="text-white/40">&gt;();</span>
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Encryption Flow Animation ---
const EncryptionFlow = () => {
  return (
    <div className="mt-8 relative w-full border-t border-white/5 pt-8">
      <div className="flex items-center justify-between font-mono mb-4 text-white/40 uppercase tracking-widest text-[10px]">
        <span className="flex items-center gap-2">
          <Lock size={10} />
          Your Device
        </span>
        <span className="flex items-center gap-2">
          <Server size={10} />
          Upstash Redis
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Client side box */}
        <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl font-mono text-sm relative overflow-hidden group/client">
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full"
            animate={{ translateX: ["100%", "-100%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />

          <div className="flex items-center gap-2 mb-2 text-[10px] text-emerald-400/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Plaintext (Local Only)
          </div>
          <div className="text-emerald-400 text-xs">
            DATABASE_URL=<span className="text-emerald-300">"postgres://..."</span>
          </div>
        </div>

        {/* Arrow with animated particles */}
        <div className="relative w-20 flex items-center justify-center">
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50" />
          </div>

          {/* Animated particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
              animate={{
                x: [-30, 30],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            />
          ))}

          <div className="relative z-10 bg-neutral-950 px-1">
            <ArrowRight size={14} className="text-emerald-500" />
          </div>
        </div>

        {/* Server side box */}
        <div className="flex-1 bg-white/[0.02] border border-white/10 p-4 rounded-xl font-mono text-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 text-[10px] text-white/40">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            Encrypted (Unreadable)
          </div>
          <div className="text-white/30 break-all text-[11px]">
            <DecryptingText targetText="aGVsbG8gd29ybGQhIHRoaXMgaXMgYSB0ZXN0" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Grid Component ---
export const FeatureGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);

  function handleMouseMove({ clientX, clientY }: MouseEvent) {
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  function handleMouseEnter() {
    animate(spotlightOpacity, 1, { duration: 0.3 });
  }

  function handleMouseLeave() {
    animate(spotlightOpacity, 0, { duration: 0.3 });
  }

  // Animated counters
  const latencyUS = useAnimatedCounter(12, 1500, isInView);
  const latencyEU = useAnimatedCounter(24, 1500, isInView);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 max-w-7xl mx-auto w-full relative z-10"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">
          <Sparkles size={12} className="text-primary" />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Features
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Built for modern teams
        </h2>
        <p className="text-lg text-white/40 max-w-xl mx-auto">
          Everything you need to manage secrets securely, without the complexity.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 auto-rows-[minmax(200px,auto)]">
        {/* Card 1: Zero-Knowledge (Hero Card) */}
        <SpotlightCard
          className="col-span-1 md:col-span-6 lg:col-span-8 row-span-2"
          spotlightColor="rgba(16, 185, 129, 0.12)"
          mouseX={mouseX}
          mouseY={mouseY}
          spotlightOpacity={spotlightOpacity}
          index={0}
          isInView={isInView}
        >
          {/* Decorative background icon */}
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
            <Lock size={300} strokeWidth={0.5} />
          </div>

          <div className="p-8 lg:p-10 h-full flex flex-col justify-between relative">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Shield className="text-emerald-400" size={20} />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
                Zero-Knowledge Architecture
              </h3>
              <p className="text-base lg:text-lg text-white/50 max-w-lg leading-relaxed">
                Your secrets are encrypted client-side using{" "}
                <code className="text-emerald-400 font-mono text-sm px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  AES-256-GCM
                </code>
                . We never see plaintext — total privacy, even if we're breached.
              </p>
            </div>

            <EncryptionFlow />
          </div>
        </SpotlightCard>

        {/* Card 2: Global Edge Network */}
        <SpotlightCard
          className="col-span-1 md:col-span-6 lg:col-span-4 row-span-2"
          spotlightColor="rgba(59, 130, 246, 0.12)"
          mouseX={mouseX}
          mouseY={mouseY}
          spotlightOpacity={spotlightOpacity}
          index={1}
          isInView={isInView}
        >
          <div className="h-full flex flex-col">
            <div className="h-48 relative overflow-hidden">
              <EnhancedGlobe />
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Globe className="text-blue-400" size={20} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Global Edge Network
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1">
                Secrets replicated globally via Upstash Redis. Fetch from the
                nearest edge node.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                  <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">
                    US-East
                  </div>
                  <div className="text-xl font-mono text-blue-400 flex items-baseline gap-1">
                    {latencyUS}
                    <span className="text-xs text-blue-400/60">ms</span>
                  </div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                  <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">
                    EU-West
                  </div>
                  <div className="text-xl font-mono text-blue-400 flex items-baseline gap-1">
                    {latencyEU}
                    <span className="text-xs text-blue-400/60">ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 3: Version History */}
        <SpotlightCard
          className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1"
          spotlightColor="rgba(245, 158, 11, 0.12)"
          mouseX={mouseX}
          mouseY={mouseY}
          spotlightOpacity={spotlightOpacity}
          index={2}
          isInView={isInView}
        >
          <div className="p-8 flex flex-col h-full relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <History className="text-amber-400" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-white">Version History</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                ROLLBACK
              </span>
            </div>
            <p className="text-white/50 text-sm mb-4">
              Every change is versioned. Instantly rollback to any previous state.
            </p>

            <TimelineVisual />
          </div>
        </SpotlightCard>

        {/* Card 4: Smart Type Casting */}
        <SpotlightCard
          className="col-span-1 md:col-span-3 lg:col-span-8 row-span-1"
          spotlightColor="rgba(236, 72, 153, 0.12)"
          mouseX={mouseX}
          mouseY={mouseY}
          spotlightOpacity={spotlightOpacity}
          index={3}
          isInView={isInView}
        >
          <div className="p-8 flex flex-col lg:flex-row items-center gap-8 h-full">
            <div className="flex-1 lg:max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <Code className="text-pink-400" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Smart Type Casting
                </h3>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Parse secrets as integers, booleans, or typed JSON. Graceful
                handling of missing keys — no crashes, ever.
              </p>
            </div>

            <div className="w-full lg:flex-1">
              <TypedCode />
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
