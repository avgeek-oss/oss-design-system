import type { Meta, StoryObj } from "@storybook/react-vite";
import { OperationProgressPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Operations/OperationProgress",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive OperationProgress examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <OperationProgressPreview />,
};
