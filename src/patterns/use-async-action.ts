"use client";

import { useRef, useState } from "react";

export type ActionResult<T> = { ok: true; value: T } | { ok: false };

export function useAsyncAction(
  failureMessage = "Could not complete the action",
) {
  const lock = useRef(false);
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  async function run<T>(action: () => Promise<T>): Promise<ActionResult<T>> {
    if (lock.current) return { ok: false };
    lock.current = true;
    setPending(true);
    setError(undefined);
    try {
      return { ok: true, value: await action() };
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : failureMessage);
      return { ok: false };
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return { isPending, error, run };
}
