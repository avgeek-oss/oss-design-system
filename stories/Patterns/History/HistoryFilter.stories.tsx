import type { Meta, StoryObj } from "@storybook/react-vite";
import { HistoryFilterPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/History/HistoryFilter",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive HistoryFilter examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <HistoryFilterPreview />,
};
