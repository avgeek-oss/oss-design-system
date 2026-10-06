import "./dom-environment.js";
import assert from "node:assert/strict";
import test from "node:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { QueryLoading } from "../src/patterns/feedback/query-state.js";

test("initial loading preserves its accessible status, app attributes, and updated announcement", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () =>
      root.render(
        <QueryLoading id="loading-view" aria-label="Members loading" />,
      ),
    );
    const status = container.querySelector('[role="status"]');
    assert.ok(status);
    assert.equal(status.id, "loading-view");
    assert.equal(status.getAttribute("aria-label"), "Members loading");
    assert.equal(status.textContent, "Loading…");
    assert.notEqual(status.getAttribute("aria-hidden"), "true");
    await act(async () =>
      root.render(<QueryLoading>Loading invitations…</QueryLoading>),
    );
    assert.equal(
      container.querySelector('[role="status"]')?.textContent,
      "Loading invitations…",
    );
    await act(async () => root.render(<p>Invitations loaded.</p>));
    assert.equal(container.querySelector('[role="status"]'), null);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
