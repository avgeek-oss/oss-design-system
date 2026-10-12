import { test, expect } from "./fixtures.mjs";

test("Storybook docs expose working controls, real source and bounded mobile content", async ({
  page,
  fixtureOrigin,
  theme,
}, testInfo) => {
  await page.goto(
    `${fixtureOrigin}/index.html?path=/docs/primitives-buttons-button--docs&globals=theme:${theme}`,
  );
  const docs = page.frameLocator("#storybook-preview-iframe");
  await expect(
    docs.getByRole("heading", { name: "Button", exact: true }),
  ).toHaveCount(1);
  await expect(
    docs.getByRole("heading", { name: "API reference", exact: true }),
  ).toHaveCount(1);
  await docs
    .getByRole("combobox", { name: "variant", exact: true })
    .selectOption("secondary");
  await expect(
    docs.getByRole("button", { name: "Button", exact: true }),
  ).toHaveClass(/button--secondary/);
  await docs
    .getByRole("switch", { name: "Show code", exact: true })
    .first()
    .click();
  await expect(docs.locator("pre.prismjs").first()).toContainText(
    "@avgeek-oss/design-system/buttons/button",
  );
  await expect(docs.locator("pre.prismjs").first()).toContainText(
    "export const Example",
  );
  expect(await docs.locator("pre.prismjs").first().innerText()).toContain(
    '<div className="p-4">',
  );
  await expect(docs.locator("html")).toHaveAttribute("data-theme", theme);
  expect(
    await docs
      .locator("html")
      .evaluate(
        (element) =>
          element.scrollWidth <= element.ownerDocument.defaultView.innerWidth,
      ),
  ).toBe(true);
  const buttonStyle = await docs
    .getByRole("button", { name: "Button", exact: true })
    .evaluate((element) => {
      const style = element.ownerDocument.defaultView.getComputedStyle(element);
      return { family: style.fontFamily, weight: style.fontWeight };
    });
  expect(buttonStyle.family).toContain("Inter");
  expect(buttonStyle.weight).toBe("500");
  await page.screenshot({ path: testInfo.outputPath("storybook-docs.png") });
});
