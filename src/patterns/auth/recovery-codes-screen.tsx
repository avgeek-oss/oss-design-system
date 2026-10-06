"use client";

import type { ComponentProps, ReactNode } from "react";
import { AuthScreen } from "./auth-screen.js";
import { RecoveryCodes } from "./recovery-codes.js";

export type RecoveryCodesScreenProps = ComponentProps<typeof RecoveryCodes> & {
  brand: ReactNode;
};

export function RecoveryCodesScreen({
  brand,
  ...props
}: RecoveryCodesScreenProps) {
  return (
    <AuthScreen
      brand={brand}
      title="Save your recovery codes"
      description="Use a recovery code if your passkey is unavailable."
    >
      <RecoveryCodes {...props} />
    </AuthScreen>
  );
}
