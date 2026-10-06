import type { ReactNode } from "react";
import { Chip } from "../../data-display/chip.js";
import { ResourceTable, ResourceName } from "../resource-table.js";

export { MembersTable, type Member } from "../team-settings/members-table.js";
import { actionColumn, type Actions } from "./table-actions.js";

export type Passkey = { id: string; name: string; createdAt: string };
export function PasskeysTable({
  items,
  actions,
  formatDate,
}: {
  items: Passkey[];
  formatDate: (value: string) => ReactNode;
} & Actions<Passkey>) {
  return (
    <ResourceTable
      ariaLabel="Passkeys"
      items={items}
      getRowKey={(item) => item.id}
      emptyTitle="No passkeys added"
      emptyDescription=""
      columns={[
        { key: "name", header: "Name", cell: (item) => item.name || "Passkey" },
        {
          key: "created",
          header: "Created",
          cell: (item) => (
            <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
          ),
        },
        actionColumn(actions),
      ]}
    />
  );
}
export type Session = {
  id: string;
  name: string;
  lastActive: string;
  expiresAt: string;
  current: boolean;
};
export function SessionsTable({
  items,
  actions,
  formatDate,
}: {
  items: Session[];
  formatDate: (value: string) => ReactNode;
} & Actions<Session>) {
  return (
    <ResourceTable
      ariaLabel="Sessions"
      items={items}
      getRowKey={(item) => item.id}
      emptyTitle="No sessions"
      emptyDescription=""
      columns={[
        {
          key: "session",
          header: "Session",
          cell: (item) => (
            <ResourceName name={item.name} description={item.id} />
          ),
        },
        {
          key: "last",
          header: "Last active",
          cell: (item) => formatDate(item.lastActive),
        },
        {
          key: "expires",
          header: "Expires",
          cell: (item) => formatDate(item.expiresAt),
        },
        {
          key: "status",
          header: "Status",
          cell: (item) => (
            <Chip color={item.current ? "accent" : "success"}>
              {item.current ? "Current" : "Active"}
            </Chip>
          ),
        },
        actionColumn(actions),
      ]}
    />
  );
}
export type ApiKey = { id: string; name: string; expiresAt: string | null };
export function ApiKeysTable({
  items,
  actions,
  formatDate,
}: {
  items: ApiKey[];
  formatDate: (value: string) => ReactNode;
} & Actions<ApiKey>) {
  return (
    <ResourceTable
      ariaLabel="API keys"
      items={items}
      getRowKey={(item) => item.id}
      emptyTitle="No API keys"
      emptyDescription=""
      columns={[
        { key: "name", header: "Name", cell: (item) => item.name },
        {
          key: "expiry",
          header: "Expires",
          cell: (item) =>
            item.expiresAt ? formatDate(item.expiresAt) : "Never",
        },
        actionColumn(actions),
      ]}
    />
  );
}
