import assert from "node:assert/strict";
import { test, expect } from "./fixtures.mjs";

async function press(control, touch) {
  if (touch) await control.tap();
  else await control.click();
}
test("sidebar links preserve navigation, active sections and mobile dismissal", async ({
  page,
  context,
  fixtureUrl,
  touch,
  theme,
}, testInfo) => {
  await page.goto(fixtureUrl("cosmos/Layouts/SecondarySidebar.fixture.tsx"));
  await page.bringToFront();
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  if (touch) await press(toggle, touch);
  const preferences = page.getByRole("link", {
    name: "Preferences",
    exact: true,
  });
  await expect(preferences).toHaveAttribute("href", "/preferences");
  const box = await preferences.boundingBox();
  assert.ok(
    box && box.height >= 36,
    "Secondary links retain native menu height",
  );
  await expect(
    page.getByRole("link", { name: "Profile", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("button", { name: "Restricted", exact: true }),
  ).toBeDisabled();
  if (!touch) {
    const newTabPromise = context.waitForEvent("page");
    await preferences.click({ modifiers: ["ControlOrMeta"] });
    const newTab = await newTabPromise;
    await newTab.waitForLoadState();
    await newTab.close();
    await page.bringToFront();
    await expect(page.locator("[data-route]")).toHaveText("/profile");
  }
  await preferences.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-route]")).toHaveText("/preferences");
  await expect(page.locator("[data-actions]")).toHaveText("Actions: 0");
  if (touch) {
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(toggle).toBeFocused();
    await press(toggle, touch);
  }
  await page.screenshot({
    path: testInfo.outputPath("preview.png"),
    animations: "disabled",
  });
  await press(
    page.getByRole("button", { name: "Refresh account", exact: true }),
    touch,
  );
  await expect(page.locator("[data-actions]")).toHaveText("Actions: 1");
  if (touch) await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.goto(
    fixtureUrl("cosmos/Layouts/Shell.fixture.tsx", "Account settings"),
  );
  if (touch)
    await press(page.getByRole("button", { name: "Toggle navigation" }), touch);
  const account = page
    .getByRole("navigation", { name: "Primary navigation", exact: true })
    .getByRole("link", {
      name: "Account settings",
      exact: true,
    });
  await expect(account).toHaveAttribute("aria-current", "page");
  const team = page
    .getByRole("navigation", { name: "Primary navigation", exact: true })
    .getByRole("link", {
      name: "Team settings",
      exact: true,
    });
  await expect(team).not.toHaveAttribute("aria-current", "page");
  if (touch) await page.keyboard.press("Escape");
  await page.goto(
    fixtureUrl("cosmos/Layouts/Shell.fixture.tsx", "Team settings"),
  );
  if (touch)
    await press(page.getByRole("button", { name: "Toggle navigation" }), touch);
  await expect(
    page
      .getByRole("navigation", {
        name: "Primary navigation",
        exact: true,
      })
      .getByRole("link", { name: "Team settings", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page
      .getByRole("navigation", {
        name: "Primary navigation",
        exact: true,
      })
      .getByRole("link", { name: "Account settings", exact: true }),
  ).not.toHaveAttribute("aria-current", "page");
});
test("notification activation waits, retries and preserves native modified clicks", async ({
  page,
  context,
  fixtureUrl,
  touch,
}, testInfo) => {
  await page.bringToFront();
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/NotificationMenu.fixture.tsx",
      "Activation and recovery",
    ),
  );
  const trigger = page.getByRole("button", { name: /^Notifications/ });
  await press(trigger, touch);
  await expect(page.locator("[data-activation-count]")).toHaveText(
    "Activations: 0",
  );
  const task = page.getByRole("link", { name: /Deployment completed/ });
  if (!touch) {
    const newTabPromise = context.waitForEvent("page");
    await task.click({ modifiers: ["ControlOrMeta"] });
    const newTab = await newTabPromise;
    await newTab.waitForLoadState();
    await newTab.close();
    await page.bringToFront();
    await expect(page.locator("[data-activation-count]")).toHaveText(
      "Activations: 0",
    );
    await expect(page.getByRole("dialog")).toBeVisible();
  }
  await task.focus();
  await page.keyboard.press("Enter");
  await expect(task).toHaveAttribute("aria-busy", "true");
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-activation-count]")).toHaveText(
    "Activations: 1",
  );
  await expect(page.locator("[data-navigation]")).toHaveText("Not navigated");
  await press(
    page.getByRole("button", {
      name: "Complete activation",
      exact: true,
    }),
    touch,
  );
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(task).toHaveAttribute("aria-busy", "false");
  await expect(page.locator('[data-slot="toast"]')).toHaveCount(1);
  await expect(page.getByRole("dialog")).not.toContainText("Could not mark");
  await press(
    page.getByRole("button", { name: "Load more", exact: true }),
    touch,
  );
  await expect(
    page.getByRole("link", { name: /Health check failed/ }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("preview.png"),
    animations: "disabled",
  });
  await press(task, touch);
  await expect(page.locator("[data-activation-count]")).toHaveText(
    "Activations: 2",
  );
  await expect(page.locator("[data-navigation]")).toHaveText("Not navigated");
  await press(
    page.getByRole("button", {
      name: "Complete activation",
      exact: true,
    }),
    touch,
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("[data-navigation]")).toHaveText(
    "Navigated to #deployment",
  );
  await press(trigger, touch);
  await press(
    page.getByRole("button", { name: "Mark all as read", exact: true }),
    touch,
  );
  await expect(
    page.getByRole("button", { name: "Marking read…", exact: true }),
  ).toBeDisabled();
  await press(
    page.getByRole("button", { name: "Complete mark all", exact: true }),
    touch,
  );
  await expect(
    page.getByRole("button", { name: "Mark all as read", exact: true }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await press(
    page.getByRole("button", {
      name: "Simulate query failure",
      exact: true,
    }),
    touch,
  );
  await press(trigger, touch);
  await expect(page.getByRole("dialog")).not.toContainText(
    "No notifications yet",
  );
  await expect(page.getByRole("dialog")).not.toContainText("Could not load");
  await press(
    page.getByRole("button", {
      name: "Retry notifications",
      exact: true,
    }),
    touch,
  );
  await expect(task).toBeVisible();
});

for (const variant of [
  "Stable navbar",
  "Replaced navbar",
  "Destination focus",
]) {
  test(`browser Back restores navigation focus with ${variant}`, async ({
    page,
    fixtureUrl,
    touch,
    reducedMotion,
  }) => {
    test.skip(!touch, "This regression concerns the mobile drawer");
    await page.goto(
      fixtureUrl("cosmos/Layouts/NavigationFocus.fixture.tsx", variant),
    );
    await page.bringToFront();
    await page.addStyleTag({
      content:
        ".drawer__dialog {--drawer-exit-duration: 600ms !important;} .drawer__backdrop[data-exiting] {transition-duration:600ms !important;}",
    });
    for (let repeat = 0; repeat < 6; repeat++) {
      await page
        .getByRole("button", { name: "Back to board", exact: true })
        .tap();
      await expect(
        page.getByRole("heading", { name: "Board", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Toggle navigation", exact: true })
        .tap();
      await expect(
        page.getByRole("dialog", { name: "Navigation" }),
      ).toBeVisible();
      await page.evaluate(async () => {
        await Promise.all(
          globalThis.document
            .getAnimations()
            .map((animation) => animation.finished),
        );
      });
      const outgoing = await page
        .getByRole("dialog", { name: "Navigation" })
        .textContent();
      await page.goBack();
      if (reducedMotion !== "reduce") {
        await expect(
          page.locator(".drawer__backdrop[data-exiting=true]"),
        ).toBeVisible();
        await expect(
          page.getByRole("dialog", { name: "Navigation" }),
        ).toHaveText(outgoing);
      }
      await expect(
        page.getByRole("dialog", { name: "Navigation" }),
      ).toHaveCount(0);
      const expected =
        variant === "Destination focus"
          ? "Destination action"
          : "Toggle navigation";
      await expect(
        page.getByRole("button", { name: expected, exact: true }),
      ).toBeFocused();
    }
  });
}

test("a drawer reopened as the destination mounts keeps focus inside navigation", async ({
  page,
  fixtureUrl,
  touch,
}) => {
  test.skip(!touch, "This regression concerns the mobile drawer");
  await page.goto(
    fixtureUrl(
      "cosmos/Layouts/NavigationFocus.fixture.tsx",
      "Reopen on arrival",
    ),
  );
  await page.bringToFront();
  await page.getByRole("button", { name: "Back to board", exact: true }).tap();
  const toggle = page.getByRole("button", {
    name: "Toggle navigation",
    exact: true,
  });
  await toggle.tap();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.evaluate(async () => {
    await Promise.all(
      globalThis.document
        .getAnimations()
        .map((animation) => animation.finished),
    );
  });
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Task", exact: true }),
  ).toBeAttached();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const navigation = page.getByRole("dialog", { name: "Navigation" });
  await expect(navigation).toBeVisible();
  await expect(
    navigation.getByRole("button", { name: "All status", exact: true }),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      navigation.evaluate((element) =>
        element.contains(globalThis.document.activeElement),
      ),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(navigation).toHaveCount(0);
  await expect(toggle).toBeFocused();
});
