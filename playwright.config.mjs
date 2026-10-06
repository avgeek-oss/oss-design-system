import { defineConfig } from "@playwright/test";

const projects = [];
for (const width of [390, 1280]) {
  for (const theme of ["light", "dark"]) {
    for (const reducedMotion of ["no-preference", "reduce"]) {
      projects.push({
        name: `${width}-${theme}-${reducedMotion}`,
        ...(reducedMotion === "reduce"
          ? { testMatch: /(?:navigation|feedback)\.spec\.mjs/ }
          : {}),
        use: {
          viewport: { width, height: 900 },
          hasTouch: width === 390,
          colorScheme: theme,
          reducedMotion,
        },
      });
    }
  }
}

export default defineConfig({
  testDir: "test/browser",
  testMatch: "**/*.spec.mjs",
  // Keyboard focus assertions require one foreground page at a time.
  workers: 1,
  forbidOnly: true,
  outputDir: "artifacts/browser/results",
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/browser/report.json" }],
  ],
  use: {
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects,
});
