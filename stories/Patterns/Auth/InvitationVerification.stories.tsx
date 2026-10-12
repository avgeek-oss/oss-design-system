import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { InvitationVerification } from "../../../src/patterns/auth/invitation-verification";
import { Button } from "../../../src/buttons/button";
import { authPreviewBrand, AuthPreview } from "../../../studio/auth-previews";

function ResendRecoveryExample() {
  const [resends, setResends] = useState(0);
  const [verifications, setVerifications] = useState(0);
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const count = useRef(0);
  const finish = useRef<(() => void) | undefined>(undefined);
  return (
    <>
      <InvitationVerification
        brand={authPreviewBrand}
        teamName="Avgeek"
        onSubmit={async () => {
          setVerifications((count) => count + 1);
          await new Promise<void>((resolve) => {
            finish.current = resolve;
          });
          throw new Error("Verification failed. Try again.");
        }}
        onResendCode={async () => {
          const attempt = ++count.current;
          setResends(attempt);
          await new Promise<void>((resolve) => {
            finish.current = resolve;
          });
          if (attempt < 3) throw new Error("Resend failed. Try again.");
          setResendAvailableAt(Date.now() + 60000);
        }}
        resendAvailableAt={resendAvailableAt}
      />
      <div className="flex flex-wrap gap-4 p-4 text-sm">
        <Button variant="secondary" onPress={() => finish.current?.()}>
          Complete request
        </Button>
        <Button variant="secondary" onPress={() => setResendAvailableAt(0)}>
          End cooldown
        </Button>
        <p data-resends>Resends: {resends}</p>
        <p data-verifications>Verifications: {verifications}</p>
      </div>
    </>
  );
}

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
  title: "Patterns/Auth/InvitationVerification",
  component: InvitationVerification,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published InvitationVerification component from @avgeek-oss/design-system/patterns/auth/invitation-verification. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence. See the Controls panel for simulated request states.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AuthPreview initial="InvitationVerification" />,
};

export const ResendRecovery: Story = {
  name: "Resend recovery",
  render: () => <ResendRecoveryExample />,
};
