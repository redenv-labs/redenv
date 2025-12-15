import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";

interface DeleteEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  envName: string;
  isLoading: boolean;
}

export default function DeleteEnvironmentModal({
  isOpen,
  onClose,
  onConfirm,
  envName,
  isLoading,
}: DeleteEnvironmentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle size={20} />
                <span>Delete Environment?</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-default-500">
                Are you sure you want to delete the{" "}
                <strong className="text-foreground">{envName.split(":")[0]}</strong>{" "}
                environment? This will permanently delete all secrets associated
                with it. This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button
                color="danger"
                variant="shadow"
                onPress={onConfirm}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
