import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryErrorPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Feedback/QueryError",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive QueryError examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <QueryErrorPreview />,
};
