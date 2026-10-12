import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Drawer } from "../../../src/overlays/drawer";

function DrawerVariants() {
  return (
    <PrimitivePreview title="Drawer">
      <Variant title="Placements">
        {(["left", "right", "top", "bottom"] as const).map((placement) => (
          <Drawer key={placement}>
            <Drawer.Trigger className="button button--secondary button--sm">
              {placement}
            </Drawer.Trigger>
            <Drawer.Backdrop>
              <Drawer.Content placement={placement}>
                <Drawer.Dialog>
                  <Drawer.Header>
                    <Drawer.Heading>Drawer heading</Drawer.Heading>
                    <Drawer.CloseTrigger />
                  </Drawer.Header>
                  <Drawer.Body>Drawer content</Drawer.Body>
                </Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
        ))}
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Overlays/Drawer",
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Drawer component from @avgeek-oss/design-system/overlays/drawer. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <DrawerVariants />,
};
