"use client";

import type { ReactNode } from "react";
import { FingerPrintIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../../buttons/button.js";
import { AuthScreen } from "./auth-screen.js";
import { AuthAction, BackToSignIn } from "./auth-action.js";

export type PasskeyVerificationProps = {
  brand: ReactNode;
  isPending?: boolean;
  onRetry: () => void;
  onCancelRequest: () => void;
  onRecoverySignIn?: () => void;
  onAuthenticatorSignIn?: () => void;
  onBackToSignIn: () => void;
};

export function PasskeyVerification({
  brand,
  isPending = false,
  onRetry,
  onCancelRequest,
  onRecoverySignIn,
  onAuthenticatorSignIn,
  onBackToSignIn,
}: PasskeyVerificationProps) {
  return (
    <AuthScreen
      brand={brand}
      title="Verify your sign-in"
      description="Use the device or password manager where you saved your passkey."
    >
      <Button className="w-full" isDisabled={isPending} onPress={onRetry}>
        <HugeiconsIcon aria-hidden icon={FingerPrintIcon} size={16} />
        {isPending ? "Waiting for your passkey…" : "Try passkey again"}
      </Button>
      {isPending && (
        <Button variant="secondary" onPress={onCancelRequest}>
          Cancel passkey request
        </Button>
      )}
      <div className="flex items-center justify-between gap-4">
        <BackToSignIn onClick={onBackToSignIn} />
        <div className="grid justify-items-end gap-3">
          {onAuthenticatorSignIn && (
            <AuthAction disabled={isPending} onClick={onAuthenticatorSignIn}>
              Use an authenticator code
            </AuthAction>
          )}
          {onRecoverySignIn && (
            <AuthAction disabled={isPending} onClick={onRecoverySignIn}>
              Use a recovery code
            </AuthAction>
          )}
        </div>
      </div>
    </AuthScreen>
  );
}
