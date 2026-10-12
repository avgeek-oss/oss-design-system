import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApiKeysTablePreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Account Settings/ApiKeysTable",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive ApiKeysTable examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ApiKeysTablePreview />,
};
