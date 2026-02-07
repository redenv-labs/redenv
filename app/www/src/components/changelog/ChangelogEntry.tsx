"use client";

import { motion } from "framer-motion";
import type { ChangelogEntry as ChangelogEntryType } from "@/lib/changelog";
import { PackageBadge } from "./PackageBadge";
import { ChangeTypeBadge } from "./ChangeTypeBadge";
import { MarkdownText } from "./MarkdownText";

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
  index: number;
}

export function ChangelogEntry({ entry, index }: ChangelogEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative"
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/6 shadow-lg shadow-black/20">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <PackageBadge
              package={entry.package}
              displayName={entry.packageDisplayName}
              version={entry.version}
            />
          </div>

          {/* Changes */}
          <div className="space-y-5">
            {entry.changes.map((changeGroup, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                <ChangeTypeBadge type={changeGroup.type} />
                <ul className="space-y-2.5 pl-1">
                  {changeGroup.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-3 text-sm text-white/80 leading-relaxed"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" />
                      <MarkdownText>{item}</MarkdownText>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
