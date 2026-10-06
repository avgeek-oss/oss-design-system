"use client";

import type { ReactNode } from "react";
import { ActionConfirmation } from "../actions/action-confirmation.js";

export function SettingsConfirmation({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <ActionConfirmation
      isOpen
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onConfirm={onConfirm}
    />
  );
}
