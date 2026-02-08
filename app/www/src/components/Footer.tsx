"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "@/components/Link";
import { ExternalLink, Terminal, Shield, Sparkles } from "lucide-react";
import { Github } from "./icons/Github";
import { RedenvLabsLogo } from "./icons/RedenvLabsLogo";
import { Upstash } from "./icons/Upstash";
import { Npm } from "./icons/Npm";
import { PyPI } from "./icons/PyPI";
import {
  REDENV_GITHUB_URL,
  REDENV_PYPI_URL,
  REDENV_JS_CLIENT_URL,
  REDENV_LABS_URL,
  PAGES,
} from "@/consts";

const footerLinks = {
  resources: PAGES.filter((page) => page.category === "resources"),
  social: [
    { label: "GitHub", href: REDENV_GITHUB_URL, external: true },
  ],
};

const stats = [
  { icon: Shield, label: "Zero-Knowledge", value: "E2E Encrypted" },
  { icon: Terminal, label: "CLI First", value: "Developer Friendly" },
  { icon: Sparkles, label: "Open Source", value: "MIT License" },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });

  return (
    <footer ref={footerRef} className="relative overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Diagonal gradient lines */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 80px,
              rgba(255,255,255,0.5) 80px,
              rgba(255,255,255,0.5) 81px
            )`,
          }}
        />
        {/* Top gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-[radial-gradient(ellipse_at_center,rgba(255,51,51,0.08),transparent_70%)]" />
        {/* Corner accents */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05),transparent_70%)]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Top border with gradient */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Stats banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="py-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-white/5 not-md:hidden"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center gap-4 px-6 group"
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-3 rounded-xl bg-white/2 border border-white/5 group-hover:border-white/10 transition-colors">
                  <stat.icon
                    size={20}
                    className="text-white/40 group-hover:text-primary/80 transition-colors"
                  />
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-white/30 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-sm font-semibold text-white/70 mt-0.5">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-white/5 to-transparent" />

        {/* Links section */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
            {/* Brand column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-2 md:col-span-5"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                    <RedenvLabsLogo size={28} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white tracking-tight">
                    redenv
                  </h3>
                  <p className="text-xs text-muted-foreground! mt-0.5">
                    by{" "}
                    <Link
                      href={REDENV_LABS_URL}
                      target="_blank"
                      className="hover:underline text-muted-foreground!"
                    >
                      Redenv Labs
                    </Link>
                  </p>
                </div>
              </div>

              <p className="text-sm text-white/40 leading-relaxed max-w-sm mb-8">
                Zero-knowledge secret management for modern teams. Your secrets
                stay encrypted, always. We never see your data.
              </p>

              {/* Distribution badges */}
              <div className="flex items-center gap-3">
                {[
                  {
                    name: "npm",
                    icon: Npm,
                    url: REDENV_JS_CLIENT_URL,
                  },
                  {
                    name: "PyPI",
                    icon: PyPI,
                    url: REDENV_PYPI_URL,
                  },
                  {
                    name: "GitHub",
                    icon: Github,
                    url: REDENV_GITHUB_URL,
                  },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/60 hover:border-border hover:bg-secondary/60 transition-all"
                  >
                    <item.icon
                      size={16}
                      className="text-foreground/70 group-hover:text-foreground transition-colors"
                    />
                    <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-1" />

            {/* Links columns */}
            {Object.entries(footerLinks).map(
              ([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + categoryIndex * 0.1,
                  }}
                  className="col-span-1 md:col-span-3"
                >
                  <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-4">
                    {category}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        {(link as any)?.disabled ? (
                          <span className="text-sm text-white/20 cursor-not-allowed flex items-center gap-1">
                            {link.label}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground/70">
                              Soon
                            </span>
                          </span>
                        ) : (
                          <Link
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            className="group text-sm text-muted-foreground/75 hover:text-muted-foreground transition-colors inline-flex items-center gap-1.5"
                          >
                            <span className="relative">
                              {link.label}
                              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-muted-foreground/75 group-hover:w-full transition-all duration-300" />
                            </span>
                            {link.external && (
                              <ExternalLink
                                size={10}
                                className="opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all"
                              />
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ),
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-secondary to-transparent" />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Copyright */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
            <span>&copy; {new Date().getFullYear()} <a className="hover:underline text-foreground/70" href={REDENV_LABS_URL} target="_blank" rel="noopener noreferrer">Redenv Labs</a></span>
            <span className="hidden sm:inline text-muted-foreground/50">•</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>

          {/* Powered by */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground/70">Powered by</span>
            <Link
              href="https://upstash.com"
              target="_blank"
              className="group flex items-center gap-2"
            >
              <Upstash
                width={60}
                className="text-emerald-500/80 group-hover:text-emerald-400 transition-colors"
              />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
    </footer>
  );
}
