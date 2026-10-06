"use client";

import type { ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { AuthForm } from "./auth-form.js";
import { BackToSignIn } from "./auth-action.js";
import { emailField } from "./auth-fields.js";

export type ForgotPasswordProps = {
  brand: ReactNode;
  defaultEmail?: string;
  onSubmit: (values: { email: string }) => Promise<void>;
  onBackToSignIn: () => void;
};

export function ForgotPassword({
  brand,
  defaultEmail,
  onSubmit,
  onBackToSignIn,
}: ForgotPasswordProps) {
  return (
    <AuthScreen
      brand={brand}
      title="Reset your password"
      description="Enter your email to request a password reset link."
    >
      <AuthForm
        fields={[{ ...emailField, defaultValue: defaultEmail }]}
        onSubmit={(values) => onSubmit({ email: values.email! })}
        submitLabel="Send reset link"
      />
      <BackToSignIn onClick={onBackToSignIn} />
    </AuthScreen>
  );
}
