import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { validateCandidate, validateRelease } from "./release-validation.mjs";
import { publishCandidate } from "./publication.mjs";

const manifest = JSON.parse(await readFile("package.json", "utf8"));
validateRelease(manifest, process.env.GITHUB_REF_NAME ?? "");
const report = JSON.parse(
  await readFile("artifacts/package-report.json", "utf8"),
);
const tarball = `./artifacts/avgeek-oss-design-system-${manifest.version}.tgz`;
validateCandidate(manifest, report, await readFile(tarball));
const result = await publishCandidate(report, () => {
  execFileSync(
    "npm",
    [
      "publish",
      tarball,
      "--ignore-scripts",
      "--access=public",
      "--registry=https://registry.npmjs.org",
    ],
    { stdio: "inherit" },
  );
});
console.log(
  result === "existing"
    ? "The verified version is already on npm."
    : "Published the verified version to npm.",
);
