"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import ViewIcon from "@hugeicons/core-free-icons/ViewIcon";
import Edit02Icon from "@hugeicons/core-free-icons/Edit02Icon";
import UserShield01Icon from "@hugeicons/core-free-icons/UserShield01Icon";
import { AuthScreen } from "./auth-screen.js";
import { AuthAction } from "./auth-action.js";
import { Button } from "../../buttons/button.js";
import { InputGroup } from "../../forms/input-group.js";
import { Field } from "../../forms/field.js";
import { Label } from "../../forms/label.js";
import { Select, ListBox } from "../../forms/select.js";
import { toast } from "../../overlays/toast.js";

export type McpAccessLevel = "read" | "write" | "admin";

export type McpAuthorizationProps = {
  brand: ReactNode;
  productName: string;
  clientName: string;
  clientLogo?: ReactNode;
  accessLevel: McpAccessLevel;
  availableAccessLevels: readonly McpAccessLevel[];
  onAccessLevelChange: (value: McpAccessLevel) => void;
  isPending?: boolean;
  isDisabled?: boolean;
  error?: ReactNode;
  approvalBlockedReason?: ReactNode;
  onApprove: () => void;
  onDeny: () => void;
};

const scopes = [
  { id: "read", label: "Read-only", icon: ViewIcon },
  { id: "write", label: "Write", icon: Edit02Icon },
  { id: "admin", label: "Administrator", icon: UserShield01Icon },
] as const;

export function McpAuthorization({
  brand,
  productName,
  clientName,
  clientLogo,
  accessLevel,
  availableAccessLevels,
  onAccessLevelChange,
  isPending = false,
  isDisabled = false,
  error,
  approvalBlockedReason,
  onApprove,
  onDeny,
}: McpAuthorizationProps) {
  const applicationId = useId();
  const reportedError = useRef<ReactNode>(undefined);
  useEffect(() => {
    if (error != null && error !== reportedError.current) toast.danger(error);
    reportedError.current = error;
  }, [error]);
  const selected = scopes.find((scope) => scope.id === accessLevel);
  const approvalBlocked =
    approvalBlockedReason != null ||
    !availableAccessLevels.includes(accessLevel);
  const disabled = isPending || isDisabled;
  return (
    <AuthScreen
      brand={brand}
      title={`Connect to ${productName}`}
      description={`Allow MCP connection to ${productName}. Review the application and the scope to continue.`}
    >
      <form
        className="grid min-w-0 gap-6 text-sm"
        method="post"
        aria-busy={isPending}
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled && !approvalBlocked) onApprove();
        }}
      >
        <Field>
          <Label htmlFor={applicationId}>Application</Label>
          <InputGroup variant="primary" isDisabled>
            {clientLogo && (
              <InputGroup.Prefix>
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-5 [&_img]:size-5"
                >
                  {clientLogo}
                </span>
              </InputGroup.Prefix>
            )}
            <InputGroup.Input
              id={applicationId}
              value={clientName}
              disabled
              readOnly
            />
          </InputGroup>
        </Field>
        <Select
          aria-label="Select Scope"
          variant="primary"
          selectedKey={accessLevel}
          isDisabled={disabled}
          disabledKeys={scopes
            .filter((scope) => !availableAccessLevels.includes(scope.id))
            .map((scope) => scope.id)}
          onSelectionChange={(key) => {
            const scope = scopes.find((item) => item.id === key);
            if (scope && availableAccessLevels.includes(scope.id))
              onAccessLevelChange(scope.id);
          }}
        >
          <Label>Select Scope</Label>
          <Select.Trigger>
            <Select.Value className="flex min-w-0 flex-1 items-center gap-2">
              {selected && (
                <HugeiconsIcon
                  icon={selected.icon}
                  size={16}
                  aria-hidden="true"
                />
              )}
              <span className="truncate">{selected?.label}</span>
            </Select.Value>
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {scopes.map((scope) => (
                <ListBox.Item
                  id={scope.id}
                  key={scope.id}
                  textValue={scope.label}
                >
                  <HugeiconsIcon
                    icon={scope.icon}
                    size={16}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">{scope.label}</span>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <p className="text-muted">
          Access to the application would be governed based on your current
          access role. In case it is updated in the future, you would be
          required to re-authenticate again.
        </p>
        {approvalBlockedReason != null && (
          <p role="alert" className="text-sm text-danger">
            {approvalBlockedReason}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            isDisabled={disabled}
            onPress={onDeny}
          >
            Deny
          </Button>
          <Button
            type="submit"
            isDisabled={disabled || approvalBlocked}
            isPending={isPending}
          >
            Approve
          </Button>
        </div>
        <AuthAction
          className="max-w-full text-left [overflow-wrap:anywhere]"
          disabled={disabled}
          onClick={onDeny}
        >
          Back to {clientName}
        </AuthAction>
      </form>
    </AuthScreen>
  );
}
