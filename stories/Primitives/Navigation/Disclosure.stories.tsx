import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview } from "../../../studio/primitive-preview";
import { Disclosure } from "../../../src/navigation/disclosure";

function DisclosureVariants() {
  return (
    <PrimitivePreview title="Disclosure">
      <Disclosure className="w-full max-w-xs">
        <Disclosure.Heading>
          <Disclosure.Trigger>
            Heading
            <Disclosure.Indicator />
          </Disclosure.Trigger>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>Content</Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/Navigation/Disclosure",
  component: Disclosure,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Disclosure component from @avgeek-oss/design-system/navigation/disclosure. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <DisclosureVariants />,
};
