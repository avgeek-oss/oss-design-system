import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "../src/buttons/button.js";
import { Page } from "../src/layouts/page.js";
import { IdentityAuthHeading } from "../src/patterns/auth/identity-auth-frame.js";
import {
  createNameSchema,
  createInvitationSchema,
  invitationSchema,
} from "../src/patterns/settings/schemas.js";

test("app-specific name limits are preserved and invitations reject unexpected fields", () => {
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

test("role validation stays scoped to each app", () => {
  const rootset = createInvitationSchema(["admin", "editor", "viewer"]);
  assert.equal(
    rootset.safeParse({ email: "alex@example.test", role: "editor" }).success,
    true,
  );
  assert.equal(
    rootset.safeParse({ email: "alex@example.test", role: "member" }).success,
    false,
  );
  assert.equal(
    invitationSchema.safeParse({ email: "alex@example.test", role: "editor" })
      .success,
    false,
  );
});

test("structured data cannot close its script element and preserves its values", () => {
  const data = {
    name: '</script><script>alert("untrusted")</script>',
    comparison: "a < b",
  };
  const markup = renderToStaticMarkup(
    <Page structuredData={data}>Content</Page>,
  );
  assert.equal([...markup.matchAll(/<script\b/g)].length, 1);
  const content = markup.match(/<script[^>]*>(.*?)<\/script>/)?.[1];
  assert.ok(content);
  assert.doesNotMatch(content, /</);
  assert.deepEqual(JSON.parse(content), data);
});
