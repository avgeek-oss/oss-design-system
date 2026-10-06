"use client";

import type { ReactNode } from "react";
import { UserAvatar } from "../user-avatar.js";
import { ResourceTable } from "../resource-table.js";
import { StatusIndicator, type StatusDescriptor } from "../status-indicator.js";
import { actionColumn } from "../settings/table-actions.js";
import type { ChoiceOption } from "../choice-field.js";
import { AsyncActionButton } from "../actions/async-action-button.js";

export type Invitation = {
  id: string;
  email: string;
  name?: string;
  role: string;
  expiresAt: string;
  status?: StatusDescriptor;
};
export type InvitationsTableProps<T extends Invitation = Invitation> = {
  items: T[];
  roles: readonly ChoiceOption[];
  formatDate: (value: string) => ReactNode;
  actions?: (item: T) => ReactNode;
  onCopyLink?: (item: T) => Promise<void>;
  onResend?: (item: T) => Promise<void>;
  onRevoke?: (item: T) => Promise<void>;
};
export function InvitationsTable<T extends Invitation>({
  items,
  roles,
  formatDate,
  actions,
  onCopyLink,
  onResend,
  onRevoke,
}: InvitationsTableProps<T>) {
  return (
    <ResourceTable
      ariaLabel="Pending invitations"
      items={items}
      getRowKey={(item) => item.id}
      emptyTitle="No pending invitations"
      emptyDescription="Invite someone by email to let them choose their own password."
      columns={[
        {
          key: "email",
          header: "Email",
          cell: (item) => (
            <div className="flex items-center gap-3">
              <UserAvatar email={item.email} name={item.name} size="sm" />
              <div className="min-w-0 grid gap-1">
                {item.name ? <span>{item.name}</span> : null}
                <span className="break-words">{item.email}</span>
                {item.status ? <StatusIndicator {...item.status} /> : null}
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
                roles.find((role) => role.id === item.role)?.label ?? item.role
              }
            />
          ),
        },
        {
          key: "expires",
          header: "Expires",
          cell: (item) => formatDate(item.expiresAt),
        },
        actionColumn<T>((item) => (
          <>
            {actions?.(item)}
            {onCopyLink ? (
              <AsyncActionButton
                variant="secondary"
                onAction={() => onCopyLink(item)}
              >
                Copy link
              </AsyncActionButton>
            ) : null}
            {onResend ? (
              <AsyncActionButton
                variant="secondary"
                onAction={() => onResend(item)}
                confirmation={{
                  title: "Resend invitation?",
                  description: `Send a new invitation to ${item.email}? Their previous invitation will no longer work.`,
                  confirmLabel: "Resend",
                  variant: "primary",
                }}
              >
                Resend
              </AsyncActionButton>
            ) : null}
            {onRevoke ? (
              <AsyncActionButton
                variant="danger"
                onAction={() => onRevoke(item)}
                confirmation={{
                  title: "Revoke invitation?",
                  description: `The invitation for ${item.email} will no longer work.`,
                  confirmLabel: "Revoke",
                }}
              >
                Revoke
              </AsyncActionButton>
            ) : null}
          </>
        )),
      ]}
    />
  );
}
