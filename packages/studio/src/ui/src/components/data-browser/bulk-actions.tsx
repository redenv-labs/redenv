import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
}

export function BulkActions({
  selectedCount,
  onDelete,
}: BulkActionsProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 pl-4 rounded-full bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-2xl text-white"
        >
          <span className="text-sm font-medium pr-2">
            {selectedCount} selected
          </span>
          <div className="h-4 w-px bg-white/20" />
          <Button
            size="sm"
            color="danger"
            onPress={onDelete}
            className="px-4 font-medium  rounded-full! bg-red-500"
            startContent={<Trash2 size={14} />}
          >
            Delete
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
