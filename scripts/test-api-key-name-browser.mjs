import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";

const exportDirectory = path.resolve("cosmos-export");
const artifacts = path.resolve("artifacts/api-key-name-validation");
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
try {
  for (const width of [390, 1280]) {
    for (const theme of ["light", "dark"]) {
      for (const variant of ["Name validation", "Permission name validation"]) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          hasTouch: width === 390,
          colorScheme: theme,
        });
        const page = await context.newPage();
        page.on("pageerror", (cause) => failures.push(cause.message));
        await page.addInitScript(
          (mode) =>
            globalThis.localStorage.setItem("avgeek-oss-ui-theme", mode),
          theme,
        );
        await page.goto(
          fixtureUrl(
            "cosmos/Patterns/Account Settings/CreateApiKeyDialog.fixture.tsx",
            variant,
          ),
        );
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await page
          .getByRole("button", { name: "Create key", exact: true })
          .click();
        const dialog = page.getByRole("dialog");
        const name = dialog.getByRole("textbox", { name: /^Name/ });
        await name.fill("   ");
        for (let attempt = 0; attempt < 2; attempt++) {
          if (width === 390)
            await dialog
              .getByRole("button", { name: "Create key", exact: true })
              .tap();
          else await name.press("Enter");
          await expect(page.getByTestId("create-requests")).toHaveText(
            "Create requests: 0",
          );
          await expect(name).toBeFocused();
          await expect(name).toHaveValue("   ");
          await expect(dialog).not.toContainText(
            "Enter a name for this API key.",
          );
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
          path: path.join(artifacts, `${width}-${theme}-${variant}.png`),
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
        checks++;
        await context.close();
      }
    }
  }
  assert.deepEqual(failures, []);
  await writeFile(
    path.join(artifacts, "receipt.json"),
    JSON.stringify(
      {
        checks,
        widths: [390, 1280],
        themes: ["light", "dark"],
        permissionModes: ["name-and-expiry", "permissions"],
      },
      null,
      2,
    ),
  );
  console.log(`${checks} API-key name validation browser checks passed`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
