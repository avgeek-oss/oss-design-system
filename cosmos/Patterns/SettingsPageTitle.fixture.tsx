import {
  SettingsPageTitle,
  settingsPageLabels,
  type CommonSettingsSection,
} from "../../src/patterns/settings/page-title.js";
export default Object.fromEntries(
  Object.keys(settingsPageLabels).map((section) => [
    section,
    <h1 className="text-lg font-medium">
      <SettingsPageTitle section={section as CommonSettingsSection} />
    </h1>,
  ]),
);
