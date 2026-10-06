"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../../buttons/button.js";
import { AuthScreen } from "./auth-screen.js";
import { AuthForm } from "./auth-form.js";
import { BackToSignIn } from "./auth-action.js";
import { emailField } from "./auth-fields.js";

export type VerificationEmailProps = {
  brand: ReactNode;
  defaultEmail?: string;
  onSubmit: (values: { email: string }) => Promise<void>;
  onBackToSignIn: () => void;
};

export function VerificationEmail({
  brand,
  defaultEmail,
  onSubmit,
  onBackToSignIn,
}: VerificationEmailProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const heading = useRef<HTMLDivElement>(null);
  const previousSent = useRef(sent);
  useEffect(() => {
    if (previousSent.current !== sent) heading.current?.focus();
    previousSent.current = sent;
  }, [sent]);
  return (
    <AuthScreen
      brand={brand}
      headingRef={heading}
      title="Verify your email"
      description={
        sent
          ? "If an account needs email verification, we’ll send a link. Check your inbox and spam folder."
          : "Enter your email to request a verification link."
      }
    >
      {sent ? (
        <Button variant="secondary" onPress={() => setSent(false)}>
          Request another link
        </Button>
      ) : (
        <AuthForm
          fields={[{ ...emailField, maxLength: 320, defaultValue: email }]}
          submitLabel="Send verification link"
          busyLabel="Sending…"
          onSubmit={async (values) => {
            const submittedEmail = values.email ?? "";
            setPending(true);
            try {
              await onSubmit({ email: submittedEmail });
              setEmail(submittedEmail);
              setSent(true);
            } finally {
              setPending(false);
            }
          }}
        />
      )}
      <BackToSignIn disabled={pending} onClick={onBackToSignIn} />
    </AuthScreen>
  );
}
