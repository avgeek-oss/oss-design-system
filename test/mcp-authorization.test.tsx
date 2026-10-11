import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { McpAuthorization } from "../src/patterns/auth/mcp-authorization.js";

const props = {
  brand: "Avgeek",
  productName: "Example product",
  clientName: "Example client",
  availableAccessLevels: ["read"] as const,
  onAccessLevelChange: () => {},
  onApprove: () => {},
  onDeny: () => {},
};

test("authorization uses the shared two-field form and client return action", () => {
  const html = renderToStaticMarkup(
    <McpAuthorization {...props} accessLevel="read" />,
  );
  assert.match(html, /Connect to Example product/);
  assert.match(html, /Allow MCP connection to Example product/);
  assert.match(html, /Application/);
  assert.match(html, /<input[^>]*disabled[^>]*value="Example client"/);
  assert.match(html, /Select Scope/);
  assert.match(html, /Read-only/);
  assert.match(html, /re-authenticate again/);
  assert.match(html, /Back to Example client/);
  assert.doesNotMatch(html, /Connection details|Client ID|expires|Unverified/);
  assert.ok(html.indexOf(">Deny<") < html.indexOf(">Approve<"));
});

test("an unavailable scope blocks approval while permitting denial", () => {
  const html = renderToStaticMarkup(
    <McpAuthorization {...props} accessLevel="admin" />,
  );
  assert.match(html, /<button[^>]*disabled[^>]*>Approve<\/button>/);
  const deny = html.match(/<button[^>]*>Deny<\/button>/)?.[0];
  assert.ok(deny);
  assert.doesNotMatch(deny, /disabled/);
});

test("pending authorization disables navigation and both decisions without inline mutation errors", () => {
  const html = renderToStaticMarkup(
    <McpAuthorization
      {...props}
      accessLevel="read"
      isPending
      error="Unable to connect"
    />,
  );
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /<button[^>]*disabled[^>]*>Deny<\/button>/);
  assert.match(
    html,
    /<button[^>]*disabled[^>]*>Back to Example client<\/button>/,
  );
  assert.doesNotMatch(html, /Unable to connect/);
});
