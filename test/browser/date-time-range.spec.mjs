import { test, expect } from "./fixtures.mjs";

const story = "stories/Primitives/Pickers/DateRangePicker.stories.tsx";

test("date/time range calendar and time controls update the controlled fields and restore focus", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(fixtureUrl(story, "Master"));
  const trigger = page
    .getByRole("button", { name: /^Choose date range/ })
    .first();
  await trigger.click();
  const calendar = page.getByRole("application", {
    name: "Date and time range calendar",
  });
  await expect(calendar).toBeVisible();
  await calendar
    .getByRole("button", { name: /Monday, 12 October 2026/, exact: false })
    .click();
  await calendar
    .getByRole("button", { name: /Tuesday, 13 October 2026/, exact: false })
    .click();
  await expect(calendar).not.toBeVisible();
  await expect(
    page.getByRole("spinbutton", { name: /day, Start Date/ }).first(),
  ).toHaveAttribute("aria-valuenow", "12");
  await expect(
    page.getByRole("spinbutton", { name: /day, End Date/ }).first(),
  ).toHaveAttribute("aria-valuenow", "13");
  await trigger.click();
  const hour = page.getByRole("spinbutton", {
    name: "hour, Start time",
    exact: true,
  });
  await hour.focus();
  await hour.press("ArrowUp");
  await expect(
    page.getByRole("spinbutton", { name: /hour, Start Date/ }).first(),
  ).toHaveAttribute("aria-valuenow", "9");
  await page.keyboard.press("Escape");
  await expect(calendar).not.toBeVisible();
  await expect(trigger).toBeFocused();
  const size = await page.evaluate(() => ({
    width: globalThis.innerWidth,
    scroll: globalThis.document.documentElement.scrollWidth,
  }));
  expect(size.scroll).toBeLessThanOrEqual(size.width);
});

test("date/time range empty, disabled, readonly and second-precision examples preserve native states", async ({
  page,
  fixtureUrl,
}) => {
  await page.goto(fixtureUrl(story, "States"));
  const disabled = page.getByRole("group", {
    name: "Disabled range",
    exact: true,
  });
  await expect(disabled.getByRole("button")).toBeDisabled();
  const readonly = page.getByRole("group", {
    name: "Read-only range",
    exact: true,
  });
  const hour = readonly.getByRole("spinbutton", { name: /hour, Start Date/ });
  const original = await hour.getAttribute("aria-valuenow");
  await hour.focus();
  await hour.press("ArrowUp");
  await expect(hour).toHaveAttribute("aria-valuenow", original);
  await expect(
    page
      .getByRole("group", { name: "12-hour range with seconds", exact: true })
      .getByRole("spinbutton", { name: /second, Start Date/ }),
  ).toBeVisible();
});
