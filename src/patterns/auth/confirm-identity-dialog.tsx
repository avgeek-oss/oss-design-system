"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { FingerPrintIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../../buttons/button.js";
import { Modal } from "../../overlays/modal.js";
import { toast } from "../../overlays/toast.js";
import { AuthForm } from "./auth-form.js";
import { currentPasswordField } from "./auth-fields.js";
import { useOverlaySuspension } from "../../overlays/overlay-suspension.js";

export type ConfirmIdentityDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
} & (
  | {
      method?: "password";
      onConfirm: (values: { password: string }) => Promise<void>;
    }
  | {
      method: "passkey";
      onConfirm: () => Promise<void>;
      onCancelRequest?: () => void;
    }
  | {
      method: "custom";
      children: ReactNode;
      isPending?: boolean;
      isDismissDisabled?: boolean;
    }
);

export function ConfirmIdentityDialog(props: ConfirmIdentityDialogProps) {
  const descriptionId = useId();
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const suspension = useOverlaySuspension();
  async function confirm(password?: string) {
    if (pending.current || props.method === "custom") return;
    pending.current = true;
    setBusy(true);
    try {
      if (props.method === "passkey") await props.onConfirm();
      else await props.onConfirm({ password: password ?? "" });
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  const dismissDisabled =
    props.method === "custom"
      ? (props.isDismissDisabled ?? props.isPending ?? false)
      : busy;
  return (
    <Modal.Backdrop
      isOpen={props.isOpen}
      onOpenChange={(open) => {
        if (!dismissDisabled && !pending.current) props.onOpenChange(open);
      }}
    >
      <Modal.Container size="sm">
        <Modal.Dialog
          aria-describedby={
            props.method === "passkey" ? descriptionId : undefined
          }
        >
          <Modal.Header>
            <Modal.Heading>Confirm it’s you</Modal.Heading>
            {props.method === "passkey" ? (
              <p className="text-sm text-muted" id={descriptionId}>
                Authenticate yourself using your passkey to confirm and obtain
                required access.
              </p>
            ) : null}
            <Modal.CloseTrigger isDisabled={dismissDisabled} />
          </Modal.Header>
          <Modal.Body>
            {props.method === "custom" ? (
              props.children
            ) : props.method === "passkey" ? (
              <Button
                className="w-full"
                isDisabled={busy}
                isPending={busy}
                onPress={async () => {
                  const isCurrent = suspension.capture();
                  try {
                    await confirm();
                  } catch (cause) {
                    if (isCurrent())
                      toast.danger(
                        cause instanceof Error
                          ? cause.message
                          : "Unable to confirm your identity. Try again.",
                      );
                  }
                }}
              >
                <HugeiconsIcon aria-hidden icon={FingerPrintIcon} size={16} />
                Use Passkey
              </Button>
            ) : (
              <AuthForm
                isPending={busy}
                variant="secondary"
                fields={[currentPasswordField]}
                submitLabel="Confirm"
                onSubmit={(values) => confirm(values.password)}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              isDisabled={
                dismissDisabled &&
                !(props.method === "passkey" && props.onCancelRequest)
              }
              onPress={() => {
                if (props.method === "passkey" && busy)
                  props.onCancelRequest?.();
                props.onOpenChange(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
