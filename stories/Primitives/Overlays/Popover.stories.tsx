import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Popover } from "../../../src/overlays/popover";

function PopoverVariants() {
  return (
    <PrimitivePreview title="Popover">
      <Variant title="Placements">
        {(["top", "bottom", "left", "right"] as const).map((placement) => (
          <Popover key={placement}>
            <Popover.Trigger className="button button--secondary button--sm">
              {placement}
            </Popover.Trigger>
            <Popover.Content placement={placement}>
              <Popover.Arrow />
              <Popover.Dialog>
                <Popover.Heading>Popover heading</Popover.Heading>
                <p className="text-sm">Popover content</p>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
        ))}
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Overlays/Popover",
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Popover component from @avgeek-oss/design-system/overlays/popover. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <PopoverVariants />,
};
