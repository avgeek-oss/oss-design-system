"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type RefObject,
} from "react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PasskeysTable } from "../settings/tables.js";
import { AuthForm } from "../auth/auth-form.js";
import { RecoveryCodes } from "../auth/recovery-codes.js";
import { Button } from "../../buttons/button.js";
import { Modal } from "../../overlays/modal.js";
import { Dropdown } from "../../overlays/dropdown.js";
import { toast } from "../../overlays/toast.js";
import { useAsyncAction } from "../use-async-action.js";
import { useOverlaySuspension } from "../../overlays/overlay-suspension.js";
import { useFormDraft } from "../use-form-draft.js";
import { restoreOverlayTriggerFocus } from "../../overlays/use-suspended-overlay-focus.js";
import { SettingsPageTitle } from "../settings/page-title.js";
import { SettingsConfirmation } from "./settings-confirmation.js";

export type PasskeySettingsProps = Omit<
  ComponentProps<typeof PasskeysTable>,
  "actions"
> & {
  maxNameLength?: number;
  onAdd: (name: string) => Promise<void>;
  onRename?: (id: string, name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onReplaceRecoveryCodes?: () => Promise<void>;
  recoveryCodes?: readonly string[];
  recoveryCodesFilename?: string;
  onDismissRecoveryCodes?: () => void;
};

type Action =
  | { type: "add" }
  | { type: "rename"; id: string }
  | { type: "remove"; id: string }
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
  const suspension = useOverlaySuspension();
  const opener = useRef<HTMLElement | null>(null);
  const editorBackdrop = useRef<HTMLDivElement>(null);
  const recoveryBackdrop = useRef<HTMLDivElement>(null);
  const moreTrigger = useRef<HTMLButtonElement>(null);
  const wasSuspended = useRef(false);
  useLayoutEffect(() => {
    if (suspension.isSuspended) wasSuspended.current = true;
  }, [suspension.isSuspended]);
  const editing =
    action?.type === "rename"
      ? items.find((item) => item.id === action.id)
      : undefined;
  const closeEditor = () => {
    const previous = editorBackdrop.current;
    const isCurrent = suspension.capture();
    setAction(null);
    if (wasSuspended.current)
      requestAnimationFrame(() => {
        if (isCurrent()) restoreOverlayTriggerFocus(opener.current, previous);
      });
  };
  const dismissRecoveryCodes = () => {
    const previous = recoveryBackdrop.current;
    const isCurrent = suspension.capture();
    onDismissRecoveryCodes?.();
    if (wasSuspended.current)
      requestAnimationFrame(() => {
        if (isCurrent()) restoreOverlayTriggerFocus(opener.current, previous);
      });
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <h1 data-slot="application-page-heading">
          <SettingsPageTitle section="passkeys" />
        </h1>
        <div className="flex gap-2">
          <Button
            onPress={(event) => {
              opener.current =
                event.target instanceof HTMLElement ? event.target : null;
              wasSuspended.current = false;
              setAction({ type: "add" });
            }}
          >
            Add passkey
          </Button>
          {items.length > 0 && onReplaceRecoveryCodes && (
            <Dropdown>
              <Button
                ref={moreTrigger}
                variant="secondary"
                isIconOnly
                aria-label="More actions"
              >
                <HugeiconsIcon
                  aria-hidden
                  icon={MoreHorizontalIcon}
                  size={16}
                />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={() => {
                    opener.current = moreTrigger.current;
                    wasSuspended.current = false;
                    setAction({ type: "replace" });
                  }}
                >
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
            {onRename && (
              <Button
                variant="secondary"
                onPress={(event) => {
                  opener.current =
                    event.target instanceof HTMLElement ? event.target : null;
                  wasSuspended.current = false;
                  setAction({ type: "rename", id: item.id });
                }}
              >
                Rename
              </Button>
            )}
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
        <PasskeyEditor
          key={action.type === "add" ? "add" : action.id}
          action={action}
          backdropRef={editorBackdrop}
          name={editing?.name ?? ""}
          maxNameLength={maxNameLength}
          onClose={closeEditor}
          onSubmit={(name) =>
            action.type === "add"
              ? onAdd(name)
              : onRename
                ? onRename(action.id, name)
                : Promise.reject(new Error("Passkey renaming is unavailable."))
          }
        />
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
              const isCurrent = suspension.capture();
              if (action.type === "replace") await onReplaceRecoveryCodes?.();
              else await onRemove(action.id);
              if (isCurrent()) toast.success("Passkeys updated");
            }}
          />
        )
      )}
      {recoveryCodes.length > 0 && onDismissRecoveryCodes && (
        <Modal.Backdrop
          ref={recoveryBackdrop}
          isOpen
          onOpenChange={(open) => {
            if (!open) dismissRecoveryCodes();
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
                  onContinue={dismissRecoveryCodes}
                />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      )}
    </>
  );
}

function PasskeyEditor({
  action,
  name,
  maxNameLength,
  onClose,
  onSubmit,
  backdropRef,
}: {
  action: Extract<Action, { type: "add" | "rename" }>;
  name: string;
  maxNameLength: number;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  backdropRef: RefObject<HTMLDivElement | null>;
}) {
  const request = useAsyncAction();
  const fields = useFormDraft([
    {
      name: "name",
      label: "Name",
      required: true,
      maxLength: maxNameLength,
      defaultValue: name,
      autoComplete: "off",
    },
  ]);
  const close = () => {
    if (!request.isPending) onClose();
  };
  return (
    <Modal.Backdrop
      ref={backdropRef}
      isOpen
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>
              {action.type === "add" ? "Add passkey" : "Rename passkey"}
            </Modal.Heading>
            <Modal.CloseTrigger isDisabled={request.isPending} />
          </Modal.Header>
          <Modal.Body>
            <AuthForm
              isPending={request.isPending}
              variant="secondary"
              fields={fields.map((field) => ({
                ...field,
                disabled: request.isPending,
              }))}
              submitLabel={action.type === "add" ? "Continue" : "Update"}
              onCancel={close}
              onSubmit={async (values) => {
                const result = await request.run(() =>
                  onSubmit(values.name ?? ""),
                );
                if (result.ok) {
                  onClose();
                  toast.success(
                    action.type === "add" ? "Passkey added" : "Passkey updated",
                  );
                }
              }}
            />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
