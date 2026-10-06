import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Chip } from "../../../src/data-display/chip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "../../../src/feedback/spinner";
import { Tooltip } from "../../../src/overlays/tooltip";
import { Tick02Icon } from "@hugeicons/core-free-icons";

export default function ChipVariants() {
  return (
    <PrimitivePreview title="Chip">
      <Variant title="Colors">
        {(["default", "accent", "danger", "success", "warning"] as const).map(
          (color) => (
            <Chip color={color} key={color}>
              {color}
            </Chip>
          ),
        )}
      </Variant>
      <Variant title="Variants">
        {(["primary", "secondary", "soft", "tertiary"] as const).map(
          (variant) => (
            <Chip variant={variant} color="accent" key={variant}>
              {variant}
            </Chip>
          ),
        )}
      </Variant>
      <Variant title="Sizes">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Chip key={size} size={size}>
            {size}
          </Chip>
        ))}
      </Variant>
      <Variant title="Content">
        <Chip>
          <HugeiconsIcon icon={Tick02Icon} size={16} aria-hidden="true" />
          <Chip.Label>Icon</Chip.Label>
        </Chip>
        <Chip aria-busy>
          <Spinner color="current" size="sm" />
          <Chip.Label>Loading</Chip.Label>
        </Chip>
        <Tooltip>
          <Tooltip.Trigger tabIndex={0}>
            <Chip>Tooltip</Chip>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Arrow />
            Additional information
          </Tooltip.Content>
        </Tooltip>
        <Chip>123</Chip>
      </Variant>
    </PrimitivePreview>
  );
}
