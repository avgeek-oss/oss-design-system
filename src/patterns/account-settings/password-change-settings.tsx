"use client";

import { useState } from "react";
import { Widget } from "../../data-display/widget.js";
import { AuthForm } from "../auth/auth-form.js";

export type PasswordChangeValues = {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
};
export type PasswordChangeSettingsProps = {
  requireCurrentPassword?: boolean;
  minLength?: number;
  maxLength?: number;
  passwordDescription?: string;
  onChangePassword: (values: PasswordChangeValues) => Promise<void>;
};
export function PasswordChangeSettings({
  requireCurrentPassword = true,
  minLength = 15,
  maxLength = 1024,
  passwordDescription = `Use at least ${minLength} characters. A long, unique passphrase works well.`,
  onChangePassword,
}: PasswordChangeSettingsProps) {
  const [instance, setInstance] = useState(0);
  return (
    <Widget>
      <Widget.Header>
        <Widget.Title>Change password</Widget.Title>
      </Widget.Header>
      <Widget.Content>
        <AuthForm
          submitButtonClassName="w-auto"
          key={instance}
          variant="secondary"
          submitLabel="Change password"
          busyLabel="Changing…"
          fields={[
            ...(requireCurrentPassword
              ? [
                  {
                    name: "currentPassword",
                    label: "Current password",
                    type: "password",
                    required: true,
                    maxLength,
                    autoComplete: "current-password",
                  },
                ]
              : []),
            {
              name: "newPassword",
              label: "New password",
              description: passwordDescription,
              type: "password",
              required: true,
              minLength,
              maxLength,
              autoComplete: "new-password",
            },
            {
              name: "confirmPassword",
              label: "Confirm new password",
              type: "password",
              required: true,
              minLength,
              maxLength,
              autoComplete: "new-password",
            },
          ]}
          onSubmit={async (values) => {
            const newPassword = values.newPassword ?? "";
            const confirmPassword = values.confirmPassword ?? "";
            if (newPassword !== confirmPassword)
              throw new Error("New passwords do not match");
            await onChangePassword({
              ...(requireCurrentPassword
                ? { currentPassword: values.currentPassword ?? "" }
                : {}),
              newPassword,
              confirmPassword,
            });
            setInstance((value) => value + 1);
          }}
        />
      </Widget.Content>
    </Widget>
  );
}
