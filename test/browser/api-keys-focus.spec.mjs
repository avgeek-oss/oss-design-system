import { test, expect } from "./fixtures.mjs";

test("API-key confirmation restores its connected row action after Escape and Cancel", async ({
  page,
  fixtureUrl,
  touch,
}) => {
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/Account Settings/ApiKeysSettings.fixture.tsx",
      "Focus return",
    ),
  );
  await page.bringToFront();
  const opener = page.getByRole("button", { name: "Revoke", exact: true });
  const dialog = page.getByRole("dialog", { name: "Revoke Automation?" });
  for (const dismissal of ["Escape", "Cancel", "Escape"]) {
    await opener.focus();
    if (touch) await opener.tap();
    else await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    const original = await opener.elementHandle();
    if (dismissal === "Escape") await page.keyboard.press("Escape");
    else
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    expect(await original.evaluate((element) => element.isConnected)).toBe(
      true,
    );
    await opener.evaluate((element) => element.closest('[role="row"]').focus());
    await expect(opener).toBeFocused();
  }
});

test("API-key confirmation recovery preserves deliberate destination focus", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/Account Settings/ApiKeysSettings.fixture.tsx",
      "Focus return",
    ),
  );
  await page.bringToFront();
  const opener = page.getByRole("button", { name: "Revoke", exact: true });
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.evaluate(() => new Promise(globalThis.requestAnimationFrame));
  const destination = page.getByRole("button", {
    name: "Other action",
    exact: true,
  });
  await destination.focus();
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        globalThis.requestAnimationFrame(() =>
          globalThis.requestAnimationFrame(resolve),
        ),
      ),
  );
  await expect(destination).toBeFocused();
});
