import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthorizedClientsPreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Account Settings/AuthorizedClientsTable",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive AuthorizedClientsTable examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AuthorizedClientsPreview />,
};
