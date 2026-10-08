import assert from "node:assert/strict";
import { test } from "node:test";
import { createBackendReconnect } from "../src/lib/backend-reconnect.js";

test("outages retry after five seconds and stop after recovery", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let calls = 0;
  const recovery = createBackendReconnect(async () => {
    calls++;
    if (calls === 1) throw new Error("Offline");
    return true;
  });
  t.mock.timers.tick(4_999);
  assert.equal(calls, 0);
  t.mock.timers.tick(1);
  await Promise.resolve();
  assert.equal(calls, 1);
  t.mock.timers.tick(5_000);
  await Promise.resolve();
  assert.equal(calls, 2);
  t.mock.timers.tick(60_000);
  assert.equal(calls, 2);
  recovery.stop();
});

test("focus retries do not overlap, and stopping aborts in-flight work", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let calls = 0;
  let signal: AbortSignal | undefined;
  let complete: ((value: boolean) => void) | undefined;
  const recovery = createBackendReconnect((nextSignal) => {
    calls++;
    signal = nextSignal;
    return new Promise<boolean>((resolve) => {
      complete = resolve;
    });
  });
  const first = recovery.refresh();
  await recovery.refresh();
  assert.equal(calls, 1);
  recovery.stop();
  assert.equal(signal?.aborted, true);
  complete?.(false);
  await first;
  t.mock.timers.tick(60_000);
  assert.equal(calls, 1);
});

test("a timed-out probe can retry without accepting its late success", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let signal: AbortSignal | undefined;
  let complete: ((value: boolean) => void) | undefined;
  let calls = 0;
  const recovery = createBackendReconnect((nextSignal) => {
    calls++;
    signal = nextSignal;
    return new Promise<boolean>((resolve) => {
      complete = resolve;
    });
  });
  const first = recovery.refresh();
  t.mock.timers.tick(20_000);
  assert.equal(signal?.aborted, true);
  complete?.(true);
  await first;
  t.mock.timers.tick(5_000);
  assert.equal(calls, 2);
  recovery.stop();
  complete?.(false);
});
