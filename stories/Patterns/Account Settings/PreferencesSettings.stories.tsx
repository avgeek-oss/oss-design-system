import type { Meta, StoryObj } from "@storybook/react-vite";
import { PreferencesSettingsPreview } from "../../../studio/account-settings-previews";

const meta = {
  args: { failRequest: false, slowResponse: false },
  argTypes: {
    failRequest: {
      control: "boolean",
      description: "Simulate a failed request and retain the editable draft.",
    },
    slowResponse: {
      control: "boolean",
      description: "Simulate a pending request.",
    },
  },
  title: "Patterns/Account Settings/PreferencesSettings",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive PreferencesSettings examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <PreferencesSettingsPreview />,
};

export const AllTimeZones: Story = {
  name: "All time zones",
  render: () => <PreferencesSettingsPreview allTimeZones />,
};
