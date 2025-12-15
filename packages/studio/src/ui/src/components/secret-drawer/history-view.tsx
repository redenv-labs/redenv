import { useEffect, useRef, useState } from "react";
import { Button, Chip, Snippet } from "@heroui/react";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "boring-avatars";

interface HistoryViewProps {
  history: any[];
  onRollback: (value: string) => void;
  isRollingBack: boolean;
}

export function HistoryView({
  history,
  onRollback,
  isRollingBack,
}: HistoryViewProps) {
  const historyWrapperRef = useRef<HTMLDivElement>(null);
  const [historyHeight, setHistoryHeight] = useState(0);

  useEffect(() => {
    if (!historyWrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHistoryHeight(entry.contentRect.height);
      }
    });
    observer.observe(historyWrapperRef.current);
    return () => observer.disconnect();
  }, [history]);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 relative bg-linear-to-b from-background via-background/50 to-background/80">
      {/* Loading Overlay */}
      {isRollingBack && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute w-10 h-10 rounded-full border-2 border-primary/20 border-b-primary animate-spin direction-reverse" />
            <div className="absolute w-full h-full rounded-full bg-primary/5 animate-pulse" />
          </div>
        </div>
      )}

      {/* Glowing Gradient Timeline Line */}
      <div
        className="absolute left-[43px] top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary/20 to-transparent shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300"
        style={{ height: historyHeight }}
      />

      <div className="space-y-8 pt-4 pb-12" ref={historyWrapperRef}>
        {history.map((version: any, index: number) => {
          const isLatest = index === 0;
          return (
            <motion.div
              key={version.version}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="relative flex gap-6 group"
            >
              {/* Glowing Timeline Node */}
              <div className="relative z-10 flex items-center justify-center w-9 h-9 shrink-0 ml-0.5">
                {isLatest ? (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <div className="absolute w-full h-full rounded-full bg-primary/20 animate-ping" />
                    <div className="absolute w-full h-full rounded-full bg-primary/10 blur-sm" />
                    <div className="relative w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] border-2 border-background" />
                  </div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-default-300 border-2 border-background group-hover:bg-primary group-hover:scale-125 transition-all duration-300 shadow-sm" />
                )}
              </div>

              {/* Glass Card */}
              <div className="flex-1 min-w-0 perspective-1000">
                <motion.div
                  className={`
                    rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-300
                    ${
                      isLatest
                        ? "bg-primary/5 border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.1)]"
                        : "bg-content1/30 border-white/5 hover:bg-content1/50 hover:border-primary/20 hover:shadow-lg"
                    }
                  `}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                      <Chip
                        size="sm"
                        variant={isLatest ? "shadow" : "flat"}
                        color={isLatest ? "primary" : "default"}
                        className={`h-6 font-mono font-bold ${
                          isLatest ? "shadow-primary/30" : ""
                        }`}
                      >
                        v{version.version}
                      </Chip>
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(version.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* User Avatar */}
                    <div className="flex items-center gap-2">
                      <Avatar name={version.user} size={20} />
                      <span className="text-xs text-foreground/70 font-medium">
                        {version.user}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 relative group/code">
                    <Snippet
                      className="w-full py-3 bg-black/20 border border-white/5"
                      hideSymbol
                    >
                      {version.value}
                    </Snippet>
                  </div>

                  {/* Card Footer (Actions) */}
                  {!isLatest && (
                    <div className="px-5 py-0 group-hover:py-3 bg-white/5 border-t border-white/5 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 h-0 group-hover:h-14">
                      <Button
                        size="sm"
                        variant="shadow"
                        color="primary"
                        isDisabled={version.value === history[0].value}
                        className="h-8 text-xs font-semibold"
                        startContent={<RotateCcw size={14} />}
                        onPress={() => onRollback(version.value)}
                      >
                        Rollback
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
