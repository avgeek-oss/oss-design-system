import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Input } from "../../../src/forms/input";
import { DatePickerPreview } from "../../../studio/date-picker-preview";

export default function InputVariants() {
  return (
    <PrimitivePreview title="Input">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant key={variant} title={variant}>
          <div
            className={
              variant === "secondary"
                ? "grid w-full max-w-md gap-3 rounded-2xl bg-surface p-4"
                : "grid w-full max-w-md gap-3"
            }
          >
            {(
              ["text", "email", "url", "number", "search", "time"] as const
            ).map((type) => (
              <Input
                key={type}
                aria-label={`${variant} ${type}`}
                variant={variant}
                type={type}
                placeholder={type}
              />
            ))}
            <DatePickerPreview
              aria-label={`${variant} date`}
              variant={variant}
            />
          </div>
        </Variant>
      ))}
      <Variant title="States">
        <div className="grid w-full max-w-md gap-3">
          <Input
            aria-label="Invalid"
            aria-invalid
            data-invalid="true"
            defaultValue="Invalid"
          />
          <Input aria-label="Read only" readOnly value="Read only" />
          <Input aria-label="Disabled" disabled value="Disabled" />
        </div>
      </Variant>
    </PrimitivePreview>
  );
}
