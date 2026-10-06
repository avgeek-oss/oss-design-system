"use client";

import { MemberFormDialog } from "./member-form-dialog.js";
import type { ChoiceOption } from "../choice-field.js";

export type AddMemberValues = {
  name: string;
  email: string;
  password: string;
  role: string;
};
export type AddMemberDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  roles: readonly ChoiceOption[];
  defaultRole?: string;
  minPasswordLength?: number;
  onAdd: (values: AddMemberValues) => Promise<void>;
};
export function AddMemberDialog({
  onAdd,
  minPasswordLength = 15,
  ...props
}: AddMemberDialogProps) {
  return (
    <MemberFormDialog
      {...props}
      title="Add user"
      submitLabel="Add user"
      description="This password is valid only for the first sign-in. The user will choose a new password during account setup."
      fields={[
        {
          name: "name",
          label: "Name",
          required: true,
          maxLength: 120,
          autoComplete: "off",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          maxLength: 320,
          autoComplete: "off",
        },
        {
          name: "password",
          label: "Temporary password",
          type: "password",
          required: true,
          minLength: minPasswordLength,
          maxLength: 1024,
          autoComplete: "new-password",
        },
      ]}
      onSubmit={(values, role) =>
        onAdd({
          name: values.name ?? "",
          email: values.email ?? "",
          password: values.password ?? "",
          role,
        })
      }
    />
  );
}
