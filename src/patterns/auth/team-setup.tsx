"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AuthForm, type AuthField } from "./auth-form.js";
import { AuthScreen } from "./auth-screen.js";
import {
  browserDateTimePreferences,
  DateTimePreferenceFields,
  type DateTimePreferenceOptions,
  type DateTimePreferences,
} from "../settings/date-time-preference-fields.js";

type AccountDetails = {
  setupSecret: string;
  team: string;
  name: string;
  email: string;
  password: string;
};
export type TeamSetupValues = AccountDetails & DateTimePreferences;

export function TeamSetup({
  brand,
  preferenceOptions,
  initialPreferences,
  setupSecretDescription,
  onSubmit,
}: {
  brand: ReactNode;
  preferenceOptions: DateTimePreferenceOptions;
  initialPreferences?: DateTimePreferences;
  setupSecretDescription?: string;
  onSubmit: (values: TeamSetupValues) => Promise<void>;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [account, setAccount] = useState<AccountDetails>({
    setupSecret: "",
    team: "",
    name: "",
    email: "",
    password: "",
  });
  const [preferences, setPreferences] = useState(
    () => initialPreferences ?? browserDateTimePreferences(preferenceOptions),
  );
  const [submitting, setSubmitting] = useState(false);
  const submissionPending = useRef(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current !== step) {
      headingRef.current?.focus();
      previousStep.current = step;
    }
  }, [step]);

  const fields: Array<AuthField & { name: keyof AccountDetails }> = [
    {
      name: "setupSecret",
      label: "Installation setup secret",
      type: "password",
      required: true,
      maxLength: 1024,
      autoComplete: "off",
      description:
        setupSecretDescription ??
        "Copy the installation setup secret from your API startup logs.",
    },
    { name: "team", label: "Team name", required: true, maxLength: 120 },
    {
      name: "name",
      label: "Your Name",
      required: true,
      maxLength: 120,
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      minLength: 15,
      autoComplete: "new-password",
      description:
        "Use at least 15 characters. A long, unique passphrase works well.",
    },
  ];
  return (
    <AuthScreen
      brand={brand}
      headingRef={headingRef}
      brandEndContent={
        <ol
          className="flex shrink-0 items-center gap-2"
          aria-label="Setup progress"
        >
          {[1, 2].map((number) => (
            <li
              key={number}
              aria-current={step === number ? "step" : undefined}
            >
              <span
                aria-hidden="true"
                className={`block size-2 rounded-full ${step === number ? "bg-accent" : "bg-muted/30"}`}
              />
              <span className="sr-only">
                Step {number} of 2:{" "}
                {number === 1 ? "Account details" : "Preferences"}
              </span>
            </li>
          ))}
        </ol>
      }
      title={step === 1 ? "Set up your team" : "Set your preferences"}
      description={
        step === 1
          ? "Create your team and admin account."
          : "Choose how dates and times appear."
      }
    >
      {step === 1 ? (
        <AuthForm
          key="account"
          fields={fields.map((field) => ({
            ...field,
            value: account[field.name],
            onChange: (event) =>
              setAccount((current) => ({
                ...current,
                [field.name]: event.target.value,
              })),
          }))}
          submitLabel="Continue"
          onSubmit={async () => setStep(2)}
        />
      ) : (
        <>
          <AuthForm
            key="preferences"
            fields={[]}
            submitLabel="Complete Setup"
            busyLabel="Completing setup…"
            onSubmit={async () => {
              if (submissionPending.current) return;
              submissionPending.current = true;
              setSubmitting(true);
              try {
                await onSubmit({ ...account, ...preferences });
              } finally {
                submissionPending.current = false;
                setSubmitting(false);
              }
            }}
          >
            <DateTimePreferenceFields
              options={preferenceOptions}
              preferences={preferences}
              onChange={setPreferences}
              disabled={submitting}
            />
          </AuthForm>
          <button
            type="button"
            disabled={submitting}
            className="w-fit text-sm text-muted underline decoration-dashed decoration-muted/50 underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-50"
            onClick={() => setStep(1)}
          >
            ← Back
          </button>
        </>
      )}
    </AuthScreen>
  );
}
