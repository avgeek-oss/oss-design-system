import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AuthForm } from "../../dist/patterns/auth/auth-form.js";
import { test, expect } from "./fixtures.mjs";

test("auth form native submission keeps credentials out of the URL before JavaScript handles events", async ({
  page,
  fixtureOrigin,
}) => {
  const destination = `${fixtureOrigin}/native-form`;
  const markup = renderToStaticMarkup(
    createElement(AuthForm, {
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
        },
      ],
      submitLabel: "Continue",
      onSubmit: async () => {
        throw new Error("The static form has no JavaScript handlers");
      },
    }),
  );
  const submissions = [];
  await page.route(destination, async (route) => {
    const request = route.request();
    if (request.method() === "POST") {
      submissions.push({
        url: request.url(),
        body: request.postData(),
      });
      await route.fulfill({
        contentType: "text/html",
        body: "<h1>Request received</h1>",
      });
    } else {
      await route.fulfill({ contentType: "text/html", body: markup });
    }
  });
  await page.goto(destination);
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("alex@example.test");
  await page.getByLabel("Password", { exact: true }).fill("private passphrase");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Request received" }),
  ).toBeVisible();
  expect(submissions).toHaveLength(1);
  expect(submissions[0].url).toBe(destination);
  const body = new URLSearchParams(submissions[0].body);
  expect(body.get("email")).toBe("alex@example.test");
  expect(body.get("password")).toBe("private passphrase");
});

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

for (const contract of [
  {
    variant: "Verify email",
    title: "Verify your email",
    action: "Confirm email",
    success: "Email verified",
  },
  {
    variant: "Change email",
    title: "Confirm email change",
    action: "Confirm email change",
    success: "Email updated",
  },
  {
    variant: "Retry",
    title: "Verify your email",
    action: "Retry confirmation",
    success: "Email verified",
  },
]) {
  test(`email ${contract.variant} awaits explicit confirmation and retries with toast-only feedback`, async ({
    page,
    fixtureUrl,
    touch,
    theme,
  }, testInfo) => {
    await page.goto(
      fixtureUrl(
        "cosmos/Patterns/Auth/EmailConfirmation.fixture.tsx",
        contract.variant,
      ),
    );
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const content = page.locator('[data-slot="identity-auth-content"]');
    const action = page.getByRole("button", {
      name: contract.action,
      exact: true,
    });
    const back = page.getByRole("button", {
      name: "← Back to Sign In",
      exact: true,
    });
    await expect(page.locator("[data-confirm-requests]")).toHaveText(
      "Requests: 0",
    );
    await action.focus();
    await page.keyboard.press("Enter");
    await expect(action).toBeDisabled();
    await action.press("Enter");
    await back.evaluate((element) => element.click());
    await expect(page.locator("[data-confirm-requests]")).toHaveText(
      "Requests: 1",
    );
    await expect(page.locator("[data-back-count]")).toHaveText("Back: 0");
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
    const complete = page.getByRole("button", {
      name: "Complete request",
      exact: true,
    });
    if (touch) await complete.tap();
    else await complete.click();
    const toast = page.locator('[data-slot="toast"]:not([data-exiting])');
    await expect(toast).toHaveCount(1);
    await expect(toast).toContainText("Confirmation failed. Try again.");
    await expect(content).not.toContainText("Confirmation failed");
    await expect(content.getByRole("alert")).toHaveCount(0);
    await expect(action).toBeEnabled();
    await expect(back).toBeEnabled();
    await toast.locator('[data-slot="toast-close"]').click();
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
    if (touch) await action.tap();
    else await action.click();
    await expect(page.locator("[data-confirm-requests]")).toHaveText(
      "Requests: 2",
    );
    if (touch) await complete.tap();
    else await complete.click();
    await expect(toast).toHaveCount(1);
    await expect(toast).toContainText(contract.success);
    await expect(content).toContainText("Sign in to continue.");
    await expect(content).not.toContainText(contract.success);
    await expect(action).toHaveCount(0);
    await expect(back).toBeEnabled();
    await expect(page.locator(":focus")).toContainText(contract.title);
    await expect(toast).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: testInfo.outputPath("preview.png") });
  });
}

test("email link states do not mutate on mount and omit unsupported retry", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/Auth/EmailConfirmation.fixture.tsx",
      "Missing link",
    ),
  );
  const content = page.locator('[data-slot="identity-auth-content"]');
  await expect(content.getByRole("button")).toHaveCount(1);
  await expect(content).toContainText("Return to sign in.");
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
  await expect(page.locator("[data-confirm-requests]")).toHaveText(
    "Requests: 0",
  );
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/Auth/EmailConfirmation.fixture.tsx",
      "Checking",
    ),
  );
  await expect(content.getByRole("status")).toContainText(
    "Checking confirmation link…",
  );
  await expect(content.getByRole("button")).toBeDisabled();
  await expect(page.locator("[data-confirm-requests]")).toHaveText(
    "Requests: 0",
  );
  await page
    .getByRole("button", { name: "Finish checking", exact: true })
    .click();
  await expect(
    content.getByRole("button", { name: "Confirm email", exact: true }),
  ).toBeEnabled();
  await expect(page.locator("[data-confirm-requests]")).toHaveText(
    "Requests: 0",
  );
});

test("invitation resend awaits one request, retains name and code and honors cooldown", async ({
  page,
  fixtureUrl,
  touch,
}, testInfo) => {
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/Auth/InvitationVerification.fixture.tsx",
      "Resend recovery",
    ),
  );
  const content = page.locator('[data-slot="identity-auth-content"]');
  const name = page.getByRole("textbox", { name: /^Your Name/ });
  const code = page.getByRole("textbox", { name: /^Email verification code/ });
  await name.fill("Alex");
  await code.fill("123456");
  const resend = page.getByRole("button", { name: "Resend code", exact: true });
  const complete = page.getByRole("button", {
    name: "Complete request",
    exact: true,
  });
  const toast = page.locator('[data-slot="toast"]:not([data-exiting])');
  for (let attempt = 1; attempt <= 2; attempt++) {
    await resend.evaluate((element) => {
      element.click();
      element.click();
    });
    await expect(resend).toBeDisabled();
    await expect(name).toBeDisabled();
    await content.locator("form").evaluate((form) => form.requestSubmit());
    await expect(page.locator("[data-resends]")).toHaveText(
      `Resends: ${attempt}`,
    );
    await expect(page.locator("[data-verifications]")).toHaveText(
      "Verifications: 0",
    );
    await expect(toast).toHaveCount(0);
    if (touch) await complete.tap();
    else await complete.click();
    await expect(toast).toHaveCount(1);
    await expect(toast).toContainText("Resend failed. Try again.");
    await expect(content).not.toContainText("Resend failed");
    await expect(name).toHaveValue("Alex");
    await expect(code).toHaveValue("123456");
    await expect(resend).toBeEnabled();
    await toast.locator('[data-slot="toast-close"]').click();
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
  }
  if (touch) await resend.tap();
  else {
    await resend.focus();
    await page.keyboard.press("Enter");
  }
  if (touch) await complete.tap();
  else await complete.click();
  await expect(toast).toHaveCount(1);
  await expect(toast).toContainText("Verification code requested.");
  await expect(content).not.toContainText("Verification code requested.");
  const cooldown = page.getByRole("button", { name: /^Resend in \d+s$/ });
  await expect(cooldown).toBeDisabled();
  await cooldown.evaluate((element) => element.click());
  await expect(page.locator("[data-resends]")).toHaveText("Resends: 3");
  await page.screenshot({ path: testInfo.outputPath("preview.png") });
  await toast.locator('[data-slot="toast-close"]').click();
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
  await page.getByRole("button", { name: "End cooldown", exact: true }).click();
  await expect(resend).toBeEnabled();
  await code.press("Enter");
  await expect(resend).toBeDisabled();
  await resend.evaluate((element) => element.click());
  await expect(page.locator("[data-resends]")).toHaveText("Resends: 3");
  await expect(page.locator("[data-verifications]")).toHaveText(
    "Verifications: 1",
  );
  if (touch) await complete.tap();
  else await complete.click();
  await expect(toast).toHaveCount(1);
  await expect(toast).toContainText("Verification failed. Try again.");
  await expect(content).not.toContainText("Verification failed");
  await expect(name).toHaveValue("Alex");
  await expect(code).toHaveValue("123456");
  await expect(resend).toBeEnabled();
});
