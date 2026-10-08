"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { Spinner } from "../../feedback/spinner.js";
import { cn } from "../../lib/utils.js";
import { createBackendReconnect } from "../../lib/backend-reconnect.js";

export type BackendUnavailableProps = ComponentProps<"section"> & {
  appName: string;
};

export function BackendUnavailable({
  appName,
  className,
  ...props
}: BackendUnavailableProps) {
  return (
    <section
      {...props}
      className={cn(
        "grid min-h-dvh place-items-center bg-background p-6",
        className,
      )}
    >
      <div
        className="grid w-full max-w-sm justify-items-center gap-3 text-center"
        role="status"
      >
        <Spinner aria-hidden="true" className="text-accent" color="current" />
        <p className="text-sm text-muted">
          {appName} is temporarily unavailable.
          <span className="block">Reconnecting automatically…</span>
        </p>
      </div>
    </section>
  );
}

/** Retry read-only app probes; true ends the loop, false or rejection retries. */
export function useBackendReconnect(
  enabled: boolean,
  reconnect: (signal: AbortSignal) => Promise<boolean>,
) {
  const callback = useRef(reconnect);
  useEffect(() => {
    callback.current = reconnect;
  }, [reconnect]);
  useEffect(() => {
    if (!enabled) return;
    const recovery = createBackendReconnect((signal) =>
      callback.current(signal),
    );
    const refresh = () => void recovery.refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      recovery.stop();
      window.removeEventListener("online", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [enabled]);
}
