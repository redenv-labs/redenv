import { useEffect, useState, useMemo } from "react";
import { useDisclosure } from "@heroui/react";
import { useStudioStore } from "../store/useStudioStore";
import { getBackendUrl } from "../utils/url";
import EditSecretDrawer from "./edit-secret-drawer";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "./data-browser/sidebar";
import { Header } from "./data-browser/header";
import { SecretsTable } from "./data-browser/secrets-table";
import { FloatingSearch } from "./data-browser/floating-search";
import { BulkActions } from "./data-browser/bulk-actions";
import DeleteConfirmationModal from "./data-browser/delete-confirmation-modal";

export default function DataBrowser() {
  const queryClient = useQueryClient();
  const { selectedKey, isSessionExpired, setIsSessionExpired } =
    useStudioStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Drawer State
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Delete Modal State
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [editingSecret, setEditingSecret] = useState<{
    key: string;
    history: any[];
  } | null>(null);

  // Fetch Secrets Query
  const {
    data: secretsData,
    isLoading: isSecretsLoading,
    error: secretsError,
    refetch,
    isRefetching,
  } = useQuery<Record<string, any>>({
    queryKey: ["secrets", selectedKey],
    queryFn: async () => {
      if (!selectedKey) return null;
      let envName = selectedKey;
      if (selectedKey.includes(":")) {
        envName = selectedKey.split(":")[0];
      }
      const res = await axios.get(getBackendUrl(`/api/data/${envName}`));
      return res.data;
    },
    enabled:
      !!selectedKey && !selectedKey.startsWith("meta@") && !isSessionExpired,
    retry: false,
  });

  useEffect(() => {
    if (secretsError) {
      const err = secretsError as any;
      if (err.response?.data?.code === "SESSION_EXPIRED") {
        setIsSessionExpired(true);
      }
    }
  }, [secretsError, setIsSessionExpired]);

  const error = secretsError
    ? (secretsError as any)?.response?.data?.error || "Failed to fetch data"
    : null;

  const filteredSecrets = useMemo(() => {
    if (!secretsData?.secrets) return [];
    return Object.entries(secretsData.secrets)
      .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(([key, history]) => ({
        key,
        value: (history as any[])[0]?.value,
        updatedAt: (history as any[])[0]?.createdAt,
        history: history as any[],
      }));
  }, [secretsData, searchQuery]);

  const toggleReveal = (key: string) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(key)) {
      newRevealed.delete(key);
    } else {
      newRevealed.add(key);
    }
    setRevealedKeys(newRevealed);
  };

  const handleEdit = (secret: any) => {
    setEditingSecret(secret);
    onOpen();
  };

  // Save Secret Mutation
  const saveSecretMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      let envName = selectedKey!;
      if (selectedKey!.includes(":")) {
        envName = selectedKey!.split(":")[0];
      }
      await axios.post(getBackendUrl(`/api/data/${envName}`), { key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secrets", selectedKey] });
      onClose();
    },
  });

  const handleSaveSecret = async (key: string, value: string) => {
    try {
      await saveSecretMutation.mutateAsync({ key, value });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Secrets Mutation
  const deleteSecretsMutation = useMutation({
    mutationFn: async (keys: string[]) => {
      let envName = selectedKey!;
      if (selectedKey!.includes(":")) {
        envName = selectedKey!.split(":")[0];
      }
      await axios.delete(getBackendUrl(`/api/data/${envName}`), {
        data: { keys },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secrets", selectedKey] });
      setSelectedKeys(new Set());
      onDeleteClose();
    },
    onError: (error: any) => {
      if (error.response?.data?.code === "SESSION_EXPIRED") {
        setIsSessionExpired(true);
      }
    },
  });

  const toggleSelection = (key: string) => {
    const newSet = new Set(selectedKeys);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setSelectedKeys(newSet);
  };

  const toggleSelectAll = () => {
    if (
      selectedKeys.size === filteredSecrets.length &&
      filteredSecrets.length > 0
    ) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(filteredSecrets.map((s) => s.key)));
    }
  };

  const [secretToDelete, setSecretToDelete] = useState<string | null>(null);

  const handleBulkDelete = () => {
    onDeleteOpen();
  };

  const handleSingleDelete = (key: string) => {
    setSecretToDelete(key);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    if (secretToDelete) {
      deleteSecretsMutation.mutate([secretToDelete]);
    } else {
      deleteSecretsMutation.mutate(Array.from(selectedKeys));
    }
  };

  const handleDeleteClose = () => {
    setSecretToDelete(null);
    onDeleteClose();
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header
          selectedKey={selectedKey}
          secretCount={Object.keys(secretsData?.secrets || {}).length}
          onRefresh={() => refetch()}
          isRefreshing={isRefetching}
          onAddSecret={() => {
            setEditingSecret(null);
            onOpen();
          }}
        />

        <SecretsTable
          secrets={filteredSecrets}
          isLoading={isSecretsLoading}
          error={error}
          selectedKeys={selectedKeys}
          revealedKeys={revealedKeys}
          onToggleSelection={toggleSelection}
          onToggleSelectAll={toggleSelectAll}
          onToggleReveal={toggleReveal}
          onEdit={handleEdit}
          onDelete={handleSingleDelete}
          onAddSecret={() => {
            setEditingSecret(null);
            onOpen();
          }}
          isSessionExpired={isSessionExpired}
          selectedKey={selectedKey}
        />

        <BulkActions
          selectedCount={selectedKeys.size}
          onDelete={handleBulkDelete}
        />

        <FloatingSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isVisible={
            (!isSessionExpired || filteredSecrets.length === 0) &&
            selectedKeys.size === 0
          }
        />
      </div>

      <EditSecretDrawer
        isOpen={isOpen}
        onClose={onClose}
        secret={editingSecret}
        onSave={handleSaveSecret}
        onDelete={handleSingleDelete}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={confirmDelete}
        secretsToDelete={secretToDelete ? [secretToDelete] : Array.from(selectedKeys)}
        isLoading={deleteSecretsMutation.isPending}
      />
    </div>
  );
}
