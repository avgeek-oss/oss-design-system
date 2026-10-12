import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberEditPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Team Settings/MemberEditDialog",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive MemberEditDialog examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <MemberEditPreview />,
};

export const RoleOnly: Story = {
  name: "RoleOnly",
  render: () => <MemberEditPreview mode="role-only" />,
};
