import assert from "node:assert/strict";
import { test, expect } from "./fixtures.mjs";

test("initial loading remains accessible without shifting content", async ({
  page,
  fixtureUrl,
  touch,
  theme,
}, testInfo) => {
  await page.goto(
    fixtureUrl("cosmos/Patterns/Feedback/QueryLoading.fixture.tsx", "Initial"),
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  const status = page
    .getByRole("status")
    .filter({ hasText: "Loading account settings…" });
  await expect(status).toHaveCount(1);
  assert.match(await status.ariaSnapshot(), /Loading account settings/);
  const hiddenBox = await status.boundingBox();
  assert.ok(
    hiddenBox && hiddenBox.width <= 1 && hiddenBox.height <= 1,
    "Ordinary loading must not occupy visible content space",
  );
  const anchor = page.getByTestId("content-anchor");
  const before = await anchor.boundingBox();
  assert.ok(before);
  await page.screenshot({
    path: testInfo.outputPath("preview.png"),
  });
  const finish = page.getByRole("button", { name: "Finish loading" });
  if (touch) await finish.tap();
  else {
    await finish.focus();
    await page.keyboard.press("Enter");
  }
  await expect(status).toHaveCount(0);
  await expect(anchor).toHaveText("Account details loaded.");
  const after = await anchor.boundingBox();
  assert.ok(after);
  assert.equal(
    after.y,
    before.y,
    "Removing the hidden loading announcement must not shift the content",
  );
  await page.getByRole("button", { name: "Load again" }).click();
  await expect(status).toHaveCount(1);
});
test("visible progress can be explicitly requested", async ({
  page,
  fixtureUrl,
}, testInfo) => {
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/Feedback/QueryLoading.fixture.tsx",
      "Visible progress",
    ),
  );
  const progress = page
    .getByRole("status")
    .filter({ hasText: "Preparing the export…" });
  await expect(progress).toBeVisible();
  const box = await progress.boundingBox();
  assert.ok(
    box && box.width > 100 && box.height > 10,
    "Explicit visible progress remains usable",
  );
  await page.screenshot({
    path: testInfo.outputPath("preview.png"),
  });
});
