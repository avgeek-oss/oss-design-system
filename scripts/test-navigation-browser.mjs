import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";

const exportDirectory = path.resolve("cosmos-export");
const artifacts = path.resolve("artifacts/navigation-notifications");
await mkdir(artifacts, { recursive: true });
const contentTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const file = path.resolve(
    exportDirectory,
    `.${decodeURIComponent(pathname)}`,
  );
  if (!file.startsWith(`${exportDirectory}${path.sep}`)) {
    response.writeHead(404).end();
    return;
  }
  try {
    const bytes = await readFile(file);
    response
      .writeHead(200, {
        "Content-Type":
          contentTypes[path.extname(file)] ?? "application/octet-stream",
      })
      .end(bytes);
  } catch (cause) {
    response.writeHead(cause.code === "ENOENT" ? 404 : 500).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
assert.ok(address && typeof address !== "string");
const browser = await chromium.launch();
const failures = [];
let checks = 0;
function fixtureUrl(file, name) {
  const fixtureId = { path: file, ...(name ? { name } : {}) };
  return `http://127.0.0.1:${address.port}/renderer.html?fixtureId=${encodeURIComponent(JSON.stringify(fixtureId))}&locked=true`;
}
async function press(control, touch) {
  if (touch) await control.tap();
  else await control.click();
}
try {
  for (const width of [390, 1280]) {
    for (const theme of ["light", "dark"]) {
      for (const reducedMotion of ["no-preference", "reduce"]) {
        const touch = width === 390;
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          hasTouch: touch,
          colorScheme: theme,
          reducedMotion,
        });
        const page = await context.newPage();
        page.on("pageerror", (cause) => failures.push(cause.message));
        await page.addInitScript(
          (mode) =>
            globalThis.localStorage.setItem("avgeek-oss-ui-theme", mode),
          theme,
        );
        await page.goto(
          fixtureUrl("cosmos/Layouts/SecondarySidebar.fixture.tsx"),
        );
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
          path: path.join(
            artifacts,
            `navigation-${width}-${theme}-${reducedMotion}.png`,
          ),
          animations: "disabled",
        });
        await press(
          page.getByRole("button", { name: "Refresh account", exact: true }),
          touch,
        );
        await expect(page.locator("[data-actions]")).toHaveText("Actions: 1");
        if (touch) await expect(page.getByRole("dialog")).toHaveCount(0);
        checks++;

        await page.goto(
          fixtureUrl("cosmos/Layouts/Shell.fixture.tsx", "Account settings"),
        );
        if (touch)
          await press(
            page.getByRole("button", { name: "Toggle navigation" }),
            touch,
          );
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
          await press(
            page.getByRole("button", { name: "Toggle navigation" }),
            touch,
          );
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
        await expect(page.locator("[data-navigation]")).toHaveText(
          "Not navigated",
        );
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
        await expect(page.getByRole("dialog")).not.toContainText(
          "Could not mark",
        );
        await press(
          page.getByRole("button", { name: "Load more", exact: true }),
          touch,
        );
        await expect(
          page.getByRole("link", { name: /Health check failed/ }),
        ).toBeVisible();
        await page.screenshot({
          path: path.join(
            artifacts,
            `notifications-${width}-${theme}-${reducedMotion}.png`,
          ),
          animations: "disabled",
        });
        await press(task, touch);
        await expect(page.locator("[data-activation-count]")).toHaveText(
          "Activations: 2",
        );
        await expect(page.locator("[data-navigation]")).toHaveText(
          "Not navigated",
        );
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
        await expect(page.getByRole("dialog")).not.toContainText(
          "Could not load",
        );
        await press(
          page.getByRole("button", {
            name: "Retry notifications",
            exact: true,
          }),
          touch,
        );
        await expect(task).toBeVisible();
        checks++;
        await context.close();
      }
    }
  }
  assert.deepEqual(
    failures,
    [],
    "Fixtures must not produce browser exceptions",
  );
  await writeFile(
    path.join(artifacts, "receipt.json"),
    JSON.stringify(
      {
        checks,
        widths: [390, 1280],
        themes: ["light", "dark"],
        reducedMotion: ["no-preference", "reduce"],
      },
      null,
      2,
    ),
  );
  console.log(`${checks} navigation and notification browser checks passed`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
