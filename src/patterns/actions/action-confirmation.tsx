"use client";

import type { ReactNode } from "react";
import { Modal } from "../../overlays/modal.js";
import { Button, type ButtonVariant } from "../../buttons/button.js";
import { useAsyncAction } from "../use-async-action.js";

export type ActionConfirmationProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  variant?: ButtonVariant;
  onConfirm: () => Promise<void>;
};
export function ActionConfirmation({
  isOpen,
  ...props
}: ActionConfirmationProps) {
  return isOpen ? <ConfirmationContent {...props} /> : null;
}
function ConfirmationContent({
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "danger",
  onConfirm,
}: Omit<ActionConfirmationProps, "isOpen">) {
  const action = useAsyncAction();
  return (
    <Modal.Backdrop
      isOpen
      onOpenChange={(open) => {
        if (!action.isPending) onOpenChange(open);
      }}
    >
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
            <Modal.CloseTrigger isDisabled={action.isPending} />
          </Modal.Header>
          {description ? <Modal.Body>{description}</Modal.Body> : null}
          <Modal.Footer>
            <Button
              variant="secondary"
              isDisabled={action.isPending}
              onPress={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant={variant}
              isDisabled={action.isPending}
              onPress={async () => {
                const result = await action.run(onConfirm);
                if (result.ok) onOpenChange(false);
              }}
            >
              {action.isPending ? "Please wait…" : confirmLabel}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
