import { AnimatePresence, motion } from "framer-motion";
import { SECRET_VALUE } from "../ScrollJourney";
import { Check } from "lucide-react";
import ShikiHighlighter from "react-shiki";

export const TerminalVisual = ({ progress }: { progress: number }) => {
  const stepProgress = Math.min(1, progress * 5); // 0-20% of total
  // Typing completes faster (at 40% of step progress instead of 100%)
  const typingProgress = Math.min(1, stepProgress * 2.5);
  const typedChars = Math.floor(typingProgress * (SECRET_VALUE.length + 15));
  const command = `redenv add API_KEY ${SECRET_VALUE}`;
  const displayedText = command.slice(0, typedChars);
  const showCursor = typingProgress < 1;
  const showSuccess = typingProgress >= 1;

  return (
    <div className="w-full max-w-md">
      {/* Terminal window */}
      <div className="bg-muted/50 rounded-xl border border-border/80 overflow-hidden shadow-2xl shadow-emerald-500/20">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border/80">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-white/30 ml-2">terminal</span>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm">
          <div className="flex items-start">
            <span className="text-emerald-400 select-none mr-1">$ </span>
            <ShikiHighlighter
              className="[&_pre]:bg-transparent! [&_pre]:p-0!"
              showLanguage={false}
              language={"shell"}
              theme="github-dark"
            >
              {displayedText}
            </ShikiHighlighter>
            {showCursor && (
              <span className="w-2 h-5 bg-emerald-400 ml-0.5 animate-pulse" />
            )}
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-3 flex items-center gap-2 text-emerald-400"
              >
                <Check size={14} />
                <span>Secret added successfully</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}