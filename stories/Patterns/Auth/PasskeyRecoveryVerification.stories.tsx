import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/PasskeyRecoveryVerification-preview";
import { PasskeyRecoveryVerification } from "../../../src/patterns/auth/passkey-recovery-verification";
const meta = {
  args: { failRequest: false },
  argTypes: {
    failRequest: {
      control: "boolean",
      description: "Simulate a failed request and retain the editable draft.",
    },
  },
  title: "Patterns/Auth/PasskeyRecoveryVerification",
  component: PasskeyRecoveryVerification,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published PasskeyRecoveryVerification component from @avgeek-oss/design-system/patterns/auth/passkey-recovery-verification. Applications supply data and action callbacks.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
