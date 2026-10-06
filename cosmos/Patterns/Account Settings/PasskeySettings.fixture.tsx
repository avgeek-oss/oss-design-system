import { PasskeySettingsPreview } from "../../../studio/account-settings-previews";
export default {
  Default: () => <PasskeySettingsPreview />,
  RegistrationAndRemoval: () => <PasskeySettingsPreview management={false} />,
  Empty: () => <PasskeySettingsPreview empty />,
};
