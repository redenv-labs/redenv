"use client";

import { GridBeams } from "@/components/GridBeams";
import HeroSection from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-foreground selection:bg-primary/30 flex flex-col overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,51,51,0.15),transparent)]" />
        <GridBeams gridSize={100} beamCount={100} />
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-15" />
      </div>

      <HeroSection />
    </main>
  );
}
