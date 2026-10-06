"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "../../buttons/button.js";
import { useAsyncAction } from "../use-async-action.js";
import { AuthScreen } from "./auth-screen.js";
import { BackToSignIn } from "./auth-action.js";

export type EmailConfirmationProps = {
  brand: ReactNode;
  purpose: "verify-email" | "email-change";
  onBackToSignIn: () => void;
} & (
  | { status: "ready"; onConfirm: () => Promise<void>; onRetry?: never }
  | {
      status: "checking" | "confirmed";
      onConfirm?: never;
      onRetry?: never;
    }
  | {
      status: "unavailable";
      onConfirm?: never;
      onRetry?: () => Promise<void>;
    }
);

export function EmailConfirmation(props: EmailConfirmationProps) {
  const action = useAsyncAction("Could not confirm your email. Try again.");
  const heading = useRef<HTMLDivElement>(null);
  const previousStatus = useRef(props.status);
  useEffect(() => {
    if (previousStatus.current !== props.status) heading.current?.focus();
    previousStatus.current = props.status;
  }, [props.status]);
  const changingEmail = props.purpose === "email-change";
  const pending = action.isPending || props.status === "checking";
  return (
    <AuthScreen
      brand={props.brand}
      headingRef={heading}
      title={changingEmail ? "Confirm email change" : "Verify your email"}
      description={
        props.status === "confirmed"
          ? "Sign in to continue."
          : props.status === "unavailable"
            ? props.onRetry
              ? "Retry confirmation or return to sign in."
              : "Return to sign in."
            : changingEmail
              ? "Confirm your new email address. You’ll be signed out of all browser sessions after confirming."
              : "Confirm your email address to continue."
      }
    >
      {props.status === "checking" && (
        <p role="status" className="text-sm text-muted">
          Checking confirmation link…
        </p>
      )}
      {props.status === "ready" && (
        <Button
          isPending={action.isPending}
          onPress={async () => {
            await action.run(props.onConfirm);
          }}
        >
          {changingEmail ? "Confirm email change" : "Confirm email"}
        </Button>
      )}
      {props.status === "unavailable" && props.onRetry && (
        <Button
          variant="secondary"
          isPending={action.isPending}
          onPress={async () => {
            if (props.onRetry) await action.run(props.onRetry);
          }}
        >
          Retry confirmation
        </Button>
      )}
      <BackToSignIn disabled={pending} onClick={props.onBackToSignIn} />
    </AuthScreen>
  );
}
