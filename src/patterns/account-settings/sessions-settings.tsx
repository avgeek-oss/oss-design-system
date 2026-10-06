"use client";

import { useState, type ComponentProps } from "react";
import { SessionsTable } from "../settings/tables.js";
import { Button } from "../../buttons/button.js";
import { toast } from "../../overlays/toast.js";
import { useOverlaySuspension } from "../../overlays/overlay-suspension.js";
import { SettingsConfirmation } from "./settings-confirmation.js";

export type SessionsSettingsProps = Omit<
  ComponentProps<typeof SessionsTable>,
  "actions"
> & {
  onRevoke: (id: string) => Promise<void>;
};

export function SessionsSettings({
  items,
  formatDate,
  onRevoke,
}: SessionsSettingsProps) {
  const suspension = useOverlaySuspension();
  const [revoking, setRevoking] = useState<string | null>(null);
  return (
    <>
      <SessionsTable
        items={items}
        formatDate={formatDate}
        actions={(item) => (
          <Button
            variant="danger"
            isDisabled={item.current}
            onPress={() => setRevoking(item.id)}
          >
            Revoke
          </Button>
        )}
      />
      {revoking && (
        <SettingsConfirmation
          title="Revoke session?"
          description="That browser will lose access immediately and must sign in again."
          confirmLabel="Revoke session"
          cancelLabel="Keep session"
          onClose={() => setRevoking(null)}
          onConfirm={async () => {
            if (items.find((item) => item.id === revoking)?.current)
              throw new Error("You cannot revoke your current session here.");
            const isCurrent = suspension.capture();
            await onRevoke(revoking);
            if (isCurrent()) toast.success("Session revoked");
          }}
        />
      )}
    </>
  );
}
