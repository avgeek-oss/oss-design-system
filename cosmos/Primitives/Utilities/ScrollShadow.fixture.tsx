import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ScrollShadow } from "../../../src/utilities/scroll-shadow";

export default function ScrollShadowVariants() {
  return (
    <PrimitivePreview title="ScrollShadow">
      <Variant title="Vertical">
        <ScrollShadow
          className="h-48 w-full max-w-md"
          aria-label="Scrollable content"
          tabIndex={0}
        >
          <div className="grid gap-4">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="text-sm">
                Item {i + 1}
              </p>
            ))}
          </div>
        </ScrollShadow>
      </Variant>
    </PrimitivePreview>
  );
}
