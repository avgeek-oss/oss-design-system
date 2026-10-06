"use client";

import { useRef, useState } from "react";
import { Modal } from "../../overlays/modal.js";
import { Button } from "../../buttons/button.js";
import { toast } from "../../overlays/toast.js";

export function SettingsConfirmation({
  title,
  onClose,
  onConfirm,
}: {
  title: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  return (
    <Modal.Backdrop
      isOpen
      onOpenChange={(open) => {
        if (!open && !pending.current) onClose();
      }}
    >
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
            <Modal.CloseTrigger isDisabled={busy} />
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" isDisabled={busy} onPress={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              isDisabled={busy}
              onPress={async () => {
                if (pending.current) return;
                pending.current = true;
                setBusy(true);
                try {
                  await onConfirm();
                  onClose();
                } catch (cause) {
                  toast.danger(
                    cause instanceof Error
                      ? cause.message
                      : "Could not complete the action",
                  );
                } finally {
                  pending.current = false;
                  setBusy(false);
                }
              }}
            >
              {busy ? "Please wait…" : "Confirm"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
