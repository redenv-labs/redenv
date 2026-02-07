"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { CodeBlock } from "../mdx";
import { Code } from "../mdx/CodeBlock";
import { Anchor } from "@/mdx-components";

interface MarkdownTextProps {
  children: string;
  className?: string;
}

export function MarkdownText({ children, className }: MarkdownTextProps) {
  return (
    <span className={cn("inline", className)}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <span>{children}</span>,
          // Bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          pre: CodeBlock,
          code: Code,
          a: Anchor,
        }}
      >
        {children}
      </ReactMarkdown>
    </span>
  );
}
