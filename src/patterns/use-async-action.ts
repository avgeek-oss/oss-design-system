"use client";

import { useRef, useState } from "react";
import { toast } from "../overlays/toast.js";

export type ActionResult<T> = { ok: true; value: T } | { ok: false };

export function useAsyncAction(
  failureMessage = "Could not complete the action",
) {
  const lock = useRef(false);
  const [isPending, setPending] = useState(false);
  async function run<T>(action: () => Promise<T>): Promise<ActionResult<T>> {
    if (lock.current) return { ok: false };
    lock.current = true;
    setPending(true);
    try {
      return { ok: true, value: await action() };
    } catch (cause) {
      toast.danger(cause instanceof Error ? cause.message : failureMessage);
      return { ok: false };
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return { isPending, run };
}
