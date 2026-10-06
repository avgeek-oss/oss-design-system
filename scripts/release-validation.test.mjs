import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { validateCandidate, validateRelease } from "./release-validation.mjs";

const manifest = {
  name: "@avgeek-oss/design-system",
  version: "1.0.0",
  publishConfig: { registry: "https://npm.pkg.github.com" },
};

test("release tags require the exact stable package version and registry", () => {
  validateRelease(manifest, "v1.0.0");
  for (const tag of ["main", "v1.0.1", "v1.0.0-beta.1", "v1.0.0\n"]) {
    assert.throws(() => validateRelease(manifest, tag));
  }
  assert.throws(() =>
    validateRelease(
      {
        ...manifest,
        publishConfig: { registry: "https://registry.npmjs.org" },
      },
      "v1.0.0",
    ),
  );
});

test("publication rejects changed bytes or a report for another package/version", () => {
  const archive = Buffer.from("verified package");
  const report = {
    name: manifest.name,
    version: manifest.version,
    tarball: "avgeek-oss-design-system-1.0.0.tgz",
    bytes: archive.length,
    integrity: `sha512-${createHash("sha512").update(archive).digest("base64")}`,
  };
  validateCandidate(manifest, report, archive);
  assert.throws(() =>
    validateCandidate(manifest, report, Buffer.from("modified package")),
  );
  for (const change of [
    { name: "@other/package" },
    { version: "1.0.1" },
    { tarball: "../other.tgz" },
    { integrity: "sha512-invalid" },
  ]) {
    assert.throws(() =>
      validateCandidate(manifest, { ...report, ...change }, archive),
    );
  }
});
