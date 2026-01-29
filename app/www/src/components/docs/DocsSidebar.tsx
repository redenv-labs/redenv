"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import type { PageTree } from "fumadocs-core/server";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  tree: PageTree.Root;
}

interface SidebarItemProps {
  item: PageTree.Node;
  level?: number;
}

function SidebarFolder({
  item,
  level = 0,
}: {
  item: PageTree.Folder;
  level?: number;
}) {
  const pathname = usePathname();
  const isActive = useMemo(() => {
    const checkActive = (nodes: PageTree.Node[]): boolean => {
      return nodes.some((node) => {
        if (node.type === "page" && node.url === pathname) return true;
        if (node.type === "folder") return checkActive(node.children);
        return false;
      });
    };
    return checkActive(item.children);
  }, [item.children, pathname]);

  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group w-full flex items-center gap-2 py-1.5 text-sm transition-colors duration-150",
          "hover:text-foreground",
          isActive ? "text-foreground font-medium" : "text-muted-foreground/70",
        )}
        style={{ paddingLeft: `${level * 12}px` }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="shrink-0"
        >
          <ChevronRight
            size={12}
            className={cn(
              "transition-colors",
              isActive ? "text-foreground/50" : "text-muted-foreground/40",
            )}
          />
        </motion.div>
        <span className="truncate">{item.name}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="relative ml-1.75 border-l border-border/40">
              {item.children.map((child, index) => (
                <SidebarItem key={index} item={child} level={level + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarPage({
  item,
  level = 0,
}: {
  item: PageTree.Item;
  level?: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.url;

  return (
    <Link
      href={item.url}
      className={cn(
        "relative group flex items-center py-1.5 text-sm transition-colors duration-150 rounded-md",
        isActive
          ? "bg-primary/10 text-primary font-medium border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
      )}
      style={{ paddingLeft: `${level * 12 + 6}px` }}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 w-0.5 h-5 bg-primary rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative truncate">{item.name}</span>
    </Link>
  );
}

function SidebarItem({ item, level = 0 }: SidebarItemProps) {
  if (item.type === "folder") {
    return <SidebarFolder item={item} level={level} />;
  }
  if (item.type === "page") {
    return <SidebarPage item={item} level={level} />;
  }
  if (item.type === "separator") {
    return (
      <div
        className={cn(
          "px-0",
          level === 0 ? "mt-6 mb-2 first:mt-0" : "mt-4 mb-1",
        )}
      >
        {item.name && (
          <span className="block text-xs font-semibold text-foreground/40 uppercase tracking-wider">
            {item.name}
          </span>
        )}
      </div>
    );
  }
  return null;
}

export function DocsSidebar({ tree }: DocsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tree based on search
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return tree;

    const filterNodes = (nodes: PageTree.Node[]): PageTree.Node[] => {
      return nodes
        .map((node) => {
          if (node.type === "page") {
            const matches = node.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
            return matches ? node : null;
          }
          if (node.type === "folder") {
            const filteredChildren = filterNodes(node.children);
            if (filteredChildren.length > 0) {
              return { ...node, children: filteredChildren };
            }
            return null;
          }
          return node;
        })
        .filter(Boolean) as PageTree.Node[];
    };

    return { ...tree, children: filterNodes(tree.children) };
  }, [tree, searchQuery]);

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col">
      {/* Search */}
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-8 pr-3 py-1.5 rounded-md text-sm",
              "bg-secondary/20 border border-border/30",
              "placeholder:text-muted-foreground/35",
              "focus:outline-none focus:border-primary/30 focus:bg-secondary/40",
              "transition-all duration-150",
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/40 hover:text-muted-foreground px-1 py-0.5 rounded bg-secondary/40"
            >
              ESC
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-thin">
        {filteredTree.children.map((item, index) => (
          <SidebarItem key={index} item={item} />
        ))}

        {searchQuery && filteredTree.children.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/40 text-sm">
            No results found
          </div>
        )}
      </nav>
    </aside>
  );
}
