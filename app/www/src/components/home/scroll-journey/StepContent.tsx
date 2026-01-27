import { cn } from "@heroui/react";
import { Terminal, Lock, Server, Globe, Zap } from "lucide-react";

export const journeySteps = [
  {
    id: "write",
    title: "Write your secret",
    description: "Add secrets via CLI. Simple, fast, secure.",
    icon: Terminal,
    color: "emerald",
  },
  {
    id: "encrypt",
    title: "Client-side encryption",
    description: "AES-256-GCM on YOUR device. We never see plaintext.",
    icon: Lock,
    color: "primary",
  },
  {
    id: "store",
    title: "Secure storage",
    description: "Encrypted data stored in Upstash Redis.",
    icon: Server,
    color: "blue",
  },
  {
    id: "distribute",
    title: "Global edge",
    description: "Replicated worldwide. Millisecond access.",
    icon: Globe,
    color: "purple",
  },
  {
    id: "use",
    title: "Use anywhere",
    description: "Fetch & decrypt at runtime. No rebuilds.",
    icon: Zap,
    color: "amber",
  },
];

export const colorClasses = {
  emerald: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  primary: {
    bg: "bg-primary/20",
    border: "border-primary/30",
    text: "text-primary",
    glow: "rgba(255, 51, 51, 0.4)",
  },
  blue: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  purple: {
    bg: "bg-purple-500/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  amber: {
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "rgba(245, 158, 11, 0.4)",
  },
};

export const StepContent = ({
  progress,
}: {
  progress: number;
}) => {
  const currentIndex = Math.min(
    Math.floor(progress * journeySteps.length),
    journeySteps.length - 1,
  );
  const currentStep = journeySteps[currentIndex];
  const colors = colorClasses[currentStep.color as keyof typeof colorClasses];

  return (
    <div className="text-center">
      <h3
        className={cn(
          "text-xl md:text-2xl font-semibold mb-2 transition-colors duration-500",
          colors.text,
        )}
      >
        {currentStep.title}
      </h3>
      <p className="text-sm md:text-base text-white/50 max-w-sm mx-auto">
        {currentStep.description}
      </p>
    </div>
  );
};
