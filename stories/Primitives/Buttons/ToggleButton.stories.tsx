import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "../../../src/buttons/toggle-button";

function ToggleButtonVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="ToggleButton">
      {section === 0 && (
        <Variant title="Variants">
          <ToggleButton variant="default">Default</ToggleButton>
          <ToggleButton variant="ghost">Ghost</ToggleButton>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Sizes">
          {(["sm", "md", "lg"] as const).map((size) => (
            <ToggleButton key={size} size={size}>
              {size}
            </ToggleButton>
          ))}
        </Variant>
      )}
      {section === 2 && (
        <Variant title="States">
          <ToggleButton>Toggle</ToggleButton>
          <ToggleButton defaultSelected>Selected</ToggleButton>
          <ToggleButton isDisabled>Disabled</ToggleButton>
        </Variant>
      )}
      {section === 3 && (
        <Variant title="Group">
          <ToggleButtonGroup
            selectionMode="single"
            defaultSelectedKeys={["first"]}
            aria-label="Options"
          >
            <ToggleButton id="first">First</ToggleButton>
            <ToggleButton id="second">Second</ToggleButton>
          </ToggleButtonGroup>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Buttons/ToggleButton",
  component: ToggleButton,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ToggleButton component from @avgeek-oss/design-system/buttons/toggle-button. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ToggleButtonVariants section={0} />,
};

export const Sizes: Story = {
  name: "Sizes",
  render: () => <ToggleButtonVariants section={1} />,
};

export const States: Story = {
  name: "States",
  render: () => <ToggleButtonVariants section={2} />,
};

export const Group: Story = {
  name: "Group",
  render: () => <ToggleButtonVariants section={3} />,
};
