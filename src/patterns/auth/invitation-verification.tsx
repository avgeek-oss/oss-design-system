"use client";

import type { ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { AuthForm } from "./auth-form.js";

export type InvitationVerificationProps = {
  brand: ReactNode;
  teamName: string;
  defaultName?: string;
  maxNameLength?: number;
  onSubmit: (values: { name: string; code: string }) => Promise<void>;
};

export function InvitationVerification({
  brand,
  teamName,
  defaultName,
  maxNameLength,
  onSubmit,
}: InvitationVerificationProps) {
  return (
    <AuthScreen
      brand={brand}
      title={`Join ${teamName}`}
      description="Verify your invited email address."
    >
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
        onSubmit={(values) =>
          onSubmit({ name: values.name!, code: values.code! })
        }
      />
    </AuthScreen>
  );
}
