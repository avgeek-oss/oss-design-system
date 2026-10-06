"use client";
import { useCallback, useRef } from "react";
import { Toast as NativeToast } from "@heroui/react";
import type {
  ToastContentValue,
  ToastProps,
  ToastProviderProps,
} from "@heroui/react";

export { toast } from "@heroui/react";
export type Toast = NativeToast;

function ToastProvider<T extends object = ToastContentValue>({
  ref,
  ...props
}: ToastProviderProps<T>) {
  const region = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const onFocusIn = useCallback((event: FocusEvent) => {
    const previous = event.relatedTarget;
    if (
      previous instanceof HTMLElement &&
      !region.current?.contains(previous)
    ) {
      returnFocus.current = previous;
    }
  }, []);
  const setRegion = useCallback(
    (node: HTMLDivElement | null) => {
      const previous = region.current;
      previous?.removeEventListener("focusin", onFocusIn);
      region.current = node;
      node?.addEventListener("focusin", onFocusIn);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
      if (!node && previous) {
        const target = returnFocus.current;
        returnFocus.current = null;
        // HeroUI blurs the final exiting toast before React Aria can restore focus.
        queueMicrotask(() => {
          const document = previous.ownerDocument;
          if (
            !region.current &&
            document.hasFocus() &&
            document.activeElement === document.body &&
            target?.isConnected &&
            !target.closest("[inert]")
          ) {
            target.focus({ preventScroll: true });
          }
        });
      }
    },
    [onFocusIn, ref],
  );
  return <NativeToast.Provider {...props} ref={setRegion} />;
}

function ToastRoot<T extends object = ToastContentValue>(props: ToastProps<T>) {
  return <NativeToast {...props} />;
}

export const Toast: typeof NativeToast = Object.assign(ToastRoot, NativeToast, {
  Provider: ToastProvider,
});
