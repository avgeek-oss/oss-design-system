import { AuthPreview } from "../../../studio/auth-previews";
export default {
  Reset: () => <AuthPreview initial="PasswordSetup" />,
  "First password": () => <AuthPreview initial="FirstPassword" />,
};
