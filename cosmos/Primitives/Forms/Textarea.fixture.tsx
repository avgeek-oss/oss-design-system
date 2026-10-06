import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Textarea } from "../../../src/forms/textarea";

export default function TextareaVariants() {
  return (
    <PrimitivePreview title="Textarea">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          <Textarea
            aria-label={`${variant} textarea`}
            className="w-full max-w-md"
            variant={variant}
            rows={3}
            placeholder="Text"
          />
        </Variant>
      ))}
      <Variant title="States">
        <Textarea
          aria-label="Invalid textarea"
          aria-invalid
          defaultValue="Invalid"
        />
        <Textarea aria-label="Disabled textarea" disabled value="Disabled" />
      </Variant>
    </PrimitivePreview>
  );
}
