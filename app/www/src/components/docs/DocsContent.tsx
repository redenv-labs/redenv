"use client";

import { motion } from "framer-motion";
import { Link } from "@heroui/react";
import {
  ChevronRight,
  Pencil,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { REDENV_GITHUB_URL } from "@/consts";
import { cn } from "@/lib/utils";

interface AdjacentPage {
  title: string;
  url: string;
}

interface DocsContentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  lastUpdated?: string;
  editUrl?: string;
  prev?: AdjacentPage;
  next?: AdjacentPage;
}

export function DocsContent({
  title,
  description,
  children,
  breadcrumbs = [],
  lastUpdated,
  editUrl,
  prev,
  next,
}: DocsContentProps) {
  return (
    <article className="flex-1 min-w-0 max-w-3xl">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1 text-sm mb-6"
        >
          <Link
            href="/docs"
            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Docs
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1">
              <ChevronRight size={14} className="text-muted-foreground/30" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-muted-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </motion.nav>
      )}

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border/30">
          {lastUpdated && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
              <Clock size={12} />
              <span>Updated {lastUpdated}</span>
            </div>
          )}
          {editUrl && (
            <Link
              href={editUrl}
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <Pencil size={12} />
              <span>Edit this page</span>
            </Link>
          )}
        </div>
      </motion.header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Prev / Next Navigation */}
      {(prev || next) && (
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={cn(
            "mt-16 grid gap-4",
            !prev || !next ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          {prev ? (
            <Link
              href={prev.url}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-border/20 p-4 transition-colors hover:border-primary/20 bg-secondary/30 hover:bg-primary/10"
            >
              <span className="flex items-start gap-1.5 text-xs text-muted-foreground/60">
                <ArrowLeft size={12} />
                Previous
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={next.url}
              className="group flex flex-col items-end gap-2 rounded-2xl border border-border/20 p-4 transition-colors hover:border-primary/20 bg-secondary/30 hover:bg-primary/10"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                Next
                <ArrowRight size={12} />
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </motion.nav>
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-8 pt-8 border-t border-border/30"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground/50">
            Was this page helpful?{" "}
            <Link
              href={`${REDENV_GITHUB_URL}/issues/new`}
              target="_blank"
              className="text-primary hover:underline"
            >
              Let us know
            </Link>
          </p>
        </div>
      </motion.footer>
    </article>
  );
}
