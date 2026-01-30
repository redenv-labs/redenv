"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type {
  SearchResultType,
  HighlightSegment,
} from "@/app/api/search/route";
import { debounce } from "@/lib/debounce";

export type { SearchResultType, HighlightSegment };

export interface SearchResult {
  id: string;
  url: string;
  title: string;
  type: SearchResultType;
  score: number;
  breadcrumbs?: string[];
  highlights?: HighlightSegment[];
  description?: string;
  official?: boolean;
}

export interface SearchState {
  results: SearchResult[];
  isLoading: boolean;
}

export function useSearch(query: string): SearchState {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (abortRef.current) abortRef.current.abort();

        const controller = new AbortController();
        abortRef.current = controller;

        try {
          const res = await fetch(
            `/api/search?query=${encodeURIComponent(searchQuery.trim())}`,
            { signal: controller.signal },
          );

          if (!res.ok) {
            setResults([]);
            setIsLoading(false);
            return;
          }

          const data = await res.json();

          if (!controller.signal.aborted) {
            setResults(Array.isArray(data) ? data : []);
            setIsLoading(false);
          }
        } catch {
          if (!controller.signal.aborted) {
            setResults([]);
            setIsLoading(false);
          }
        }
      }, 400),
    [],
  );

  useEffect(() => {
    if (!query.trim()) {
      debouncedFetch.cancel();
      if (abortRef.current) abortRef.current.abort();
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debouncedFetch(query);

    return () => {
      debouncedFetch.cancel();
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query, debouncedFetch]);

  return { results, isLoading };
}
