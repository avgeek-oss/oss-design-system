import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Attributes } from "../../../src/data-display/attributes";

export default function AttributesVariants() {
  return (
    <PrimitivePreview title="Attributes">
      {(["list", "card", "embedded"] as const).map((variant) => (
        <Variant key={variant} title={variant}>
          <Attributes
            className="w-full max-w-lg"
            {...(variant === "embedded"
              ? { variant }
              : { variant, title: "Attributes" })}
          >
            <Attributes.Item label="First">Value</Attributes.Item>
            <Attributes.Item label="Second">Value</Attributes.Item>
          </Attributes>
        </Variant>
      ))}
    </PrimitivePreview>
  );
}
