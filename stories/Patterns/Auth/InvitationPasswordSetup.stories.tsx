import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/InvitationPasswordSetup-preview";
import { InvitationPasswordSetup } from "../../../src/patterns/auth/invitation-password-setup";
const meta = {
  args: { failRequest: false },
  argTypes: {
    failRequest: {
      control: "boolean",
      description: "Simulate a failed request and retain the editable draft.",
    },
  },
  title: "Patterns/Auth/InvitationPasswordSetup",
  component: InvitationPasswordSetup,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published InvitationPasswordSetup component from @avgeek-oss/design-system/patterns/auth/invitation-password-setup. Applications supply data and action callbacks.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
