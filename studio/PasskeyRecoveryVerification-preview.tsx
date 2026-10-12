import { PasskeyRecoveryVerification } from "../src/patterns/auth/passkey-recovery-verification";
import { authPreviewBrand } from "./auth-previews";
import { usePreviewOptions } from "./preview-options";

export default function PasskeyRecoveryVerificationPreview() {
  const { failRequest: fail } = usePreviewOptions();
  const request = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (fail) throw new Error("Could not complete the request. Try again.");
  };
  return (
    <PasskeyRecoveryVerification
      brand={authPreviewBrand}
      onSubmit={request}
      onPasskeyVerification={() => {}}
      onBackToSignIn={() => {}}
    />
  );
}
