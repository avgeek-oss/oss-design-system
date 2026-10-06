import assert from "node:assert/strict";
import { test, expect } from "./fixtures.mjs";

const activeToasts = (page) =>
  page.locator('[data-slot="toast"]:not([data-exiting="true"])');
const close = (toast) => toast.locator('[data-slot="toast-close"]');
async function assertReachable(control) {
  await expect(control).toBeVisible();
  await expect(control).toHaveCSS("opacity", "1");
  await expect(control).toHaveCSS("pointer-events", "auto");
  await expect
    .poll(async () => {
      const box = await control.boundingBox();
      return box ? Math.min(box.width, box.height) : 0;
    })
    .toBeGreaterThanOrEqual(31.99);
}
async function dismiss(control, touch) {
  if (touch) await control.tap();
  else await control.click();
}
for (const scenario of ["single", "stack", "modal"]) {
  test(`toast ${scenario}`, async ({
    page,
    fixtureUrl,
    touch,
    theme,
    width,
    reducedMotion,
  }, testInfo) => {
    await page.goto(
      fixtureUrl("cosmos/Primitives/Overlays/Toast.fixture.tsx", "Dismissal"),
    );
    await page.bringToFront();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    if (scenario === "single") {
      await page
        .getByRole("button", { name: "Show error", exact: true })
        .click();
      await page.mouse.move(0, 0);
      const toast = activeToasts(page);
      await expect(toast).toHaveCount(1);
      await expect(toast).not.toHaveAttribute("data-entering", "true");
      await assertReachable(close(toast));
      await page.screenshot({
        path: testInfo.outputPath("preview.png"),
        animations: "disabled",
      });
      await dismiss(close(toast), touch);
      await expect(activeToasts(page)).toHaveCount(0);
    } else if (scenario === "stack") {
      await page
        .getByRole("button", { name: "Show stack", exact: true })
        .click();
      await page.mouse.move(0, 0);
      await expect(activeToasts(page)).toHaveCount(6);
      const front = page.locator('[data-slot="toast"][data-frontmost="true"]');
      await expect(front).not.toHaveAttribute("data-entering", "true");
      await assertReachable(close(front));
      const back = page.locator(
        '[data-slot="toast"]:not([data-frontmost="true"]):not([data-hidden="true"])',
      );
      await expect(back).toHaveCount(2);
      for (const toast of await back.all()) {
        await expect(close(toast)).toHaveCSS("opacity", "0");
        await expect(close(toast)).toHaveCSS("pointer-events", "none");
      }
      const hidden = page.locator('[data-slot="toast"][data-hidden="true"]');
      await expect(hidden).toHaveCount(3);
      for (const toast of await hidden.all()) {
        await expect(close(toast)).toHaveCSS("visibility", "hidden");
        await expect(close(toast)).toHaveCSS("pointer-events", "none");
      }
      await page.keyboard.press("F6");
      await expect(page.locator('[data-slot="toast-region"]')).toHaveAttribute(
        "data-expanded",
        "true",
      );
      const expanded = page.locator(
        '[data-slot="toast"]:not([data-hidden="true"])',
      );
      for (const toast of await expanded.all())
        await assertReachable(close(toast));
      let keyboardClose = false;
      for (let tab = 0; tab < 4; tab++) {
        await page.keyboard.press("Tab");
        keyboardClose = await page.evaluate(
          () =>
            globalThis.document.activeElement?.getAttribute("data-slot") ===
            "toast-close",
        );
        if (keyboardClose) break;
      }
      assert.equal(
        keyboardClose,
        true,
        "Toast close must be reachable by keyboard without hover",
      );
      await close(expanded.nth(1)).focus();
      await page.screenshot({
        path: testInfo.outputPath("preview.png"),
        animations: "disabled",
      });
      await page.keyboard.press("Enter");
      await expect(activeToasts(page)).toHaveCount(5);
      for (const toast of await hidden.all()) {
        await expect(close(toast)).toHaveCSS("pointer-events", "none");
      }
    } else {
      await page
        .getByRole("button", { name: "Open form", exact: true })
        .click();
      const dialog = page.getByRole("dialog");
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Open form", exact: true }),
      ).toBeFocused();
      await page
        .getByRole("button", { name: "Open form", exact: true })
        .click();
      await dialog.getByLabel("Name", { exact: true }).fill("Retained draft");
      for (let attempt = 0; attempt < 3; attempt++) {
        await dialog.getByRole("button", { name: "Save", exact: true }).click();
        await page.mouse.move(0, 0);
        const toast = activeToasts(page);
        await expect(toast).toHaveCount(1);
        await expect(toast).not.toHaveAttribute("data-entering", "true");
        await assertReachable(close(toast));
        await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(
          "Retained draft",
        );
        if (attempt === 0) {
          await page.screenshot({
            path: testInfo.outputPath("preview.png"),
            animations: "disabled",
          });
          await dismiss(close(toast), touch);
        } else if (attempt === 1) {
          await close(toast).focus();
          await page.keyboard.press("Enter");
        } else {
          await dismiss(close(toast), touch);
          await dialog.getByLabel("Name", { exact: true }).focus();
        }
        await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
        await expect(dialog).toBeVisible();
        await expect
          .poll(
            () =>
              page.evaluate(() => ({
                focused: globalThis.document.hasFocus(),
                insideDialog: Boolean(
                  globalThis.document.activeElement?.closest('[role="dialog"]'),
                ),
              })),
            {
              message: `Modal focus return: ${width}/${theme}/${reducedMotion}/${attempt}`,
            },
          )
          .toMatchObject({ focused: true, insideDialog: true });
        if (attempt === 2) {
          await expect(
            dialog.getByLabel("Name", { exact: true }),
          ).toBeFocused();
        }
      }
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Open form", exact: true }),
      ).toBeFocused();
    }
  });
}
