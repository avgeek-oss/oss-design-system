import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "../../../src/forms/field";
import { Input } from "../../../src/forms/input";

export default function FieldVariants() {
  return (
    <PrimitivePreview title="Field">
      <Variant title="Label and description">
        <Field className="max-w-md">
          <FieldLabel htmlFor="field-example" isRequired>
            Label
          </FieldLabel>
          <Input
            id="field-example"
            required
            aria-describedby="field-description"
          />
          <FieldDescription id="field-description">
            Description
          </FieldDescription>
        </Field>
      </Variant>
      <Variant title="Error">
        <Field className="max-w-md">
          <FieldLabel htmlFor="field-error">Label</FieldLabel>
          <Input
            id="field-error"
            aria-invalid
            aria-describedby="error-description"
          />
          <FieldError id="error-description">Error description</FieldError>
        </Field>
      </Variant>
    </PrimitivePreview>
  );
}
