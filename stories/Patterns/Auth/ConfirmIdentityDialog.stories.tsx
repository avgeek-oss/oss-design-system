import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../../src/buttons/button";
import { AuthForm } from "../../../src/patterns/auth/auth-form";
import { ConfirmIdentityDialog } from "../../../src/patterns/auth/confirm-identity-dialog";
import { ConfirmIdentityPreview } from "../../../studio/auth-previews";
function CustomVerification() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Confirm identity</Button>
      <ConfirmIdentityDialog
        isOpen={open}
        onOpenChange={setOpen}
        method="custom"
      >
        <AuthForm
          variant="secondary"
          fields={[
            {
              name: "code",
              label: "Authenticator code",
              required: true,
              autoComplete: "one-time-code",
              inputMode: "numeric",
            },
          ]}
          submitLabel="Confirm"
          onSubmit={async () => setOpen(false)}
        />
      </ConfirmIdentityDialog>
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
  title: "Patterns/Auth/ConfirmIdentityDialog",
  component: ConfirmIdentityDialog,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ConfirmIdentityDialog component from @avgeek-oss/design-system/patterns/auth/confirm-identity-dialog. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence. See the Controls panel for simulated request states.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <CustomVerification />,
};

export const Password: Story = {
  name: "Password",
  render: () => <ConfirmIdentityPreview />,
};

export const Passkey: Story = {
  name: "Passkey",
  render: () => <ConfirmIdentityPreview method="passkey" />,
};
