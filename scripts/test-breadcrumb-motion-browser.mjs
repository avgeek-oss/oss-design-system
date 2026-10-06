import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, expect } from "@playwright/test";

const exportDirectory = path.resolve("cosmos-export");
const artifacts = path.resolve("artifacts/breadcrumb-motion");
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
async function sampleFrames(popover) {
  const frames = await popover.evaluate(async (element) => {
    const frames = [];
    for (let index = 0; index < 12; index++) {
      const bounds = element.getBoundingClientRect();
      const style = globalThis.getComputedStyle(element);
      frames.push({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        identity: new globalThis.DOMMatrixReadOnly(style.transform).isIdentity,
        opacity: Number(style.opacity),
      });
      await new Promise(globalThis.requestAnimationFrame);
    }
    return frames;
  });
  for (const [index, frame] of frames.entries()) {
    assert.equal(
      frame.identity,
      true,
      "Breadcrumb popover must not scale or slide",
    );
    for (const property of ["x", "y", "width", "height"])
      assert.ok(
        Math.abs(frame[property] - frames[0][property]) < 0.2,
        "Breadcrumb geometry must remain steady",
      );
    if (index > 0)
      assert.ok(
        frame.opacity + 0.001 >= frames[index - 1].opacity,
        "Opening opacity must progress without flickering",
      );
  }
  assert.equal(frames.at(-1).opacity, 1);
}
async function open(trigger, touch) {
  if (touch) await trigger.tap();
  else await trigger.click();
}
try {
  for (const width of [390, 1280]) {
    for (const theme of ["light", "dark"]) {
      for (const reducedMotion of ["no-preference", "reduce"]) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          hasTouch: width === 390,
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
          fixtureUrl("cosmos/Primitives/Navigation/Breadcrumbs.fixture.tsx"),
        );
        await page.evaluate(() => globalThis.document.fonts.ready);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        for (const kind of ["dropdown", "select"]) {
          const trigger = page.getByRole("button", {
            name: kind === "dropdown" ? "Switch section" : /Switch item/,
            exact: kind === "dropdown",
          });
          const popover = page.locator(
            kind === "dropdown"
              ? '[data-slot="dropdown-popover"]'
              : '[data-slot="select-popover"]',
          );
          await open(trigger, width === 390);
          await sampleFrames(popover);
          if (reducedMotion === "reduce")
            assert.equal(
              await popover.evaluate(
                (element) =>
                  element
                    .getAnimations()
                    .filter((animation) => animation.playState === "running")
                    .length,
              ),
              0,
            );
          await page.keyboard.press("Escape");
          await expect(popover).toHaveCount(0);
          await expect(trigger).toBeFocused();
          for (let attempt = 0; attempt < 3; attempt++) {
            await trigger.focus();
            await page.keyboard.press("Enter");
            await expect(popover).toHaveCount(1);
            await page.keyboard.press("Escape");
            const bounds = await trigger.boundingBox();
            assert.ok(bounds);
            if (width === 390)
              await page.touchscreen.tap(
                bounds.x + bounds.width / 2,
                bounds.y + bounds.height / 2,
              );
            else
              await page.mouse.click(
                bounds.x + bounds.width / 2,
                bounds.y + bounds.height / 2,
              );
            await expect(popover).toHaveCount(1);
            await expect(popover).not.toHaveAttribute("data-exiting", "true");
            await expect(trigger).toHaveAttribute("aria-expanded", "true");
            const ownsFocus = await popover.evaluate((element) =>
              element.contains(globalThis.document.activeElement),
            );
            assert.equal(
              ownsFocus,
              true,
              "Rapid reopen must put focus inside the active popover",
            );
            await page.keyboard.press("Escape");
            await expect(popover).toHaveCount(0);
            await expect(trigger).toBeFocused();
          }
          if (reducedMotion === "no-preference") {
            const slowExit = await page.addStyleTag({
              content:
                ".breadcrumb-popover[data-exiting=true] { transition-duration: 10s !important; }",
            });
            await open(trigger, width === 390);
            await sampleFrames(popover);
            await page.keyboard.press("Escape");
            assert.equal(
              await popover.evaluate((element) => {
                const animation = element
                  .getAnimations()
                  .find((animation) => animation.playState === "running");
                if (!animation) return false;
                element.dataset.reopenMarker = "same-popover";
                animation.pause();
                return true;
              }),
              true,
              "Paused exit fixture must retain the mounted popover",
            );
            const bounds = await trigger.boundingBox();
            assert.ok(bounds);
            if (width === 390)
              await page.touchscreen.tap(
                bounds.x + bounds.width / 2,
                bounds.y + bounds.height / 2,
              );
            else
              await page.mouse.click(
                bounds.x + bounds.width / 2,
                bounds.y + bounds.height / 2,
              );
            await expect(popover).not.toHaveAttribute("data-exiting", "true");
            await expect(popover).toHaveAttribute(
              "data-reopen-marker",
              "same-popover",
            );
            await expect
              .poll(() =>
                popover.evaluate((element) =>
                  element.contains(globalThis.document.activeElement),
                ),
              )
              .toBe(true);
            await slowExit.evaluate((element) => element.remove());
            await page.keyboard.press("Escape");
            await expect(popover).toHaveCount(0);
            await expect(trigger).toBeFocused();
          }
          const slowEntry =
            reducedMotion === "no-preference"
              ? await page.addStyleTag({
                  content:
                    ".breadcrumb-popover:not([data-exiting=true]) { transition-duration: 10s !important; }",
                })
              : null;
          await open(trigger, width === 390);
          if (slowEntry)
            assert.equal(
              await popover.evaluate((element) => {
                const animation = element
                  .getAnimations()
                  .find((animation) => animation.playState === "running");
                if (!animation) return false;
                animation.pause();
                return true;
              }),
              true,
              "Opening fade must be active for the interrupted selection test",
            );
          if (kind === "select") {
            const search = page.getByRole("searchbox", {
              name: "Search items",
            });
            await search.fill("Second");
            await expect(
              page.getByRole("option", { name: "First item", exact: true }),
            ).toHaveCount(0);
          }
          const item = page.getByRole(
            kind === "dropdown" ? "menuitemradio" : "option",
            {
              name: kind === "dropdown" ? "Second section" : "Second item",
              exact: true,
            },
          );
          if (width === 1280) {
            const bounds = await item.boundingBox();
            assert.ok(bounds);
            await page.mouse.move(
              bounds.x + bounds.width / 2,
              bounds.y + bounds.height / 2,
            );
            await page.mouse.down();
            assert.equal(
              await item.evaluate(
                (element) =>
                  new globalThis.DOMMatrixReadOnly(
                    globalThis.getComputedStyle(element).transform,
                  ).isIdentity,
              ),
              true,
              "Pressed breadcrumb items must not scale",
            );
            await page.mouse.up();
          } else await item.tap();
          await expect(popover).toHaveCount(0);
          if (slowEntry)
            await slowEntry.evaluate((element) => element.remove());
          await expect(trigger).toContainText(
            kind === "dropdown" ? "Second section" : "Second item",
          );
          await open(trigger, width === 390);
          await sampleFrames(popover);
          await page.screenshot({
            path: path.join(
              artifacts,
              `${width}-${theme}-${reducedMotion}-${kind}.png`,
            ),
          });
          await page.keyboard.press("Escape");
          await expect(popover).toHaveCount(0);
          await expect(trigger).toBeFocused();
          checks++;
        }
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
        reducedMotion: ["no-preference", "reduce"],
      },
      null,
      2,
    ),
  );
  console.log(`${checks} breadcrumb motion browser checks passed`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
