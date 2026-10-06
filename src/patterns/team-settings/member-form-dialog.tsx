"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "../../overlays/modal.js";
import { Button } from "../../buttons/button.js";
import { CodeBlock } from "../../typography/code-block.js";
import { FieldDescription } from "../../forms/field.js";
import { AuthForm, type AuthField } from "../auth/auth-form.js";
import { ChoiceField, type ChoiceOption } from "../choice-field.js";

export type MemberFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  roles: readonly ChoiceOption[];
  defaultRole?: string;
  title: string;
  submitLabel: string;
  fields: AuthField[];
  description?: string;
  onSubmit: (
    values: Record<string, string>,
    role: string,
  ) => Promise<{ inviteUrl: string } | void>;
};
export function MemberFormDialog({ isOpen, ...props }: MemberFormDialogProps) {
  return isOpen ? <MemberFormContent {...props} /> : null;
}
function MemberFormContent({
  onOpenChange,
  roles,
  defaultRole,
  title,
  submitLabel,
  fields,
  description,
  onSubmit,
}: Omit<MemberFormDialogProps, "isOpen">) {
  const [role, setRole] = useState(
    defaultRole ??
      roles.find((item) => item.id === "member")?.id ??
      roles[0]?.id ??
      "",
  );
  const [inviteUrl, setInviteUrl] = useState<string>();
  const doneRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (inviteUrl) doneRef.current?.focus();
  }, [inviteUrl]);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const changeOpen = (open: boolean) => {
    if (!lock.current) onOpenChange(open);
  };
  return (
    <Modal.Backdrop isOpen onOpenChange={changeOpen}>
      <Modal.Container size="sm" scroll="inside">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
            <Modal.CloseTrigger isDisabled={busy} />
          </Modal.Header>
          <Modal.Body>
            {inviteUrl ? (
              <div className="grid gap-4">
                <p>
                  Invitation created. The recipient must verify their email
                  before joining.
                </p>
                <CodeBlock>
                  <CodeBlock.Header>
                    <CodeBlock.Filename>Invitation link</CodeBlock.Filename>
                    <CodeBlock.CopyButton
                      code={inviteUrl}
                      aria-label="Copy invitation link"
                    />
                  </CodeBlock.Header>
                  <CodeBlock.Code code={inviteUrl} />
                </CodeBlock>
                <Button
                  ref={doneRef}
                  variant="secondary"
                  onPress={() => changeOpen(false)}
                >
                  Done
                </Button>
              </div>
            ) : (
              <AuthForm
                variant="secondary"
                fields={fields}
                submitLabel={submitLabel}
                onCancel={() => changeOpen(false)}
                onSubmit={async (values) => {
                  if (!roles.some((item) => item.id === role))
                    throw new Error("Choose a role");
                  lock.current = true;
                  setBusy(true);
                  try {
                    const result = await onSubmit(values, role);
                    if (result) setInviteUrl(result.inviteUrl);
                    else onOpenChange(false);
                  } finally {
                    lock.current = false;
                    setBusy(false);
                  }
                }}
              >
                <ChoiceField
                  label="Role"
                  value={role}
                  options={roles}
                  onChange={setRole}
                  isRequired
                  isDisabled={busy}
                />
                {description ? (
                  <FieldDescription>{description}</FieldDescription>
                ) : null}
              </AuthForm>
            )}
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
