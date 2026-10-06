import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Description } from "../../../src/forms/description";

export default function DescriptionVariants() {
  return (
    <PrimitivePreview title="Description">
      <Variant title="Default">
        <Description>Supporting description</Description>
      </Variant>
    </PrimitivePreview>
  );
}
