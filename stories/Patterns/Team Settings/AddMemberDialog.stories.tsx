import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddMemberPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Team Settings/AddMemberDialog",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive AddMemberDialog examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AddMemberPreview />,
};
