import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { ProgressCircle } from "../../../src/feedback/progress-circle";

export default function ProgressCircleVariants() {
  return (
    <PrimitivePreview title="ProgressCircle">
      <Variant title="Determinate">
        {[0, 50, 100].map((value) => (
          <ProgressCircle
            key={value}
            value={value}
            aria-label={`${value} percent`}
          >
            <ProgressCircle.Track>
              <ProgressCircle.TrackCircle />
              <ProgressCircle.FillCircle />
            </ProgressCircle.Track>
          </ProgressCircle>
        ))}
      </Variant>
      <Variant title="Indeterminate">
        <ProgressCircle isIndeterminate aria-label="Loading">
          <ProgressCircle.Track>
            <ProgressCircle.TrackCircle />
            <ProgressCircle.FillCircle />
          </ProgressCircle.Track>
        </ProgressCircle>
      </Variant>
    </PrimitivePreview>
  );
}
