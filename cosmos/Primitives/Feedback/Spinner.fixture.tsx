import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Spinner } from "../../../src/feedback/spinner";

export default function SpinnerVariants() {
  return (
    <PrimitivePreview title="Spinner">
      <Variant title="Sizes">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Spinner key={size} size={size} aria-label={`${size} loading`} />
        ))}
      </Variant>
      <Variant title="Colors">
        {(["accent", "success", "warning", "danger", "current"] as const).map(
          (color) => (
            <Spinner
              key={color}
              color={color}
              aria-label={`${color} loading`}
            />
          ),
        )}
      </Variant>
    </PrimitivePreview>
  );
}
