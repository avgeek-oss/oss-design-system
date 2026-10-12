import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusIndicatorPreview } from "../../studio/pattern-previews";

const meta = {
  title: "Patterns/StatusIndicator",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive StatusIndicator examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <StatusIndicatorPreview />,
};
