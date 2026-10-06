"use client";

import { ActionConfirmation } from "../actions/action-confirmation.js";

export function SettingsConfirmation({
  title,
  onClose,
  onConfirm,
}: {
  title: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <ActionConfirmation
      isOpen
      title={title}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onConfirm={onConfirm}
    />
  );
}
