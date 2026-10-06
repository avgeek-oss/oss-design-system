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

const suspensionFixture =
  "cosmos/Primitives/Overlays/OverlaySuspensionScope.fixture.tsx";
async function previewEvent(page, type) {
  await page.evaluate(
    (name) => globalThis.dispatchEvent(new Event(`preview:${name}`)),
    type,
  );
}
for (const scenario of [
  {
    variant: "Passkey",
    opener: "Add passkey",
    field: /^Name/,
    draft: "Travel key",
    submit: "Continue",
    settlement: "resolve",
    result: "Passkey added",
  },
  {
    variant: "ApiKey",
    opener: "Create key",
    field: /^Name/,
    draft: "Automation",
    submit: "Create key",
    settlement: "reject",
    result: "preview-key",
  },
  {
    variant: "Invitation",
    opener: "Create invitation",
    field: /^Email/,
    draft: "alex@example.test",
    submit: "Create invitation",
    settlement: "resolve",
    result: "https://example.test/invite/preview",
  },
]) {
  test(`${scenario.variant} suspension releases native locks, retains drafts and ignores old settlements`, async ({
    page,
    fixtureUrl,
    theme,
  }, testInfo) => {
    await page.goto(fixtureUrl(suspensionFixture, scenario.variant));
    await page.bringToFront();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const originalOverflow = await page.evaluate(
      () => globalThis.document.documentElement.style.overflow,
    );
    await page
      .getByRole("button", { name: scenario.opener, exact: true })
      .click();
    let dialog = page.getByRole("dialog");
    await dialog
      .getByRole("textbox", { name: scenario.field })
      .fill(scenario.draft);
    await dialog
      .getByRole("button", { name: scenario.submit, exact: true })
      .click();
    await expect(page.getByTestId("requests")).toHaveText("Requests: 1");
    await previewEvent(page, "suspend");
    await expect(page.locator('[data-slot="modal-backdrop"]')).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(() => globalThis.document.documentElement.style.overflow),
      )
      .toBe(originalOverflow);
    const resume = page.getByRole("button", {
      name: "Resume same account",
      exact: true,
    });
    await expect(resume).toBeVisible();
    expect(
      await resume.evaluate((node) => Boolean(node.closest("[inert]"))),
    ).toBe(false);
    await page.screenshot({ path: testInfo.outputPath("suspended.png") });
    await resume.click();
    dialog = page.getByRole("dialog");
    const field = dialog.getByRole("textbox", { name: scenario.field });
    await expect(field).toHaveValue(scenario.draft);
    await expect(field).toBeDisabled();
    await previewEvent(page, scenario.settlement);
    await expect(field).toBeEnabled();
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
    await expect(field).toHaveValue(scenario.draft);
    await dialog
      .getByRole("button", { name: scenario.submit, exact: true })
      .click();
    await expect(page.getByTestId("requests")).toHaveText("Requests: 2");
    await previewEvent(page, "reject");
    const toast = page.locator('[data-slot="toast"]');
    await expect(toast).toHaveCount(1);
    await expect(toast).toContainText("Request rejected");
    await expect(field).toHaveValue(scenario.draft);
    await toast.locator('[data-slot="toast-close"]').click();
    await expect(toast).toHaveCount(0);
    await dialog
      .getByRole("button", { name: scenario.submit, exact: true })
      .click();
    await expect(page.getByTestId("requests")).toHaveText("Requests: 3");
    await previewEvent(page, "resolve");
    if (scenario.variant === "Passkey") {
      await expect(dialog).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Add passkey", exact: true }),
      ).toBeFocused();
      await expect(page.locator('[data-slot="toast"]')).toHaveCount(1);
      await expect(page.locator('[data-slot="toast"]')).toContainText(
        scenario.result,
      );
    } else {
      await expect(dialog).toContainText(scenario.result);
      await expect(
        dialog.getByRole("button", { name: "Done", exact: true }),
      ).toBeFocused();
    }
    await page.screenshot({ path: testInfo.outputPath("resumed-result.png") });
  });
}
for (const settlement of ["resolve", "reject"]) {
  test(`a new account ignores the old passkey ${settlement} without restoring its draft`, async ({
    page,
    fixtureUrl,
  }) => {
    await page.goto(fixtureUrl(suspensionFixture, "Passkey"));
    await page
      .getByRole("button", { name: "Add passkey", exact: true })
      .click();
    await page.getByRole("textbox", { name: /^Name/ }).fill("Old account key");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await previewEvent(page, "suspend");
    await page
      .getByRole("button", { name: "Switch account", exact: true })
      .click();
    await previewEvent(page, settlement);
    await page
      .getByRole("button", { name: "Add passkey", exact: true })
      .click();
    await expect(page.getByRole("textbox", { name: /^Name/ })).toHaveValue("");
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
  });
}
for (const scenario of [
  { variant: "Modal", opener: "Open overlay", role: "dialog" },
  {
    variant: "AlertDialog",
    opener: "Open overlay",
    role: "alertdialog",
    dismissal: "keyboard",
  },
  {
    variant: "AlertDialog",
    opener: "Open overlay",
    role: "alertdialog",
    dismissal: "pointer",
  },
  { variant: "Dropdown", opener: "Open dropdown", role: "menu" },
  { variant: "Popover", opener: "Open popover", role: "dialog" },
  { variant: "Confirmation", opener: "Revoke access", role: "dialog" },
]) {
  test(`${scenario.variant}${scenario.dismissal ? ` ${scenario.dismissal}` : ""} suspension preserves logical open state and releases the native portal`, async ({
    page,
    fixtureUrl,
  }) => {
    await page.goto(fixtureUrl(suspensionFixture, scenario.variant));
    await page.bringToFront();
    const originalOverflow = await page.evaluate(
      () => globalThis.document.documentElement.style.overflow,
    );
    await page
      .getByRole("button", { name: scenario.opener, exact: true })
      .click();
    await expect(page.getByRole(scenario.role)).toBeVisible();
    if (["Modal", "AlertDialog"].includes(scenario.variant)) {
      await page
        .getByRole("textbox", { name: "Name", exact: true })
        .fill("Retained draft");
      await expect(page.getByTestId("logical-open")).toHaveText("Open: true");
    }
    await previewEvent(page, "suspend");
    await expect(page.getByRole(scenario.role)).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate(() => globalThis.document.documentElement.style.overflow),
      )
      .toBe(originalOverflow);
    await page
      .getByRole("button", { name: "Resume same account", exact: true })
      .click();
    await expect(page.getByRole(scenario.role)).toBeVisible();
    if (["Modal", "AlertDialog"].includes(scenario.variant)) {
      await expect(
        page.getByRole("textbox", { name: "Name", exact: true }),
      ).toHaveValue("Retained draft");
      await expect(page.getByTestId("logical-open")).toHaveText("Open: true");
      await page.keyboard.press("Escape");
      if (scenario.variant === "AlertDialog") {
        await expect(page.getByRole(scenario.role)).toBeVisible();
        const close = page.getByRole("button", { name: "Close", exact: true });
        if (scenario.dismissal === "pointer") await close.click();
        else {
          await close.focus();
          await page.keyboard.press("Enter");
        }
      }
    } else if (["Dropdown", "Popover"].includes(scenario.variant)) {
      await page.keyboard.press("Escape");
    }
    if (
      ["Modal", "AlertDialog", "Dropdown", "Popover"].includes(scenario.variant)
    ) {
      await expect(page.getByRole(scenario.role)).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: scenario.opener, exact: true }),
      ).toBeFocused();
    }
  });
}

for (const variant of ["AlertRerender", "AlertDestination"]) {
  test(`${variant} close recovery respects committed rerenders and deliberate destination focus`, async ({
    page,
    fixtureUrl,
  }) => {
    await page.goto(fixtureUrl(suspensionFixture, variant));
    await page.bringToFront();
    await page
      .getByRole("button", { name: "Open overlay", exact: true })
      .click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await previewEvent(page, "suspend");
    await page
      .getByRole("button", { name: "Resume same account", exact: true })
      .click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    if (variant === "AlertRerender")
      await expect(page.getByTestId("revision")).toHaveText("Revision: 1");
    await expect(
      page.getByRole("button", {
        name:
          variant === "AlertDestination" ? "Destination focus" : "Open overlay",
        exact: true,
      }),
    ).toBeFocused();
  });
}
for (const name of ["Date format", "Time format", "Time zone"]) {
  test(`retained preferences ${name.toLowerCase()} releases its native picker during suspension`, async ({
    page,
    fixtureUrl,
  }) => {
    await page.goto(fixtureUrl(suspensionFixture, "Preferences"));
    await page.bringToFront();
    const opener = page.getByRole("button", { name: new RegExp(name) });
    await opener.click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await previewEvent(page, "suspend");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await expect(page.locator('[data-slot="select-popover"]')).toHaveCount(0);
    await page
      .getByRole("button", { name: "Resume same account", exact: true })
      .click();
    await expect(page.getByRole("listbox")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toHaveCount(0);
    await expect(opener).toBeFocused();
  });
}

for (const variant of ["PasskeyRename", "PasskeyRecovery"]) {
  test(`${variant} returns to its live management opener after a suspended fresh request`, async ({
    page,
    fixtureUrl,
  }) => {
    await page.goto(fixtureUrl(suspensionFixture, variant));
    await page.bringToFront();
    const opener = page.getByRole("button", {
      name: variant === "PasskeyRename" ? "Rename" : "Add passkey",
      exact: true,
    });
    await opener.click();
    await page.getByRole("textbox", { name: /^Name/ }).fill("Travel key");
    const submit = page.getByRole("button", {
      name: variant === "PasskeyRename" ? "Update" : "Continue",
      exact: true,
    });
    await submit.click();
    await previewEvent(page, "suspend");
    await page
      .getByRole("button", { name: "Resume same account", exact: true })
      .click();
    await previewEvent(page, "reject");
    await expect(page.getByRole("textbox", { name: /^Name/ })).toHaveValue(
      "Travel key",
    );
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
    await submit.click();
    await expect(page.getByTestId("requests")).toHaveText("Requests: 2");
    await previewEvent(page, "resolve");
    if (variant === "PasskeyRecovery") {
      const dialog = page.getByRole("dialog");
      await expect(dialog).toContainText("Save recovery codes");
      await expect(dialog).toContainText("demo-0001-preview");
      await expect(page.locator('[data-slot="toast"]')).toHaveCount(1);
      await page
        .locator('[data-slot="toast"]')
        .getByRole("button", { name: "Close", exact: true })
        .click();
      await dialog
        .getByRole("button", { name: "Continue", exact: true })
        .click();
    } else
      await expect(
        page.getByRole("row").filter({ hasText: "Travel key" }),
      ).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(opener).toBeFocused();
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(
      variant === "PasskeyRecovery" ? 0 : 1,
    );
  });
}
