"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Search,
  FileText,
  Hash,
  Text,
  Puzzle,
  ArrowRight,
  CornerDownLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "@/hooks/useRouter";
import {
  useSearch as useSearchQuery,
  type SearchResult,
  type HighlightSegment,
} from "./useSearch";
import { Keybindy } from "@keybindy/react";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { results, isLoading } = useSearchQuery(query);
  const resultCount = results.length;

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navigate = useCallback(
    (item: SearchResult) => {
      router.push(item.url);
      onClose();
    },
    [router, onClose],
  );

  useEffect(() => {
    if (!resultsRef.current) return;
    const el = resultsRef.current.querySelector(
      `[data-index="${selectedIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <Keybindy
      disabled={!isOpen}
      scope="search-dialog"
      shortcuts={[
        {
          keys: ["Arrow Down"],
          handler: (e: any) => {
            e.preventDefault();
            setSelectedIndex((i) => (i < resultCount - 1 ? i + 1 : 0));
          },
          options: { repeat: true },
        },
        {
          keys: ["Arrow Up"],
          handler: (e: any) => {
            e.preventDefault();
            setSelectedIndex((i) =>
              i > 0 ? i - 1 : Math.max(resultCount - 1, 0),
            );
          },
          options: { repeat: true },
        },
        {
          keys: ["Enter"],
          handler: (e: any) => {
            e.preventDefault();
            if (results[selectedIndex]) {
              navigate(results[selectedIndex]);
            }
          },
        },
        {
          keys: ["Esc"],
          handler: (e: any) => {
            e.preventDefault();
            onClose();
          },
        },
      ]}
    >
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative mx-auto mt-[15vh] w-[calc(100%-2rem)] max-w-xl"
            >
              <div className="bg-neutral-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 px-5 border-b border-white/8">
                  <Search size={18} className="text-white/25 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search docs, plugins..."
                    className="flex-1 bg-transparent py-4 text-sm text-white placeholder:text-white/25 outline-none"
                  />
                  <kbd
                    onClick={onClose}
                    className="cursor-pointer px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/30 hover:text-white/50 transition-colors"
                  >
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div
                  ref={resultsRef}
                  className="max-h-[50vh] overflow-y-auto scrollbar-1"
                >
                  {!query.trim() ? (
                    <div className="px-5 py-10 text-center">
                      <p className="text-sm text-white/20">
                        Type to search documentation and plugins
                      </p>
                    </div>
                  ) : isLoading && results.length === 0 ? (
                    <div className="p-4 space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl animate-pulse"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/5" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3.5 bg-white/5 rounded w-2/3" />
                            <div className="h-2.5 bg-white/3 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : results.length === 0 && !isLoading ? (
                    <div className="px-5 py-10 text-center">
                      <p className="text-sm text-white/30 mb-1">
                        No results for &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-xs text-white/15">
                        Try a different search term
                      </p>
                    </div>
                  ) : (
                    <LayoutGroup>
                      <motion.div
                        className="p-2"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.03,
                            },
                          },
                        }}
                      >
                        {results.map((item, i) => (
                          <ResultRow
                            key={item.id}
                            index={i}
                            selectedIndex={selectedIndex}
                            item={item}
                            onSelect={() => navigate(item)}
                            onHover={() => setSelectedIndex(i)}
                          />
                        ))}
                      </motion.div>
                    </LayoutGroup>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-white/20">
                    <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 text-[10px] font-mono">
                      ↑↓
                    </kbd>
                    navigate
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-white/20">
                    <CornerDownLeft size={11} className="text-white/20" />
                    open
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-white/20">
                    <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/8 text-[10px] font-mono">
                      esc
                    </kbd>
                    close
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Keybindy>,
    document.body,
  );
}

function hasHighlights(segments?: HighlightSegment[]): boolean {
  return !!segments?.some((s) => s.highlight);
}

function HighlightedText({ segments }: { segments: HighlightSegment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary rounded-sm px-0.5 -mx-0.5"
          >
            {seg.content}
          </mark>
        ) : (
          <span key={i}>{seg.content}</span>
        ),
      )}
    </>
  );
}

const typeIcon: Record<string, React.ReactNode> = {
  page: <FileText size={14} className="text-white/30" />,
  heading: <Hash size={14} className="text-white/30" />,
  text: <Text size={14} className="text-white/30" />,
  plugin: <Puzzle size={14} className="text-white/30" />,
};

const typeLabel: Record<string, string> = {
  page: "Page",
  heading: "Section",
  text: "Content",
  plugin: "Plugin",
};

function ResultRow({
  index,
  selectedIndex,
  item,
  onSelect,
  onHover,
}: {
  index: number;
  selectedIndex: number;
  item: SearchResult;
  onSelect: () => void;
  onHover: () => void;
}) {
  const isActive = selectedIndex === index;

  return (
    <motion.button
      layout="position"
      layoutId={item.id}
      variants={{
        hidden: { opacity: 0, y: 8, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
        layout: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
      }}
      data-index={index}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`flex items-center gap-3 w-full py-2.5 rounded-xl text-left transition-colors px-3 ${
        isActive
          ? "bg-white/5 border-l-2 border-primary"
          : "hover:bg-white/3 border-l-2 border-transparent"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0`}
      >
        {typeIcon[item.type] || typeIcon.page}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white/80 truncate">
            {hasHighlights(item.highlights) ? (
              <HighlightedText segments={item.highlights!} />
            ) : (
              item.title
            )}
          </p>
          {item.type === "plugin" && item.official && (
            <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold uppercase">
              official
            </span>
          )}
          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-white/3 border border-white/6 text-white/20 font-medium">
            {typeLabel[item.type] || "Page"}
          </span>
        </div>
        {item.breadcrumbs && item.breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-white/20 truncate">
            {item.breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight size={9} className="text-white/10 shrink-0" />
                )}
                <span className="truncate">{crumb}</span>
              </span>
            ))}
          </div>
        )}
        {item.description && !item.breadcrumbs?.length && (
          <p className="text-[11px] text-white/20 truncate">
            {item.description}
          </p>
        )}
      </div>
      {isActive && (
        <ArrowRight size={14} className="text-primary/50 shrink-0" />
      )}
    </motion.button>
  );
}
