/**
 * Keeps the two redirect layers in sync.
 *
 * There are two, and they do different jobs:
 *
 *   vercel.json  real HTTP 301s at the edge. This is what a crawler, a link
 *                checker and anyone pasting an old URL actually gets.
 *   App.tsx      a client-side <Navigate>, for an in-app navigation that never
 *                touches the edge.
 *
 * The failure mode this guards is quiet: adding a route to one and forgetting
 * the other. If only App.tsx has it, the URL returns 200 with the SPA shell and
 * no crawler ever learns the page moved. If only vercel.json has it, an in-app
 * link 404s into the catch-all.
 *
 * The 301 itself can only be observed on Vercel. This asserts the config is
 * right and complete, which is the part that can be checked here.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "../..");
const vercel = JSON.parse(readFileSync(resolve(ROOT, "vercel.json"), "utf-8"));
const appSource = readFileSync(resolve(ROOT, "src/App.tsx"), "utf-8");

/** Every route retired in July and August 2026, and where its traffic goes. */
const RETIRED_ROUTES: Record<string, string> = {
  "/workshops": "/teardown",
  "/enterprise": "/handover",
  "/immersion": "/handover",
  "/cohort": "/start",
  "/leaders": "/start",
  "/leadership-insights": "/start",
  "/sprints": "/teardown",
  "/sprint/4-week": "/teardown",
  "/sprint/90-day": "/handover",
  "/builder-sprint": "/teardown",
  "/war-room": "/handover",
  "/strategy-day": "/teardown",
  "/fractional-caio": "/handover",
};

describe("retired routes redirect", () => {
  const bySource = new Map<string, { destination: string; permanent?: boolean }>(
    vercel.redirects.map((r: { source: string; destination: string; permanent?: boolean }) => [
      r.source,
      r,
    ]),
  );

  it("has an edge redirect for every retired route", () => {
    const missing = Object.keys(RETIRED_ROUTES).filter((route) => !bySource.has(route));
    expect(missing, "missing from vercel.json redirects").toEqual([]);
  });

  it("sends each retired route to the right place, permanently", () => {
    for (const [source, destination] of Object.entries(RETIRED_ROUTES)) {
      const rule = bySource.get(source);
      expect(rule?.destination, `${source} destination`).toBe(destination);
      expect(rule?.permanent, `${source} must be a 301, not a 302`).toBe(true);
    }
  });

  it("covers the workshop children, not just the index", () => {
    // Five sub-pages existed. A wildcard is correct here; an index-only rule
    // would drop every deep link into the catch-all.
    const wildcard = bySource.get("/workshops/:path*");
    expect(wildcard?.destination).toBe("/teardown");
    expect(wildcard?.permanent).toBe(true);
  });

  it("has a client-side fallback for every retired route", () => {
    const missing = Object.keys(RETIRED_ROUTES).filter(
      (route) => !appSource.includes(`path="${route}"`),
    );
    expect(missing, "missing a <Route> fallback in App.tsx").toEqual([]);
  });

  it("does not still render an archived page component", () => {
    // The strongest check here: even with both redirect layers correct, an
    // import left behind would keep a retired offer in the bundle.
    for (const gone of [
      "./pages/Cohort",
      "./pages/Enterprise",
      "./pages/Immersion",
      "./pages/Workshops",
      "./pages/LeadershipInsights",
      "./pages/workshops/",
    ]) {
      expect(appSource.includes(gone), `App.tsx still imports ${gone}`).toBe(false);
    }
  });

  it("no longer points a redirect at a route that is itself a redirect", () => {
    // /war-room, /strategy-day and /fractional-caio used to land on
    // /enterprise, which was itself orphaned, so an old link took two hops to
    // reach a page that no longer existed.
    for (const [source, destination] of Object.entries(RETIRED_ROUTES)) {
      expect(
        Object.keys(RETIRED_ROUTES).includes(destination),
        `${source} redirects to ${destination}, which is itself retired`,
      ).toBe(false);
    }
  });

  it("keeps /alumni reachable and noindex", () => {
    // Intentionally unlinked and invitation-only, not retired.
    expect(bySource.has("/alumni")).toBe(false);
    expect(appSource).toContain('path="/alumni"');
    const noindex = vercel.headers.find((h: { headers: { value: string }[] }) =>
      h.headers.some((x) => x.value.includes("noindex")),
    );
    expect(noindex.source).toContain("alumni");
  });

  it("no longer marks live pages noindex", () => {
    // The noindex rule used to cover workshops, enterprise, capital and
    // immersion. Capital is live now, and the rest are redirects.
    const noindex = vercel.headers.find((h: { headers: { value: string }[] }) =>
      h.headers.some((x) => x.value.includes("noindex")),
    );
    expect(noindex.source).not.toContain("capital");
    expect(noindex.source).not.toContain("workshops");
  });
});
