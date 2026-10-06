"use client";

import { useState } from "react";
import {
  ApiKeysTable,
  type ApiKey,
  type ApiKeysTableProps,
} from "./api-keys-table.js";
import { Button } from "../../buttons/button.js";
import { ActionConfirmation } from "../actions/action-confirmation.js";

export type ApiKeysSettingsProps<T extends ApiKey = ApiKey> = Omit<
  ApiKeysTableProps<T>,
  "actions"
> & {
  onRevoke: (id: string) => Promise<void>;
  actions?: ApiKeysTableProps<T>["actions"];
};
export function ApiKeysSettings<T extends ApiKey>({
  items,
  formatDate,
  emptyDescription,
  onRevoke,
  actions,
}: ApiKeysSettingsProps<T>) {
  const [revoking, setRevoking] = useState<T | null>(null);
  return (
    <>
      <ApiKeysTable
        items={items}
        formatDate={formatDate}
        emptyDescription={emptyDescription}
        actions={(item) => (
          <>
            {actions?.(item)}
            <Button variant="danger" onPress={() => setRevoking(item)}>
              Revoke
            </Button>
          </>
        )}
      />
      {revoking ? (
        <ActionConfirmation
          isOpen
          title={`Revoke ${revoking.name}?`}
          description="Any script or app using this key will lose access immediately. Create a replacement key to reconnect."
          confirmLabel="Revoke key"
          onOpenChange={(open) => {
            if (!open) setRevoking(null);
          }}
          onConfirm={() => onRevoke(revoking.id)}
        />
      ) : null}
    </>
  );
}
