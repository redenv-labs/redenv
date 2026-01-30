import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import { getPlugins } from "@/lib/plugins";
import { NextRequest, NextResponse } from "next/server";

const searchAPI = createFromSource(source, { language: "english" });

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function matchScore(word: string, queryToken: string): number {
  if (!word || !queryToken) return 0;

  // exact match
  if (word === queryToken) return 1;

  // word starts with query
  if (word.startsWith(queryToken)) {
    // penalize if query is very short compared to word
    const ratio = queryToken.length / word.length;
    return ratio >= 0.5 ? 0.9 : ratio >= 0.3 ? 0.7 : 0.5;
  }

  // query starts with word
  if (queryToken.startsWith(word) && word.length >= 3) {
    return 0.6;
  }

  // only for longer queries to avoid false positives
  if (queryToken.length >= 3 && word.includes(queryToken)) {
    return 0.4;
  }

  return 0;
}

function relevanceScore(text: string, query: string): number {
  if (!text || !query) return 0;

  const textTokens = normalize(text);
  const queryTokens = normalize(query);

  if (!textTokens.length || !queryTokens.length) return 0;

  let matchedTokens = 0;
  let totalScore = 0;

  for (const q of queryTokens) {
    // skip very short query tokens
    if (q.length < 2) continue;

    let bestMatch = 0;
    for (const t of textTokens) {
      bestMatch = Math.max(bestMatch, matchScore(t, q));
    }

    if (bestMatch > 0) {
      matchedTokens++;
      totalScore += bestMatch;
    }
  }

  // no meaningful matches
  if (matchedTokens === 0) return 0;

  // score based on match quality and coverage
  const coverage = matchedTokens / queryTokens.length;
  const avgQuality = totalScore / matchedTokens;

  return avgQuality * coverage * 100;
}

export type SearchResultType = "page" | "heading" | "text" | "plugin";

export interface HighlightSegment {
  content: string;
  highlight?: boolean;
}

export interface UnifiedResult {
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

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim();

  // minimum 2 chars
  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const [docsResponse, plugins] = await Promise.all([
    searchAPI.GET(request),
    getPlugins(),
  ]);

  const results: UnifiedResult[] = [];

  if (docsResponse.ok) {
    const docsData = await docsResponse.json();
    const docs: any[] = Array.isArray(docsData) ? docsData : [];

    // trust fumadocs results, bcz it already filters and ranks
    docs.forEach((item, index) => {
      const title = item.title || item.content || "Untitled";

      const type: SearchResultType =
        item.type === "text"
          ? item.url.includes("#")
            ? "heading"
            : item.type
          : item.type;

      // position bonus (fumadocs orders by relevance, so earlier is better)
      const positionBonus = Math.max(0, 50 - index * 3);

      // type bonus
      const typeBonus = type === "page" ? 20 : type === "heading" ? 10 : 0;

      const score = positionBonus + typeBonus;

      // Map contentWithHighlights to highlight segments
      const highlights: HighlightSegment[] | undefined =
        item.contentWithHighlights?.map((seg: any) => ({
          content: seg.content,
          highlight: !!seg.styles?.highlight,
        }));

      results.push({
        id: item.id || item.url,
        url: item.url,
        title,
        type,
        score,
        breadcrumbs: item.breadcrumbs,
        highlights,
      });
    });
  }

  for (const plugin of plugins) {
    const nameScore = relevanceScore(plugin.name, query);
    const descScore = relevanceScore(plugin.description ?? "", query) * 0.5;
    const categoryScore = relevanceScore(plugin.category ?? "", query) * 0.6;

    // must have strong match, at least 50% of name should match
    const primaryScore = Math.max(nameScore, descScore, categoryScore);

    // high threshold so partial matches don't appear
    if (primaryScore < 50) continue;

    const officialBonus = plugin.official ? 10 : 0;
    const finalScore = primaryScore + officialBonus;

    results.push({
      id: `plugin:${plugin.id}`,
      url: `/plugins?q=${plugin.id}`,
      title: plugin.name,
      type: "plugin",
      score: finalScore,
      description: plugin.description,
      official: plugin.official,
    });
  }

  results.sort((a, b) => b.score - a.score);

  return NextResponse.json(results.slice(0, 20));
}
