import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChoiceFieldPreview } from "../../studio/pattern-previews";

const meta = {
  title: "Patterns/ChoiceField",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive ChoiceField examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ChoiceFieldPreview />,
};
