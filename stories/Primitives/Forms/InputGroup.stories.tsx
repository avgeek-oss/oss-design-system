import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { InputGroup } from "../../../src/forms/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

function InputGroupVariants() {
  return (
    <PrimitivePreview title="InputGroup">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          <InputGroup variant={variant} className="w-full max-w-md">
            <InputGroup.Prefix>
              <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.5} />
            </InputGroup.Prefix>
            <InputGroup.Input
              aria-label={`${variant} search`}
              placeholder="Search"
              type="search"
            />
            <InputGroup.Suffix>⌘ K</InputGroup.Suffix>
          </InputGroup>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Forms/InputGroup",
  component: InputGroup,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published InputGroup component from @avgeek-oss/design-system/forms/input-group. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <InputGroupVariants />,
};
