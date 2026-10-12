import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/RevokeInvitationDialog-preview";
const meta = {
  args: { failRequest: false },
  argTypes: {
    failRequest: {
      control: "boolean",
      description: "Simulate a failed request and retain the editable draft.",
    },
  },
  title: "Patterns/Team Settings/RevokeInvitationDialog",
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
