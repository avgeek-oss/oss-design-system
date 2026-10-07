import { test, expect } from "./fixtures.mjs";

for (const [name, heading, retry] of [
  ["404", "Page not found", false],
  ["500", "We couldn't load this page", true],
  ["Unavailable", "Temporarily unavailable", true],
]) {
  test(`error page ${name} preserves recovery and fits the viewport`, async ({
    page,
    fixtureUrl,
  }) => {
    await page.goto(
      fixtureUrl("cosmos/Patterns/Feedback/ErrorPage.fixture.tsx", name),
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(
      page.getByRole("link", { name: "Go to overview" }),
    ).toHaveAttribute("href", "/");
    const button = page.getByRole("button", { name: "Try again" });
    if (retry) {
      await button.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("status")).toHaveText("Retry requested");
    } else {
      await expect(button).toHaveCount(0);
    }
    expect(
      await page.evaluate(
        () =>
          globalThis.document.documentElement.scrollWidth <=
          globalThis.innerWidth,
      ),
    ).toBe(true);
  });
}

test("pending recovery cannot be submitted again", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(
    fixtureUrl("cosmos/Patterns/Feedback/ErrorPage.fixture.tsx", "Pending"),
  );
  await expect(page.getByRole("button", { name: "Try again" })).toBeDisabled();
  await expect(page.getByRole("link", { name: "Go to home" })).toBeVisible();
});
