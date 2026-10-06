import { InvitationPasswordSetup } from "../src/patterns/auth/invitation-password-setup";
import { authPreviewBrand } from "./auth-previews";
import { useFixtureInput } from "react-cosmos/client";

export default function InvitationPasswordSetupPreview() {
  const [fail] = useFixtureInput("Fail request", false);
  const request = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (fail) throw new Error("Could not complete the request. Try again.");
  };
  return (
    <InvitationPasswordSetup
      brand={authPreviewBrand}
      teamName="Avgeek"
      email="alex@example.test"
      role="Member"
      onSubmit={request}
      onBackToSignIn={() => {}}
    />
  );
}
