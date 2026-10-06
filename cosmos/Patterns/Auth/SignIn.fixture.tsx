import { AuthPreview, authPreviewBrand } from "../../../studio/auth-previews";
import { SignIn } from "../../../src/patterns/auth/sign-in";
export default {
  Default: () => <AuthPreview initial="SignIn" />,
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
