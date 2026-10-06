import "./dom-environment.js";
import assert from "node:assert/strict";
import test from "node:test";
import { act, createRef } from "react";
import { createRoot } from "react-dom/client";
import {
  BreadcrumbDropdown,
  BreadcrumbSelect,
} from "../src/navigation/breadcrumbs.js";
import { ListBox } from "../src/forms/select.js";

test("breadcrumb dropdown popovers forward native refs, DOM props, render classes, and selection callbacks", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  const ref = createRef<HTMLElement>();
  const selections: string[] = [];
  try {
    await act(async () =>
      root.render(
        <BreadcrumbDropdown.Root defaultOpen>
          <BreadcrumbDropdown.Trigger>Account</BreadcrumbDropdown.Trigger>
          <BreadcrumbDropdown.Popover
            ref={ref}
            data-testid="account-popover"
            className={() => "account-options"}
          >
            <BreadcrumbDropdown.Menu
              aria-label="Account pages"
              onAction={(key) => selections.push(String(key))}
            >
              <BreadcrumbDropdown.Item id="profile">
                Profile
              </BreadcrumbDropdown.Item>
            </BreadcrumbDropdown.Menu>
          </BreadcrumbDropdown.Popover>
        </BreadcrumbDropdown.Root>,
      ),
    );
    assert.ok(ref.current instanceof HTMLElement);
    assert.equal(ref.current.dataset.testid, "account-popover");
    assert.equal(ref.current.classList.contains("account-options"), true);
    const profile = document.querySelector('[role="menuitem"]');
    assert.ok(profile);
    await act(async () =>
      profile.dispatchEvent(new MouseEvent("click", { bubbles: true })),
    );
    assert.deepEqual(selections, ["profile"]);
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
});

test("breadcrumb select popovers retain controlled selection and native ref forwarding", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  const ref = createRef<HTMLElement>();
  const selections: string[] = [];
  try {
    await act(async () =>
      root.render(
        <BreadcrumbSelect.Root
          aria-label="Board"
          defaultOpen
          selectedKey="first"
          onSelectionChange={(key) => selections.push(String(key))}
        >
          <BreadcrumbSelect.Trigger>
            <BreadcrumbSelect.Value />
          </BreadcrumbSelect.Trigger>
          <BreadcrumbSelect.Popover ref={ref} data-testid="board-popover">
            <ListBox>
              <ListBox.Item id="first">First board</ListBox.Item>
              <ListBox.Item id="second">Second board</ListBox.Item>
            </ListBox>
          </BreadcrumbSelect.Popover>
        </BreadcrumbSelect.Root>,
      ),
    );
    assert.ok(ref.current instanceof HTMLElement);
    assert.equal(ref.current.dataset.testid, "board-popover");
    const second = [...document.querySelectorAll('[role="option"]')].find(
      (item) => item.textContent === "Second board",
    );
    assert.ok(second);
    await act(async () =>
      second.dispatchEvent(new MouseEvent("click", { bubbles: true })),
    );
    assert.deepEqual(selections, ["second"]);
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
});
