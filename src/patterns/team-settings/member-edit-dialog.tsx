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
  onSave: (values: MemberEditValues) => Promise<void>;
};
export function MemberEditDialog({
  member,
  onSave,
  ...props
}: MemberEditDialogProps) {
  return (
    <MemberFormDialog
      key={member.id}
      {...props}
      defaultRole={member.role}
      title={`Edit ${member.name}`}
      submitLabel="Update"
      fields={[
        {
          name: "name",
          label: "Name",
          defaultValue: member.name,
          required: true,
          maxLength: 120,
          autoComplete: "off",
        },
      ]}
      onSubmit={(values, role) => onSave({ name: values.name ?? "", role })}
    />
  );
}
