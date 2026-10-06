"use client";

import type { ReactNode } from "react";
import { Button } from "../../buttons/button.js";
import { AuthScreen } from "./auth-screen.js";
import { BackToSignIn } from "./auth-action.js";

export type AcceptInvitationProps = {
  brand: ReactNode;
  teamName: string;
  role: string;
  isPending?: boolean;
  onVerifyEmail: () => void;
  onBackToSignIn: () => void;
};

export function AcceptInvitation({
  brand,
  teamName,
  role,
  isPending = false,
  onVerifyEmail,
  onBackToSignIn,
}: AcceptInvitationProps) {
  return (
    <AuthScreen
      brand={brand}
      title={`Join ${teamName}`}
      description={`You’ve been invited to join the ${teamName} team as a ${role}. Verify your email address to accept the invitation and set up your account.`}
    >
      <Button
        className="w-full"
        isDisabled={isPending}
        isPending={isPending}
        onPress={onVerifyEmail}
      >
        Verify email to continue
      </Button>
      <BackToSignIn onClick={onBackToSignIn} />
    </AuthScreen>
  );
}
