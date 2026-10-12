import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Accordion } from "../../../src/data-display/accordion";

function AccordionVariants() {
  return (
    <PrimitivePreview title="Accordion">
      {(["default", "surface"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          <Accordion className="w-full max-w-lg" variant={variant}>
            {["First", "Second"].map((title) => (
              <Accordion.Item key={title} id={title}>
                <Accordion.Heading>
                  <Accordion.Trigger>
                    {title}
                    <Accordion.Indicator />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>Content</Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}

const meta = {
  title: "Primitives/DataDisplay/Accordion",
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component:
          "Use the published Accordion component from @avgeek-oss/design-system/data-display/accordion. The examples use the actual export with local sample data and callbacks; applications own routing, permissions and persistence.",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Master: Story = {
  name: "Master",
  render: () => <AccordionVariants />,
};
