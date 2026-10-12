import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Filters/FilterDialog",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive FilterDialog examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <FilterPreview />,
};
