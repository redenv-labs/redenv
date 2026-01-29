"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  MotionValue,
} from "framer-motion";
import { cn } from "@heroui/react";
import { useRef } from "react";

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.15)",
  mouseX,
  mouseY,
  spotlightOpacity,
  index = 0,
  isInView = false,
  enable3dRotation = true,
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  spotlightOpacity: MotionValue<number>;
  index?: number;
  isInView?: boolean;
  enable3dRotation?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);

  // 3D tilt effect
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  useMotionValueEvent(mouseX, "change", (latestX: number) => {
    if (!cardRef.current || !enable3dRotation) return;
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
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={cn(
        "group relative border border-white/8 bg-neutral-950/60 overflow-hidden rounded-3xl backdrop-blur-sm",
        className,
      )}
    >
      {/* Spotlight Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl transition duration-300 z-10"
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
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 bg-linear-to-r from-transparent via-white/10 to-transparent" />

      {/* Inner glow */}
      <div className="absolute inset-px rounded-3xl bg-linear-to-b from-white/3 to-transparent pointer-events-none" />

      <div className="relative h-full z-20">{children}</div>
    </motion.div>
  );
};
