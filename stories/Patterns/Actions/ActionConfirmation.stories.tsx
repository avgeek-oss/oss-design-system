import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionConfirmationPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Actions/ActionConfirmation",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive ActionConfirmation examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ActionConfirmationPreview />,
};
