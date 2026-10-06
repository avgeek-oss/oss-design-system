import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Accordion } from "../../../src/data-display/accordion";

export default function AccordionVariants() {
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
