import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthPreview } from "../../../studio/auth-previews";
function RecoveryCodesScreenPreview() {
  return <AuthPreview initial="RecoveryCodesScreen" />;
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
  title: "Patterns/Auth/RecoveryCodesScreen",
  parameters: {
    docs: {
      description: {
        component:
          "Interactive RecoveryCodesScreen examples using the shared exports. Applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <RecoveryCodesScreenPreview />,
};
