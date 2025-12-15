import { Database, Lock } from "lucide-react";
import { Button } from "@heroui/react";
import { useStudioStore } from "../store/useStudioStore";
import { useState } from "react";

export default function NavigationBar() {
  const { isSessionExpired, sendWebSocketMessage } = useStudioStore();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = () => {
    setIsRestoring(true);
    try {
      sendWebSocketMessage({ type: "RELOAD_SESSION" });
      setTimeout(() => setIsRestoring(false), 5000);
    } catch (error) {
      console.error("Failed to restore session", error);
      setIsRestoring(false);
    }
  };
  return (
    <nav className="sticky top-0 z-50 w-full h-14 border-b border-border bg-background/60 backdrop-blur-xl flex items-center justify-between px-4 transition-all duration-200">
      {/* Left: Brand */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 text-brand shadow-sm">
          <Database size={18} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">
          Redenv{" "}
          <span className="text-muted-foreground font-medium">Studio</span>
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        {isSessionExpired && (
          <Button
            size="sm"
            color="danger"
            variant="flat"
            startContent={!isRestoring && <Lock size={14} />}
            onPress={handleRestore}
            isLoading={isRestoring}
            className="font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            Restore Session
          </Button>
        )}
      </div>
    </nav>
  );
}
