"use client";

import { ActionConfirmation } from "../actions/action-confirmation.js";

export type RemoveMemberDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: { name: string; email: string };
  onRemove: () => Promise<void>;
};

export function RemoveMemberDialog({
  member,
  onRemove,
  ...props
}: RemoveMemberDialogProps) {
  return (
    <ActionConfirmation
      {...props}
      title={`Remove ${member.name}?`}
      description={
        <p>
          {member.email} will lose access to this team. Their work and history
          will remain.
        </p>
      }
      confirmLabel="Remove member"
      onConfirm={onRemove}
    />
  );
}
