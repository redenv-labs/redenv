import {
  Github,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ChevronLeft,
} from "lucide-react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

interface SidebarExpandedProps {
  navItems: any[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  toggleSidebar: () => void;
  isConnected: boolean;
  theme: string;
  toggleTheme: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
  sidebarWidth: number;
  startResizing: () => void;
  isSessionExpired: boolean;
}

export function SidebarExpanded({
  navItems,
  activeTab,
  setActiveTab,
  toggleSidebar,
  isConnected,
  theme,
  toggleTheme,
  sidebarRef,
  sidebarWidth,
  startResizing,
  isSessionExpired,
}: SidebarExpandedProps) {
  return (
    <div
      ref={sidebarRef}
      className="relative flex flex-col h-[calc(100vh-3.5rem)] bg-background border-r border-border"
      style={{ width: sidebarWidth }}
    >
      <div className="p-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Explorer
        </span>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={toggleSidebar}
          className="h-6 w-6 min-w-6 rounded-md"
        >
          <ChevronLeft size={14} />
        </Button>
      </div>

      <div className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <Button
              key={item.id}
              onPress={() => setActiveTab(item.id)}
              className={`
                justify-start px-3 py-2 text-sm font-medium transition-colors w-full
                ${
                  isActive
                    ? "bg-brand/10! text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
              variant="light"
              radius="sm"
            >
              <Icon size={16} />
              {item.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-border bg-muted/10 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isSessionExpired
                  ? "bg-warning animate-pulse"
                  : isConnected
                  ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "bg-destructive/50"
              }`}
            />
            <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]">
              {isSessionExpired
                ? "Session Expired"
                : isConnected
                ? "Connected"
                : "Disconnected"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              as="a"
              href="https://github.com/PRASSamin/redenv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground w-7 h-7 min-w-7"
            >
              <Github size={16} />
            </Button>
            <Dropdown placement="top-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-muted-foreground hover:text-foreground w-7 h-7 min-w-7"
                >
                  <Settings size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Settings Actions">
                <DropdownItem
                  key="theme"
                  startContent={
                    theme === "light" ? <Moon size={16} /> : <Sun size={16} />
                  }
                  onPress={toggleTheme}
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<Settings size={16} />}
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="help"
                  startContent={<HelpCircle size={16} />}
                >
                  Help & Documentation
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Resizer Handle */}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/25 transition-all duration-100 z-10"
        onMouseDown={startResizing}
      />
    </div>
  );
}
