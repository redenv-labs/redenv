"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { JourneyVisual } from "./scroll-journey/JourneyVisual";
import { StepContent } from "./scroll-journey/StepContent";
import { StepIndicator } from "./scroll-journey/StepIndicator";

gsap.registerPlugin(ScrollTrigger);

export const SECRET_VALUE = "sk-proj-x7Kj9mN2pQ4r";
export const ENCRYPTED_VALUE = "aGVsbG8gd29ybGQ=...";


export function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      if (!containerRef.current || !stickyRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
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

  return (
    <section ref={containerRef} className="relative h-[500vh]">
      <div ref={stickyRef} className="h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-neutral-950" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 h-screen bg-[linear-gradient(to_right,#ff333315_1px,transparent_1px),linear-gradient(to_bottom,#ff333315_1px,transparent_1px)] bg-size-[40px_40px] mask-[linear-gradient(to_bottom,black_40%,transparent_60%)]" />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,51,51,0.15),transparent)]"
          style={{ opacity: 0.5 + Math.sin(progress * Math.PI) * 0.5 }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-6xl mx-auto">
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

            <div className="flex flex-col items-center justify-center gap-8">
              <JourneyVisual progress={progress} />

              <StepContent progress={progress} />

              <StepIndicator progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
