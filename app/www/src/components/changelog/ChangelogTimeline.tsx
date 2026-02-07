"use client";

import { motion } from "framer-motion";
import type { GroupedChangelog } from "@/lib/changelog";
import { ChangelogEntry } from "./ChangelogEntry";
import { Calendar } from "lucide-react";

interface ChangelogTimelineProps {
  groups: GroupedChangelog[];
}

export function ChangelogTimeline({ groups }: ChangelogTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-primary/30 via-white/10 to-transparent hidden lg:block" />

      {/* Date groups */}
      <div className="space-y-16">
        {groups.map((group, groupIndex) => (
          <div key={group.date} className="relative">
            {/* Date section with sticky behavior */}
            <div className="lg:grid lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr] lg:gap-8 xl:gap-12">
              {/* Sticky date column */}
              <div className="relative mb-6 lg:mb-0">
                <div className="lg:sticky lg:top-24">
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="absolute -left-1.25 top-1 w-2.75 h-2.75 rounded-full border-2 border-primary/40 bg-neutral-950 hidden lg:block"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute -left-0.75 top-0.75 w-1.75 h-1.75 rounded-full bg-primary shadow-lg shadow-primary/50 hidden lg:block"
                  />

                  {/* Date display */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="lg:pl-6"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/1 lg:bg-transparent lg:border-0 lg:px-0 lg:py-0 shadow-lg shadow-black/20 lg:shadow-none">
                      <Calendar className="w-4 h-4 text-primary lg:hidden" />
                      <time
                        dateTime={group.date}
                        className="text-sm font-semibold text-white/90 lg:text-base lg:font-medium"
                      >
                        {group.displayDate}
                      </time>
                    </div>

                    {/* Entry count badge - desktop only */}
                    <div className="hidden lg:block mt-2">
                      <span className="text-xs text-white/40 font-medium">
                        {group.entries.length} update{group.entries.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Entries column */}
              <div className="space-y-4">
                {group.entries.map((entry, entryIndex) => (
                  <ChangelogEntry
                    key={`${entry.package}-${entry.version}`}
                    entry={entry}
                    index={entryIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* End of timeline marker */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative mt-16 lg:pl-50 xl:pl-60 lg:ml-8 xl:ml-12"
      >
        <div className="absolute -left-0.75 top-0 w-1.75 h-1.75 rounded-full bg-primary/40 hidden lg:block" />
        <div className="flex items-center gap-4 text-sm text-white/40">
          <div className="h-px flex-1 bg-linear-to-r from-primary/20 to-transparent" />
          <span className="px-4 py-1.5 rounded-full bg-white/3 border border-white/6">The beginning</span>
          <div className="h-px flex-1 bg-linear-to-l from-primary/20 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
