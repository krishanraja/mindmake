import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PRIMARY_ROUTES, START_LABEL, SUBSCRIBE_LABEL, SUBSCRIBE_URL } from "@/lib/publicLinks";

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

  it("badges Media with the subscription, on both menus (Krish, 2026-09-25)", () => {
    const markup = read("src/components/homepage-release/markup.ts");
    const media = PRIMARY_ROUTES.find(({ label }) => label === "Media");
    expect(media?.href).toBe(SUBSCRIBE_URL);
    expect(media?.badge).toBe(SUBSCRIBE_LABEL);
    for (const [, nav] of markup.matchAll(/<nav class="primary-routes"[^>]*>(.*?)<\/nav>/gs)) {
      expect(nav).toContain(`data-badge="${SUBSCRIBE_LABEL}">Media</a>`);
    }
    expect(read("src/components/mindmake/MindmakeShell.tsx")).toContain("data-badge={badge}");
  });

  it("sends the hero doors to their pages, as real links", () => {
    const markup = read("src/components/homepage-release/markup.ts");
    expect(markup).not.toMatch(/<button[^>]*data-route-choice/);
    expect([...markup.matchAll(/<a href="(\/ai-(?:brain|gtm))" data-route-choice="(brain|gtm)"/g)].map(([, href, route]) => `${route}:${href}`))
      .toEqual(["brain:/ai-brain", "gtm:/ai-gtm", "brain:/ai-brain", "gtm:/ai-gtm"]);
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
    /* Home leads and About us sits before Media (Krish, 2026-09-25). */
    expect(PRIMARY_ROUTES[0]).toEqual({ label: "Home", href: "/" });
    expect(PRIMARY_ROUTES.at(-2)).toEqual({ label: "About us", href: "/about" });
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
