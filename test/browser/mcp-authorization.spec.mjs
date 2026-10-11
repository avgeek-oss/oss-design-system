import { test, expect } from "./fixtures.mjs";

const fixture = "cosmos/Patterns/Auth/McpAuthorization.fixture.tsx";

test("MCP consent defaults to read-only and permits an explicit administrator choice", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(fixtureUrl(fixture, "Administrator"));
  await expect(
    page.getByRole("heading", { name: "Connect to Towbar" }),
  ).toBeVisible();
  await expect(page.getByLabel("Application", { exact: true })).toBeDisabled();
  const scope = page.getByRole("button", { name: "Select Scope" });
  await expect(scope).toContainText("Read-only");
  await scope.click();
  await page
    .getByRole("option", { name: "Administrator", exact: true })
    .click();
  await expect(scope).toContainText("Administrator");
  await page.getByRole("button", { name: "Approve", exact: true }).click();
  await expect(
    page.getByText("Preview connection approved", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        globalThis.document.documentElement.scrollWidth <=
        globalThis.innerWidth,
    ),
  ).toBe(true);
});

test("MCP consent disables scope beyond the current role and returns to the client through denial", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(fixtureUrl(fixture, "Viewer"));
  await page.getByRole("button", { name: "Select Scope" }).click();
  for (const name of ["Write", "Administrator"]) {
    await expect(
      page.getByRole("option", { name, exact: true }),
    ).toHaveAttribute("aria-disabled", "true");
  }
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Back to Example MCP client", exact: true })
    .click();
  await expect(
    page.getByText("Preview connection denied", { exact: true }),
  ).toBeVisible();
});

test("MCP consent locks scope, approval and return while a decision is pending", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(fixtureUrl(fixture, "Pending"));
  await page.getByRole("button", { name: "Approve", exact: true }).click();
  for (const name of [
    "Approve",
    "Deny",
    "Back to Example MCP client",
    "Select Scope",
  ]) {
    await expect(
      page.getByRole("button", { name, exact: name !== "Select Scope" }),
    ).toBeDisabled();
  }
  await expect(
    page.getByText("Preview connection approved", { exact: true }),
  ).toBeVisible();
});
