"use client";

import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Menu, X, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RedenvLabsLogo } from "@/components/icons/RedenvLabsLogo";
import { Github } from "@/components/icons/Github";
import { REDENV_GITHUB_URL } from "@/consts";
import { cn } from "@/lib/utils";

interface DocsHeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const navItems = [
  { label: "Docs", href: "/docs", active: true },
  { label: "API Reference", href: "/docs/api", disabled: true },
  { label: "Examples", href: "/docs/examples", disabled: true },
];

export function DocsHeader({ onMobileMenuToggle, isMobileMenuOpen }: DocsHeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <RedenvLabsLogo size={20} className="text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">redenv</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-muted-foreground text-sm">docs</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    item.disabled
                      ? "text-muted-foreground/30 cursor-not-allowed"
                      : pathname.startsWith(item.href) && item.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.label}
                  {item.disabled && (
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground/50">
                      Soon
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Version badge */}
            <div className="hidden sm:flex items-center">
              <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-secondary/50 border border-border/50 text-muted-foreground">
                v1.0.0-beta
              </span>
            </div>

            {/* GitHub */}
            <Link
              href={REDENV_GITHUB_URL}
              target="_blank"
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Github size={18} />
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink size={12} className="opacity-50" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
