import type { Meta, StoryObj } from "@storybook/react-vite";
import { InvitationsPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Team Settings/InvitationsTable",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive InvitationsTable examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <InvitationsPreview />,
};
