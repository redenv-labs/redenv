"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button, Link } from "@heroui/react";
import { ArrowRight, Copy, Check, Github } from "lucide-react";

export function CTAFooter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("bun add -g @redenv/cli");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(255,51,51,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_80%,rgba(59,130,246,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_90%,rgba(16,185,129,0.08),transparent)]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-white/60">
              Open Source & Free Forever
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to secure
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-400">
              your secrets?
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
            Get started in under 60 seconds.
            <br className="hidden md:block" />
            Just you, your terminal, and zero-knowledge encryption.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              as={Link}
              href="/docs"
              size="lg"
              className="font-semibold px-8 h-14 bg-white text-neutral-950 hover:bg-white/90 rounded-full text-base shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] transition-all duration-300 group"
              endContent={
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                />
              }
            >
              Read the Docs
            </Button>

            <Button
              as={Link}
              href="https://github.com/redenv-labs/redenv"
              target="_blank"
              size="lg"
              className="font-semibold px-8 h-14 bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-full text-base transition-all duration-300"
              startContent={<Github size={18} />}
            >
              View on GitHub
            </Button>
          </div>

          {/* Install Command */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center"
          >
            <div className="group relative flex items-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-neutral-900/80 backdrop-blur-sm rounded-full border border-white/10 pl-6 pr-2 h-12 gap-4">
                <code className="font-mono text-sm text-white/60">
                  <span className="select-none text-white/30">$ </span>
                  bun add -g @redenv/cli
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 bg-transparent hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                  aria-label="Copy command"
                >
                  {copied ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & copyright */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">R</span>
              </div>
              <span className="text-white/40 text-sm">
                Redenv &copy; {new Date().getFullYear()}
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/docs"
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="https://github.com/redenv-labs/redenv"
                target="_blank"
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="https://www.npmjs.com/package/@redenv/cli"
                target="_blank"
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                npm
              </Link>
            </div>

            {/* Built with */}
            <div className="flex items-center gap-2 text-sm text-white/30">
              <span>Powered by</span>
              <Link
                href="https://upstash.com"
                target="_blank"
                className="text-emerald-400/70 hover:text-emerald-400 transition-colors font-medium"
              >
                Upstash
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
