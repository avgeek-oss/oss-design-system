import { test, expect } from "./fixtures.mjs";

for (const variant of ["Name validation", "Permission name validation"]) {
  test(`API key ${variant.toLowerCase()} keeps invalid drafts and allows one trimmed submission`, async ({
    page,
    fixtureUrl,
    touch,
    theme,
  }, testInfo) => {
    await page.bringToFront();
    await page.goto(
      fixtureUrl(
        "cosmos/Patterns/Account Settings/CreateApiKeyDialog.fixture.tsx",
        variant,
      ),
    );
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.getByRole("button", { name: "Create key", exact: true }).click();
    const dialog = page.getByRole("dialog");
    const name = dialog.getByRole("textbox", { name: /^Name/ });
    await name.fill("   ");
    for (let attempt = 0; attempt < 2; attempt++) {
      if (touch)
        await dialog
          .getByRole("button", { name: "Create key", exact: true })
          .tap();
      else await name.press("Enter");
      await expect(page.getByTestId("create-requests")).toHaveText(
        "Create requests: 0",
      );
      await expect(name).toBeFocused();
      await expect(name).toHaveValue("   ");
      await expect(dialog).not.toContainText("Enter a name for this API key.");
      const toast = page.locator(
        '[data-slot="toast"]:not([data-exiting=true])',
      );
      await expect(toast).toHaveCount(1);
      await expect(toast).toContainText("Enter a name for this API key.");
      await toast.locator('[data-slot="toast-close"]').click();
      await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
      await expect(name).toBeFocused();
    }
    await page.screenshot({
      path: testInfo.outputPath("preview.png"),
    });
    await name.fill(" Automation ");
    const create = dialog.getByRole("button", {
      name: "Create key",
      exact: true,
    });
    await create.evaluate((element) => {
      element.click();
      element.click();
    });
    await expect(page.getByTestId("create-requests")).toHaveText(
      "Create requests: 1",
    );
    await expect(page.getByTestId("submitted-name")).toHaveText(
      "Submitted name: Automation",
    );
    await expect(dialog).toContainText("preview-key");
    await dialog.getByRole("button", { name: "Done", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Create key", exact: true }),
    ).toBeFocused();
  });
}
