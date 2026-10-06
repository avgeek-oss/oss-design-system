"use client";

import type { ComponentProps, ReactNode } from "react";
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
  onPasskeySignIn?: () => void;
};

export function SignIn({
  brand,
  description = "Sign in to your team’s instance.",
  defaultEmail,
  isPending = false,
  onSubmit,
  onForgotPassword,
  onPasskeySignIn,
}: SignInProps) {
  return (
    <AuthScreen brand={brand} title="Sign in" description={description}>
      <IdentityCredentialsForm
        disabled={isPending}
        identifierLabel="Email"
        identifierType="email"
        identifierAutoComplete="email"
        defaultIdentifier={defaultEmail}
        submitIcon={<HugeiconsIcon aria-hidden icon={Login01Icon} size={16} />}
        passwordAction={
          <AuthAction disabled={isPending} onClick={onForgotPassword}>
            Forgot password?
          </AuthAction>
        }
        onSubmit={onSubmit}
      />
      {onPasskeySignIn && (
        <Button
          isDisabled={isPending}
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
