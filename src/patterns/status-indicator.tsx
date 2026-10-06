"use client";

import type { ComponentProps, ReactNode } from "react";
import { Chip } from "../data-display/chip.js";
import { Tooltip } from "../overlays/tooltip.js";

export type StatusDescriptor = {
  label: string;
  color?: ComponentProps<typeof Chip>["color"];
  icon?: ReactNode;
  description?: string;
};
export type StatusIndicatorProps = Omit<
  ComponentProps<typeof Chip>,
  "children" | "color"
> &
  StatusDescriptor;
export function StatusIndicator({
  label,
  color = "default",
  icon,
  description,
  ...props
}: StatusIndicatorProps) {
  const chip = (
    <Chip {...props} color={color}>
      <Chip.Label className="inline-flex items-center gap-1.5">
        {icon ? (
          <span aria-hidden="true" className="inline-flex [&_svg]:size-3.5">
            {icon}
          </span>
        ) : null}
        {label}
      </Chip.Label>
    </Chip>
  );
  return description ? (
    <Tooltip>
      <Tooltip.Trigger>{chip}</Tooltip.Trigger>
      <Tooltip.Content>{description}</Tooltip.Content>
    </Tooltip>
  ) : (
    chip
  );
}
