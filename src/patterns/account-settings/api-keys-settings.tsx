"use client";

import { useEffect, useRef, useState } from "react";
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
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (revoking || !opener.current) return;
    const target = opener.current;
    // A grid may restore its row after the modal returns focus to its action.
    let frame = 0;
    const restore = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!document.hasFocus() || !target.isConnected) return;
        const active = document.activeElement;
        if (
          active === document.body ||
          active === target.closest('[role="row"]') ||
          active === target.closest('[role="gridcell"]')
        )
          target.focus({ preventScroll: true });
      });
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("pointerdown", stop, true);
      document.removeEventListener("keydown", stop, true);
      window.removeEventListener("blur", stop);
    };
    const onFocus = (event: FocusEvent) => {
      const active = event.target;
      if (active === target) return;
      if (
        active === document.body ||
        active === target.closest('[role="row"]') ||
        active === target.closest('[role="gridcell"]')
      )
        restore();
      else stop();
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("pointerdown", stop, true);
    document.addEventListener("keydown", stop, true);
    window.addEventListener("blur", stop);
    restore();
    return stop;
  }, [revoking]);
  return (
    <>
      <ApiKeysTable
        items={items}
        formatDate={formatDate}
        emptyDescription={emptyDescription}
        actions={(item) => (
          <>
            {actions?.(item)}
            <Button
              variant="danger"
              onPress={(event) => {
                opener.current =
                  event.target instanceof HTMLElement ? event.target : null;
                setRevoking(item);
              }}
            >
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
