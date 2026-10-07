import { PrimitivePreview, Variant } from "../../../studio/primitive-preview";
import { Chip } from "../../../src/data-display/chip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "../../../src/feedback/spinner";
import { Tooltip } from "../../../src/overlays/tooltip";
import { Flag01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

export default function ChipVariants() {
  const tones = {
    default: "text-foreground",
    accent: "text-accent",
    danger: "text-danger",
    success: "text-success",
    warning: "text-warning",
  };
  return (
    <PrimitivePreview title="Chip">
      <Variant title="Colors">
        {(["default", "accent", "danger", "success", "warning"] as const).map(
          (color) => (
            <div key={color} className="grid gap-2" data-status-tone={color}>
              <span className={tones[color]}>1 {color}</span>
              <Chip color={color}>
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={16}
                  aria-hidden
                  className={tones[color]}
                />
                <Chip.Label>{color}</Chip.Label>
              </Chip>
            </div>
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
      <Variant title="Single-line labels">
        <div className="w-24">
          <Chip size="sm">
            <Chip.Label className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={Flag01Icon} size={14} aria-hidden />
              No priority
            </Chip.Label>
          </Chip>
        </div>
        <Chip>Waiting for review</Chip>
      </Variant>
    </PrimitivePreview>
  );
}
