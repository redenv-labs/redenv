"use client";

import {
  motion,
  useMotionValue,
  useInView,
  animate,
} from "framer-motion";
import {
  Shield,
  Globe,
  History,
  Code,
  Lock,
  Sparkles,
} from "lucide-react";
import {
  MouseEvent,
  useRef,
} from "react";
import { SpotlightCard } from "./feature-grid/SpotlightCard";
import { EncryptionFlow } from "./feature-grid/EncryptionFlow";
import {Globe as GlobeComponent} from "./feature-grid/Globe"
import { TimelineVisual } from "./feature-grid/TimelineVisual";
import { TypedCode } from "./feature-grid/TypedCode";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/3 mb-6">
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
        {/* Card 1 */}
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

          <div className="p-6 md:p-8 lg:p-10 h-full flex flex-col justify-between relative">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Shield className="text-emerald-400" size={20} />
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-emerald-500/30 to-transparent" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
                Zero-Knowledge Architecture
              </h3>
              <p className="text-base lg:text-lg text-white/50 max-w-lg leading-relaxed">
                Your secrets are encrypted client-side using{" "}
                <code className="text-emerald-400 font-mono text-sm px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  AES-256-GCM
                </code>
                . We never see plaintext - total privacy, even if we're breached.
              </p>
            </div>

            <EncryptionFlow />
          </div>
        </SpotlightCard>

        {/* Card 2 */}
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
              <GlobeComponent />
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col">
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

        {/* Card 3 */}
        <SpotlightCard
          className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1"
          spotlightColor="rgba(245, 158, 11, 0.12)"
          mouseX={mouseX}
          mouseY={mouseY}
          spotlightOpacity={spotlightOpacity}
          index={2}
          isInView={isInView}
        >
          <div className="p-6 md:p-8 flex flex-col h-full relative">
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

        {/* Card 4 */}
        <SpotlightCard
          className="col-span-1 md:col-span-3 lg:col-span-8 row-span-1"
          spotlightColor="rgba(236, 72, 153, 0.12)"
          mouseX={mouseX}
          mouseY={mouseY}
          spotlightOpacity={spotlightOpacity}
          index={3}
          isInView={isInView}
        >
          <div className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 h-full">
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
