import { useEffect, useRef } from "react";
import { useOverlaySuspension } from "../../overlays/overlay-suspension.js";

export function useConfirmationOpener(isOpen: boolean) {
  const opener = useRef<HTMLElement | null>(null);
  const { isSuspended } = useOverlaySuspension();
  useEffect(() => {
    if (isSuspended || isOpen || !opener.current) return;
    const target = opener.current;
    // A grid may restore its row after the modal returns focus to its action.
    let frame = 0;
    let cancelled = false;
    const restore = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        if (
          !document.hasFocus() ||
          !target.isConnected ||
          target.closest("[hidden], [inert]")
        ) {
          stop();
          return;
        }
        const active = document.activeElement;
        if (
          active === document.body ||
          active === target.closest('[role="row"]') ||
          active === target.closest('[role="gridcell"]')
        )
          target.focus({ preventScroll: true });
      });
    };
    const stop = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("focusin", onFocus, true);
      document.removeEventListener("pointerdown", stop, true);
      document.removeEventListener("keydown", stop, true);
      window.removeEventListener("blur", stop);
    };
    const onFocus = (event: FocusEvent) => {
      const active = event.target;
      if (active === target) return;
      if (
        active === document.body ||
        active === target.closest('[role="row"]') ||
        active === target.closest('[role="gridcell"]')
      )
        restore();
      else stop();
    };
    document.addEventListener("focusin", onFocus, true);
    document.addEventListener("pointerdown", stop, true);
    document.addEventListener("keydown", stop, true);
    window.addEventListener("blur", stop);
    restore();
    return stop;
  }, [isOpen, isSuspended]);
  return opener;
}
