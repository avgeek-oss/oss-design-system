import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Alert } from "../../../src/feedback/alert";

function AlertVariants() {
  return (
    <PrimitivePreview title="Alert">
      <Variant title="Statuses">
        {(["default", "accent", "success", "warning", "danger"] as const).map(
          (status) => (
            <Alert key={status} status={status} className="w-full max-w-lg">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{status}</Alert.Title>
                <Alert.Description>Alert description</Alert.Description>
              </Alert.Content>
            </Alert>
          ),
        )}
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Feedback/Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Alert component from @avgeek-oss/design-system/feedback/alert. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AlertVariants />,
};
