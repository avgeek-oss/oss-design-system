"use client";

import { useRef, useState } from "react";
import { toast } from "../overlays/toast.js";
import { useOverlaySuspension } from "../overlays/overlay-suspension.js";

export type ActionResult<T> = { ok: true; value: T } | { ok: false };

export function useAsyncAction(
  failureMessage = "Could not complete the action",
) {
  const lock = useRef(false);
  const [isPending, setPending] = useState(false);
  const suspension = useOverlaySuspension();
  async function run<T>(action: () => Promise<T>): Promise<ActionResult<T>> {
    if (lock.current || suspension.isSuspended) return { ok: false };
    const isCurrent = suspension.capture();
    lock.current = true;
    setPending(true);
    try {
      const value = await action();
      return isCurrent() ? { ok: true, value } : { ok: false };
    } catch (cause) {
      if (isCurrent())
        toast.danger(cause instanceof Error ? cause.message : failureMessage);
      return { ok: false };
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return { isPending, run };
}
