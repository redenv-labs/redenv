"use client";

import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RedenvLabsLogo } from "@/components/icons/RedenvLabsLogo";
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

export function DocsHeader({
  onMobileMenuToggle,
  isMobileMenuOpen,
}: DocsHeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm",
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Brand */}
          <div className="flex items-center justify-between w-full gap-6">
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

            {/* Right: Actions */}
            <div className="flex items-center justify-end w-full gap-3">
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
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
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
      </div>
    </header>
  );
}
