"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useMotionValue, useInView, animate } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PluginsHero } from "@/components/plugins/PluginsHero";
import { FeaturedPlugin } from "@/components/plugins/FeaturedPlugin";
import { CategoryFilter } from "@/components/plugins/CategoryFilter";
import { PluginGrid } from "@/components/plugins/PluginGrid";
import { Footer } from "@/components/Footer";
import type { Plugin } from "@/types/plugins";

export function PluginsView({ plugins }: { plugins: Plugin[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialQuery = searchParams.get("q") || "";

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  // sync url
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);

  function handleMouseMove({ clientX, clientY }: MouseEvent) {
    mouseX.set(clientX);
    mouseY.set(clientY);
  }

  function handleMouseEnter() {
    animate(spotlightOpacity, 1, { duration: 0.3 });
  }

  function handleMouseLeave() {
    animate(spotlightOpacity, 0, { duration: 0.3 });
  }

  const featuredPlugin = plugins.find((p) => p.featured);

  return (
    <main className="relative min-h-screen">
      <PluginsHero
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <section
        ref={sectionRef}
        className="relative py-8 px-6 max-w-7xl mx-auto"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {featuredPlugin && !searchQuery && (
          <FeaturedPlugin
            plugin={featuredPlugin}
            mouseX={mouseX}
            mouseY={mouseY}
            spotlightOpacity={spotlightOpacity}
            isInView={isInView}
          />
        )}

        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          plugins={plugins}
        />

        <PluginGrid
          plugins={plugins}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          mouseX={mouseX}
          mouseY={mouseY}
          spotlightOpacity={spotlightOpacity}
          isInView={isInView}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </section>

      <div className="mt-20">
        <Footer />
      </div>
    </main>
  );
}
