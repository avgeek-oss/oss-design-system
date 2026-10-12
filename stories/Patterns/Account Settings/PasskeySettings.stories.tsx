import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasskeySettingsPreview } from "../../../studio/account-settings-previews";

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
  title: "Patterns/Account Settings/PasskeySettings",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive PasskeySettings examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <PasskeySettingsPreview />,
};

export const RegistrationAndRemoval: Story = {
  name: "RegistrationAndRemoval",
  render: () => <PasskeySettingsPreview management={false} />,
};

export const Empty: Story = {
  name: "Empty",
  render: () => <PasskeySettingsPreview empty />,
};
