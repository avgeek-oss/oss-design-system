"use client";

import { MemberFormDialog } from "./member-form-dialog.js";
import type { ChoiceOption } from "../choice-field.js";

export type InviteMemberValues = { email: string; role: string };
export type InviteMemberDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  roles: readonly ChoiceOption[];
  defaultRole?: string;
  onInvite: (values: InviteMemberValues) => Promise<{ inviteUrl: string }>;
};
export function InviteMemberDialog({
  onInvite,
  ...props
}: InviteMemberDialogProps) {
  return (
    <MemberFormDialog
      {...props}
      title="Create invitation"
      submitLabel="Create invitation"
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          maxLength: 320,
          autoComplete: "off",
        },
      ]}
      onSubmit={(values, role) => onInvite({ email: values.email ?? "", role })}
    />
  );
}
