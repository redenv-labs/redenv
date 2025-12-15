import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  cn,
  useDisclosure,
} from "@heroui/react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useStudioStore } from "../../store/useStudioStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getBackendUrl } from "../../utils/url";
import DeleteEnvironmentModal from "./delete-environment-modal";

interface HeaderProps {
  selectedKey: string | null;
  secretCount: number;
  onRefresh: () => void;
  onAddSecret: () => void;
  isRefreshing?: boolean;
}

export function Header({
  selectedKey,
  secretCount,
  onRefresh,
  onAddSecret,
  isRefreshing,
}: HeaderProps) {
  const { schemaData, setSelectedKey } = useStudioStore();
  const queryClient = useQueryClient();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const currentEnv = schemaData?.environments.find(
    (e) => e.key === selectedKey
  );

  const deleteEnvMutation = useMutation({
    mutationFn: async (key: string) => {
      await axios.delete(getBackendUrl("/api/environments"), {
        data: { key },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schema"] });
      onDeleteClose();
      setSelectedKey(null);
    },
  });

  const handleDelete = () => {
    if (selectedKey) {
      deleteEnvMutation.mutate(selectedKey);
    }
  };

  return (
    <div className="h-14 border-b border-default-200 flex items-center justify-between px-4 bg-content1/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <Breadcrumbs>
            <BreadcrumbItem>
              {currentEnv?.name.split(":")[1] ||
                selectedKey?.split(":")[1] ||
                "Select an Environment"}
            </BreadcrumbItem>
            {selectedKey && (
              <BreadcrumbItem>{selectedKey.split(":")[0]}</BreadcrumbItem>
            )}
          </Breadcrumbs>
          <span className="text-xs text-muted-foreground">
            {selectedKey
              ? `${secretCount} secrets`
              : "Manage your project secrets"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {selectedKey && (
          <>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={onDeleteOpen}
              className="text-default-400 hover:text-danger"
              title="Delete Environment"
            >
              <Trash2 size={16} />
            </Button>
            <div className="h-4 w-px bg-default-200 mx-1" />
          </>
        )}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={onRefresh}
          className="text-default-400 hover:text-foreground"
        >
          <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
        </Button>
        <Button
          size="sm"
          variant="flat"
          startContent={<Plus size={16} />}
          onPress={onAddSecret}
          isDisabled={!selectedKey}
          className="font-medium"
        >
          Add Secret
        </Button>
      </div>

      <DeleteEnvironmentModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        envName={currentEnv?.name || selectedKey || ""}
        isLoading={deleteEnvMutation.isPending}
      />
    </div>
  );
}
