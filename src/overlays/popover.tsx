"use client";

import { Popover as HeroPopover, type PopoverProps } from "@heroui/react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import type { ComponentProps } from "react";
import { useOverlaySuspension } from "./overlay-suspension.js";

function PopoverRoot(props: PopoverProps) {
  return <HeroPopover {...props} />;
}

function PopoverTrigger(props: AriaButtonProps) {
  return <AriaButton {...props} />;
}

function PopoverContent(props: ComponentProps<typeof HeroPopover.Content>) {
  const { isSuspended } = useOverlaySuspension();
  return isSuspended ? null : <HeroPopover.Content {...props} />;
}

export const Popover = Object.assign(PopoverRoot, HeroPopover, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});

export type { PopoverProps } from "@heroui/react";
