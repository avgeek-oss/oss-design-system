import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthPreview } from "../../../studio/auth-previews";

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
  title: "Patterns/Auth/PasswordSetup",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive PasswordSetup examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AuthPreview initial="PasswordSetup" />,
};

export const FirstPassword: Story = {
  name: "First password",
  render: () => <AuthPreview initial="FirstPassword" />,
};
