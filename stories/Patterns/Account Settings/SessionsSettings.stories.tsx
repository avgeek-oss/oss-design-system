import type { Meta, StoryObj } from "@storybook/react-vite";
import { SessionsSettingsPreview as ComponentExample } from "../../../studio/account-settings-previews";
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
  title: "Patterns/Account Settings/SessionsSettings",
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
