import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Attributes } from "../../../src/data-display/attributes";

function AttributesVariants() {
  return (
    <PrimitivePreview title="Attributes">
      {(["list", "card", "embedded"] as const).map((variant) => (
        <Variant key={variant} title={variant}>
          <Attributes
            className="w-full max-w-lg"
            {...(variant === "embedded"
              ? { variant }
              : { variant, title: "Attributes" })}
          >
            <Attributes.Item label="First">Value</Attributes.Item>
            <Attributes.Item label="Second">Value</Attributes.Item>
          </Attributes>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/Attributes",
  component: Attributes,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Attributes component from @avgeek-oss/design-system/data-display/attributes. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AttributesVariants />,
};
