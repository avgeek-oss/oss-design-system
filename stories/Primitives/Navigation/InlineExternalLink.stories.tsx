import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { InlineExternalLink } from "../../../src/navigation/inline-external-link";

function InlineExternalLinkVariants() {
  return (
    <PrimitivePreview title="InlineExternalLink">
      <Variant title="Default">
        <InlineExternalLink href="https://github.com/avgeek-oss/oss-design-system">
          External link
        </InlineExternalLink>
      </Variant>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Navigation/InlineExternalLink",
  component: InlineExternalLink,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published InlineExternalLink component from @avgeek-oss/design-system/navigation/inline-external-link. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <InlineExternalLinkVariants />,
};
