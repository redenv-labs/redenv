import { cn } from "@heroui/react";
import { colorClasses, journeySteps as steps } from "./StepContent";
import { Check } from "lucide-react";

export const StepIndicator = ({
  progress,
}: {
  progress: number;
}) => {
  return (
    <div className="relative flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const stepStart = index / steps.length;
        const stepEnd = (index + 1) / steps.length;
        const isActive = progress >= stepStart && progress < stepEnd;
        const isComplete = progress >= stepEnd;
        const colors = colorClasses[step.color as keyof typeof colorClasses];
        const Icon = step.icon;

        return (
          <div
            key={step.id}
            className="relative flex flex-col items-center gap-2 z-10"
          >
            {/* Step circle */}
            <div
              className={cn(
                "relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 bg-secondary",
                isActive
                  ? `${colors.bg} ${colors.border} border-2 scale-110`
                  : isComplete
                    ? "opacity-50 border border-white/20"
                    : "border border-white/10",
              )}
              style={{
                boxShadow: isActive ? `0 0 20px ${colors.glow}` : "none",
              }}
            >
              {isComplete ? (
                <Check size={18} className="text-emerald-400" />
              ) : (
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? colors.text : "text-muted-foreground",
                  )}
                />
              )}

              {/* Pulse ring for active step */}
              {isActive && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-30",
                    colors.bg,
                  )}
                  style={{ animationDuration: "2s" }}
                />
              )}
            </div>

            {/* Step label */}
            <span
              className={cn(
                "hidden sm:block text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 max-w-20 text-center",
                isActive
                  ? "text-white"
                  : isComplete
                    ? "text-muted-foreground"
                    : "text-muted-foreground",
              )}
            >
              {step.title.split(" ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}