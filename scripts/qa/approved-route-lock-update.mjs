#!/usr/bin/env node
// Regenerates quality/route-lock/approved-production.lock.json from the files
// on disk. Run it after an intended edit to a locked file and commit the lock
// with that edit; the diff is the declaration. On a merge conflict in the lock,
// take either side and run this again.
//
//   npm run qa:approved-routes:update                 rehash every locked file
//   npm run qa:approved-routes:update -- --add a b    also lock a and b
//   npm run qa:approved-routes:update -- --remove a   stop locking a
//   npm run qa:approved-routes:update -- --check      fail if the lock is stale
//
// Never run it to absorb an edit you did not mean to make: a failing
// qa:approved-routes is telling you a locked file changed.
import { access, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { hashLockedFile, lockPath, root, serializeLock } from "../lib/route-lock.mjs";

const args = process.argv.slice(2);
const listAfter = (flag) => {
  const start = args.indexOf(flag);
  if (start === -1) return [];
  const end = args.findIndex((arg, index) => index > start && arg.startsWith("--"));
  return args.slice(start + 1, end === -1 ? undefined : end);
};
const check = args.includes("--check");
const added = listAfter("--add");
const removed = new Set(listAfter("--remove"));

const current = await readFile(lockPath, "utf8");
const lock = JSON.parse(current);
const paths = [...new Set([...Object.keys(lock.files), ...added])].filter((path) => !removed.has(path));
const missing = [];
for (const path of paths) {
  try { await access(resolve(root, path)); } catch { missing.push(path); }
}
if (missing.length) {
  console.error(`Locked files are missing; remove them with --remove if that was intended:\n${missing.join("\n")}`);
  process.exit(1);
}

const files = {};
for (const path of paths) files[path] = (await hashLockedFile(path, lock)).hash;
const next = serializeLock({ ...lock, files });
const changed = Object.keys(files).filter((path) => files[path] !== lock.files[path]);
const dropped = Object.keys(lock.files).filter((path) => !(path in files));

if (check) {
  if (next !== current) {
    console.error(JSON.stringify({ lock: "stale", changed, dropped }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ lock: "current", lockedFiles: paths.length }, null, 2));
} else {
  if (next !== current) await writeFile(lockPath, next);
  console.log(JSON.stringify({ lockedFiles: paths.length, changed, dropped }, null, 2));
}
