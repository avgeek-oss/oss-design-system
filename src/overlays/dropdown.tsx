"use client";

import { Dropdown as HeroDropdown } from "@heroui/react";
import { useRef, type ComponentProps } from "react";
import { mergeRefs } from "@react-aria/utils";
import { useSuspendedOverlayFocus } from "./use-suspended-overlay-focus.js";

function DropdownRoot(props: ComponentProps<typeof HeroDropdown>) {
  return <HeroDropdown {...props} />;
}
function DropdownPopover(props: ComponentProps<typeof HeroDropdown.Popover>) {
  const overlay = useRef<HTMLDivElement>(null);
  const isSuspended = useSuspendedOverlayFocus(props.isOpen, overlay);
  return isSuspended ? null : (
    <HeroDropdown.Popover {...props} ref={mergeRefs(overlay, props.ref)} />
  );
}
export const Dropdown = Object.assign(DropdownRoot, HeroDropdown, {
  Popover: DropdownPopover,
});
export { Header } from "@heroui/react";
