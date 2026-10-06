"use client";

import type { ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { AuthForm } from "./auth-form.js";
import { BackToSignIn } from "./auth-action.js";

export type InvitationPasswordSetupProps = {
  brand: ReactNode;
  teamName: string;
  email: string;
  role: string;
  maxNameLength?: number;
  minPasswordLength?: number;
  maxPasswordLength?: number;
  onSubmit: (values: { name: string; password: string }) => Promise<void>;
  onBackToSignIn: () => void;
};

export function InvitationPasswordSetup({
  brand,
  teamName,
  email,
  role,
  maxNameLength = 120,
  minPasswordLength = 15,
  maxPasswordLength = 1024,
  onSubmit,
  onBackToSignIn,
}: InvitationPasswordSetupProps) {
  const password = {
    type: "password",
    required: true,
    autoComplete: "new-password",
    minLength: minPasswordLength,
    maxLength: maxPasswordLength,
  } as const;
  return (
    <AuthScreen
      brand={brand}
      title={`Join ${teamName}`}
      description={`Create your account for ${email} to join the team as ${role}.`}
    >
      <AuthForm
        fields={[
          {
            name: "name",
            label: "Your Name",
            required: true,
            autoComplete: "name",
            maxLength: maxNameLength,
          },
          {
            name: "password",
            label: "Password",
            ...password,
            description: `Use at least ${minPasswordLength} characters. A long, unique passphrase works well.`,
          },
          { name: "confirmPassword", label: "Confirm password", ...password },
        ]}
        submitLabel="Create account and join"
        onSubmit={async (values) => {
          if (values.password !== values.confirmPassword)
            throw new Error("Passwords do not match");
          await onSubmit({ name: values.name!, password: values.password! });
        }}
      />
      <BackToSignIn onClick={onBackToSignIn} />
    </AuthScreen>
  );
}
