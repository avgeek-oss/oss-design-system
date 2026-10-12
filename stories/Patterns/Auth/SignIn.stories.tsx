import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthPreview, authPreviewBrand } from "../../../studio/auth-previews";
import { SignIn } from "../../../src/patterns/auth/sign-in";
import { AuthPage } from "../../../src/patterns/pages/page";

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
  title: "Patterns/Auth/SignIn",
  component: SignIn,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published SignIn component from @avgeek-oss/design-system/patterns/auth/sign-in. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence. See the Controls panel for simulated request states.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AuthPreview initial="SignIn" />,
};

export const PageLayout: Story = {
  name: "Page layout",
  render: () => (
    <AuthPage>
      <AuthPreview initial="SignIn" />
    </AuthPage>
  ),
};

export const EmailVerificationRecovery: Story = {
  name: "Email verification recovery",
  render: () => (
    <AuthPreview initial="SignIn" signInFailureCode="EMAIL_NOT_VERIFIED" />
  ),
};

export const CredentialRetry: Story = {
  name: "Credential retry",
  render: () => (
    <SignIn
      brand={authPreviewBrand}
      onSubmit={async () => {
        throw new Error("Could not sign in. Try again.");
      }}
    />
  ),
};

export const Pending: Story = {
  name: "Pending",
  render: () => (
    <SignIn
      brand={authPreviewBrand}
      defaultEmail="alex@example.test"
      isPending
      onSubmit={async () => {}}
      onForgotPassword={() => {}}
      onResendVerification={() => {}}
      onPasskeySignIn={() => {}}
    />
  ),
};
