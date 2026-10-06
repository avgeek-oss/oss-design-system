"use client";

import type { ReactNode } from "react";
import { Widget } from "../../data-display/widget.js";
import { Attributes } from "../../data-display/attributes.js";
import { EmptyState } from "../../data-display/empty-state.js";
import { StatusIndicator, type StatusDescriptor } from "../status-indicator.js";
import { AsyncActionButton } from "../actions/async-action-button.js";

export type IntegrationConnection = {
  id: string;
  status: StatusDescriptor;
  details: readonly { id: string; label: string; value: ReactNode }[];
};
export type IntegrationConnectionCardProps = {
  provider: { name: string; icon?: ReactNode };
  connection: IntegrationConnection | null;
  emptyDescription: string;
  disconnectDescription: ReactNode;
  onConnect?: () => Promise<void>;
  onReauthorize?: () => Promise<void>;
  onDisconnect?: () => Promise<void>;
  children?: ReactNode;
};
export function IntegrationConnectionCard({
  provider,
  connection,
  emptyDescription,
  disconnectDescription,
  onConnect,
  onReauthorize,
  onDisconnect,
  children,
}: IntegrationConnectionCardProps) {
  return (
    <Widget>
      <Widget.Header
        endContent={
          connection ? <StatusIndicator {...connection.status} /> : null
        }
      >
        <Widget.Title icon={provider.icon} help={false}>
          {provider.name} connection
        </Widget.Title>
      </Widget.Header>
      <Widget.Content className="grid gap-4">
        {connection ? (
          <>
            <Attributes variant="embedded" columns={1}>
              {connection.details.map((field) => (
                <Attributes.Item key={field.id} label={field.label}>
                  {field.value}
                </Attributes.Item>
              ))}
            </Attributes>
            <div className="flex flex-wrap gap-3">
              {onReauthorize ? (
                <AsyncActionButton
                  onAction={onReauthorize}
                  pendingLabel={`Opening ${provider.name}…`}
                >
                  Reauthorize {provider.name}
                </AsyncActionButton>
              ) : null}
              {onDisconnect ? (
                <AsyncActionButton
                  variant="danger"
                  onAction={onDisconnect}
                  confirmation={{
                    title: `Disconnect ${provider.name}?`,
                    description: disconnectDescription,
                    confirmLabel: `Disconnect ${provider.name}`,
                  }}
                >
                  Disconnect {provider.name}
                </AsyncActionButton>
              ) : null}
            </div>
          </>
        ) : (
          <EmptyState>
            <EmptyState.Header>
              <EmptyState.Title>{provider.name} not connected</EmptyState.Title>
              <EmptyState.Description>
                {emptyDescription}
              </EmptyState.Description>
            </EmptyState.Header>
            {onConnect ? (
              <EmptyState.Content>
                <AsyncActionButton
                  onAction={onConnect}
                  pendingLabel={`Opening ${provider.name}…`}
                >
                  Connect {provider.name}
                </AsyncActionButton>
              </EmptyState.Content>
            ) : null}
          </EmptyState>
        )}
        {children}
      </Widget.Content>
    </Widget>
  );
}
