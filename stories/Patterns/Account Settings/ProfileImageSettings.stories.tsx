import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/ProfileImageSettings-preview";
const meta = {
  title: "Patterns/Account Settings/ProfileImageSettings",
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
