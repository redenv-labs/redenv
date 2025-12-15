import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Tabs,
  Tab,
  Chip,
  Input,
} from "@heroui/react";
import { Key, Save, Copy, Check, History, Code, Command } from "lucide-react";
import { Keybindy } from "@keybindy/react";
import { ValueEditor } from "./secret-drawer/value-editor";
import { HistoryView } from "./secret-drawer/history-view";

interface EditSecretDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  secret: { key: string; history: any[] } | null;
  onSave: (key: string, value: string) => Promise<void>;
}

export default function EditSecretDrawer({
  isOpen,
  onClose,
  secret,
  onSave,
}: EditSecretDrawerProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("value");
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  useEffect(() => {
    if (secret) {
      setKey(secret.key);
      if (secret.history.length > 0) {
        setValue(secret.history[0].value);
      }
    } else {
      setKey("");
      setValue("");
    }
  }, [secret, isOpen]);

  const handleSave = async () => {
    // Validation for create mode
    if (!secret && !key.trim()) return;

    // Don't save if value hasn't changed (Edit Mode only)
    if (
      secret &&
      secret.history.length > 0 &&
      value === secret.history[0].value
    ) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onSave(secret ? secret.key : key, value);
      onClose();
    } catch (error) {
      console.error("Failed to save secret:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (key) {
      navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Keybindy
      shortcuts={[
        {
          keys: [["Enter"], ["Numpad Enter"]],
          handler: () => {
            if (isTextareaFocused) return;
            handleSave();
          },
        },
      ]}
    >
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        backdrop="blur"
        classNames={{
          base: "border-l border-default-200",
          wrapper: "z-[9999]",
        }}
      >
        <DrawerContent className="bg-background/95 backdrop-blur-md">
          {/* Header Section */}
          <DrawerHeader className="flex flex-col gap-0 p-0 border-b border-default-100 bg-background">
            <div className="p-6 pb-2">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-4">
                <span>Project</span>
                <span className="text-default-300">/</span>
                <span>Environment</span>
                <span className="text-default-300">/</span>
                <span className="text-primary font-bold">
                  {secret ? secret.key : key ? key : "New Secret"}
                </span>
              </div>

              {/* Title & Key */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-sm border border-primary/20">
                    <Key size={24} />
                  </div>
                  <div className="flex-1">
                    {secret ? (
                      <>
                        <h2 className="text-2xl font-bold font-mono tracking-tight text-foreground">
                          {secret.key}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Chip
                            size="sm"
                            variant="flat"
                            color="success"
                            className="h-5 text-[10px]"
                          >
                            Active
                          </Chip>
                          <span className="text-xs text-muted-foreground">
                            Last modified:{" "}
                            {secret.history[0] &&
                              new Date(
                                secret.history[0].createdAt
                              ).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="max-w-md">
                        <Input
                          autoFocus
                          variant="underlined"
                          placeholder="SECRET_KEY"
                          value={key}
                          onValueChange={(v) =>
                            setKey(v.toUpperCase().replace(/[^A-Z0-9_]/g, ""))
                          }
                          classNames={{
                            input:
                              "text-2xl font-bold font-mono tracking-tight placeholder:text-default-300",
                            inputWrapper: "border-b-2",
                          }}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Use uppercase letters, numbers, and underscores.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {secret && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      onPress={handleCopyKey}
                      startContent={
                        copied ? (
                          <Check size={14} className="text-success" />
                        ) : (
                          <Copy size={14} />
                        )
                      }
                    >
                      {copied ? "Copied" : "Copy Key"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
              <Tabs
                aria-label="Secret Options"
                variant="underlined"
                classNames={{
                  tabList:
                    "gap-6 w-full relative rounded-none p-0 border-b border-transparent",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-0 h-10",
                  tabContent:
                    "group-data-[selected=true]:text-primary font-medium",
                }}
                selectedKey={activeTab}
                onSelectionChange={(k) => setActiveTab(k as string)}
              >
                <Tab
                  key="value"
                  title={
                    <div className="flex items-center gap-2">
                      <Code size={16} />
                      <span>Value</span>
                    </div>
                  }
                />
                {secret && (
                  <Tab
                    key="history"
                    title={
                      <div className="flex items-center gap-2">
                        <History size={16} />
                        <span>History</span>
                      </div>
                    }
                  />
                )}
              </Tabs>
            </div>
          </DrawerHeader>

          {/* Body Section */}
          <DrawerBody className="p-0 bg-content1/30 overflow-hidden flex flex-col">
            {activeTab === "value" && (
              <ValueEditor
                value={value}
                onChange={setValue}
                onFocus={() => setIsTextareaFocused(true)}
                onBlur={() => setIsTextareaFocused(false)}
              />
            )}

            {activeTab === "history" && secret && (
              <HistoryView
                history={secret.history}
                isRollingBack={loading}
                onRollback={async (v) => {
                  // Don't rollback if value is same as current
                  if (v === secret.history[0].value) return;

                  setLoading(true);
                  try {
                    await onSave(secret.key, v);
                    onClose();
                  } catch (error) {
                    console.error("Failed to rollback secret:", error);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            )}
          </DrawerBody>

          {/* Footer Section */}
          {activeTab === "value" && (
            <DrawerFooter className="border-t border-default-100 p-6 bg-background">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Command size={12} />
                  <span>
                    Press <kbd className="font-sans font-semibold">Enter</kbd>{" "}
                    to save
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    color="primary"
                    variant="faded"
                    onPress={handleSave}
                    isLoading={loading}
                    isDisabled={!key.trim()}
                    className="font-medium shadow-lg"
                    startContent={!loading && <Save size={18} />}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </Keybindy>
  );
}
