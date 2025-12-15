import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getBackendUrl } from "../../utils/url";
import { Hash, Sparkles } from "lucide-react";
import { Keybindy } from "@keybindy/react";

interface CreateEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEnvironmentModal({
  isOpen,
  onClose,
}: CreateEnvironmentModalProps) {
  const [key, setKey] = useState("");
  const queryClient = useQueryClient();

  const createEnvMutation = useMutation({
    mutationFn: async (data: { key: string }) => {
      await axios.post(getBackendUrl("/api/environments"), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schema"] });
      onClose();
      setKey("");
    },
  });

  const handleSubmit = () => {
    if (!key) return;
    createEnvMutation.mutate({ key });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      classNames={{
        base: "bg-zinc-900 border border-white/10 shadow-2xl",
        header: "border-b border-white/5 pb-4",
        footer: "border-t border-white/5 pt-4",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <Keybindy
        scope="create-environment-modal"
        shortcuts={[
          {
            keys: [["Enter"], ["Numpad Enter"]],
            handler: () => {
              if (createEnvMutation.isPending) return;
              handleSubmit();
            },
          },
        ]}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white">
                  <div className="p-2 rounded-lg bg-brand/10 text-brand">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      New Environment
                    </span>
                    <span className="text-xs font-normal text-default-400">
                      Create a new deployment target for your secrets.
                    </span>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                <div className="flex flex-col gap-6">
                  <Input
                    label="Environment Key"
                    placeholder="e.g. staging"
                    value={key}
                    onValueChange={(value) => {
                      setKey(value);
                      createEnvMutation.reset();
                    }}
                    autoFocus
                    variant="bordered"
                    labelPlacement="outside"
                    description="Unique key for the environment"
                    startContent={
                      <Hash
                        className="text-default-400 pointer-events-none shrink-0"
                        size={16}
                      />
                    }
                    classNames={{
                      label:
                        "text-default-300 group-data-[filled-within=true]:text-default-300",
                      input:
                        "text-white font-mono placeholder:text-default-500",
                      inputWrapper:
                        "bg-zinc-800/50 border-white/10 hover:border-white/20 group-data-[focus=true]:border-brand/50",
                      description: "text-default-500",
                    }}
                  />
                  {createEnvMutation.isError && (
                    <div className="p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm">
                      {(createEnvMutation.error as any)?.response?.data
                        ?.error || "Failed to create environment"}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="text-default-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={createEnvMutation.isPending}
                  isDisabled={!key}
                  className="bg-linear-to-tr from-brand to-brand/80 shadow-lg shadow-brand/20 font-medium text-white"
                  startContent={
                    !createEnvMutation.isPending && <Sparkles size={16} />
                  }
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Keybindy>
    </Modal>
  );
}
