"use client";

import { Modal } from "../../overlays/modal.js";
import { AuthForm, type AuthField } from "../auth/auth-form.js";
import { useFormDraft } from "../use-form-draft.js";
import { useAsyncAction } from "../use-async-action.js";

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
  const draftFields = useFormDraft(fields);
  const action = useAsyncAction();
  const busy = action.isPending;
  const changeOpen = (open: boolean) => {
    if (!busy) onOpenChange(open);
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
              isPending={busy}
              variant="secondary"
              fields={draftFields.map((field) => ({
                ...field,
                disabled: field.disabled || busy,
              }))}
              submitLabel="Add destination"
              onCancel={() => changeOpen(false)}
              onSubmit={async (values) => {
                const result = await action.run(() => onAdd(values));
                if (result.ok) onOpenChange(false);
              }}
            />
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
