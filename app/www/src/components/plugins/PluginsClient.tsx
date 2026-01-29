"use client";

import { useRef, useState, type MouseEvent } from "react";
import { useMotionValue, useInView, animate } from "framer-motion";
import { PluginsHero } from "./PluginsHero";
import { FeaturedPlugin } from "./FeaturedPlugin";
import { CategoryFilter } from "./CategoryFilter";
import { PluginGrid } from "./PluginGrid";
import { Footer } from "@/components/Footer";
import type { Plugin } from "@/data/plugins";

export function PluginsClient({ plugins }: { plugins: Plugin[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

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
  const regularPlugins = plugins.filter((p) => !p.featured);

  return (
    <main className="relative min-h-screen">
      <PluginsHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <section
        ref={sectionRef}
        className="relative py-8 px-6 max-w-7xl mx-auto"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {featuredPlugin && !searchQuery && activeCategory === "all" && (
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
          plugins={regularPlugins}
        />

        <PluginGrid
          plugins={regularPlugins}
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
