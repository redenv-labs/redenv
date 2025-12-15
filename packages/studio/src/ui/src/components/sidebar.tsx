import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Terminal, FileCode } from "lucide-react";
import { useStudioStore } from "../store/useStudioStore";
import { useTheme } from "../hooks/useTheme";
import { useSidebarConnection } from "../hooks/useSidebarConnection";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { useIsMobile } from "../hooks/useIsMobile";
import { SidebarCollapsed } from "./sidebar/SidebarCollapsed";
import { SidebarExpanded } from "./sidebar/SidebarExpanded";

const NAV_ITEMS = [
  { id: "data", label: "Data Browser", icon: Database },
  { id: "schema", label: "Schema", icon: FileCode },
  { id: "query", label: "Query Console", icon: Terminal },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const {
    activeTab,
    setActiveTab,
    isSidebarOpen,
    toggleSidebar,
    projectInfo,
    isConnected,
    isSessionExpired,
  } = useStudioStore();

  // Custom hooks
  useSidebarConnection(); // Manages WS connection
  const { sidebarRef, startResizing, sidebarWidth } = useSidebarResize();
  const isMobile = useIsMobile();

  // Force collapse on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      toggleSidebar();
    }
  }, [isMobile, isSidebarOpen, toggleSidebar]);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen && !isMobile ? sidebarWidth : 56,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full border-r border-default-200 flex flex-col relative overflow-hidden z-50"
      ref={sidebarRef as React.RefObject<HTMLDivElement>}
    >
      <AnimatePresence mode="wait">
        {!isSidebarOpen || isMobile ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <SidebarCollapsed
              navItems={NAV_ITEMS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              toggleSidebar={toggleSidebar}
              isConnected={isConnected}
              projectInfo={projectInfo}
              theme={theme}
              toggleTheme={toggleTheme}
              isMobile={isMobile}
            />
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <SidebarExpanded
              navItems={NAV_ITEMS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              toggleSidebar={toggleSidebar}
              isConnected={isConnected}
              theme={theme}
              toggleTheme={toggleTheme}
              sidebarRef={sidebarRef as React.RefObject<HTMLDivElement>}
              sidebarWidth={sidebarWidth}
              startResizing={startResizing}
              isSessionExpired={isSessionExpired}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
