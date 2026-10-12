import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventDetailPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/History/EventDetail",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive EventDetail examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <EventDetailPreview />,
};
