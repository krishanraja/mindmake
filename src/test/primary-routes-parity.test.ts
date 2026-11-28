import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { homepageMarkup } from "@/components/homepage-release/markup";
import { PRIMARY_ROUTES, PUBLICATION_URL, START_LABEL, SUBSCRIBE_LABEL, SUBSCRIBE_URL } from "@/lib/publicLinks";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

/* The homepage menu is generated R3 markup; every other page opens the shell
   menu, which reads PRIMARY_ROUTES. These two must never drift again: a reader
   who opens the menu on /blog sees what they see on /. */
describe("primary routes parity", () => {
  it("matches the R3 homepage menu route for route, in order", () => {
    const tree = new DOMParser().parseFromString(homepageMarkup, "text/html");
    const menus = tree.querySelectorAll(".r3-navigation .primary-routes");
    expect(menus).toHaveLength(2);
    for (const menu of menus) {
      const links = Array.from(menu.querySelectorAll("a"), link => ({
        href: link.getAttribute("href"),
        label: (link.querySelector(".mm-route-label-full") ?? link).textContent,
        short: link.querySelector(".mm-route-label-short")?.textContent,
      }));
      expect(links).toEqual(PRIMARY_ROUTES.map(({ href, label, short }) => ({ href, label, short })));
    }
  });

  /* Krish, 2026-11-28: the visible menu is the landing page, the AI brain,
     the toolkit, the questions and about us; /ai-gtm retired and Media left
     the menus (the publication keeps the hero line and the masthead). */
  it("carries exactly the five approved routes on both menus", () => {
    expect(PRIMARY_ROUTES.map(({ href }) => href)).toEqual(["/", "/ai-brain", "/2-minute-ai-upgrade-toolkit", "/faq", "/about"]);
    const markup = read("src/components/homepage-release/markup.ts");
    expect(markup).not.toContain('href="/ai-gtm"');
    for (const [, nav] of markup.matchAll(/<nav class="primary-routes"[^>]*>(.*?)<\/nav>/gs)) expect(nav).not.toContain(">Media</a>");
    expect(PUBLICATION_URL).toBe("https://makeyourmindup.ai");
    expect(SUBSCRIBE_URL).toBe("https://makeyourmindup.ai");
    expect(SUBSCRIBE_LABEL).toBeTruthy();
  });

  it("sends the hero doors to their pages, as real links", () => {
    const markup = read("src/components/homepage-release/markup.ts");
    expect(markup).not.toMatch(/<button[^>]*data-route-choice/);
    /* One door since 2026-11-28. */
    expect([...markup.matchAll(/<a href="(\/ai-(?:brain|gtm))" data-route-choice="(brain|gtm)"/g)].map(([, href, route]) => `${route}:${href}`))
      .toEqual(["brain:/ai-brain", "brain:/ai-brain"]);
  });

  it("uses the approved shared language", () => {
    const handoff = JSON.parse(read("quality/website-redesign/homepage-handoff.v1.json"));
    const selection = handoff.handoff?.sharedLanguage?.selection ?? findSelection(handoff);
    const byHref = Object.fromEntries(PRIMARY_ROUTES.map(({ href, label }) => [href, label]));
    /* /case-studies retired into the homepage (Krish, 2026-11-28). */
    expect(byHref["/case-studies"]).toBeUndefined();
    expect(byHref["/2-minute-ai-upgrade-toolkit"]).toBe(selection.toolkit);
    /* The blog stays for search engines with no menu link (Krish, 2026-11-19). */
    expect(byHref["/blog"]).toBeUndefined();
    /* Quick AI tips merged into Ideas you can use (Krish, 2026-09-25): no
       menu carries /answers, and the handoff no longer names a label for it. */
    expect(byHref["/answers"]).toBeUndefined();
    expect(selection.answers).toBeUndefined();
    expect(byHref["/faq"]).toBe(selection.faq);
    /* Home leads and About us closes the list (Media left it on 2026-11-28). */
    expect(PRIMARY_ROUTES[0]).toEqual({ label: "Home", href: "/" });
    expect(PRIMARY_ROUTES.at(-1)).toEqual({ label: "About us", href: "/about" });
    /* The way in was renamed on 24 October 2026 ("Start building your AI
       brain"), after the handoff froze "Get your free AI brief". The handoff is
       an immutable recovery record, so the homepage the generator writes is
       held to the shell's label instead: the same words in both menus and the
       footer. */
    expect(selection.start).toBe("Get your free AI brief");
    expect(homepageMarkup.split(`href="/start">${START_LABEL}`).length - 1).toBe(3);
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
