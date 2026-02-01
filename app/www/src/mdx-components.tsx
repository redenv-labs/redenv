import type { MDXComponents } from "mdx/types";
import { Link } from "@/components/Link";
import { ExternalLink } from "lucide-react";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { CodeBlock } from "@/components/mdx/CodeBlock";
import { Callout } from "@/components/mdx/Callout";
import { Card, Cards } from "@/components/mdx/Cards";
import { Step, Steps } from "@/components/mdx/Steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import {
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockTab,
} from "@/components/mdx/CodeBlock";
import { ComponentProps } from "react";
import { cn } from "./lib/utils";
import * as Twoslash from "fumadocs-twoslash/ui";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import Image from "next/image";

// =============================================================================
// TYPOGRAPHY
// =============================================================================

const H1 = ({
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    id={id}
    className="scroll-mt-24 text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 mt-2 no-underline!"
    {...props}
  >
    {children}
  </h1>
);

const H2 = ({
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    id={id}
    className="group scroll-mt-24 text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-12 mb-4 pb-3 border-b border-border/40"
    {...props}
  >
    <a href={`#${id}`} className="flex items-center gap-2 no-underline">
      {children}
      <span className="opacity-0 group-hover:opacity-50 transition-opacity text-primary">
        #
      </span>
    </a>
  </h2>
);

const H3 = ({
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    id={id}
    className="group scroll-mt-24 text-xl md:text-2xl font-semibold tracking-tight text-foreground mt-10 mb-3"
    {...props}
  >
    <a href={`#${id}`} className="flex items-center gap-2 no-underline">
      {children}
      <span className="opacity-0 group-hover:opacity-50 transition-opacity text-primary text-sm">
        #
      </span>
    </a>
  </h3>
);

const H4 = ({
  children,
  id,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    id={id}
    className="scroll-mt-24 text-lg font-semibold text-foreground mt-8 mb-2"
    {...props}
  >
    {children}
  </h4>
);

const Paragraph = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className="text-muted-foreground leading-7 mb-5 not-first:mt-0" {...props}>
    {children}
  </p>
);

// =============================================================================
// LINKS
// =============================================================================

const Anchor = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isExternal = href?.startsWith("http");
  const isAnchor = href?.startsWith("#");

  if (isAnchor) {
    return (
      <a
        href={href}
        className="font-foreground font-medium hover:underline underline-offset-4 transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-foreground font-medium hover:underline underline-offset-4 transition-colors"
        {...props}
      >
        {children}
        <ExternalLink size={12} className="opacity-60" />
      </a>
    );
  }

  return (
    <Link
      href={href || ""}
      className="text-foreground font-medium hover:underline underline-offset-4 transition-colors"
      {...props}
    >
      {children}
    </Link>
  );
};

// =============================================================================
// LISTS
// =============================================================================

const UnorderedList = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul
    className="my-5 ml-2 list-none space-y-2 text-muted-foreground [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-1 [&>li]:before:top-1/2 [&>li]:before:-translate-y-1/2 [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-primary/50"
    {...props}
  >
    {children}
  </ul>
);

const OrderedList = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) => (
  <ol
    className="my-5 ml-2 list-none space-y-2 text-muted-foreground [counter-reset:item] [&>li]:relative [&>li]:pl-8 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-1/2 [&>li]:before:-translate-y-1/2 [&>li]:before:h-6 [&>li]:before:w-auto [&>li]:before:aspect-square [&>li]:before:rounded-full [&>li]:before:bg-primary/10 [&>li]:before:text-primary [&>li]:before:text-[0.65rem] [&>li]:before:font-bold [&>li]:before:flex [&>li]:before:items-center [&>li]:before:justify-center [&>li]:before:content-[counter(item)] [&>li]:before:[counter-increment:item]"
    {...props}
  >
    {children}
  </ol>
);

const ListItem = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="leading-7" {...props}>
    {children}
  </li>
);

// =============================================================================
// BLOCKQUOTE
// =============================================================================

const Blockquote = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    className="my-6 border-l-4 border-primary/50 bg-primary/5 rounded-r-lg py-4 px-5 text-muted-foreground italic [&>p]:mb-0"
    {...props}
  >
    {children}
  </blockquote>
);

// =============================================================================
// TABLE
// =============================================================================

const Table = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="my-6 overflow-x-auto rounded-xl border border-border/50">
    <table className="w-full text-sm" {...props}>
      {children}
    </table>
  </div>
);

const TableHead = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-secondary/50 border-b border-border/50" {...props}>
    {children}
  </thead>
);

const TableBody = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="divide-y divide-border/30" {...props}>
    {children}
  </tbody>
);

const TableRow = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className="transition-colors hover:bg-secondary/20" {...props}>
    {children}
  </tr>
);

const TableHeader = ({
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className="px-4 py-3 text-left font-semibold text-foreground" {...props}>
    {children}
  </th>
);

const TableCell = ({
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className="px-4 py-3 text-muted-foreground" {...props}>
    {children}
  </td>
);

// =============================================================================
// OTHER ELEMENTS
// =============================================================================

const HorizontalRule = (props: React.HTMLAttributes<HTMLHRElement>) => (
  <hr className="my-10 border-border/30" {...props} />
);

// =============================================================================
// EXPORT
// =============================================================================

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...Twoslash,

    // Typography
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    p: Paragraph,

    // Links
    a: Anchor,

    // Lists
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,

    // Code
    pre: CodeBlock,

    // Blockquote
    blockquote: Blockquote,

    // Table
    table: Table,
    thead: TableHead,
    tbody: TableBody,
    tr: TableRow,
    th: TableHeader,
    td: TableCell,

    // Other
    hr: HorizontalRule,
    img: ({
      className,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <ImageZoom className={cn(className, "rounded-xl")} {...(props as any)} />
    ),
    
    Image,

    Callout,
    Card,
    Cards,
    Steps,
    Step,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    CodeBlockTab,

    Tabs: ({ className, ...props }: ComponentProps<typeof Tabs>) => (
      <Tabs className={cn(className, "bg-secondary")} {...props} />
    ),
    Tab: ({ className, ...props }: ComponentProps<typeof Tab>) => (
      <Tab className={cn(className, "bg-background/40")} {...props} />
    ),

    ...components,
  };
}
