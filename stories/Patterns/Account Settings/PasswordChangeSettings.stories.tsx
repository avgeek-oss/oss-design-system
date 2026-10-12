import type { Meta, StoryObj } from "@storybook/react-vite";
import { PasswordChangePreview } from "../../../studio/pattern-previews";

const meta = {
  title: "Patterns/Account Settings/PasswordChangeSettings",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive PasswordChangeSettings examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <PasswordChangePreview />,
};
