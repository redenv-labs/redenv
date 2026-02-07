"use client";

import { motion } from "framer-motion";

export function AnimatedBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      <div className="absolute inset-0 filter blur-[100px] md:blur-[140px]">

        <motion.div
          className="absolute w-125 h-125 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255, 51, 51, 0.5) 0%, rgba(255, 51, 51, 0.1) 45%, transparent 70%)",
            left: "5%",
            top: "10%",
            mixBlendMode: "screen",
          }}
          animate={{
            x: [0, 120, -60, 0],
            y: [0, -80, 80, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-162.5 h-162.5 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 75%)",
            right: "-5%",
            top: "5%",
            mixBlendMode: "screen",
          }}
          animate={{
            x: [0, -140, 70, 0],
            y: [0, 100, -60, 0],
            scale: [1, 0.85, 1.15, 1],
            rotate: [0, -60, 60, 0],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute w-112.5 h-112.5 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.02) 50%, transparent 70%)",
            left: "15%",
            bottom: "5%",
            mixBlendMode: "screen",
          }}
          animate={{
            x: [0, 180, -120, 0],
            y: [0, 120, -180, 0],
            scale: [0.85, 1.25, 0.75, 0.85],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />

        <motion.div
          className="absolute w-137.5 h-137.5 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 75%)",
            right: "10%",
            bottom: "10%",
            mixBlendMode: "screen",
          }}
          animate={{
            x: [0, -100, 150, 0],
            y: [0, -150, 100, 0],
            scale: [1.1, 0.8, 1.1, 1.1],
            rotate: [0, 180, -180, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </div>
    </div>
  );
}

