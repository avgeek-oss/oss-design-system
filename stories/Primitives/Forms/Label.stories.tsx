import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Label } from "../../../src/forms/label";

function LabelVariants() {
  return (
    <PrimitivePreview title="Label">
      <Variant title="States">
        <Label>Default</Label>
        <Label isRequired>Required</Label>
        <Label isDisabled>Disabled</Label>
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/Label",
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Label component from @avgeek-oss/design-system/forms/label. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <LabelVariants />,
};
