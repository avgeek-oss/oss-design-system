export function createBackendReconnect(
  reconnect: (signal: AbortSignal) => Promise<boolean>,
) {
  let stopped = false;
  let pending = false;
  let timer: ReturnType<typeof setTimeout>;
  let controller: AbortController | undefined;
  const schedule = () => {
    timer = setTimeout(() => void refresh(), 5_000);
  };
  const refresh = async () => {
    if (stopped || pending) return;
    clearTimeout(timer);
    pending = true;
    controller = new AbortController();
    const timeout = setTimeout(() => controller?.abort(), 20_000);
    try {
      if ((await reconnect(controller.signal)) && !controller.signal.aborted)
        stopped = true;
    } catch {
      // Failed read-only probes remain eligible for the next retry.
    } finally {
      clearTimeout(timeout);
      pending = false;
      if (!stopped) schedule();
    }
  };
  schedule();
  return {
    refresh,
    stop() {
      stopped = true;
      clearTimeout(timer);
      controller?.abort();
    },
  };
}
