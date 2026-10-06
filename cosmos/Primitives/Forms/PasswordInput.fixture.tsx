import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { PasswordInput } from "../../../src/forms/password-input";

export default function PasswordInputVariants() {
  return (
    <PrimitivePreview title="PasswordInput">
      {(["primary", "secondary"] as const).map((variant) => (
        <Variant title={variant} key={variant}>
          <div className="w-full max-w-md">
            <PasswordInput
              aria-label={`${variant} password`}
              variant={variant}
              defaultValue="preview-password"
            />
          </div>
        </Variant>
      ))}
      <Variant title="Disabled">
        <div className="w-full max-w-md">
          <PasswordInput
            aria-label="Disabled password"
            disabled
            value="preview-password"
          />
        </div>
      </Variant>
    </PrimitivePreview>
  );
}
