"use client";

import { useRef, useState, type ComponentProps } from "react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PasskeysTable } from "../settings/tables.js";
import { AuthForm } from "../auth/auth-form.js";
import { RecoveryCodes } from "../auth/recovery-codes.js";
import { Button } from "../../buttons/button.js";
import { Modal } from "../../overlays/modal.js";
import { Dropdown } from "../../overlays/dropdown.js";
import { toast } from "../../overlays/toast.js";
import { SettingsConfirmation } from "./settings-confirmation.js";

export type PasskeySettingsProps = Omit<
  ComponentProps<typeof PasskeysTable>,
  "actions"
> & {
  maxNameLength?: number;
  onAdd: (name: string) => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onReplaceRecoveryCodes: () => Promise<void>;
  recoveryCodes?: readonly string[];
  recoveryCodesFilename?: string;
  onDismissRecoveryCodes: () => void;
};

type Action =
  | { type: "add" }
  | { type: "rename" | "remove"; id: string }
  | { type: "replace" };

export function PasskeySettings({
  items,
  formatDate,
  maxNameLength = 120,
  onAdd,
  onRename,
  onRemove,
  onReplaceRecoveryCodes,
  recoveryCodes = [],
  recoveryCodesFilename,
  onDismissRecoveryCodes,
}: PasskeySettingsProps) {
  const [action, setAction] = useState<Action | null>(null);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const editing =
    action?.type === "rename"
      ? items.find((item) => item.id === action.id)
      : undefined;
  const closeEditor = () => {
    if (!pending.current) setAction(null);
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <h1 className="text-xl font-medium">Passkeys</h1>
        <div className="flex gap-2">
          <Button onPress={() => setAction({ type: "add" })}>
            Add passkey
          </Button>
          {items.length > 0 && (
            <Dropdown>
              <Button variant="secondary" isIconOnly aria-label="More actions">
                <HugeiconsIcon
                  aria-hidden
                  icon={MoreHorizontalIcon}
                  size={16}
                />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu onAction={() => setAction({ type: "replace" })}>
                  <Dropdown.Item id="replace">
                    Replace recovery codes
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>
      </div>
      <PasskeysTable
        items={items}
        formatDate={formatDate}
        actions={(item) => (
          <>
            <Button
              variant="secondary"
              onPress={() => setAction({ type: "rename", id: item.id })}
            >
              Rename
            </Button>
            <Button
              variant="danger"
              onPress={() => setAction({ type: "remove", id: item.id })}
            >
              Remove
            </Button>
          </>
        )}
      />
      {action?.type === "add" || action?.type === "rename" ? (
        <Modal.Backdrop
          isOpen
          onOpenChange={(open) => {
            if (!open) closeEditor();
          }}
        >
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>
                  {action.type === "add" ? "Add passkey" : "Rename passkey"}
                </Modal.Heading>
                <Modal.CloseTrigger isDisabled={busy} />
              </Modal.Header>
              <Modal.Body>
                <AuthForm
                  key={action.type === "add" ? "add" : action.id}
                  variant="secondary"
                  fields={[
                    {
                      name: "name",
                      label: "Name",
                      required: true,
                      maxLength: maxNameLength,
                      defaultValue: editing?.name ?? "",
                      autoComplete: "off",
                    },
                  ]}
                  submitLabel={action.type === "add" ? "Continue" : "Update"}
                  onCancel={closeEditor}
                  onSubmit={async (values) => {
                    if (pending.current) return;
                    pending.current = true;
                    setBusy(true);
                    try {
                      if (action.type === "add") await onAdd(values.name!);
                      else await onRename(action.id, values.name!);
                      setAction(null);
                      toast.success(
                        action.type === "add"
                          ? "Passkey added"
                          : "Passkey updated",
                      );
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
      ) : (
        action && (
          <SettingsConfirmation
            title={
              action.type === "replace"
                ? "Replace recovery codes?"
                : "Remove passkey?"
            }
            onClose={() => setAction(null)}
            onConfirm={async () => {
              if (action.type === "replace") await onReplaceRecoveryCodes();
              else await onRemove(action.id);
              toast.success("Passkeys updated");
            }}
          />
        )
      )}
      {recoveryCodes.length > 0 && (
        <Modal.Backdrop
          isOpen
          onOpenChange={(open) => {
            if (!open) onDismissRecoveryCodes();
          }}
        >
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Save recovery codes</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                <RecoveryCodes
                  codes={recoveryCodes}
                  filename={recoveryCodesFilename}
                  onContinue={onDismissRecoveryCodes}
                />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      )}
    </>
  );
}
