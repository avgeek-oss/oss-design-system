import assert from "node:assert/strict";
import { createHash } from "node:crypto";

export function validateRelease(manifest, tag) {
  assert.match(tag, /^v\d+\.\d+\.\d+$/, "Use a stable v<version> release tag");
  assert.equal(
    tag,
    `v${manifest.version}`,
    "Release tag must match package.json",
  );
  assert.equal(manifest.name, "@avgeek-oss/design-system");
  assert.equal(manifest.publishConfig.registry, "https://npm.pkg.github.com");
}

export function validateCandidate(manifest, report, archive) {
  assert.equal(report.name, manifest.name);
  assert.equal(report.version, manifest.version);
  assert.equal(
    report.tarball,
    `avgeek-oss-design-system-${manifest.version}.tgz`,
  );
  assert.equal(report.bytes, archive.length);
  assert.equal(
    report.integrity,
    `sha512-${createHash("sha512").update(archive).digest("base64")}`,
    "Package must match the verified candidate",
  );
}
