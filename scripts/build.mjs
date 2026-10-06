import { execFileSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
await rm("dist", { recursive: true, force: true });
execFileSync(
  process.execPath,
  [require.resolve("typescript/bin/tsc"), "-p", "tsconfig.build.json"],
  {
    stdio: "inherit",
  },
);
await import("./copy-styles.mjs");
