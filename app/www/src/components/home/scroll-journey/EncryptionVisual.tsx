import { useEffect, useState } from "react";
import { ENCRYPTED_VALUE, SECRET_VALUE } from "../ScrollJourney";
import { Lock } from "lucide-react";
import { cn } from "@heroui/react";

export const EncryptionVisual = ({ progress }: { progress: number }) => {
  const stepProgress = Math.max(0, Math.min(1, (progress - 0.2) * 5)); // 20-40%
  const [scrambled, setScrambled] = useState(SECRET_VALUE);

  useEffect(() => {
    if (stepProgress <= 0 || stepProgress >= 1) {
      setScrambled(stepProgress >= 1 ? ENCRYPTED_VALUE : SECRET_VALUE);
      return;
    }

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    const easedProgress = stepProgress * stepProgress;
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

  const lockScale = 0.9 + stepProgress * 0.2;
  const lockRotation = stepProgress * 180;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6">
      {/* Lock animation */}
      <div
        className="relative w-24 h-24 flex items-center justify-center"
        style={{ transform: `scale(${lockScale})` }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 bg-primary/50 rounded-full blur-2xl"
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
      <div className="bg-secondary rounded-lg border border-border/80 px-4 py-4 font-mono text-sm">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">value:</span>
          <span
            className={cn(
              "transition-colors duration-300",
              stepProgress > 0.5 ? "text-primary" : "text-foreground",
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