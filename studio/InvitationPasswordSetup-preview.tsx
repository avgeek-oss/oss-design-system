import { InvitationPasswordSetup } from "../src/patterns/auth/invitation-password-setup";
import { authPreviewBrand } from "./auth-previews";
import { usePreviewOptions } from "./preview-options";

export default function InvitationPasswordSetupPreview() {
  const { failRequest: fail } = usePreviewOptions();
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
