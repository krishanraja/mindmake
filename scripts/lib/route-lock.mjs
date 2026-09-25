// The one active route lock. It is generated, never hand-edited: run
// `npm run qa:approved-routes:update` after an intended edit to a locked file
// and commit the result with that edit. It carries no revision number or date,
// so a change never renames it and two branches only meet on the lines for the
// files they both touched. The numbered manifests beside it (r1 to r48) are
// frozen history; the checker reads one only when MINDMAKE_ROUTE_LOCK_MANIFEST
// names it.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { sourceHashBytes } from "./source-hash.mjs";

export const root = resolve(import.meta.dirname, "../..");
export const lockPath = resolve(root, "quality/route-lock/approved-production.lock.json");

export const sha256 = (content) => createHash("sha256").update(content).digest("hex");

export async function hashLockedFile(relativePath, lock) {
  const content = await readFile(resolve(root, relativePath));
  // Git checkouts differ in line endings across Windows and Linux. Only a lock
  // explicitly opting in uses LF-canonical text; binary assets stay
  // byte-exact, and historic manifests retain their original hash semantics.
  return { content, hash: sha256(sourceHashBytes(relativePath, content, lock)) };
}

// Sorted keys, one file per line, trailing newline: the same input always
// produces the same bytes.
export function serializeLock(lock) {
  const files = Object.fromEntries(Object.keys(lock.files).sort().map((path) => [path, lock.files[path]]));
  return `${JSON.stringify({ ...lock, files }, null, 2)}\n`;
}
