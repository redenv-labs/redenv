import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

interface FloatingSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isVisible: boolean;
}

export function FloatingSearch({
  searchQuery,
  onSearchChange,
  isVisible,
}: FloatingSearchProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-96 max-w-[90%]">
      <div className="relative group">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-default-200 transition-all group-focus-within:border-primary/50 group-focus-within:ring-2 group-focus-within:ring-primary/20" />
        <div className="relative flex items-center px-4 h-12 gap-3">
          <Search size={18} className="text-muted-foreground" />
          <input
            ref={searchInputRef}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            placeholder="Search secrets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-default-200 bg-default-100 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
