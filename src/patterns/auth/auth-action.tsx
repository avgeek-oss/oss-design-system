"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/utils.js";

export function AuthAction({
  className,
  ...props
}: ComponentPropsWithRef<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "w-fit text-sm text-muted underline decoration-dashed decoration-muted/50 underline-offset-4 hover:text-foreground hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function BackToSignIn({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <AuthAction disabled={disabled} onClick={onClick}>
      ← Back to Sign In
    </AuthAction>
  );
}
