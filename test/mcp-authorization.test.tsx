import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  McpAuthorization,
  type McpAuthorizationDetails,
} from "../src/patterns/auth/mcp-authorization.js";

const details: McpAuthorizationDetails = {
  clientName: "Example client",
  clientId: "example-client",
  clientTrust: "unverified",
  identityDescription: "The app supplied its own name.",
  redirectUri: "https://client.example.test/callback",
  account: { email: "alex@example.test", teamName: "Avgeek", role: "Viewer" },
  permissionSummary: "Requests edit access.",
  accessDescription: "Can edit records allowed by your role.",
  accessLifetime: "7 days",
  revocationDescription: "Revoke access in Connections.",
  restrictions: "Account management is excluded.",
};

test("authorization exposes app policy and blocks approval without blocking denial", () => {
  const html = renderToStaticMarkup(
    <McpAuthorization
      brand="Avgeek"
      productName="Example product"
      details={details}
      approvalBlockedReason="Your role cannot grant edit access."
      onAllow={() => {}}
      onDeny={() => {}}
    />,
  );
  assert.match(html, /Connect to Example product/);
  assert.match(html, /Unverified app/);
  assert.match(html, /7 days/);
  assert.match(html, /Revoke access in Connections/);
  assert.match(html, /Account management is excluded/);
  assert.match(html, /alex@example.test/);
  assert.match(html, /https:\/\/client.example.test\/callback/);
  assert.match(html, /<button[^>]*disabled[^>]*>Allow access<\/button>/);
  const deny = html.match(/<button[^>]*>Deny<\/button>/)?.[0];
  assert.ok(deny);
  assert.doesNotMatch(deny, /disabled/);
});

test("pending authorization disables both decisions and metadata does not imply verification", () => {
  const html = renderToStaticMarkup(
    <McpAuthorization
      brand="Avgeek"
      productName="Example product"
      details={{
        ...details,
        clientTrust: "metadata-document",
        identityDescription: "Published metadata does not verify this app.",
      }}
      isPending
      error="Unable to connect. Try again."
      onAllow={() => {}}
      onDeny={() => {}}
    />,
  );
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /Published metadata does not verify this app/);
  assert.doesNotMatch(html, /Unverified app/);
  assert.match(html, /Unable to connect. Try again/);
  assert.match(html, /<button[^>]*disabled[^>]*>Deny<\/button>/);
});
