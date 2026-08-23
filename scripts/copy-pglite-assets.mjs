import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dest = join(
  process.cwd(),
  ".vercel/output/functions/__server.func/_libs",
);
const srcDir = join(process.cwd(), "node_modules/@electric-sql/pglite/dist");
if (!existsSync(dest)) process.exit(0);
mkdirSync(dest, { recursive: true });
for (const file of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(srcDir, file);
  if (existsSync(from)) copyFileSync(from, join(dest, file));
}
