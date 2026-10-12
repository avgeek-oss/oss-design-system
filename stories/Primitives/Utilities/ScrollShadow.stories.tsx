import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ScrollShadow } from "../../../src/utilities/scroll-shadow";

function ScrollShadowVariants() {
  return (
    <PrimitivePreview title="ScrollShadow">
      <Variant title="Vertical">
        <ScrollShadow
          className="h-48 w-full max-w-md"
          aria-label="Scrollable content"
          tabIndex={0}
        >
          <div className="grid gap-4">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="text-sm">
                Item {i + 1}
              </p>
            ))}
          </div>
        </ScrollShadow>
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Utilities/ScrollShadow",
  component: ScrollShadow,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published ScrollShadow component from @avgeek-oss/design-system/utilities/scroll-shadow. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <ScrollShadowVariants />,
};
