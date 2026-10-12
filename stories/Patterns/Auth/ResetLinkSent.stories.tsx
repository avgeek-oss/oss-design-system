import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthPreview } from "../../../studio/auth-previews";
function ResetLinkSentPreview() {
  return <AuthPreview initial="ResetLinkSent" />;
}

const meta = {
  args: { failRequest: false, slowResponse: false },
  argTypes: {
    failRequest: {
      control: "boolean",
      description: "Simulate a failed request and retain the editable draft.",
    },
    slowResponse: {
      control: "boolean",
      description: "Simulate a pending request.",
    },
  },
  title: "Patterns/Auth/ResetLinkSent",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive ResetLinkSent examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ResetLinkSentPreview />,
};
