"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "../../buttons/button.js";
import { toast } from "../../overlays/toast.js";
import { useAsyncAction } from "../use-async-action.js";
import { AuthScreen } from "./auth-screen.js";
import { AuthForm } from "./auth-form.js";

export type InvitationVerificationProps = {
  brand: ReactNode;
  teamName: string;
  defaultName?: string;
  maxNameLength?: number;
  onResendCode?: () => Promise<void>;
  resendAvailableAt?: number;
  onSubmit: (values: { name: string; code: string }) => Promise<void>;
};

export function InvitationVerification({
  brand,
  teamName,
  defaultName,
  maxNameLength,
  onSubmit,
  onResendCode,
  resendAvailableAt = 0,
}: InvitationVerificationProps) {
  const action = useAsyncAction("Unable to continue. Try again.");
  const [resending, setResending] = useState(false);
  const [secondsUntilResend, setSecondsUntilResend] = useState(0);
  useEffect(() => {
    const update = () =>
      setSecondsUntilResend(
        Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000)),
      );
    update();
    if (!resendAvailableAt) return;
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [resendAvailableAt]);
  return (
    <AuthScreen
      brand={brand}
      title={`Join ${teamName}`}
      description="Verify your invited email address."
    >
      <fieldset disabled={action.isPending} className="min-w-0 border-0 p-0">
        <AuthForm
          fields={[
            {
              name: "name",
              label: "Your Name",
              required: true,
              autoComplete: "name",
              defaultValue: defaultName,
              maxLength: maxNameLength,
            },
            {
              name: "code",
              label: "Email verification code",
              required: true,
              autoComplete: "one-time-code",
              inputMode: "numeric",
              pattern: "[0-9]{6}",
              maxLength: 6,
              description:
                "Enter the six-digit code sent to your invited email address.",
            },
          ]}
          submitLabel="Verify and continue"
          onSubmit={async (values) => {
            await action.run(async () => {
              setResending(false);
              await onSubmit({
                name: values.name ?? "",
                code: values.code ?? "",
              });
            });
          }}
        />
      </fieldset>
      {onResendCode && (
        <Button
          variant="secondary"
          isPending={action.isPending && resending}
          isDisabled={
            (action.isPending && !resending) || secondsUntilResend > 0
          }
          onPress={async () => {
            if (Date.now() < resendAvailableAt) return;
            const result = await action.run(async () => {
              setResending(true);
              await onResendCode();
            });
            if (result.ok) toast.success("Verification code requested.");
          }}
        >
          {secondsUntilResend
            ? `Resend in ${secondsUntilResend}s`
            : "Resend code"}
        </Button>
      )}
    </AuthScreen>
  );
}
