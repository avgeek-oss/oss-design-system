import { ProfileImageSettings } from "../src/patterns/account-settings/profile-image-settings";

export default function ProfileImageSettingsPreview() {
  return (
    <div className="max-w-lg p-4">
      <ProfileImageSettings email="alex@example.test" name="Alex Morgan" />
    </div>
  );
}
