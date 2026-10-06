"use client";

import type { ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { BackToSignIn } from "./auth-action.js";

export type InvitationUnavailableProps = {
  brand: ReactNode;
  description?: ReactNode;
  onBackToSignIn: () => void;
};

export function InvitationUnavailable({
  brand,
  description = "This invitation may have expired, been revoked, or already been accepted. Ask your admin for a new link.",
  onBackToSignIn,
}: InvitationUnavailableProps) {
  return (
    <AuthScreen
      brand={brand}
      title="Invitation unavailable"
      description={description}
    >
      <BackToSignIn onClick={onBackToSignIn} />
    </AuthScreen>
  );
}
