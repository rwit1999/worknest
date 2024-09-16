"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) => {

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {title || "Confirmation"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {description || "Are you sure you want to proceed?"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4 text-gray-700">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
