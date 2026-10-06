"use client";

import { UserAvatar } from "../user-avatar.js";
import { StatusIndicator, type StatusDescriptor } from "../status-indicator.js";
import {
  ResourceTable,
  ResourceName,
  type ResourceTableColumn,
} from "../resource-table.js";
import { actionColumn } from "../settings/table-actions.js";
import type { ChoiceOption } from "../choice-field.js";
import type { ReactNode } from "react";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  accountStatus?: StatusDescriptor;
  securityStatus?: StatusDescriptor;
  emailVerified?: boolean;
  passkeyEnabled?: boolean;
};
export type MembersTableProps<T extends Member = Member> = {
  items: T[];
  actions: (item: T) => ReactNode;
  roles?: readonly ChoiceOption[];
  emptyDescription?: string;
};
export function MembersTable<T extends Member>({
  items,
  actions,
  roles,
  emptyDescription = "Add a team member to get started.",
}: MembersTableProps<T>) {
  const security = items.some((item) => item.securityStatus !== undefined);
  const columns: ResourceTableColumn<T>[] = [
    {
      key: "member",
      header: "Member",
      cell: (item) => (
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar email={item.email} name={item.name} />
          <div className="grid gap-1">
            <ResourceName name={item.name} description={item.email} />
            {item.emailVerified === false ? (
              <StatusIndicator label="Email unverified" color="warning" />
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (item) => (
        <StatusIndicator
          label={
            roles?.find((role) => role.id === item.role)?.label ??
            {
              admin: "Admin",
              member: "Member",
              editor: "Editor",
              viewer: "Viewer",
            }[item.role] ??
            item.role
          }
        />
      ),
    },
    {
      key: "account",
      header: "Account",
      cell: (item) =>
        item.accountStatus ? <StatusIndicator {...item.accountStatus} /> : "—",
    },
    {
      key: "security",
      header: security ? "2FA" : "Passkeys",
      cell: (item) =>
        item.securityStatus ? (
          <StatusIndicator {...item.securityStatus} />
        ) : item.passkeyEnabled !== undefined ? (
          <StatusIndicator
            label={item.passkeyEnabled ? "Enabled" : "Not enabled"}
            color={item.passkeyEnabled ? "success" : "danger"}
          />
        ) : (
          "—"
        ),
    },
    actionColumn(actions),
  ];
  return (
    <ResourceTable
      ariaLabel="Members"
      items={items}
      columns={columns}
      getRowKey={(item) => item.id}
      emptyTitle="No members"
      emptyDescription={emptyDescription}
    />
  );
}
