import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";

const exportDirectory = path.resolve("cosmos-export");
const artifacts = path.resolve("artifacts/query-loading");
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
      await page.addInitScript(
        (mode) => globalThis.localStorage.setItem("avgeek-oss-ui-theme", mode),
        theme,
      );
      await page.goto(
        fixtureUrl(
          "cosmos/Patterns/Feedback/QueryLoading.fixture.tsx",
          "Initial",
        ),
      );
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const status = page
        .getByRole("status")
        .filter({ hasText: "Loading account settings…" });
      await expect(status).toHaveCount(1);
      assert.match(await status.ariaSnapshot(), /Loading account settings/);
      const style = await status.evaluate((element) => {
        const value = globalThis.getComputedStyle(element);
        return {
          position: value.position,
          clip: value.clip,
          clipPath: value.clipPath,
          overflow: value.overflow,
          width: value.width,
          height: value.height,
          display: value.display,
          visibility: value.visibility,
        };
      });
      assert.equal(style.position, "absolute");
      assert.equal(style.width, "1px");
      assert.equal(style.height, "1px");
      assert.equal(style.overflow, "hidden");
      assert.ok(
        style.clipPath === "inset(50%)" ||
          /^rect\(0px, 0px, 0px, 0px\)$/.test(style.clip),
        "Loading announcement must be visually clipped",
      );
      assert.notEqual(style.display, "none");
      assert.notEqual(style.visibility, "hidden");
      const anchor = page.getByTestId("content-anchor");
      const before = await anchor.boundingBox();
      assert.ok(before);
      await page.screenshot({
        path: path.join(artifacts, `${width}-${theme}-initial.png`),
      });
      const finish = page.getByRole("button", { name: "Finish loading" });
      if (width === 390) await finish.tap();
      else {
        await finish.focus();
        await page.keyboard.press("Enter");
      }
      await expect(status).toHaveCount(0);
      await expect(anchor).toHaveText("Account details loaded.");
      const after = await anchor.boundingBox();
      assert.ok(after);
      assert.equal(
        after.y,
        before.y,
        "Removing the hidden loading announcement must not shift the content",
      );
      await page.getByRole("button", { name: "Load again" }).click();
      await expect(status).toHaveCount(1);
      checks++;
      await page.goto(
        fixtureUrl(
          "cosmos/Patterns/Feedback/QueryLoading.fixture.tsx",
          "Visible progress",
        ),
      );
      const progress = page
        .getByRole("status")
        .filter({ hasText: "Preparing the export…" });
      await expect(progress).toBeVisible();
      const box = await progress.boundingBox();
      assert.ok(
        box && box.width > 100 && box.height > 10,
        "Explicit visible progress remains usable",
      );
      await page.screenshot({
        path: path.join(artifacts, `${width}-${theme}-visible.png`),
      });
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
  console.log(`${checks} query loading browser checks passed`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
