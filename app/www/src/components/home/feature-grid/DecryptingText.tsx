"use client";
import { useEffect, useState } from "react";

export const DecryptingText = ({ targetText }: { targetText: string }) => {
  const [displayText, setDisplayText] = useState(targetText);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef0123456789+/=";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const runAnimation = () => {
      let iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplayText(() =>
          targetText
            .split("")
            .map((letter, index) => {
              if (index < iteration) return targetText[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join(""),
        );
        if (iteration >= targetText.length) clearInterval(interval);
        iteration += 1 / 3;
      }, 30);
    };
    runAnimation();
    const loop = setInterval(runAnimation, 4000);
    return () => {
      clearInterval(interval);
      clearInterval(loop);
    };
  }, [targetText]);

  return <span className="font-mono text-emerald-400/80">{displayText}</span>;
};
