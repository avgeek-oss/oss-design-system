import { PasskeyRecoveryVerification } from "../src/patterns/auth/passkey-recovery-verification";
import { authPreviewBrand } from "./auth-previews";
import { useFixtureInput } from "react-cosmos/client";

export default function PasskeyRecoveryVerificationPreview() {
  const [fail] = useFixtureInput("Fail request", false);
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
