"use client";

import type { ReactNode } from "react";
import {
  ResourceTable,
  ResourceName,
  type ResourceTableColumn,
} from "../resource-table.js";
import { StatusIndicator, type StatusDescriptor } from "../status-indicator.js";
import { actionColumn } from "../settings/table-actions.js";

export type ApiKey = {
  id: string;
  name: string;
  expiresAt: string | null;
  tokenHint?: string;
  permissions?: string;
  createdAt?: string;
  lastUsedAt?: string | null;
  status?: StatusDescriptor;
};
export type ApiKeysTableProps<T extends ApiKey = ApiKey> = {
  items: T[];
  formatDate: (value: string) => ReactNode;
  actions: (item: T) => ReactNode;
  emptyDescription?: string;
};
function credentialColumns<T extends ApiKey>(
  formatDate: (value: string) => ReactNode,
  actions: (item: T) => ReactNode,
): ResourceTableColumn<T>[] {
  return [
    {
      key: "permissions",
      header: "Permissions",
      cell: (item) => item.permissions ?? "—",
    },
    {
      key: "added",
      header: "Added",
      cell: (item) => (item.createdAt ? formatDate(item.createdAt) : "—"),
    },
    {
      key: "expires",
      header: "Expires",
      cell: (item) =>
        item.expiresAt ? formatDate(item.expiresAt) : "No expiry",
    },
    {
      key: "last-used",
      header: "Last used",
      cell: (item) => (item.lastUsedAt ? formatDate(item.lastUsedAt) : "Never"),
    },
    actionColumn(actions),
  ];
}
export function ApiKeysTable<T extends ApiKey>({
  items,
  formatDate,
  actions,
  emptyDescription = "Create an API key for your scripts or apps.",
}: ApiKeysTableProps<T>) {
  return (
    <ResourceTable
      ariaLabel="API keys"
      items={items}
      getRowKey={(item) => item.id}
      emptyTitle="No API keys"
      emptyDescription={emptyDescription}
      columns={[
        {
          key: "name",
          header: "Name",
          cell: (item) => (
            <div className="grid gap-1">
              <ResourceName name={item.name} description={item.tokenHint} />
              {item.status ? <StatusIndicator {...item.status} /> : null}
            </div>
          ),
        },
        ...credentialColumns(formatDate, actions),
      ]}
    />
  );
}

export type AuthorizedClient = ApiKey & {
  client: {
    name: string;
    id?: string;
    logo?: ReactNode;
    trust?: StatusDescriptor;
  };
};
export type AuthorizedClientsTableProps<
  T extends AuthorizedClient = AuthorizedClient,
> = ApiKeysTableProps<T>;
export function AuthorizedClientsTable<T extends AuthorizedClient>({
  items,
  formatDate,
  actions,
  emptyDescription = "Connect an app by signing in from the app.",
}: AuthorizedClientsTableProps<T>) {
  return (
    <ResourceTable
      ariaLabel="Authorized clients"
      items={items}
      getRowKey={(item) => item.id}
      emptyTitle="No authorized clients"
      emptyDescription={emptyDescription}
      columns={[
        {
          key: "client",
          header: "App",
          cell: (item) => (
            <div className="flex min-w-0 items-start gap-2">
              {item.client.logo ? (
                <span aria-hidden="true" className="shrink-0 [&_svg]:size-5">
                  {item.client.logo}
                </span>
              ) : null}
              <div className="grid gap-1">
                <ResourceName
                  name={item.client.name}
                  description={item.client.id}
                />
                {item.client.trust ? (
                  <StatusIndicator {...item.client.trust} />
                ) : null}
              </div>
            </div>
          ),
        },
        ...credentialColumns(formatDate, actions),
      ]}
    />
  );
}
