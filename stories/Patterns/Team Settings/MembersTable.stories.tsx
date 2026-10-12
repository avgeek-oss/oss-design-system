import type { Meta, StoryObj } from "@storybook/react-vite";
import { MembersPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Team Settings/MembersTable",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive MembersTable examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <MembersPreview />,
};
