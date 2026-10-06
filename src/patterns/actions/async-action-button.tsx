"use client";

import { useState, type ComponentProps } from "react";
import { Button } from "../../buttons/button.js";
import { useAsyncAction } from "../use-async-action.js";
import {
  ActionConfirmation,
  type ActionConfirmationProps,
} from "./action-confirmation.js";

export type AsyncActionButtonProps = Omit<
  ComponentProps<typeof Button>,
  "onPress"
> & {
  onAction: () => Promise<void>;
  pendingLabel?: string;
  confirmation?: Omit<
    ActionConfirmationProps,
    "isOpen" | "onOpenChange" | "onConfirm"
  >;
};
export function AsyncActionButton({
  onAction,
  pendingLabel = "Please wait…",
  confirmation,
  children,
  isDisabled,
  ...props
}: AsyncActionButtonProps) {
  const action = useAsyncAction();
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button
        {...props}
        isDisabled={isDisabled || action.isPending}
        onPress={async () => {
          if (confirmation) setOpen(true);
          else await action.run(onAction);
        }}
      >
        {action.isPending ? pendingLabel : children}
      </Button>
      {confirmation ? (
        <ActionConfirmation
          {...confirmation}
          isOpen={isOpen}
          onOpenChange={setOpen}
          onConfirm={onAction}
        />
      ) : null}
    </>
  );
}
