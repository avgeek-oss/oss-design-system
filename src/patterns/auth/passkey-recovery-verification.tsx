"use client";

import type { ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { AuthForm } from "./auth-form.js";
import { AuthAction, BackToSignIn } from "./auth-action.js";

export type PasskeyRecoveryVerificationProps = {
  brand: ReactNode;
  onSubmit: (values: { code: string }) => Promise<void>;
  onPasskeyVerification: () => void;
  onBackToSignIn: () => void;
};

export function PasskeyRecoveryVerification({
  brand,
  onSubmit,
  onPasskeyVerification,
  onBackToSignIn,
}: PasskeyRecoveryVerificationProps) {
  return (
    <AuthScreen
      brand={brand}
      title="Use a recovery code"
      description="Enter an unused recovery code to finish signing in."
    >
      <AuthForm
        fields={[
          {
            name: "code",
            label: "Recovery code",
            required: true,
            autoComplete: "one-time-code",
            maxLength: 100,
            spellCheck: false,
          },
        ]}
        submitLabel="Sign in"
        onSubmit={(values) => onSubmit({ code: values.code! })}
      />
      <div className="flex items-center justify-between gap-4">
        <BackToSignIn onClick={onBackToSignIn} />
        <AuthAction onClick={onPasskeyVerification}>Use a passkey</AuthAction>
      </div>
    </AuthScreen>
  );
}
