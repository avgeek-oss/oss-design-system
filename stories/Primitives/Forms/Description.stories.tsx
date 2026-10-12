import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Description } from "../../../src/forms/description";

function DescriptionVariants() {
  return (
    <PrimitivePreview title="Description">
      <Variant title="Default">
        <Description>Supporting description</Description>
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/Description",
  component: Description,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Description component from @avgeek-oss/design-system/forms/description. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <DescriptionVariants />,
};
