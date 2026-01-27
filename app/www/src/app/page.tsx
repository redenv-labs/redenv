import HeroSection from "@/components/home/Hero";
import { FeatureGrid } from "@/components/home/FeatureGrid";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-foreground selection:bg-primary/30 flex flex-col overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-neutral-950" />
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-15" />
      </div>

      <HeroSection />
      <FeatureGrid />
    </main>
  );
}
