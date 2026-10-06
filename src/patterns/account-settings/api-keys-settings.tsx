"use client";

import { useState, type ComponentProps } from "react";
import { ApiKeysTable } from "../settings/tables.js";
import { Button } from "../../buttons/button.js";
import { toast } from "../../overlays/toast.js";
import { SettingsConfirmation } from "./settings-confirmation.js";

export type ApiKeysSettingsProps = Omit<
  ComponentProps<typeof ApiKeysTable>,
  "actions"
> & {
  onRevoke: (id: string) => Promise<void>;
};

export function ApiKeysSettings({
  items,
  formatDate,
  onRevoke,
}: ApiKeysSettingsProps) {
  const [revoking, setRevoking] = useState<string | null>(null);
  return (
    <>
      <ApiKeysTable
        items={items}
        formatDate={formatDate}
        actions={(item) => (
          <Button variant="danger" onPress={() => setRevoking(item.id)}>
            Revoke
          </Button>
        )}
      />
      {revoking && (
        <SettingsConfirmation
          title="Revoke API key?"
          onClose={() => setRevoking(null)}
          onConfirm={async () => {
            await onRevoke(revoking);
            toast.success("API key revoked");
          }}
        />
      )}
    </>
  );
}
