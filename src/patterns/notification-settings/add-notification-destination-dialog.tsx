"use client";

import { useRef, useState } from "react";
import { Modal } from "../../overlays/modal.js";
import { AuthForm, type AuthField } from "../auth/auth-form.js";

export type AddNotificationDestinationDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  fields: AuthField[];
  onAdd: (values: Record<string, string>) => Promise<void>;
};
export function AddNotificationDestinationDialog({
  isOpen,
  ...props
}: AddNotificationDestinationDialogProps) {
  return isOpen ? <DestinationContent {...props} /> : null;
}
function DestinationContent({
  onOpenChange,
  title,
  fields,
  onAdd,
}: Omit<AddNotificationDestinationDialogProps, "isOpen">) {
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const changeOpen = (open: boolean) => {
    if (!pending.current) onOpenChange(open);
  };
  return (
    <Modal.Backdrop isOpen onOpenChange={changeOpen}>
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
            <Modal.CloseTrigger isDisabled={busy} />
          </Modal.Header>
          <Modal.Body>
            <AuthForm
              variant="secondary"
              fields={fields}
              submitLabel="Add destination"
              onCancel={() => changeOpen(false)}
              onSubmit={async (values) => {
                pending.current = true;
                setBusy(true);
                try {
                  await onAdd(values);
                  onOpenChange(false);
                } finally {
                  pending.current = false;
                  setBusy(false);
                }
              }}
            />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
