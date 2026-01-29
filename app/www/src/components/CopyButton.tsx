"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

export const CopyButton = ({
  text = "",
  handleCopy,
  disabled = false,
}: {
  text?: string;
  handleCopy?: () => void;
  disabled?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (!text && typeof handleCopy === "function") {
      handleCopy();
    } else {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onPress={handleClick}
      size="sm"
      disabled={disabled}
      variant="light"
      className="bg-transparent! aspect-square p-0 min-w-auto relative overflow-hidden"
    >
      <motion.div
        key={copied ? "check" : "copy"}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {copied ? (
          <Check size={18} className="text-muted-foreground" />
        ) : (
          <Copy size={16} className="text-muted-foreground" />
        )}
      </motion.div>
    </Button>
  );
};
