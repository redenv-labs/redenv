import ShikiHighlighter from "react-shiki";
import { SECRET_VALUE } from "../ScrollJourney";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export const UsageVisual=({ progress }: { progress: number })=> {
  const stepProgress = Math.max(0, Math.min(1, (progress - 0.8) * 5)); // 80-100%
  const codeLines = [
    { text: "const secrets = await redenv.load();", delay: 0 },
    { text: "", delay: 0.2 },
    { text: 'const apiKey = secrets.get("API_KEY");', delay: 0.4 },
    { text: `// → "${SECRET_VALUE}"`, delay: 0.6, isComment: true },
  ];

  return (
    <div className="w-full max-w-md">
      {/* Code editor */}
      <div className="bg-muted/50 rounded-xl border border-border/80 shadow-2xl shadow-amber-500/20 overflow-hidden relative">
        {/* Editor header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border/80">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-white/30 ml-2">api/route.ts</span>
        </div>

        {/* Code content */}
        <div className="p-4 font-mono text-sm space-y-1">
          {codeLines.map((line, i) => {
            const lineProgress = Math.max(0, (stepProgress - line.delay) * 2.5);
            const opacity = Math.min(1, lineProgress);
            const translateX = (1 - Math.min(1, lineProgress)) * 20;

            if (!line.text) return <div key={i} className="h-4" />;

            return (
              <ShikiHighlighter
                key={i}
                style={{
                  opacity,
                  transform: `translateX(${translateX}px)`,
                  transition: "all 0.3s ease-out",
                }}
                className="[&_pre]:bg-transparent! [&_pre]:p-0!"
                showLanguage={false}
                language={"typescript"}
                theme="github-dark"
              >
                {line.text}
              </ShikiHighlighter>
            );
          })}
        </div>

        {/* Success indicator */}
        <AnimatePresence>
          {stepProgress > 0.9 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-2.5 py-1.5 rounded-full bg-emerald-500/10 border-t border-emerald-500/20 flex items-center gap-2 overflow-hidden absolute top-1.5 right-1.5"
            >
              <Check size={14} className="text-emerald-400 shrink-0" />
              <span className="text-xs text-emerald-400">
                Decrypted at runtime
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}