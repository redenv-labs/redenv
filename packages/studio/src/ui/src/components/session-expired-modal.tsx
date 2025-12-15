import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { RefreshCw, ShieldAlert, Lock } from "lucide-react";
import { useStudioStore } from "../store/useStudioStore";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SessionExpiredModal() {
  const { isSessionExpired, sendWebSocketMessage } = useStudioStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  // Sync modal state with store
  useEffect(() => {
    if (isSessionExpired) {
      onOpen();
    }
  }, [isSessionExpired, onOpen]);

  const handleReload = () => {
    setIsLoading(true);
    try {
      sendWebSocketMessage({ type: "RELOAD_SESSION" });
      // The modal will close when "backend_online" is received and isSessionExpired becomes false
      // We can set a timeout to stop loading if it takes too long
      setTimeout(() => setIsLoading(false), 5000);
    } catch (error) {
      console.error("Error reloading session:", error);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen && isSessionExpired}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        base: "bg-background/80 backdrop-blur-md border border-white/10 shadow-2xl dark:bg-zinc-900/90",
        header: "border-b border-white/5 p-0",
        footer: "border-t border-white/5 p-6",
        body: "p-0",
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
      <ModalContent>
        {() => (
          <>
            <ModalBody className="flex flex-col items-center text-center pt-10 pb-8 px-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
                  <Lock className="w-8 h-8 text-red-500" />
                  <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1.5 rounded-full border-4 border-zinc-900">
                    <ShieldAlert size={14} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/60 mb-3">
                  Session Expired
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
                  For your security, the session has been automatically
                  terminated due to inactivity.
                </p>
              </motion.div>
            </ModalBody>

            <ModalFooter className="justify-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <Button
                size="md"
                onPress={handleReload}
                isLoading={isLoading}
                className="w-full font-semibold text-white shadow-xl shadow-red-600/20 bg-linear-to-br from-red-600 to-rose-600 border border-red-400/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-red-600/30 active:translate-y-0 active:scale-[0.98] rounded-xl!"
                startContent={
                  !isLoading && <RefreshCw size={20} className="mr-1" />
                }
              >
                Restore Secure Session
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
