import { readdir, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

async function copy(directory = "src") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) await copy(source);
    else if (entry.name.endsWith(".css")) {
      const target = source.replace(/^src\//, "dist/");
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(source, target);
    }
  }
}
await copy();
