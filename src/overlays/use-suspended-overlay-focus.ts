"use client";

import { useContext, useLayoutEffect, useRef, type RefObject } from "react";
import {
  OverlayTriggerStateContext,
  PopoverContext,
  useSlottedContext,
} from "react-aria-components";
import { useOverlaySuspension } from "./overlay-suspension.js";

export function restoreOverlayTriggerFocus(
  target: Element | null | undefined,
  overlay: HTMLElement | null,
) {
  if (
    !(target instanceof HTMLElement) ||
    !target.isConnected ||
    target === target.ownerDocument.body ||
    target.getClientRects().length === 0 ||
    target.closest("[hidden], [inert]") ||
    target.matches(":disabled")
  )
    return;
  const active = target.ownerDocument.activeElement;
  if (
    active &&
    active !== target.ownerDocument.body &&
    active.isConnected &&
    !overlay?.contains(active)
  )
    return;
  target.focus({ preventScroll: true });
}

export function useSuspendedOverlayFocus(
  isOpen: boolean | undefined,
  overlay: RefObject<HTMLDivElement | null>,
) {
  const { isSuspended, capture } = useOverlaySuspension();
  const triggerState = useContext(OverlayTriggerStateContext);
  const trigger = useSlottedContext(PopoverContext)?.triggerRef;
  const open = isOpen ?? triggerState?.isOpen ?? false;
  const restorePending = useRef(false);
  const lastOverlay = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (overlay.current) lastOverlay.current = overlay.current;
    if (isSuspended && open) restorePending.current = true;
    if (isSuspended || open || !restorePending.current) return;
    const isCurrent = capture();
    const previous = lastOverlay.current;
    let frame: number;
    const restore = () => {
      if (!isCurrent()) return;
      if (previous?.isConnected) {
        frame = requestAnimationFrame(restore);
        return;
      }
      restorePending.current = false;
      restoreOverlayTriggerFocus(trigger?.current, previous);
    };
    frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [open, overlay, isSuspended, capture, trigger]);
  return isSuspended;
}
