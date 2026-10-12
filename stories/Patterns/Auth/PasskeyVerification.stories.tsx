import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthPreview, authPreviewBrand } from "../../../studio/auth-previews";
import { PasskeyVerification } from "../../../src/patterns/auth/passkey-verification";
import { toast } from "../../../src/overlays/toast";
const props = {
  brand: authPreviewBrand,
  onRetry: () => toast.info("Preview passkey requested"),
  onCancelRequest: () => toast.info("Preview cancelled"),
  onBackToSignIn: () => toast.info("Preview back to sign in"),
};

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
  title: "Patterns/Auth/PasskeyVerification",
  component: PasskeyVerification,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published PasskeyVerification component from @avgeek-oss/design-system/patterns/auth/passkey-verification. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence. See the Controls panel for simulated request states.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AuthPreview initial="PasskeyVerification" />,
};

export const PasskeyOnly: Story = {
  name: "PasskeyOnly",
  render: () => <PasskeyVerification {...props} />,
};

export const AuthenticatorAndRecovery: Story = {
  name: "AuthenticatorAndRecovery",
  render: () => (
    <PasskeyVerification
      {...props}
      onAuthenticatorSignIn={() => toast.info("Preview authenticator sign in")}
      onRecoverySignIn={() => toast.info("Preview recovery sign in")}
    />
  ),
};
