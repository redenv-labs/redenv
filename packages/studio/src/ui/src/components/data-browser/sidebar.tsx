import { Database, Server, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useStudioStore } from "../../store/useStudioStore";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getBackendUrl } from "../../utils/url";
import { Button, useDisclosure, cn } from "@heroui/react";
import CreateEnvironmentModal from "./create-environment-modal";
import DeleteEnvironmentModal from "./delete-environment-modal";
import EnvironmentContextMenu from "./environment-context-menu";

interface SchemaData {
  projectName: string;
  meta: { key: string; data: any };
  environments: { name: string; key: string }[];
}

interface EnvironmentItemProps {
  env: { name: string; key: string };
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function EnvironmentItem({
  env,
  isSelected,
  onSelect,
  onDelete,
  isOpen,
  onOpenChange,
}: EnvironmentItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    onOpenChange(true);
  };

  const showDots = isHovered || isOpen;

  return (
    <>
      {/* Right-click Context Menu */}
      <EnvironmentContextMenu
        isOpen={isOpen && !!menuPosition}
        onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) setMenuPosition(null);
        }}
        onDelete={onDelete}
        position={menuPosition}
        envName={env.name}
      >
        <></>
      </EnvironmentContextMenu>

      <div
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
        className={cn(
          "group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer relative isolate",
          isSelected
            ? "text-brand font-medium"
            : "text-muted-foreground hover:bg-default-100 hover:text-foreground",
          isOpen && !isSelected && "bg-default-100 text-foreground"
        )}
      >
        {isSelected && (
          <motion.div
            layoutId="active-env-background"
            className="absolute inset-0 bg-brand/10 rounded-md -z-10"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}
        <Server size={16} />
        <span className="truncate flex-1 text-left">{env.name}</span>

        {/* Status Indicator / Actions */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          {/* 3-Dot Menu Trigger (Left Click) */}
          <EnvironmentContextMenu
            isOpen={isOpen && !menuPosition}
            onOpenChange={(open) => {
              onOpenChange(open);
              if (!open) setMenuPosition(null);
            }}
            onDelete={onDelete}
            envName={env.name}
          >
            <div
              className="w-5 h-5 relative cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Top Dot */}
              <motion.div
                initial={false}
                animate={
                  showDots
                    ? { y: -6, scale: 1, opacity: 1 }
                    : { y: 0, scale: 0, opacity: 0 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={cn(
                  "w-1 h-1 rounded-full absolute top-1/2 right-0 -translate-y-1/2",
                  isSelected ? "bg-brand" : "bg-muted-foreground"
                )}
              />
              {/* Middle Dot */}
              <motion.div
                layoutId={isSelected ? "active-env-indicator" : undefined}
                initial={false}
                animate={
                  isSelected
                    ? { scale: 1, opacity: 1 }
                    : showDots
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0, opacity: 0 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={cn(
                  "w-1 h-1 rounded-full absolute top-1/2 right-0 -translate-y-1/2",
                  isSelected ? "bg-brand" : "bg-muted-foreground"
                )}
              />
              {/* Bottom Dot */}
              <motion.div
                initial={false}
                animate={
                  showDots
                    ? { y: 6, scale: 1, opacity: 1 }
                    : { y: 0, scale: 0, opacity: 0 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={cn(
                  "w-1 h-1 rounded-full absolute top-1/2 right-0 -translate-y-1/2",
                  isSelected ? "bg-brand" : "bg-muted-foreground"
                )}
              />
            </div>
          </EnvironmentContextMenu>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const { selectedKey, setSelectedKey } = useStudioStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Delete Modal State
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [envToDelete, setEnvToDelete] = useState<{
    name: string;
    key: string;
  } | null>(null);

  const [sidebarWidth, setSidebarWidth] = useState(250);
  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  const resize = (e: MouseEvent) => {
    if (isResizing.current) {
      setSidebarWidth((prev) => {
        const newWidth = prev + e.movementX;
        if (newWidth < 200) return 200;
        if (newWidth > 500) return 500;
        return newWidth;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  const { data: schema } = useQuery<SchemaData>({
    queryKey: ["schema"],
    queryFn: async () => {
      const res = await axios.get(getBackendUrl("/api/schema"));
      if (!selectedKey && res.data.environments.length > 0) {
        setSelectedKey(res.data.environments[0].key);
      }
      return res.data;
    },
  });

  const deleteEnvMutation = useMutation({
    mutationFn: async (key: string) => {
      await axios.delete(getBackendUrl("/api/environments"), {
        data: { key },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schema"] });
      onDeleteClose();
      setEnvToDelete(null);
      // If deleted env was selected, select the first available one
      if (selectedKey === envToDelete?.key) {
        setSelectedKey(null); // Will be handled by the query success or effect
      }
    },
  });

  const handleDeleteClick = (env: { name: string; key: string }) => {
    setEnvToDelete(env);
    onDeleteOpen();
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (envToDelete) {
      deleteEnvMutation.mutate(envToDelete.key);
    }
  };

  return (
    <div
      className="border-r border-default-200 bg-content1/50 flex flex-col relative shrink-0"
      style={{ width: sidebarWidth }}
    >
      <div className="p-4 border-b border-default-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-muted-foreground" />
          <h2 className="font-semibold text-sm">Environments</h2>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onOpen}
          className="text-muted-foreground hover:text-foreground min-w-0 w-6 h-6"
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {schema?.environments.map((env) => (
          <EnvironmentItem
            key={env.key}
            env={env}
            isSelected={selectedKey === env.key}
            onSelect={() => setSelectedKey(env.key)}
            onDelete={() => handleDeleteClick(env)}
            isOpen={activeMenuId === env.key}
            onOpenChange={(isOpen) => setActiveMenuId(isOpen ? env.key : null)}
          />
        ))}
      </div>

      {/* Resizer Handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-brand/50 transition-colors z-20"
        onMouseDown={startResizing}
      />

      <CreateEnvironmentModal isOpen={isOpen} onClose={onClose} />

      <DeleteEnvironmentModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        envName={envToDelete?.name || ""}
        isLoading={deleteEnvMutation.isPending}
      />
    </div>
  );
}
