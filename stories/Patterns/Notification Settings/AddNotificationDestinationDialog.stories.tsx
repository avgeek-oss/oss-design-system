import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddDestinationPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Notification Settings/AddNotificationDestinationDialog",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive AddNotificationDestinationDialog examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AddDestinationPreview />,
};
