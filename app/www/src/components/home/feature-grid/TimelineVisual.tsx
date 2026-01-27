"use client";
import { useState } from "react";
import {motion} from "framer-motion"
import { cn } from "@heroui/react";

export const TimelineVisual = () => {
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
          className="absolute left-0 top-1/2 h-px bg-linear-to-r from-amber-500/50 to-amber-500"
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
