import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/InvitationPasswordSetup-preview";
const meta = {
  title: "Patterns/Auth/InvitationPasswordSetup",
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
