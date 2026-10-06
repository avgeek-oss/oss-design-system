import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Label } from "../../../src/forms/label";

export default function LabelVariants() {
  return (
    <PrimitivePreview title="Label">
      <Variant title="States">
        <Label>Default</Label>
        <Label isRequired>Required</Label>
        <Label isDisabled>Disabled</Label>
      </Variant>
    </PrimitivePreview>
  );
}
