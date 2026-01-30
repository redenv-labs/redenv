"use client";

import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RedenvLabsLogo } from "@/components/icons/RedenvLabsLogo";
import { cn } from "@/lib/utils";
import { REDENV_LABS_URL } from "@/consts";
import { useMobileMenu } from "@/components/MobileMenuContext";
import { useSearch } from "@/components/search/SearchProvider";

const navItems: { label: string; href: string; active: boolean; disabled?: boolean }[] = [
  { label: "Docs", href: "/docs", active: true },
  { label: "Plugins", href: "/plugins", active: true },
];

export function AppNavbar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useMobileMenu();
  const { open: openSearch } = useSearch();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b border-border/30 bg-background/30 backdrop-blur-xl shadow-sm",
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center justify-between w-full gap-6">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <Link href={REDENV_LABS_URL}>
                  <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <RedenvLabsLogo size={20} className="text-primary" />
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/">
                  <span className="font-bold text-foreground">redenv</span>
                </Link>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-muted-foreground text-sm">
                  {
                    navItems.find((item) => pathname.startsWith(item.href))
                      ?.label
                  }
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end w-full gap-3">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname.startsWith(item.href) && item.active;
                  return (
                    <Link
                      key={item.href}
                      href={item?.disabled ? "#" : item.href}
                      className={cn(
                        "relative flex items-center gap-2 px-3 py-1.5 text-sm transition-all duration-300",
                        item?.disabled
                          ? "text-muted-foreground/30 cursor-not-allowed"
                          : isActive
                            ? "text-foreground font-medium"
                            : "text-muted-foreground/60 hover:text-muted-foreground",
                      )}
                    >
                      <span>{item.label}</span>
                      {item?.disabled && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground/50 border border-border/50">
                          Soon
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
              {/* Search trigger */}
              <button
                onClick={openSearch}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/3 border border-white/8 text-xs text-white/30 hover:text-white/50 hover:border-white/15 transition-all"
              >
                <Search size={13} />
                <span>Search</span>
                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">
                  ⌘K
                </kbd>
              </button>
              {/* Mobile search button */}
              <button
                onClick={openSearch}
                className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              {/* Mobile menu button */}
              <button
                onClick={toggle}
                className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
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
