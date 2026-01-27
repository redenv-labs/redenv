import { Lock } from "lucide-react";
import { ENCRYPTED_VALUE } from "../ScrollJourney";
import { Upstash } from "@/components/icons/Upstash";
import { cn } from "@heroui/react";

export const StorageVisual = ({ progress }: { progress: number }) => {
  const stepProgress = Math.max(0, Math.min(1, (progress - 0.4) * 5)); // 40-60%
  const packetY = -100 + stepProgress * 100;
  const serverGlow = stepProgress > 0.7 ? (stepProgress - 0.7) * 3.33 : 0;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      {/* Flying data packet */}
      <div
        className="relative h-24 w-full flex justify-center"
        style={{
          opacity: stepProgress < 0.9 ? 1 : 1 - (stepProgress - 0.9) * 10,
        }}
      >
        <div
          className="absolute flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-lg"
          style={{
            transform: `translateY(${packetY}px)`,
            boxShadow: "0 0 20px rgba(255, 51, 51, 0.3)",
          }}
        >
          <Lock size={14} className="text-primary" />
          <span className="font-mono text-xs text-primary">
            {ENCRYPTED_VALUE}
          </span>
        </div>
      </div>

      {/* Server */}
      <div className="relative">
        {/* Server glow */}
        <div
          className="absolute inset-0 bg-blue-500/50 rounded-2xl blur-2xl"
          style={{ opacity: serverGlow }}
        />

        <div className="relative bg-secondary rounded-2xl border border-border/80 px-4 py-6 flex flex-col items-center gap-10">
          {/* Server icon */}
          <Upstash width={100} />

          {/* Server status */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                stepProgress > 0.7 ? "bg-emerald-400" : "bg-muted-foreground",
              )}
            />
            <span className="text-xs text-muted-foreground">
              {stepProgress > 0.7 ? "Stored securely" : "Receiving..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}