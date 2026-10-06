import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { toast } from "../../../src/overlays/toast";
import { Button } from "../../../src/buttons/button";

export default function ToastVariants() {
  return (
    <PrimitivePreview title="Toast">
      <Variant title="Variants">
        {(["success", "danger", "warning", "info"] as const).map((variant) => (
          <Button
            variant="secondary"
            key={variant}
            onPress={() => toast[variant](`${variant} message`)}
          >
            {variant}
          </Button>
        ))}
      </Variant>
    </PrimitivePreview>
  );
}
