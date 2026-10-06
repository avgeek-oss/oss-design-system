"use client";

import type { ComponentProps } from "react";
import { Button } from "../../buttons/button.js";
import { cn } from "../../lib/utils.js";

export type QueryLoadingProps = ComponentProps<"div">;
export function QueryLoading({
  children = "Loading…",
  className,
  ...props
}: QueryLoadingProps) {
  return (
    <div
      {...props}
      role="status"
      className={cn("text-sm text-muted", className)}
    >
      {children}
    </div>
  );
}

export type QueryErrorProps = ComponentProps<"div"> & {
  message: string;
  onRetry?: () => void;
};
export function QueryError({
  message,
  onRetry,
  className,
  ...props
}: QueryErrorProps) {
  return (
    <div {...props} className={cn("grid gap-3", className)}>
      <p role="alert" className="text-sm text-danger-soft-foreground">
        {message}
      </p>
      {onRetry ? (
        <div>
          <Button variant="secondary" onPress={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
    </div>
  );
}
