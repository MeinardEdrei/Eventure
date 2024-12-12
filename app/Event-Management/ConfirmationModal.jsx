import React from "react";
import { Button } from "@/components/ui/button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85">
      <div className="bg-[#ffffff] rounded-lg p-6 w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black text-center">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            className="text-black border-gray-600 hover:bg-gray-300"
            onClick={onClose}
          >
            {cancelButtonText}
          </Button>
          <Button
            className="bg-[#000000] text-white hover:bg-[#2e2e2e]"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
