import assert from "node:assert/strict";
import { test, expect } from "./fixtures.mjs";

test("clipboard writes lock repeated presses and allow retry after failure", async ({
  page,
  fixtureUrl,
  touch,
  theme,
}, testInfo) => {
  await page.addInitScript(() => {
    globalThis.copyWrites = 0;
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => {
          globalThis.copyWrites++;
          return new Promise((resolve, reject) => {
            globalThis.finishCopy = resolve;
            globalThis.failCopy = reject;
          });
        },
      },
    });
  });
  await page.goto(
    fixtureUrl("cosmos/Primitives/Typography/CodeBlock.fixture.tsx"),
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  const copy = page
    .getByRole("button", { name: "Copy code", exact: true })
    .first();
  await copy.evaluate((element) => {
    element.click();
    element.click();
  });
  assert.equal(await page.evaluate(() => globalThis.copyWrites), 1);
  await expect(copy).toHaveAttribute("aria-disabled", "true");
  await expect(copy).toHaveText("Copy");
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
  await page.evaluate(() => globalThis.failCopy(new Error("Clipboard denied")));
  const danger = page.locator('[data-slot="toast"]:not([data-exiting])');
  await expect(danger).toHaveCount(1);
  await expect(danger).toContainText(
    "Could not copy to the clipboard. Select and copy the text instead.",
  );
  await expect(copy).not.toHaveAttribute("aria-disabled", "true");
  await expect(
    page.locator('[data-slot="code-block-code"]').first(),
  ).toHaveText("Plain text");
  const dangerClose = danger.locator('[data-slot="toast-close"]');
  if (touch) await dangerClose.tap();
  else {
    await dangerClose.focus();
    await page.keyboard.press("Enter");
  }
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
  await copy.focus();
  if (touch) await copy.tap();
  else await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => globalThis.copyWrites), 2);
  await page.evaluate(() => globalThis.finishCopy());
  const success = page.locator('[data-slot="toast"]:not([data-exiting])');
  await expect(success).toHaveCount(1);
  await expect(success).toContainText("Copied to clipboard.");
  await expect(copy).toHaveText("Copy");
  await expect(copy).toHaveAttribute("aria-label", "Copy code");
  await expect(success).not.toHaveAttribute("data-entering", "true");
  await page.screenshot({
    path: testInfo.outputPath("preview.png"),
  });
  await success.locator('[data-slot="toast-close"]').click();
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
  await page.evaluate(() =>
    Reflect.deleteProperty(globalThis.navigator, "clipboard"),
  );
  for (let attempt = 0; attempt < 2; attempt++) {
    await copy.click();
    await expect(danger).toHaveCount(1);
    await expect(danger).toContainText("Could not copy to the clipboard.");
    await expect(copy).toHaveText("Copy");
    await dangerClose.click();
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
  }
  assert.equal(
    await page.evaluate(() => globalThis.copyWrites),
    2,
    "Unsupported clipboard must not fabricate writes",
  );
});
