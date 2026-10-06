"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Login01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../../buttons/button.js";
import { AuthScreen } from "./auth-screen.js";
import { AuthAction } from "./auth-action.js";
import { IdentityCredentialsForm } from "./identity-credentials-form.js";

export type SignInProps = {
  brand: ReactNode;
  description?: ReactNode;
  defaultEmail?: string;
  isPending?: boolean;
  onSubmit: ComponentProps<typeof IdentityCredentialsForm>["onSubmit"];
  onForgotPassword: () => void;
  onResendVerification?: () => void;
  onPasskeySignIn?: () => void;
};

export function SignIn({
  brand,
  description = "Sign in to your account.",
  defaultEmail,
  isPending = false,
  onSubmit,
  onForgotPassword,
  onResendVerification,
  onPasskeySignIn,
}: SignInProps) {
  const [submitting, setSubmitting] = useState(false);
  const pending = isPending || submitting;
  return (
    <AuthScreen brand={brand} title="Sign in" description={description}>
      <IdentityCredentialsForm
        disabled={pending}
        aria-busy={pending}
        submitLabel={pending ? "Signing in…" : "Sign in"}
        identifierLabel="Email"
        identifierType="email"
        identifierAutoComplete="email"
        defaultIdentifier={defaultEmail}
        submitIcon={<HugeiconsIcon aria-hidden icon={Login01Icon} size={16} />}
        passwordAction={
          <AuthAction disabled={pending} onClick={onForgotPassword}>
            Forgot password?
          </AuthAction>
        }
        onSubmit={async (credentials) => {
          setSubmitting(true);
          try {
            await onSubmit(credentials);
          } finally {
            setSubmitting(false);
          }
        }}
      />
      {onResendVerification && (
        <AuthAction disabled={pending} onClick={onResendVerification}>
          Need a new verification email?
        </AuthAction>
      )}
      {onPasskeySignIn && (
        <Button
          isDisabled={pending}
          className="w-full"
          variant="secondary"
          onPress={onPasskeySignIn}
        >
          Sign in with Passkey
        </Button>
      )}
    </AuthScreen>
  );
}
