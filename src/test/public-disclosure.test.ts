import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const PUBLIC_SURFACES = ["src", "scripts", "public", "index.html"];
const BLOCKED_RESULT = /\$\s*254(?:,?000|K)\b|22\s*%\s*(?:revenue|lift)/i;
const RETIRED_BOOKING_ROUTES = /mindmaker-concierge|15-min-intro/i;

const collectFiles = (relativePath: string): string[] => {
  const absolutePath = resolve(ROOT, relativePath);

  if (!existsSync(absolutePath)) return [];
  if (statSync(absolutePath).isFile()) return [absolutePath];

  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const child = `${relativePath}/${entry.name}`;

    if (entry.isDirectory()) {
      if (["test", "__tests__"].includes(entry.name)) return [];
      return collectFiles(child);
    }

    return [resolve(ROOT, child)];
  });
};

describe("public disclosure guard", () => {
  it("keeps the private contract amount out of public and generated surfaces", () => {
    const leaks = PUBLIC_SURFACES.flatMap(collectFiles).flatMap((file) => {
      const content = readFileSync(file, "utf8");
      return BLOCKED_RESULT.test(content) ? [file.replace(`${ROOT}\\`, "")] : [];
    });

    expect(leaks).toEqual([]);
  });

  it("keeps retired Calendly events out of public and generated surfaces", () => {
    const leaks = PUBLIC_SURFACES.flatMap(collectFiles).flatMap((file) => {
      const content = readFileSync(file, "utf8");
      return RETIRED_BOOKING_ROUTES.test(content) ? [file.replace(`${ROOT}\\`, "")] : [];
    });

    expect(leaks).toEqual([]);
  });
});
