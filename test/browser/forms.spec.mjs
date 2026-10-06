import { test, expect } from "./fixtures.mjs";

test("sign-in clears completed passwords and cached-page credentials while retaining email", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(
    fixtureUrl("cosmos/Patterns/Auth/SignIn.fixture.tsx", "Credential retry"),
  );
  const email = page.getByRole("textbox", { name: /^Email/ });
  const password = page.getByLabel("Password", { exact: true });
  await email.fill("alex@example.test");
  await password.fill("preview password");
  await password.press("Enter");
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(1);
  await expect(password).toHaveValue("");
  await expect(email).toHaveValue("alex@example.test");
  await password.fill("another password");
  await page.evaluate(() => globalThis.dispatchEvent(new Event("pagehide")));
  await expect(password).toHaveValue("");
  await expect(email).toHaveValue("alex@example.test");
});

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

test("invitation entry focuses email and moves focus to the returned link action", async ({
  page,
  fixtureUrl,
  theme,
}, testInfo) => {
  await page.bringToFront();
  await page.goto(
    fixtureUrl("cosmos/Patterns/Team Settings/InviteMemberDialog.fixture.tsx"),
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  const opener = page.getByRole("button", {
    name: "Create invitation",
    exact: true,
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  const email = dialog.getByRole("textbox", { name: /^Email/ });
  await expect(email).toBeFocused();
  await email.fill("alex@example.test");
  await dialog
    .getByRole("button", { name: "Create invitation", exact: true })
    .click();
  const done = dialog.getByRole("button", { name: "Done", exact: true });
  await expect(done).toBeFocused();
  await expect(dialog).toContainText("https://example.test/invite/demo");
  await page.screenshot({ path: testInfo.outputPath("invitation-link.png") });
  await done.click();
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("sign-in verification navigation uses the shared request and private acknowledgment", async ({
  page,
  fixtureUrl,
  touch,
  theme,
}, testInfo) => {
  await page.goto(
    fixtureUrl("cosmos/Patterns/Auth/SignIn.fixture.tsx", "Default"),
  );
  await page.bringToFront();
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  const verification = page.getByRole("button", {
    name: "Need a new verification email?",
    exact: true,
  });
  if (touch) await verification.tap();
  else {
    await verification.focus();
    await page.keyboard.press("Enter");
  }
  await expect(
    page.getByRole("heading", { name: "Verify your email", exact: true }),
  ).toBeVisible();
  const email = page.getByRole("textbox", { name: /^Email/ });
  await expect(email).not.toBeFocused();
  await email.fill("alex@example.test");
  await page.screenshot({
    path: testInfo.outputPath("verification-email.png"),
  });
  if (touch)
    await page
      .getByRole("button", { name: "Send verification link", exact: true })
      .tap();
  else await email.press("Enter");
  await expect(page.locator("form")).toHaveCount(0);
  await expect(
    page.getByText(
      "If an account needs email verification, we’ll send a link. Check your inbox and spam folder.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.locator(":focus")).toContainText("Verify your email");
  await page
    .getByRole("button", { name: "Request another link", exact: true })
    .click();
  await expect(page.getByRole("textbox", { name: /^Email/ })).toHaveValue(
    "alex@example.test",
  );
  await page
    .getByRole("button", { name: "← Back to Sign In", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Sign in", exact: true }),
  ).toBeVisible();
});
