import { Button, Checkbox, Snippet, Spinner } from "@heroui/react";
import {
  Eye,
  EyeOff,
  Lock,
  Server,
  ShieldAlert,
  Pen,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Secret {
  key: string;
  value: string;
  updatedAt: string;
  history: any[];
}

interface SecretsTableProps {
  secrets: Secret[];
  isLoading: boolean;
  error: string | null;
  selectedKeys: Set<string>;
  revealedKeys: Set<string>;
  onToggleSelection: (key: string) => void;
  onToggleSelectAll: () => void;
  onToggleReveal: (key: string) => void;
  onAddSecret: () => void;
  onDelete: (key: string) => void;
  onEdit: (secret: Secret) => void;
  isSessionExpired: boolean;
  selectedKey: string | null;
}

export function SecretsTable({
  secrets,
  isLoading,
  error,
  selectedKeys,
  revealedKeys,
  onToggleSelection,
  onToggleSelectAll,
  onToggleReveal,
  onEdit,
  onDelete,
  onAddSecret,
  isSessionExpired,
  selectedKey,
}: SecretsTableProps) {
  return (
    <div className="flex-1 overflow-auto bg-background relative">
      <AnimatePresence mode="wait">
        {isSessionExpired ? (
          <motion.div
            key="expired"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center h-full p-6"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
                <Lock className="w-8 h-8 text-red-500" />
                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full border-4 border-zinc-900">
                  <ShieldAlert size={14} />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Session Expired</h3>
            <p className="text-muted-foreground text-center max-w-xs">
              Data is hidden to protect your secrets. Restore your session to
              continue.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {!selectedKey || selectedKey.startsWith("meta@") ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center mb-4">
                  <Server size={32} className="opacity-20" />
                </div>
                <p>Select an environment from the sidebar to view secrets.</p>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Spinner size="lg" className="[&_i]:border-b-red-500!" />
              </div>
            ) : error ? (
              <div className="p-8 flex justify-center">
                <div className="p-4 bg-danger/10 text-danger rounded-lg border border-danger/20 max-w-md text-center">
                  <p className="font-semibold">Failed to load secrets</p>
                  <p className="text-sm opacity-80 mt-1">{error}</p>
                </div>
              </div>
            ) : secrets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>No secrets found in this environment.</p>
                <Button
                  size="sm"
                  variant="flat"
                  className="mt-4"
                  onPress={onAddSecret}
                >
                  Create your first secret
                </Button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-default-50 sticky top-0 z-10 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-3 border-b border-default-200 w-10">
                      <Checkbox
                        isSelected={
                          secrets.length > 0 &&
                          selectedKeys.size === secrets.length
                        }
                        isIndeterminate={
                          selectedKeys.size > 0 &&
                          selectedKeys.size < secrets.length
                        }
                        onValueChange={onToggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 border-b border-default-200 w-1/3">
                      Key
                    </th>
                    <th className="px-6 py-3 border-b border-default-200">
                      Value
                    </th>
                    <th className="px-6 py-3 border-b border-default-200 w-24 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                  {secrets.map((secret) => (
                    <tr
                      onDoubleClick={() => onEdit(secret)}
                      key={secret.key}
                      className={`group transition-colors cursor-pointer ${
                        selectedKeys.has(secret.key)
                          ? "bg-primary/5 hover:bg-primary/10"
                          : "hover:bg-default-50"
                      }`}
                    >
                      <td className="px-6 py-3">
                        <Checkbox
                          isSelected={selectedKeys.has(secret.key)}
                          onValueChange={() => onToggleSelection(secret.key)}
                        />
                      </td>
                      <td className="px-6 py-3 font-mono text-sm font-medium text-foreground">
                        {secret.key}
                      </td>
                      <td className="px-6 py-3 font-mono text-sm text-muted-foreground relative">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[300px] block">
                            {revealedKeys.has(secret.key)
                              ? secret.value
                              : "•".repeat(
                                  secret.value.length > 20
                                    ? 20
                                    : secret.value.length
                                )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          onPress={() => onToggleReveal(secret.key)}
                          size="sm"
                          variant="light"
                          className="text-default-500 hover:text-foreground min-w-auto! p-2"
                          title={
                            revealedKeys.has(secret.key)
                              ? "Hide Value"
                              : "Show Value"
                          }
                        >
                          {revealedKeys.has(secret.key) ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </Button>{" "}
                        <Snippet
                          variant="flat"
                          disableTooltip
                          title="Copy Value"
                          onCopy={() =>
                            navigator.clipboard.writeText(secret.value)
                          }
                          className="[&_pre]:hidden! p-0! bg-transparent hover:bg-content2 rounded-md text-muted-foreground"
                        >
                          {secret.value}
                        </Snippet>
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => onEdit(secret)}
                          className="text-default-500 hover:text-foreground min-w-auto! p-2"
                          title="Edit Secret"
                        >
                          <Pen size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          color="danger"
                          onPress={() => onDelete(secret.key)}
                          className="text-default-400 hover:text-danger h-8 w-8 min-w-0"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
