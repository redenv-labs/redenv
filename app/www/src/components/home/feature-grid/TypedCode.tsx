"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export const TypedCode = () => {
  const [step, setStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timer = setTimeout(() => {
      if (step < 4) setStep(step + 1);
      else setShowTooltip(true);
    }, 400); // 400ms
    return () => clearTimeout(timer);
  }, [step, hasStarted]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0a0a0a] border border-white/8 rounded-xl shadow-2xl font-mono text-[13px]"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="text-white/30 text-xs">app.ts</div>
      </div>

      {/* Code content */}
      <div className="p-5 min-h-45 relative">
        {/* Line 1: Import */}
        <div className="flex items-center">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">
            1
          </span>
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
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">
            2
          </span>
        </div>

        {/* Line 3: Load secrets */}
        <div className="flex items-center">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">
            3
          </span>
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
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">
            4
          </span>
        </div>

        {/* Line 5: toInt example */}
        <div className="flex items-center relative">
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">
            5
          </span>
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
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">
            6
          </span>
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
          <span className="text-white/20 select-none mr-4 w-4 text-right text-xs">
            7
          </span>
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
