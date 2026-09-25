import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PRIMARY_ROUTES, START_LABEL } from "@/lib/publicLinks";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

/* The homepage menu is generated R3 markup; every other page opens the shell
   menu, which reads PRIMARY_ROUTES. These two must never drift again: a reader
   who opens the menu on /blog sees what they see on /. */
describe("primary routes parity", () => {
  it("matches the R3 homepage menu route for route, in order", () => {
    const markup = read("src/components/homepage-release/markup.ts");
    const primary = markup.match(/<nav class="primary-routes"[^>]*>(.*?)<\/nav>/s);
    expect(primary).not.toBeNull();
    const r3 = [...primary![1].matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map(([, href, label]) => ({ href, label }));
    expect(PRIMARY_ROUTES.map(({ href, label }) => ({ href, label }))).toEqual(r3);
  });

  it("uses the approved shared language", () => {
    const handoff = JSON.parse(read("quality/website-redesign/homepage-handoff.v1.json"));
    const selection = handoff.handoff?.sharedLanguage?.selection ?? findSelection(handoff);
    const byHref = Object.fromEntries(PRIMARY_ROUTES.map(({ href, label }) => [href, label]));
    expect(byHref["/case-studies"]).toBe(selection.results);
    expect(byHref["/blog"]).toBe(selection.blog);
    expect(byHref["/answers"]).toBe(selection.answers);
    expect(byHref["/faq"]).toBe(selection.faq);
    expect(PRIMARY_ROUTES.at(-1)?.label).toBe(selection.media);
    expect(START_LABEL).toBe(selection.start);
  });
});

function findSelection(node: unknown): Record<string, string> {
  if (node && typeof node === "object") {
    const record = node as Record<string, unknown>;
    const shared = record.sharedLanguage as { selection?: Record<string, string> } | undefined;
    if (shared?.selection) return shared.selection;
    for (const value of Object.values(record)) {
      const found = findSelection(value);
      if (found) return found;
    }
  }
  return undefined as unknown as Record<string, string>;
}
