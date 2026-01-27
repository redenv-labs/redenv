"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export const Globe = () => {
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
        <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />

        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-blue-500/30 to-transparent" />

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