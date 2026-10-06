import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test as base, expect } from "@playwright/test";

const exportDirectory = path.resolve("cosmos-export");
const contentTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

export const test = base.extend({
  fixtureOrigin: [
    async ({}, use) => {
      const server = createServer(async (request, response) => {
        try {
          const pathname = new URL(request.url ?? "/", "http://localhost")
            .pathname;
          const file = path.resolve(
            exportDirectory,
            `.${decodeURIComponent(pathname)}`,
          );
          if (!file.startsWith(`${exportDirectory}${path.sep}`)) {
            response.writeHead(404).end();
            return;
          }
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
      await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
      });
      try {
        const address = server.address();
        assert.ok(address && typeof address !== "string");
        await use(`http://127.0.0.1:${address.port}`);
      } finally {
        await new Promise((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        );
      }
    },
    { scope: "worker" },
  ],
  fixtureUrl: async ({ fixtureOrigin }, use) => {
    await use((file, name) => {
      const fixtureId = { path: file, ...(name ? { name } : {}) };
      return `${fixtureOrigin}/renderer.html?fixtureId=${encodeURIComponent(JSON.stringify(fixtureId))}&locked=true`;
    });
  },
  touch: async ({ hasTouch }, use) => use(Boolean(hasTouch)),
  width: async ({ viewport }, use) => use(viewport.width),
  theme: async ({ colorScheme }, use) => use(colorScheme),
  page: async ({ page, theme }, use) => {
    const failures = [];
    page.on("pageerror", (cause) => failures.push(cause.message));
    await page.addInitScript(
      (mode) => globalThis.localStorage.setItem("avgeek-oss-ui-theme", mode),
      theme,
    );
    await use(page);
    expect(failures, "Fixtures must not produce browser exceptions").toEqual(
      [],
    );
  },
});

export { expect };
