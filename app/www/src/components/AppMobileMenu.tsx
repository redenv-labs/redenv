"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Link } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useMobileMenu } from "@/components/MobileMenuContext";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { source } from "@/lib/source";
import { useEffect } from "react";
import { BookOpen, Puzzle, ChevronRight } from "lucide-react";

const navItems = [
  { label: "Docs", href: "/docs", icon: BookOpen, description: "Guides, API reference & examples" },
  { label: "Plugins", href: "/plugins", icon: Puzzle, description: "Extend Redenv with integrations" },
];

export function AppMobileMenu() {
  const { isOpen, close } = useMobileMenu();
  const pathname = usePathname();
  const isDocsPage = pathname.startsWith("/docs");
  const tree = source.getPageTree();

  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/30 backdrop-blur-sm md:hidden"
            onClick={close}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-16 left-0 bottom-0 z-50 bg-background/50 backdrop-blur-sm border-r border-border/30 md:hidden overflow-hidden"
          >
            {isDocsPage ? (
              <>
                {/* horizontal tab-style nav */}
                <div className="px-3 pt-3 pb-2 border-b border-border/20">
                  <div className="flex items-center gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onPress={close}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                          pathname.startsWith(item.href)
                            ? "text-foreground bg-white/5"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <DocsSidebar tree={tree} />
              </>
            ) : (
              /* Non-docs: rich list nav */
              <div className="p-4 space-y-2">
                <p className="px-2 text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-3">
                  Navigate
                </p>
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onPress={close}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm transition-all group",
                        isActive
                          ? "bg-white/5 border border-white/8"
                          : "hover:bg-white/3",
                      )}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          isActive
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-white/5 border border-white/8 group-hover:border-white/12",
                        )}
                      >
                        <item.icon
                          size={16}
                          className={cn(
                            "transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-white/30 group-hover:text-white/50",
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={cn(
                            "block font-medium",
                            isActive ? "text-foreground" : "text-white/60 group-hover:text-white/80",
                          )}
                        >
                          {item.label}
                        </span>
                        <span className="block text-[11px] text-white/25 mt-0.5">
                          {item.description}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={cn(
                          "shrink-0 transition-all",
                          isActive
                            ? "text-primary/50"
                            : "text-white/15 group-hover:text-white/30 group-hover:translate-x-0.5",
                        )}
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
