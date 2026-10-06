import { parseDate } from "@internationalized/date";
import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { DatePickerPreview } from "../../../studio/date-picker-preview";

export default function DatePickerVariants() {
  return (
    <PrimitivePreview title="DatePicker">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant key={variant} title={variant}>
          <div className="w-full max-w-md">
            <DatePickerPreview
              aria-label={`${variant} date`}
              variant={variant}
              defaultValue={parseDate("2026-10-06")}
            />
          </div>
        </Variant>
      ))}
      <Variant title="States">
        <div className="grid w-full max-w-md gap-3">
          <DatePickerPreview aria-label="Empty date" />
          <DatePickerPreview aria-label="Invalid date" isInvalid />
          <DatePickerPreview
            aria-label="Read only date"
            isReadOnly
            defaultValue={parseDate("2026-10-06")}
          />
          <DatePickerPreview
            aria-label="Disabled date"
            isDisabled
            defaultValue={parseDate("2026-10-06")}
          />
        </div>
      </Variant>
    </PrimitivePreview>
  );
}
