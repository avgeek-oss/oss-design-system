"use client";

import { useId, type ReactNode } from "react";
import { ResourceTable } from "../resource-table.js";
import { ResourceName } from "../resource-table.js";
import { Checkbox } from "../../forms/checkbox.js";
import { Label } from "../../forms/label.js";
import { FieldError } from "../../forms/field.js";
import { AsyncActionButton } from "../actions/async-action-button.js";
import { useAsyncAction } from "../use-async-action.js";
import { actionColumn } from "../settings/table-actions.js";

export type SubscriptionMode = "off" | "all" | "failures";
export type NotificationCategory = {
  id: string;
  label: string;
  modes: readonly SubscriptionMode[];
};
export type NotificationDestination = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  subscriptions: Readonly<Record<string, SubscriptionMode>>;
};
export type NotificationDestinationsSettingsProps<
  T extends NotificationDestination = NotificationDestination,
> = {
  items: T[];
  categories: readonly NotificationCategory[];
  onSubscriptionChange: (
    item: T,
    category: string,
    mode: SubscriptionMode,
  ) => Promise<void>;
  onTest?: (item: T) => Promise<void>;
  onRemove?: (item: T) => Promise<void>;
  actions?: (item: T) => ReactNode;
  toolbar?: ReactNode;
  children?: ReactNode;
  isDisabled?: boolean;
};
export function NotificationDestinationsSettings<
  T extends NotificationDestination,
>({
  items,
  categories,
  onSubscriptionChange,
  onTest,
  onRemove,
  actions,
  toolbar,
  children,
  isDisabled = false,
}: NotificationDestinationsSettingsProps<T>) {
  const id = useId();
  const action = useAsyncAction("Could not save notification subscriptions");
  const disabled = isDisabled || action.isPending;
  return (
    <div className="grid min-w-0 gap-4" aria-busy={action.isPending}>
      {toolbar}
      {action.error ? <FieldError>{action.error}</FieldError> : null}
      <ResourceTable
        ariaLabel="Notification destinations"
        items={items}
        getRowKey={(item) => item.id}
        emptyTitle="No notification destinations"
        emptyDescription="Add a destination to receive notifications."
        columns={[
          {
            key: "destination",
            header: "Destination",
            className: "min-w-48",
            cell: (item) => (
              <div className="flex items-center gap-2">
                {item.icon ? (
                  <span aria-hidden="true" className="shrink-0 [&_svg]:size-5">
                    {item.icon}
                  </span>
                ) : null}
                <ResourceName
                  name={item.label}
                  description={item.description}
                />
              </div>
            ),
          },
          ...categories.map((category) => ({
            key: `category-${category.id}`,
            header: category.label,
            className: category.modes.includes("failures")
              ? "min-w-64"
              : "min-w-40",
            cell: (item: T) => {
              const mode = item.subscriptions[category.id] ?? "off";
              const change = async (mode: SubscriptionMode) => {
                await action.run(() =>
                  onSubscriptionChange(item, category.id, mode),
                );
              };
              if (!category.modes.includes("failures"))
                return (
                  <Checkbox
                    aria-label={`${category.label} for ${item.label}`}
                    isSelected={mode === "all"}
                    isDisabled={
                      disabled ||
                      !category.modes.includes("all") ||
                      !category.modes.includes("off")
                    }
                    onChange={async (selected) => {
                      await change(selected ? "all" : "off");
                    }}
                  >
                    <Checkbox.Content>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Label className="sr-only">
                        {category.label} for {item.label}
                      </Label>
                    </Checkbox.Content>
                  </Checkbox>
                );
              return (
                <fieldset
                  disabled={disabled}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  <legend className="sr-only">
                    {category.label} for {item.label}
                  </legend>
                  {category.modes
                    .filter((value) => value !== "off")
                    .map((value) => (
                      <label
                        key={value}
                        className="inline-flex cursor-pointer items-center gap-1.5"
                      >
                        <input
                          type="radio"
                          name={`${id}-${item.id}-${category.id}`}
                          value={value}
                          checked={value === mode}
                          onChange={async () => {
                            await change(value);
                          }}
                          className="size-4 accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        />
                        <span>{value === "all" ? "All" : "Failures only"}</span>
                      </label>
                    ))}
                  {mode !== "off" && category.modes.includes("off") ? (
                    <button
                      type="button"
                      className="text-muted underline underline-offset-2"
                      onClick={async () => {
                        await change("off");
                      }}
                    >
                      Clear
                    </button>
                  ) : null}
                </fieldset>
              );
            },
          })),
          actionColumn<T>((item) => (
            <>
              {actions?.(item)}
              {onTest ? (
                <AsyncActionButton
                  variant="secondary"
                  isDisabled={disabled}
                  onAction={() => onTest(item)}
                  confirmation={{
                    title: "Send test notification?",
                    description: `Send a test notification to ${item.label}?`,
                    confirmLabel: "Send test",
                    variant: "primary",
                  }}
                >
                  Send test
                </AsyncActionButton>
              ) : null}
              {onRemove ? (
                <AsyncActionButton
                  variant="danger"
                  isDisabled={disabled}
                  onAction={() => onRemove(item)}
                  confirmation={{
                    title: "Remove destination?",
                    description: `${item.label} will stop receiving notifications.`,
                    confirmLabel: "Remove",
                  }}
                >
                  Remove
                </AsyncActionButton>
              ) : null}
            </>
          )),
        ]}
      />
      {children}
    </div>
  );
}
