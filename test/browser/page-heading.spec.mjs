import { test, expect } from "./fixtures.mjs";

for (const variant of [
  "Application title",
  "Custom icon title",
  "Content title",
  "Status title",
]) {
  test(`${variant} keeps a long heading and usable actions on one row`, async ({
    page,
    fixtureUrl,
    touch,
    width,
  }, testInfo) => {
    await page.goto(
      fixtureUrl("cosmos/Layouts/PageHeading.fixture.tsx", variant),
    );
    await page.bringToFront();
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText(
      "Review the complete release plan, board activity, security access and all remaining product follow-ups",
    );
    const create = page.getByRole("button", { name: "New task", exact: true });
    const more = page.getByRole("button", {
      name: "More actions",
      exact: true,
    });
    const geometry = await heading.evaluate((element) => {
      const header = element.closest("header");
      const buttons = Array.from(header.querySelectorAll("button"));
      const bounds = element.getBoundingClientRect();
      return {
        height: header.getBoundingClientRect().height,
        center: bounds.y + bounds.height / 2,
        actions: buttons.map((button) => {
          const rect = button.getBoundingClientRect();
          return {
            center: rect.y + rect.height / 2,
            left: rect.left,
            right: rect.right,
          };
        }),
        titleRight: bounds.right,
        badgeLeft: header
          .querySelector('[data-slot="chip"]')
          .getBoundingClientRect().left,
        viewport: globalThis.innerWidth,
        pageWidth: globalThis.document.documentElement.scrollWidth,
      };
    });
    expect(geometry.height).toBeLessThanOrEqual(36);
    expect(geometry.actions).toHaveLength(2);
    for (const action of geometry.actions) {
      expect(Math.abs(action.center - geometry.center)).toBeLessThan(2);
      expect(action.left).toBeGreaterThanOrEqual(geometry.titleRight);
      expect(action.right).toBeLessThanOrEqual(geometry.viewport);
    }
    expect(geometry.pageWidth).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.badgeLeft - geometry.titleRight).toBeLessThanOrEqual(13);
    if (width === 390) {
      const text = heading.getByText(/^Review the complete/);
      const clipped = await text.evaluate((element) => ({
        width: element.clientWidth,
        scrollWidth: element.scrollWidth,
        ellipsis: globalThis.getComputedStyle(element).textOverflow,
      }));
      expect(clipped.scrollWidth).toBeGreaterThan(clipped.width);
      expect(clipped.ellipsis).toBe("ellipsis");
      await text.tap();
      await expect(page.getByRole("tooltip")).toContainText(
        "all remaining product follow-ups",
      );
      await page.keyboard.press("Escape");
    }
    if (touch) await create.tap();
    else {
      await create.focus();
      await page.keyboard.press("Enter");
    }
    await expect(
      page.getByText("Created: 1; actions opened: 0", { exact: true }),
    ).toBeVisible();
    if (touch) await more.tap();
    else {
      await more.focus();
      await page.keyboard.press("Enter");
    }
    await expect(
      page.getByText("Created: 1; actions opened: 1", { exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: testInfo.outputPath("heading.png"),
      animations: "disabled",
    });
  });
}

test("page headings retain their wrapping default", async ({
  page,
  fixtureUrl,
  width,
}) => {
  await page.goto(
    fixtureUrl("cosmos/Layouts/PageHeading.fixture.tsx", "Default wrapping"),
  );
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toContainText("all remaining product follow-ups");
  if (width === 390) {
    const height = await heading.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    expect(height).toBeGreaterThan(32);
  }
  await expect(
    page.getByRole("button", { name: "New task", exact: true }),
  ).toBeVisible();
});
