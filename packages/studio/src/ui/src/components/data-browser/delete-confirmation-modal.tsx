import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  secretsToDelete: string[];
  isLoading: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  secretsToDelete,
  isLoading,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle size={20} />
                <span>Delete Secrets?</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-default-500">
                Are you sure you want to delete{" "}
                <strong className="text-foreground">
                  {secretsToDelete.length === 1
                    ? secretsToDelete[0]
                    : secretsToDelete.length}
                </strong>
                {secretsToDelete.length === 1 ? null : " secrets"}? This action
                cannot be undone.
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
