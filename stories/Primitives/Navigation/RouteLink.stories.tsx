import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { RouteLink } from "../../../src/navigation/route-link";

function RouteLinkVariants() {
  return (
    <PrimitivePreview title="RouteLink">
      <Variant title="Default">
        <RouteLink href="#target" className="text-sm text-accent underline">
          Route link
        </RouteLink>
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Navigation/RouteLink",
  component: RouteLink,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published RouteLink component from @avgeek-oss/design-system/navigation/route-link. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <RouteLinkVariants />,
};
