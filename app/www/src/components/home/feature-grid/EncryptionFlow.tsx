"use client";

import { ArrowRight, Lock, Server } from "lucide-react";
import { motion } from "framer-motion";
import { DecryptingText } from "./DecryptingText";

export const EncryptionFlow = () => {
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

      <div className="flex not-md:flex-col items-center gap-3 not-md:gap-7">
        {/* Client side box */}
        <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl font-mono text-sm relative overflow-hidden group/client">
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full"
            animate={{ translateX: ["100%", "-100%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />

          <div className="flex items-center gap-2 mb-2 text-[10px] text-emerald-400/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Plaintext (Local Only)
          </div>
          <div className="text-emerald-400 text-xs">
            DATABASE_URL=
            <span className="text-emerald-300">"postgres://..."</span>
          </div>
        </div>

        {/* animated particles */}
        <div className="relative w-20 flex items-center justify-center">
          <div className="not-md:hidden absolute inset-y-0 left-0 right-0 flex items-center">
            <div className="h-px flex-1 bg-linear-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50" />
          </div>
          <div className="md:hidden absolute inset-y-0 left-1/2 flex items-center">
            <div className="w-px h-14 bg-linear-to-t from-emerald-500/50 via-emerald-500 to-emerald-500/50" />
          </div>

          {/* Animated particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute not-md:hidden w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
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

          <div className="md:hidden -translate-x-0.5 flex items-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                animate={{
                  y: [-30, 30],
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
          </div>

          <div className="relative not-md:hidden z-10 bg-neutral-950 px-1">
            <ArrowRight size={14} className="text-emerald-500" />
          </div>
        </div>

        {/* Server side box */}
        <div className="flex-1 bg-white/2 border border-white/10 p-4 rounded-xl font-mono text-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 text-[10px] text-white/40">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
            Encrypted (Unreadable)
          </div>
          <div className="text-white/30 text-[11px]">
            <DecryptingText targetText="aGVsbG8gd29ybGQhIHRoaXMgaXMgYSB0ZXN0" />
          </div>
        </div>
      </div>
    </div>
  );
};
