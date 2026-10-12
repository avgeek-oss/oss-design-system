import type { Meta, StoryObj } from "@storybook/react-vite";
import ComponentExample from "../../../studio/RemoveMemberDialog-preview";
import { RemoveMemberDialog } from "../../../src/patterns/team-settings/remove-member-dialog";
const meta = {
  args: { failRequest: false },
  argTypes: {
    failRequest: {
      control: "boolean",
      description: "Simulate a failed request and retain the editable draft.",
    },
  },
  title: "Patterns/Team Settings/RemoveMemberDialog",
  component: RemoveMemberDialog,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published RemoveMemberDialog component from @avgeek-oss/design-system/patterns/team-settings/remove-member-dialog. Applications supply data and action callbacks.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Master: Story = { render: () => <ComponentExample /> };
