import type { Meta, StoryObj } from "@storybook/react-vite";
import { InviteMemberPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Team Settings/InviteMemberDialog",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive InviteMemberDialog examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <InviteMemberPreview />,
};
