"use client";

import type { ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { AuthForm } from "./auth-form.js";
import { BackToSignIn } from "./auth-action.js";

export type PasswordSetupProps = {
  brand: ReactNode;
  mode?: "reset" | "first";
  minLength?: number;
  passwordDescription?: string;
  onSubmit: (values: {
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  onBackToSignIn: () => void;
};

export function PasswordSetup({
  brand,
  mode = "reset",
  minLength = 15,
  passwordDescription = `Use at least ${minLength} characters. A long, unique passphrase works well.`,
  onSubmit,
  onBackToSignIn,
}: PasswordSetupProps) {
  const password = {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    minLength,
    autoComplete: "new-password",
  } as const;
  return (
    <AuthScreen
      brand={brand}
      title={
        mode === "first" ? "Choose your password" : "Choose a new password"
      }
      description="Use a strong, unique password to secure your account."
    >
      <AuthForm
        fields={[
          { ...password, description: passwordDescription },
          { ...password, name: "confirmPassword", label: "Confirm password" },
        ]}
        onSubmit={async (values) => {
          if (values.password !== values.confirmPassword)
            throw new Error("Passwords do not match");
          await onSubmit({
            password: values.password!,
            confirmPassword: values.confirmPassword!,
          });
        }}
        submitLabel={mode === "first" ? "Set password" : "Reset password"}
      />
      <BackToSignIn onClick={onBackToSignIn} />
    </AuthScreen>
  );
}
