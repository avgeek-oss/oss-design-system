import { AuthPreview, authPreviewBrand } from "../../../studio/auth-previews";
import { PasskeyVerification } from "../../../src/patterns/auth/passkey-verification";
import { toast } from "../../../src/overlays/toast";
const props = {
  brand: authPreviewBrand,
  onRetry: () => toast.info("Preview passkey requested"),
  onCancelRequest: () => toast.info("Preview cancelled"),
  onBackToSignIn: () => toast.info("Preview back to sign in"),
};
export default {
  Default: () => <AuthPreview initial="PasskeyVerification" />,
  PasskeyOnly: () => <PasskeyVerification {...props} />,
  AuthenticatorAndRecovery: () => (
    <PasskeyVerification
      {...props}
      onAuthenticatorSignIn={() => toast.info("Preview authenticator sign in")}
      onRecoverySignIn={() => toast.info("Preview recovery sign in")}
    />
  ),
};
