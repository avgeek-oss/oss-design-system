import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/RevokeInvitationDialog-preview";
import { RevokeInvitationDialog } from "../../../src/patterns/team-settings/revoke-invitation-dialog";
const meta = {
  args: { failRequest: false },
  argTypes: {
    failRequest: {
      control: "boolean",
      description: "Simulate a failed request and retain the editable draft.",
    },
  },
  title: "Patterns/Team Settings/RevokeInvitationDialog",
  component: RevokeInvitationDialog,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published RevokeInvitationDialog component from @avgeek-oss/design-system/patterns/team-settings/revoke-invitation-dialog. Applications supply data and action callbacks.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
