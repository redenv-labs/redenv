"use client";

import {
  ComponentProps,
  createContext,
  RefObject,
  use,
  useMemo,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "../CopyButton";
import { CodeBlockProps } from "fumadocs-ui/components/codeblock";
import { useCopyButton } from "@fumadocs/ui/hooks/use-copy-button";
import { mergeRefs } from "@fumadocs/ui/merge-refs";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
} from "fumadocs-ui/components/tabs";

export const Code = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  // Code blocks from markdown have a className like "language-typescript"
  // Inline code doesn't have this class
  const isCodeBlock = className?.includes("language-");

  if (isCodeBlock) {
    return (
      <code
        className={cn(
          "w-full [&_span]:w-full inline-flex flex-col gap-1",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  // Inline code styling
  return (
    <code
      className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-foreground w-full [&_span]:w-full max-w-max flex-col gap-1"
      {...props}
    >
      {children}
    </code>
  );
};

export function CodeBlock({
  children,
  icon,
  Actions = (props) => (
    <div {...props} className={cn("empty:hidden", props.className)} />
  ),
  title,
  className,
  ...props
}: CodeBlockProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const inTab = use(TabsContext);

  const [, onClick] = useCopyButton(() => {
    const pre =
      areaRef.current?.getElementsByTagName("pre").item(0) ||
      areaRef.current?.getElementsByTagName("code").item(0);
    if (!pre) return;

    const clone = pre.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".nd-copy-ignore").forEach((node) => {
      node.replaceWith("\n");
    });

    void navigator.clipboard.writeText(clone.textContent ?? "");
  });

  return (
    <div
      className={cn(
        "group relative my-6 rounded-xl overflow-hidden border border-border/50",
        inTab ? "bg-background/30" : "bg-secondary/40",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between border-border/30 bg-secondary/30",
          title ? "px-4 py-1 border-b" : "",
        )}
      >
        <div className="w-full flex items-center justify-between gap-3 text-muted-foreground">
          {title ? (
            <>
              {typeof icon === "string" ? (
                <div
                  className="[&_svg]:size-3.5"
                  dangerouslySetInnerHTML={{
                    __html: icon,
                  }}
                />
              ) : (
                icon
              )}
              <figcaption className="flex-1 truncate text-sm">
                {title}
              </figcaption>
              {Actions({
                className: "-me-2 flex items-center",
                children: <CopyButton handleCopy={onClick as any} />,
              })}
            </>
          ) : (
            Actions({
              className:
                "absolute top-3 right-2 z-2 backdrop-blur-lg rounded-lg text-fd-muted-foreground",
              children: <CopyButton handleCopy={onClick as any} />,
            })
          )}
        </div>
      </div>
      {/* Code */}
      <pre
        ref={areaRef as any}
        className={cn(
          "overflow-x-auto py-4 text-sm leading-relaxed font-mono scrollbar-1",
          "[&>code]:bg-transparent [&>code]:p-0 [&>code]:border-0 [&>code]:text-inherit [&_code:only-child]:inline-flex [&_code:only-child]:max-w-full",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

const TabsContext = createContext<{
  containerRef: RefObject<HTMLDivElement | null>;
  nested: boolean;
} | null>(null);

export function CodeBlockTabs({
  ref,
  className,
  ...props
}: ComponentProps<typeof Tabs>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nested = use(TabsContext) !== null;

  return (
    <Tabs
      ref={mergeRefs(containerRef, ref)}
      {...props}
      className={cn(
        "bg-fd-card rounded-xl border",
        !nested && "my-4",
        className,
      )}
    >
      <TabsContext
        value={useMemo(
          () => ({
            containerRef,
            nested,
          }),
          [nested],
        )}
      >
        {props.children}
      </TabsContext>
    </Tabs>
  );
}

export function CodeBlockTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      {...props}
      className={cn(
        "flex flex-row px-2 overflow-x-auto text-fd-muted-foreground",
        className,
      )}
    >
      {props.children}
    </TabsList>
  );
}

export function CodeBlockTabsTrigger({
  children,
  className,
  ...props
}: ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      {...props}
      className={cn(
        "relative group inline-flex text-sm font-medium text-nowrap items-center transition-colors gap-2 px-2 py-2 [&_svg]:size-3.5",
        className,
      )}
    >
      {children}
    </TabsTrigger>
  );
}

export function CodeBlockTab(props: ComponentProps<typeof TabsContent>) {
  return <TabsContent {...props} />;
}
