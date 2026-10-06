import { parseDate } from "@internationalized/date";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { DateField } from "../../../src/forms/date-field";

export default function DateFieldVariants() {
  return (
    <PrimitivePreview title="DateField">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant key={variant} title={variant}>
          <DateField
            aria-label={`${variant} date field`}
            className="w-full max-w-md"
            defaultValue={parseDate("2026-10-06")}
          >
            <DateField.Group variant={variant} fullWidth>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
            </DateField.Group>
          </DateField>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}
