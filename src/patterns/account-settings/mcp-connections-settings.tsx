"use client";
import { useState } from "react";
import { Button } from "../../buttons/button.js";
import { ActionConfirmation } from "../actions/action-confirmation.js";
import {
  AuthorizedClientsTable,
  type AuthorizedClient,
  type AuthorizedClientsTableProps,
} from "./api-keys-table.js";

export type McpConnectionsSettingsProps<
  T extends AuthorizedClient = AuthorizedClient,
> = Omit<AuthorizedClientsTableProps<T>, "actions"> & {
  onRevoke: (id: string) => Promise<void>;
};
export function McpConnectionsSettings<T extends AuthorizedClient>({
  onRevoke,
  ...props
}: McpConnectionsSettingsProps<T>) {
  const [revoking, setRevoking] = useState<T | null>(null);
  return (
    <>
      <AuthorizedClientsTable
        {...props}
        actions={(client) => (
          <Button variant="danger" onPress={() => setRevoking(client)}>
            Revoke
          </Button>
        )}
      />
      {revoking ? (
        <ActionConfirmation
          isOpen
          title={`Revoke ${revoking.client.name}?`}
          description="This app will lose access immediately. Sign in again from the app to reconnect."
          confirmLabel="Revoke connection"
          onOpenChange={(open) => {
            if (!open) setRevoking(null);
          }}
          onConfirm={() => onRevoke(revoking.id)}
        />
      ) : null}
    </>
  );
}
