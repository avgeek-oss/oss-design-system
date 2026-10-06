"use client";
import { Modal as HeroModal, type ModalProps } from "@heroui/react";
import { useRef, type ComponentProps } from "react";
import { mergeRefs } from "@react-aria/utils";
import { useSuspendedOverlayFocus } from "./use-suspended-overlay-focus.js";

function ModalRoot(props: ModalProps) {
  return <HeroModal {...props} />;
}
function ModalBackdrop(props: ComponentProps<typeof HeroModal.Backdrop>) {
  const overlay = useRef<HTMLDivElement>(null);
  const isSuspended = useSuspendedOverlayFocus(props.isOpen, overlay);
  return isSuspended ? null : (
    <HeroModal.Backdrop {...props} ref={mergeRefs(overlay, props.ref)} />
  );
}
export const Modal = Object.assign(ModalRoot, HeroModal, {
  Backdrop: ModalBackdrop,
});
export type { ModalProps } from "@heroui/react";
