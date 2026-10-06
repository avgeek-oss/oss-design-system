"use client";

import type { ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { AuthForm } from "./auth-form.js";
import { BackToSignIn } from "./auth-action.js";
import { emailField, currentPasswordField } from "./auth-fields.js";

export type RecoverySignInProps = {
  brand: ReactNode;
  defaultEmail?: string;
  onSubmit: (values: {
    email: string;
    password: string;
    recoveryCode: string;
  }) => Promise<void>;
  onBackToSignIn: () => void;
};

export function RecoverySignIn({
  brand,
  defaultEmail,
  onSubmit,
  onBackToSignIn,
}: RecoverySignInProps) {
  return (
    <AuthScreen
      brand={brand}
      title="Use a recovery code"
      description="Enter your password and an unused recovery code."
    >
      <AuthForm
        fields={[
          { ...emailField, defaultValue: defaultEmail },
          currentPasswordField,
          {
            name: "recoveryCode",
            label: "Recovery code",
            required: true,
            autoComplete: "one-time-code",
            spellCheck: false,
          },
        ]}
        onSubmit={(values) =>
          onSubmit({
            email: values.email!,
            password: values.password!,
            recoveryCode: values.recoveryCode!,
          })
        }
        submitLabel="Sign in"
      />
      <BackToSignIn onClick={onBackToSignIn} />
    </AuthScreen>
  );
}
