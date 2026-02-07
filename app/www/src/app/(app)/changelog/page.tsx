import { getChangelog, groupChangelogByDate } from "@/lib/changelog";
import { ChangelogHero, ChangelogTimeline } from "@/components/changelog";
import { AnimatedBlobs } from "@/components/changelog/AnimatedBlobs";
import { metatag } from "@/lib/metatag";
import { Footer } from "@/components/Footer";

export const generateMetadata = () => {
  return metatag({
    title: "Changelog - Redenv",
    description:
      "Stay up to date with the latest updates, improvements, and fixes across the Redenv ecosystem. Track changes to CLI, Core, and SDK packages.",
  });
};

export default async function ChangelogPage() {
  const entries = await getChangelog();
  const groups = groupChangelogByDate(entries);

  const latestDate = groups[0]?.displayDate ?? "N/A";
  const totalUpdates = entries.length;

  return (
    <main className="relative min-h-screen">
      {/* Animated Background */}
      <AnimatedBlobs />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24">
        <ChangelogHero totalUpdates={totalUpdates} latestDate={latestDate} />
        <ChangelogTimeline groups={groups} />
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </main>
  );
}
