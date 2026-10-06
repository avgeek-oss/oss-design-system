"use client";

import { MemberFormDialog } from "./member-form-dialog.js";
import type { ChoiceOption } from "../choice-field.js";
import type { Member } from "./members-table.js";

export type MemberEditValues = { name: string; role: string };
export type MemberEditDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  member: Member;
  roles: readonly ChoiceOption[];
} & (
  | {
      mode?: "identity-and-role";
      onSave: (values: MemberEditValues) => Promise<void>;
    }
  | {
      mode: "role-only";
      onSave: (values: Pick<MemberEditValues, "role">) => Promise<void>;
    }
);

export function MemberEditDialog(props: MemberEditDialogProps) {
  const { member, mode } = props;
  return (
    <MemberFormDialog
      key={member.id}
      {...props}
      defaultRole={member.role}
      title={
        mode === "role-only"
          ? `Edit role for ${member.name}`
          : `Edit ${member.name}`
      }
      submitLabel="Update"
      fields={
        mode === "role-only"
          ? []
          : [
              {
                name: "name",
                label: "Name",
                defaultValue: member.name,
                required: true,
                maxLength: 120,
                autoComplete: "off",
              },
            ]
      }
      onSubmit={(values, role) =>
        props.mode === "role-only"
          ? props.onSave({ role })
          : props.onSave({ name: values.name ?? "", role })
      }
    />
  );
}
