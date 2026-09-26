import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { writtenOn } from "@/lib/ideaFormat";

/**
 * Dates on the reading pages are spelt out by hand. The server and each
 * browser carry their own locale data and time zone, so a date formatted by
 * the runtime can differ between the prerendered page and hydration: Safari
 * wrote "26 Sep 2026" against the server's "26 Sept 2026" (main CI, WebKit,
 * 26 September 2026), and a reader west of London saw the day before.
 */

const ROOT = resolve(__dirname, "../..");

const sources = (dir: string): string[] =>
  readdirSync(resolve(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "test" ? [] : sources(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });

describe("written dates", () => {
  it("writes a date the same way on every runtime", () => {
    expect(writtenOn("2026-09-26")).toBe("26 September 2026");
    expect(writtenOn("2026-09-26", "short")).toBe("26 Sept 2026");
    expect(writtenOn("2025-01-01", "short")).toBe("1 Jan 2025");
    expect(writtenOn("2024-12-31")).toBe("31 December 2024");
  });

  it("leaves no rendered date to the runtime's locale data", () => {
    const offenders = sources("src").filter((path) => /toLocaleDateString|toLocaleTimeString|Intl\.DateTimeFormat/.test(readFileSync(resolve(ROOT, path), "utf8")));
    expect(offenders).toEqual([]);
  });
});
