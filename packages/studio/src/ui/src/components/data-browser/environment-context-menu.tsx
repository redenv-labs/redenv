import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { Trash2, Pencil, Copy } from "lucide-react";
import { ReactNode } from "react";

interface EnvironmentContextMenuProps {
  children: ReactNode;
  onDelete: () => void;
  onRename?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  position?: { x: number; y: number } | null;
  envName: string;
}

export default function EnvironmentContextMenu({
  children,
  onDelete,
  onRename,
  isOpen,
  onOpenChange,
  position,
  envName,
}: EnvironmentContextMenuProps) {
  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom-start"
      classNames={{
        content:
          "min-w-[200px] border-small border-default-100 bg-content1 p-1 shadow-medium rounded-medium",
      }}
      triggerScaleOnOpen={false}
      closeOnSelect={true}
    >
      <DropdownTrigger>
        {position ? (
          <div
            className="fixed w-0 h-0"
            style={{ top: position.y, left: position.x }}
          />
        ) : (
          children
        )}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Environment Actions"
        variant="flat"
        itemClasses={{
          base: "rounded-md",
        }}
      >
        <DropdownSection title={envName} showDivider>
          <DropdownItem
            key="rename"
            startContent={<Pencil size={16} className="text-default-500" />}
            shortcut="⌘R"
            onPress={onRename}
          >
            Rename
          </DropdownItem>
          <DropdownItem
            key="copy"
            startContent={<Copy size={16} className="text-default-500" />}
            shortcut="⌘C"
            onPress={() => {
              // Placeholder for copy functionality
            }}
          >
            Copy ID
          </DropdownItem>
        </DropdownSection>

        <DropdownSection>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<Trash2 size={16} className="text-danger" />}
            shortcut="⌘⌫"
            onPress={onDelete}
          >
            Delete
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
