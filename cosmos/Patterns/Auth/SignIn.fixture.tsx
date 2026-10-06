import { AuthPreview, authPreviewBrand } from "../../../studio/auth-previews";
import { SignIn } from "../../../src/patterns/auth/sign-in";
export default {
  Default: () => <AuthPreview initial="SignIn" />,
  "Credential retry": () => (
    <SignIn
      brand={authPreviewBrand}
      onSubmit={async () => {
        throw new Error("Could not sign in. Try again.");
      }}
    />
  ),
  Pending: () => (
    <SignIn
      brand={authPreviewBrand}
      defaultEmail="alex@example.test"
      isPending
      onSubmit={async () => {}}
      onForgotPassword={() => {}}
      onResendVerification={() => {}}
      onPasskeySignIn={() => {}}
    />
  ),
};
