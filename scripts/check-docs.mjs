import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const documents = [
  "README.md",
  "AGENTS.md",
  "DESIGN.md",
  "CHANGELOG.md",
  ...(await readdir("docs"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join("docs", file)),
];
for (const document of documents) {
  const content = await readFile(document, "utf8");
  assert.ok(content.trim(), `${document} must not be an empty placeholder`);
  for (const [, link] of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    if (/^(?:https?:|#)/.test(link)) continue;
    const target = link.split("#")[0];
    await stat(path.resolve(path.dirname(document), target));
  }
}
process.stdout.write(
  `Checked ${documents.length} public Markdown documents and their local links.\n`,
);
