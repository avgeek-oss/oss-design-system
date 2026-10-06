import { PrimitivePreview } from "../../../studio/primitive-preview";
import { Disclosure } from "../../../src/navigation/disclosure";

export default function DisclosureVariants() {
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
