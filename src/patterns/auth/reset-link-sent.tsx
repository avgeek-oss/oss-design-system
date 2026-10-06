"use client";

import type { ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { BackToSignIn } from "./auth-action.js";

export type ResetLinkSentProps = {
  brand: ReactNode;
  onBackToSignIn: () => void;
};

export function ResetLinkSent({ brand, onBackToSignIn }: ResetLinkSentProps) {
  return (
    <AuthScreen
      brand={brand}
      title="Reset your password"
      description="If an account exists for that email, we’ll send a password reset link. Check your inbox and spam folder."
    >
      <BackToSignIn onClick={onBackToSignIn} />
    </AuthScreen>
  );
}
