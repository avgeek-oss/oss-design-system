import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "../src/buttons/button.js";
import { Page } from "../src/layouts/page.js";
import { IdentityAuthHeading } from "../src/patterns/auth/identity-auth-frame.js";
import { mcpClientPresentation } from "../src/utilities/mcp-client-presentation.js";
import {
  createNameSchema,
  createInvitationSchema,
  invitationSchema,
} from "../src/patterns/settings/schemas.js";

test("Codex names and metadata identifiers use ChatGPT branding without changing trust", () => {
  const trust = { label: "Unverified", color: "warning" } as const;
  for (const name of [
    "Codex",
    " codex ",
    "https://chatgpt.com/oauth/codex/client.json",
    "https://chatgpt.com/oauth/codex/YddBjjAsi-xR/client.json",
  ]) {
    const client = { name, trust, logo: <span>Generic logo</span> };
    const display = mcpClientPresentation(client);
    assert.equal(display.name, "Codex");
    assert.notEqual(display.logo, client.logo);
    assert.equal(display.trust, trust);
    assert.equal(client.name, name);
  }
  const id = "https://chatgpt.com/oauth/codex/client.json";
  assert.equal(mcpClientPresentation({ name: "MCP client", id }).name, "Codex");
  assert.equal(mcpClientPresentation({ name: "MCP client", id }).id, id);
  for (const name of [
    "Example app",
    "https://chatgpt.com.example.test/oauth/codex/client.json",
    "https://chatgpt.com@example.test/oauth/codex/client.json",
    "http://chatgpt.com/oauth/codex/client.json",
    "https://chatgpt.com/other/client.json",
  ]) {
    const client = { name, logo: <span>App logo</span> };
    assert.equal(mcpClientPresentation(client), client);
  }
});

test("common name limits, explicit domain limits and strict invitation fields are preserved", () => {
  assert.equal(createNameSchema().safeParse("x".repeat(120)).success, true);
  assert.equal(createNameSchema().safeParse("x".repeat(121)).success, false);
  assert.equal(createNameSchema().safeParse("   ").success, false);
  assert.equal(createNameSchema(100).safeParse("x".repeat(101)).success, false);
  assert.equal(createNameSchema(120).safeParse("x".repeat(101)).success, true);
  assert.equal(
    invitationSchema.safeParse({ email: "alex@example.test", role: "owner" })
      .success,
    false,
  );
  assert.equal(
    invitationSchema.safeParse({
      email: "alex@example.test",
      role: "admin",
      permissions: ["everything"],
    }).success,
    false,
  );
});
test("buttons and auth headings retain accessible names and semantics", () => {
  const button = renderToStaticMarkup(
    <Button variant="secondary" aria-label="Cancel invitation">
      Cancel
    </Button>,
  );
  assert.match(button, /aria-label="Cancel invitation"/);
  const heading = renderToStaticMarkup(
    <IdentityAuthHeading title="Sign in" titleElementType="h1">
      Sign in to your instance.
    </IdentityAuthHeading>,
  );
  assert.match(heading, /<h1[^>]*>Sign in<\/h1>/);
  assert.match(heading, /text-xl/);
  assert.match(heading, /text-sm/);
});
test("the shared runtime has no Next.js or application package dependency", async () => {
  async function check(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.name === "adapters") continue;
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) await check(path);
      else if (/\.tsx?$/.test(entry.name)) {
        const text = await readFile(path, "utf8");
        assert.doesNotMatch(
          text,
          /from ["'](?:next(?:\/|["'])|@workspace\/|@mill\/|@avgeek-inc\/)/,
          path,
        );
      }
    }
  }
  await check("src");
});

test("distinct domain role validation does not broaden common team roles", () => {
  const domainRoles = createInvitationSchema(["owner", "contributor"]);
  assert.equal(
    domainRoles.safeParse({ email: "alex@example.test", role: "contributor" })
      .success,
    true,
  );
  assert.equal(
    domainRoles.safeParse({ email: "alex@example.test", role: "member" })
      .success,
    false,
  );
  assert.equal(
    invitationSchema.safeParse({
      email: "alex@example.test",
      role: "contributor",
    }).success,
    false,
  );
});

test("structured data cannot close its script element and preserves its values", () => {
  const data = {
    name: '</script><script>alert("untrusted")</script>',
    alternate: '</ScRiPt ><SCRIPT>alert("untrusted")</SCRIPT>',
    comparison: "a < b",
  };
  const markup = renderToStaticMarkup(
    <Page structuredData={data}>Content</Page>,
  );
  const scripts = markup.split('<script type="application/ld+json">');
  assert.equal(scripts.length, 2);
  const closing = scripts[1]?.split("</script>");
  assert.equal(closing?.length, 2);
  const content = closing?.[0];
  assert.ok(content);
  assert.doesNotMatch(content, /</);
  assert.deepEqual(JSON.parse(content), data);
});

test("date/time range composition keeps two labeled segmented fields and native disabled state", async () => {
  const { DateTimeRangePicker } =
    await import("../src/patterns/date-time-range-picker.js");
  const { parseDateTime } = await import("@internationalized/date");
  const markup = renderToStaticMarkup(
    <DateTimeRangePicker
      label="Log range"
      locale="en-GB"
      isDisabled
      hourCycle={24}
      value={{
        start: parseDateTime("2026-10-14T09:15"),
        end: parseDateTime("2026-10-14T10:45"),
      }}
    />,
  );
  assert.match(markup, /Start date and time/);
  assert.match(markup, /End date and time/);
  assert.match(markup, /Choose date range/);
  assert.match(markup, /disabled/);
  assert.match(markup, /09/);
  assert.match(markup, /45/);
});
