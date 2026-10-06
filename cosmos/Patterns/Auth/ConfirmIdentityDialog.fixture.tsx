import { ConfirmIdentityPreview } from "../../../studio/auth-previews";
export default {
  Password: () => <ConfirmIdentityPreview />,
  Passkey: () => <ConfirmIdentityPreview method="passkey" />,
};
