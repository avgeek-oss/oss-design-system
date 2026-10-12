import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/PasskeyRecoveryVerification-preview";
const meta = {
  title: "Patterns/Auth/PasskeyRecoveryVerification",
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
