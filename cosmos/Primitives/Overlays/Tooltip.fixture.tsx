import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Tooltip, TooltipText } from "../../../src/overlays/tooltip";

export default function TooltipVariants() {
  return (
    <PrimitivePreview title="Tooltip">
      <Variant title="Placements">
        {(["top", "bottom", "left", "right"] as const).map((placement) => (
          <Tooltip key={placement}>
            <Tooltip.Trigger<"button">
              className="button button--secondary inline-flex"
              render={(props) => <button {...props} />}
            >
              {placement}
            </Tooltip.Trigger>
            <Tooltip.Content placement={placement}>
              <Tooltip.Arrow />
              Tooltip content
            </Tooltip.Content>
          </Tooltip>
        ))}
      </Variant>
      <Variant title="Truncated text">
        <TooltipText
          className="max-w-40 truncate text-sm"
          tooltip="A long label that exceeds the available width"
        >
          A long label that exceeds the available width
        </TooltipText>
      </Variant>
    </PrimitivePreview>
  );
}
