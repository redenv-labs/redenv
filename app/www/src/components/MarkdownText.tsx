"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./mdx";
import { Code } from "./mdx/CodeBlock";
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
          pre: ({ className, ...props }) => <CodeBlock className={cn(className, "bg-muted")} {...props} />,
          code: ({ className, ...props }) => <code className={cn("bg-muted-foreground/20 px-1.5 py-0.5 rounded text-sm font-mono text-foreground w-full [&_span]:w-full max-w-max flex-col gap-1",className, )} {...props} />,
          a: Anchor,
        }}
      >
        {children}
      </ReactMarkdown>
    </span>
  );
}
