import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { HeadingHelp } from "../../../src/overlays/heading-help";

function HeadingHelpVariants({ section = 0 }: { section?: number }) {
  return (
    <PrimitivePreview title="HeadingHelp">
      {section === 0 && (
        <Variant title="Documentation">
          <span className="inline-flex items-center gap-2 text-sm">
            Heading
            <HeadingHelp
              title="Heading"
              help={{
                description: "Additional context for this heading.",
                href: "https://github.com/avgeek-oss/oss-design-system",
              }}
            />
          </span>
        </Variant>
      )}
      {section === 1 && (
        <Variant title="Without documentation">
          <span className="text-sm">
            Heading
            <HeadingHelp title="Heading" help={false} />
          </span>
        </Variant>
      )}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Overlays/HeadingHelp",
  component: HeadingHelp,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published HeadingHelp component from @avgeek-oss/design-system/overlays/heading-help. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <HeadingHelpVariants section={0} />,
};

export const WithoutDocumentation: Story = {
  name: "Without documentation",
  render: () => <HeadingHelpVariants section={1} />,
};
