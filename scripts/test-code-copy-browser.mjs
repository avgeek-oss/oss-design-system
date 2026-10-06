import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";

const exportDirectory = path.resolve("cosmos-export");
const artifacts = path.resolve("artifacts/code-copy");
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
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        hasTouch: width === 390,
        colorScheme: theme,
      });
      const page = await context.newPage();
      page.on("pageerror", (cause) => failures.push(cause.message));
      await page.addInitScript((mode) => {
        globalThis.localStorage.setItem("avgeek-oss-ui-theme", mode);
        globalThis.copyWrites = 0;
        Object.defineProperty(globalThis.navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: () => {
              globalThis.copyWrites++;
              return new Promise((resolve, reject) => {
                globalThis.finishCopy = resolve;
                globalThis.failCopy = reject;
              });
            },
          },
        });
      }, theme);
      await page.goto(
        fixtureUrl("cosmos/Primitives/Typography/CodeBlock.fixture.tsx"),
      );
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const copy = page
        .getByRole("button", { name: "Copy code", exact: true })
        .first();
      await copy.evaluate((element) => {
        element.click();
        element.click();
      });
      assert.equal(await page.evaluate(() => globalThis.copyWrites), 1);
      await expect(copy).toHaveAttribute("aria-disabled", "true");
      await expect(copy).toHaveText("Copy");
      await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
      await page.evaluate(() =>
        globalThis.failCopy(new Error("Clipboard denied")),
      );
      const danger = page.locator('[data-slot="toast"]:not([data-exiting])');
      await expect(danger).toHaveCount(1);
      await expect(danger).toContainText(
        "Could not copy to the clipboard. Select and copy the text instead.",
      );
      await expect(copy).not.toHaveAttribute("aria-disabled", "true");
      await expect(
        page.locator('[data-slot="code-block-code"]').first(),
      ).toHaveText("Plain text");
      const dangerClose = danger.locator('[data-slot="toast-close"]');
      if (width === 390) await dangerClose.tap();
      else {
        await dangerClose.focus();
        await page.keyboard.press("Enter");
      }
      await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
      await copy.focus();
      if (width === 390) await copy.tap();
      else await page.keyboard.press("Enter");
      assert.equal(await page.evaluate(() => globalThis.copyWrites), 2);
      await page.evaluate(() => globalThis.finishCopy());
      const success = page.locator('[data-slot="toast"]:not([data-exiting])');
      await expect(success).toHaveCount(1);
      await expect(success).toContainText("Copied to clipboard.");
      await expect(copy).toHaveText("Copy");
      await expect(copy).toHaveAttribute("aria-label", "Copy code");
      await page.screenshot({
        path: path.join(artifacts, `${width}-${theme}-success.png`),
      });
      await success.locator('[data-slot="toast-close"]').click();
      await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
      await page.evaluate(() =>
        Reflect.deleteProperty(globalThis.navigator, "clipboard"),
      );
      for (let attempt = 0; attempt < 2; attempt++) {
        await copy.click();
        await expect(danger).toHaveCount(1);
        await expect(danger).toContainText("Could not copy to the clipboard.");
        await expect(copy).toHaveText("Copy");
        await dangerClose.click();
        await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
      }
      assert.equal(
        await page.evaluate(() => globalThis.copyWrites),
        2,
        "Unsupported clipboard must not fabricate writes",
      );
      checks++;
      await context.close();
    }
  }
  assert.deepEqual(failures, []);
  await writeFile(
    path.join(artifacts, "receipt.json"),
    JSON.stringify(
      { checks, widths: [390, 1280], themes: ["light", "dark"] },
      null,
      2,
    ),
  );
  console.log(`${checks} code copy browser checks passed`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
