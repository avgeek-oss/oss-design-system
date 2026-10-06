"use client";

import { Dropdown as HeroDropdown } from "@heroui/react";
import type { ComponentProps } from "react";
import { useOverlaySuspension } from "./overlay-suspension.js";

function DropdownRoot(props: ComponentProps<typeof HeroDropdown>) {
  return <HeroDropdown {...props} />;
}
function DropdownPopover(props: ComponentProps<typeof HeroDropdown.Popover>) {
  const { isSuspended } = useOverlaySuspension();
  return isSuspended ? null : <HeroDropdown.Popover {...props} />;
}
export const Dropdown = Object.assign(DropdownRoot, HeroDropdown, {
  Popover: DropdownPopover,
});
export { Header } from "@heroui/react";
