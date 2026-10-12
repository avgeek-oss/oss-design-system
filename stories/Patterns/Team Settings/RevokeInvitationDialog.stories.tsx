import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/RevokeInvitationDialog-preview";
const meta = {
  title: "Patterns/Team Settings/RevokeInvitationDialog",
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
