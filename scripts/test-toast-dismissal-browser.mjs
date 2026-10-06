import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";

const exportDirectory = path.resolve("cosmos-export");
const artifacts = path.resolve("artifacts/toast-dismissal");
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
const fixtureId = {
  path: "cosmos/Primitives/Overlays/Toast.fixture.tsx",
  name: "Dismissal",
};
const url = `http://127.0.0.1:${address.port}/renderer.html?fixtureId=${encodeURIComponent(JSON.stringify(fixtureId))}&locked=true`;
const browser = await chromium.launch();
const failures = [];
let checks = 0;
const activeToasts = (page) =>
  page.locator('[data-slot="toast"]:not([data-exiting="true"])');
const close = (toast) => toast.locator('[data-slot="toast-close"]');
async function assertReachable(control) {
  await expect(control).toBeVisible();
  await expect(control).toHaveCSS("opacity", "1");
  await expect(control).toHaveCSS("pointer-events", "auto");
  await expect
    .poll(async () => {
      const box = await control.boundingBox();
      return box ? Math.min(box.width, box.height) : 0;
    })
    .toBeGreaterThanOrEqual(31.99);
}
async function dismiss(control, touch) {
  if (touch) await control.tap();
  else await control.click();
}
try {
  for (const width of [390, 1280]) {
    for (const theme of ["light", "dark"]) {
      for (const reducedMotion of ["no-preference", "reduce"]) {
        for (const scenario of ["single", "stack", "modal"]) {
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
          await page.goto(url);
          await page.bringToFront();
          await expect(page.locator("html")).toHaveAttribute(
            "data-theme",
            theme,
          );
          if (scenario === "single") {
            await page
              .getByRole("button", { name: "Show error", exact: true })
              .click();
            await page.mouse.move(0, 0);
            const toast = activeToasts(page);
            await expect(toast).toHaveCount(1);
            await expect(toast).not.toHaveAttribute("data-entering", "true");
            await assertReachable(close(toast));
            await page.screenshot({
              path: path.join(
                artifacts,
                `${scenario}-${width}-${theme}-${reducedMotion}.png`,
              ),
              animations: "disabled",
            });
            await dismiss(close(toast), touch);
            await expect(activeToasts(page)).toHaveCount(0);
          } else if (scenario === "stack") {
            await page
              .getByRole("button", { name: "Show stack", exact: true })
              .click();
            await page.mouse.move(0, 0);
            await expect(activeToasts(page)).toHaveCount(6);
            const front = page.locator(
              '[data-slot="toast"][data-frontmost="true"]',
            );
            await expect(front).not.toHaveAttribute("data-entering", "true");
            await assertReachable(close(front));
            const back = page.locator(
              '[data-slot="toast"]:not([data-frontmost="true"]):not([data-hidden="true"])',
            );
            await expect(back).toHaveCount(2);
            for (const toast of await back.all()) {
              await expect(close(toast)).toHaveCSS("opacity", "0");
              await expect(close(toast)).toHaveCSS("pointer-events", "none");
            }
            const hidden = page.locator(
              '[data-slot="toast"][data-hidden="true"]',
            );
            await expect(hidden).toHaveCount(3);
            for (const toast of await hidden.all()) {
              await expect(close(toast)).toHaveCSS("visibility", "hidden");
              await expect(close(toast)).toHaveCSS("pointer-events", "none");
            }
            await page.keyboard.press("F6");
            await expect(
              page.locator('[data-slot="toast-region"]'),
            ).toHaveAttribute("data-expanded", "true");
            const expanded = page.locator(
              '[data-slot="toast"]:not([data-hidden="true"])',
            );
            for (const toast of await expanded.all())
              await assertReachable(close(toast));
            let keyboardClose = false;
            for (let tab = 0; tab < 4; tab++) {
              await page.keyboard.press("Tab");
              keyboardClose = await page.evaluate(
                () =>
                  globalThis.document.activeElement?.getAttribute(
                    "data-slot",
                  ) === "toast-close",
              );
              if (keyboardClose) break;
            }
            assert.equal(
              keyboardClose,
              true,
              "Toast close must be reachable by keyboard without hover",
            );
            await close(expanded.nth(1)).focus();
            await page.screenshot({
              path: path.join(
                artifacts,
                `${scenario}-${width}-${theme}-${reducedMotion}.png`,
              ),
              animations: "disabled",
            });
            await page.keyboard.press("Enter");
            await expect(activeToasts(page)).toHaveCount(5);
            for (const toast of await hidden.all()) {
              await expect(close(toast)).toHaveCSS("pointer-events", "none");
            }
          } else {
            await page
              .getByRole("button", { name: "Open form", exact: true })
              .click();
            const dialog = page.getByRole("dialog");
            await page.keyboard.press("Escape");
            await expect(dialog).toHaveCount(0);
            await expect(
              page.getByRole("button", { name: "Open form", exact: true }),
            ).toBeFocused();
            await page
              .getByRole("button", { name: "Open form", exact: true })
              .click();
            await dialog
              .getByLabel("Name", { exact: true })
              .fill("Retained draft");
            for (let attempt = 0; attempt < 3; attempt++) {
              await dialog
                .getByRole("button", { name: "Save", exact: true })
                .click();
              await page.mouse.move(0, 0);
              const toast = activeToasts(page);
              await expect(toast).toHaveCount(1);
              await expect(toast).not.toHaveAttribute("data-entering", "true");
              await assertReachable(close(toast));
              await expect(
                dialog.getByLabel("Name", { exact: true }),
              ).toHaveValue("Retained draft");
              if (attempt === 0) {
                await page.screenshot({
                  path: path.join(
                    artifacts,
                    `${scenario}-${width}-${theme}-${reducedMotion}.png`,
                  ),
                  animations: "disabled",
                });
                await dismiss(close(toast), touch);
              } else if (attempt === 1) {
                await close(toast).focus();
                await page.keyboard.press("Enter");
              } else {
                await dismiss(close(toast), touch);
                await dialog.getByLabel("Name", { exact: true }).focus();
              }
              await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
              await expect(dialog).toBeVisible();
              await expect
                .poll(
                  () =>
                    page.evaluate(() => ({
                      focused: globalThis.document.hasFocus(),
                      insideDialog: Boolean(
                        globalThis.document.activeElement?.closest(
                          '[role="dialog"]',
                        ),
                      ),
                    })),
                  {
                    message: `Modal focus return: ${width}/${theme}/${reducedMotion}/${attempt}`,
                  },
                )
                .toMatchObject({ focused: true, insideDialog: true });
              if (attempt === 2) {
                await expect(
                  dialog.getByLabel("Name", { exact: true }),
                ).toBeFocused();
              }
            }
            await page.keyboard.press("Escape");
            await expect(dialog).toHaveCount(0);
            await expect(
              page.getByRole("button", { name: "Open form", exact: true }),
            ).toBeFocused();
          }
          checks++;
          await context.close();
        }
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
  console.log(`${checks} toast dismissal browser checks passed`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
