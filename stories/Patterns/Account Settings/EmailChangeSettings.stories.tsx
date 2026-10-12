import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmailChangePreview } from "../../../studio/pattern-previews";
import { EmailChangeSettings } from "../../../src/patterns/account-settings/email-change-settings";

const meta = {
  title: "Patterns/Account Settings/EmailChangeSettings",
  component: EmailChangeSettings,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published EmailChangeSettings component from @avgeek-oss/design-system/patterns/account-settings/email-change-settings. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <EmailChangePreview />,
};

export const ReadOnly: Story = {
  name: "ReadOnly",
  render: () => (
    <div className="max-w-lg p-4">
      <EmailChangeSettings
        email="alex@example.test"
        isVerified
        mode="read-only"
      >
        <p className="text-sm text-muted">
          Your sign-in email is managed by your instance administrator.
        </p>
      </EmailChangeSettings>
    </div>
  ),
};
