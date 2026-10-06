"use client";

import { ActionConfirmation } from "../actions/action-confirmation.js";

export type RevokeInvitationDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onRevoke: () => Promise<void>;
};

export function RevokeInvitationDialog({
  email,
  onRevoke,
  ...props
}: RevokeInvitationDialogProps) {
  return (
    <ActionConfirmation
      {...props}
      title="Revoke invitation?"
      description={
        <p>
          The invitation for {email} will stop working. You can create a new
          invitation later.
        </p>
      }
      confirmLabel="Revoke invitation"
      onConfirm={onRevoke}
    />
  );
}
