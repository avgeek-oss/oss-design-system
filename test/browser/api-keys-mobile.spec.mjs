import { test, expect } from "./fixtures.mjs";

test("API keys retain every field, native row headers and reachable actions at mobile and desktop widths", async ({
  page,
  fixtureUrl,
  touch,
  width,
}, testInfo) => {
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/Account Settings/ApiKeysSettings.fixture.tsx",
      "Responsive details",
    ),
  );
  await page.bringToFront();
  const table = page.getByRole("grid", { name: "API keys" });
  await expect(table).toBeVisible();
  await expect(table.getByRole("columnheader")).toHaveText([
    "Name",
    "Permissions",
    "Added",
    "Expires",
    "Last used",
    "Actions",
  ]);
  await expect(table.getByRole("rowheader")).toHaveCount(2);
  await expect(table.getByRole("rowheader").first()).toContainText(
    "Automation key with a long identifiable name for release operations",
  );
  await expect(table.getByRole("rowheader").first()).toContainText(
    "key_••••12ab",
  );
  await expect(table.getByText("Active", { exact: true })).toBeVisible();
  await expect(
    table.getByRole("gridcell", {
      name: "Read and write boards, tasks and comments across the current workspace",
      exact: true,
    }),
  ).toBeVisible();
  for (const date of ["2026-10-01", "2026-12-30", "2026-10-06"])
    await expect(table.getByText(date, { exact: true })).toBeVisible();
  await expect(
    table.getByRole("gridcell", { name: "No expiry", exact: true }),
  ).toBeVisible();
  await expect(
    table.getByRole("gridcell", { name: "Never", exact: true }),
  ).toBeVisible();
  const bounds = await table.evaluate((element) => {
    const container = element.closest(".table__scroll-container");
    const rect = container.getBoundingClientRect();
    return {
      scrollWidth: container.scrollWidth,
      width: container.clientWidth,
      left: rect.left,
      right: rect.right,
      pageWidth: globalThis.document.documentElement.scrollWidth,
    };
  });
  expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.width + 1);
  expect(bounds.pageWidth).toBeLessThanOrEqual(width);
  const revoke = table
    .getByRole("button", { name: "Revoke", exact: true })
    .first();
  const actionBounds = await revoke.boundingBox();
  expect(actionBounds.x).toBeGreaterThanOrEqual(bounds.left - 1);
  expect(actionBounds.x + actionBounds.width).toBeLessThanOrEqual(
    bounds.right + 1,
  );
  if (touch) {
    const cells = table.getByRole("row").nth(1).locator(".table__cell");
    await expect(cells).toHaveCount(6);
    const positions = await cells.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width };
      }),
    );
    expect(positions[1].top).toBeGreaterThan(positions[0].top);
    expect(positions[3].top).toBe(positions[2].top);
    expect(positions[5].top).toBeGreaterThan(positions[4].top);
  }
  await page.screenshot({
    path: testInfo.outputPath("metadata.png"),
    animations: "disabled",
  });
  await revoke.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: /Revoke Automation key/ });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(revoke).toBeFocused();
  if (touch) await revoke.tap();
  else await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  const confirm = dialog.getByRole("button", {
    name: "Revoke key",
    exact: true,
  });
  await confirm.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await expect(
    page.getByText("Simulated requests: 1", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText(
    "Revocation failed. Please retry.",
  );
  await expect(dialog).toBeVisible();
  await expect(table.getByRole("rowheader")).toHaveCount(2);
  await page.locator('[data-slot="toast-close"]').click();
  await confirm.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByText("Simulated requests: 2", { exact: true }),
  ).toBeVisible();
  await expect(table.getByRole("rowheader")).toHaveCount(1);
  await expect(table.getByRole("rowheader")).toContainText("Reporting");
  await expect(
    table.getByRole("button", { name: "Revoke", exact: true }),
  ).toBeVisible();
});
