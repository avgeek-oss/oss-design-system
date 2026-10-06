"use client";

import { useEffect, useId, useState } from "react";
import { Widget } from "../../data-display/widget.js";
import { Field, FieldDescription, FieldError } from "../../forms/field.js";
import { Input } from "../../forms/input.js";
import { Label } from "../../forms/label.js";
import { Button } from "../../buttons/button.js";
import { Modal } from "../../overlays/modal.js";
import { AuthForm } from "../auth/auth-form.js";
import { StatusIndicator } from "../status-indicator.js";
import { AsyncActionButton } from "../actions/async-action-button.js";
import { useAsyncAction } from "../use-async-action.js";

export type PendingEmailChange = { email: string; expiresAt: string };
export type EmailChangeSettingsProps = {
  email: string;
  isVerified: boolean;
  pendingChange?: PendingEmailChange | null;
  resendAvailableAt?: number;
  formatDate?: (value: string) => string;
  error?: string;
  onRequestChange: (email: string) => Promise<void>;
  onCancelChange: () => Promise<void>;
  onResendVerification: () => Promise<void>;
};

export function EmailChangeSettings({
  email,
  isVerified,
  pendingChange,
  resendAvailableAt = 0,
  formatDate,
  error,
  onRequestChange,
  onCancelChange,
  onResendVerification,
}: EmailChangeSettingsProps) {
  const id = useId();
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [secondsUntilResend, setSecondsUntilResend] = useState(0);
  const resend = useAsyncAction("Could not send verification email");
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
    <>
      <Widget>
        <Widget.Header
          endContent={
            isVerified ? (
              <StatusIndicator
                label="Verified"
                color="success"
                description="Your current email address is verified."
              />
            ) : (
              <button
                type="button"
                className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                aria-label="Unverified email. Resend confirmation email"
                onClick={() => setVerificationOpen(true)}
              >
                <StatusIndicator label="Unverified" color="warning" />
              </button>
            )
          }
        >
          <Widget.Title>Email address</Widget.Title>
        </Widget.Header>
        <Widget.Content className="grid gap-4">
          <Field>
            <Label htmlFor={id}>Current email</Label>
            <Input
              id={id}
              type="email"
              value={email}
              disabled
              variant="secondary"
            />
          </Field>
          <AuthForm
            submitButtonClassName="w-auto"
            variant="secondary"
            fields={[
              {
                name: "email",
                label: "New email address",
                type: "email",
                required: true,
                maxLength: 320,
                autoComplete: "email",
              },
            ]}
            submitLabel="Send confirmation"
            busyLabel="Sending…"
            onSubmit={async (values) => {
              await onRequestChange(values.email ?? "");
            }}
          />
          <FieldDescription>
            We’ll send a confirmation link to your new address. Your sign-in
            email changes only after you confirm it.
          </FieldDescription>
          {error ? <FieldError>{error}</FieldError> : null}
          {pendingChange ? (
            <div className="grid gap-3">
              <p className="text-sm text-muted break-words">
                Waiting for confirmation at {pendingChange.email}.
                {formatDate ? (
                  <>
                    {" "}
                    The link expires{" "}
                    <time dateTime={pendingChange.expiresAt}>
                      {formatDate(pendingChange.expiresAt)}
                    </time>
                    .
                  </>
                ) : null}
              </p>
              <div>
                <AsyncActionButton
                  variant="secondary"
                  onAction={onCancelChange}
                >
                  Cancel email change
                </AsyncActionButton>
              </div>
            </div>
          ) : null}
        </Widget.Content>
      </Widget>
      <Modal.Backdrop
        isOpen={verificationOpen}
        onOpenChange={(open) => {
          if (!resend.isPending) setVerificationOpen(open);
        }}
      >
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Verify your email</Modal.Heading>
              <Modal.CloseTrigger isDisabled={resend.isPending} />
            </Modal.Header>
            <Modal.Body className="grid gap-3">
              <p>
                We’ll send a confirmation link to{" "}
                <span className="break-words font-medium">{email}</span>.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                isDisabled={resend.isPending}
                onPress={() => setVerificationOpen(false)}
              >
                Cancel
              </Button>
              <Button
                isDisabled={resend.isPending || secondsUntilResend > 0}
                onPress={async () => {
                  const result = await resend.run(onResendVerification);
                  if (result.ok) setVerificationOpen(false);
                }}
              >
                {resend.isPending
                  ? "Sending…"
                  : secondsUntilResend
                    ? `Resend in ${secondsUntilResend}s`
                    : "Send confirmation"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
