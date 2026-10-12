import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/RemoveMemberDialog-preview";
const meta = {
  title: "Patterns/Team Settings/RemoveMemberDialog",
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
