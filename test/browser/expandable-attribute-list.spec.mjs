import assert from "node:assert/strict";
import { test, expect } from "./fixtures.mjs";

for (const variant of ["Mixed", "Controlled"]) {
  test(`${variant} attribute rows expand accessibly and keep static values aligned`, async ({
    page,
    fixtureUrl,
    touch,
  }, testInfo) => {
    await page.goto(
      fixtureUrl(
        "cosmos/Patterns/ExpandableAttributeList.fixture.tsx",
        variant,
      ),
    );
    const report = page.getByRole("button", { name: /10:49 Report Complete/ });
    await expect(report).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Daily report", { exact: true })).toBeHidden();
    await expect(page.getByRole("button", { name: /Status/ })).toHaveCount(0);
    if (touch) await report.tap();
    else {
      await report.focus();
      await page.keyboard.press("Enter");
    }
    await expect(report).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Daily report", { exact: true })).toBeVisible();
    const geometry = await page
      .locator(".expandable-attribute-list__item")
      .nth(1)
      .evaluate((item) => {
        const label = item
          .querySelector(".expandable-attribute-list__label")
          .getBoundingClientRect();
        const value = item
          .querySelector(".expandable-attribute-list__value")
          .getBoundingClientRect();
        const details = item
          .querySelector(".expandable-attribute-list__details")
          .getBoundingClientRect();
        const values = [
          ...globalThis.document.querySelectorAll(
            ".expandable-attribute-list__value",
          ),
        ].map((element) => element.getBoundingClientRect().right);
        return {
          label: label.left,
          value: value.right,
          left: details.left,
          right: details.right,
          values,
          overflow:
            globalThis.document.documentElement.scrollWidth >
            globalThis.innerWidth,
        };
      });
    assert.ok(
      Math.abs(geometry.label - geometry.left) <= 1,
      "Details begin under the label",
    );
    assert.ok(
      Math.abs(geometry.value - geometry.right) <= 1,
      "Details end under the value",
    );
    assert.ok(
      geometry.values.every((right) => Math.abs(right - geometry.value) <= 1),
      "Static and expandable values share the same column",
    );
    assert.equal(geometry.overflow, false);
    await page.screenshot({ path: testInfo.outputPath("expanded.png") });
    if (touch) await report.tap();
    else await page.keyboard.press("Space");
    await expect(report).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Daily report", { exact: true })).toBeHidden();
    if (!touch) await expect(report).toBeFocused();
  });
}

test("long attribute labels and values wrap without horizontal overflow", async ({
  page,
  fixtureUrl,
}, testInfo) => {
  await page.goto(
    fixtureUrl(
      "cosmos/Patterns/ExpandableAttributeList.fixture.tsx",
      "Long content",
    ),
  );
  await page.getByRole("button", { name: /An unusually long report/ }).click();
  await expect(page.getByText("Daily report", { exact: true })).toBeVisible();
  assert.equal(
    await page.evaluate(
      () =>
        globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    ),
    false,
  );
  await page.screenshot({ path: testInfo.outputPath("long-content.png") });
});
