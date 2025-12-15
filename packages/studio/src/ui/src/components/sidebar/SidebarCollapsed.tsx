import {
  Github,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
} from "@heroui/react";
import { useStudioStore } from "../../store/useStudioStore";

interface SidebarCollapsedProps {
  navItems: any[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  toggleSidebar: () => void;
  isConnected: boolean;
  projectInfo: { name: string; version: string } | null;
  theme: string;
  toggleTheme: () => void;
  isMobile: boolean;
}

export function SidebarCollapsed({
  navItems,
  activeTab,
  setActiveTab,
  toggleSidebar,
  isConnected,
  projectInfo,
  theme,
  toggleTheme,
  isMobile,
}: SidebarCollapsedProps) {
  const { isSessionExpired } = useStudioStore();
  return (
    <div className="flex flex-col items-center py-2 gap-3 h-full justify-between">
      <div className="flex flex-col gap-3 items-center">
        {!isMobile && (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="rounded-md"
            onPress={toggleSidebar}
          >
            <ChevronRight size={18} />
          </Button>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              isIconOnly
              variant={"light"}
              className={`
                  transition-colors rounded-md
                  ${
                    isActive
                      ? "bg-brand/10! text-brand"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              size="sm"
              onPress={() => setActiveTab(item.id)}
              title={item.label}
            >
              <Icon size={18} />
            </Button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="w-8 h-px bg-border mb-1" />

        {/* Connection Status Indicator (Collapsed) */}
        <div
          className={cn(
            `w-2 h-2 rounded-full mb-1`,
            isSessionExpired
              ? "bg-warning animate-pulse"
              : isConnected
              ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              : "bg-destructive/50"
          )}
          title={
            isConnected
              ? `Connected: ${projectInfo?.name || "Unknown"}`
              : "Disconnected"
          }
        />

        <Button
          isIconOnly
          variant="light"
          size="sm"
          as="a"
          href="https://github.com/PRASSamin/redenv"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          className="text-muted-foreground hover:text-foreground"
        >
          <Github size={18} />
        </Button>
        <Dropdown placement="right-end">
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              title="Settings"
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings size={18} />
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
            <DropdownItem key="settings" startContent={<Settings size={16} />}>
              Settings
            </DropdownItem>
            <DropdownItem key="help" startContent={<HelpCircle size={16} />}>
              Help & Documentation
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
