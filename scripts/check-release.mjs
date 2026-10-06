import { readFile } from "node:fs/promises";
import path from "node:path";
import { validateCandidate, validateRelease } from "./release-validation.mjs";

const manifest = JSON.parse(await readFile("package.json", "utf8"));
validateRelease(manifest, process.env.GITHUB_REF_NAME ?? "");
if (process.argv.includes("--candidate")) {
  const report = JSON.parse(
    await readFile("artifacts/package-report.json", "utf8"),
  );
  const archive = await readFile(
    path.join("artifacts", `avgeek-oss-design-system-${manifest.version}.tgz`),
  );
  validateCandidate(manifest, report, archive);
}
