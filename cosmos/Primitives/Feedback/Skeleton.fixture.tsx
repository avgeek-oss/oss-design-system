import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Skeleton } from "../../../src/feedback/skeleton";

export default function SkeletonVariants() {
  return (
    <PrimitivePreview title="Skeleton">
      <Variant title="Animation">
        {(["shimmer", "pulse", "none"] as const).map((animationType) => (
          <div key={animationType} className="grid w-full max-w-sm gap-2">
            <span className="text-xs text-muted">{animationType}</span>
            <Skeleton animationType={animationType} className="h-8 w-full" />
            <Skeleton animationType={animationType} className="h-4 w-2/3" />
          </div>
        ))}
      </Variant>
    </PrimitivePreview>
  );
}
