import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const vercel = JSON.parse(readFileSync(resolve(ROOT, "vercel.json"), "utf8"));
const app = readFileSync(resolve(ROOT, "src/App.tsx"), "utf8");
const retiredToolPaths = [
  "public/test-email-flows.html",
  "public/intake/index.html",
  "public/testimonials/index.html",
];
const bySource = new Map<string, { destination: string; permanent?: boolean }>(
  vercel.redirects.map((route: { source: string; destination: string; permanent?: boolean }) => [route.source, route]),
);

const TO_START = [
  "/teardown",
  "/handover",
  "/capital",
  "/workshops",
  "/enterprise",
  "/immersion",
  "/cohort",
  "/leaders",
  "/leadership-insights",
  "/sprints",
  "/sprint/4-week",
  "/sprint/90-day",
  "/builder-sprint",
  "/war-room",
  "/strategy-day",
  "/fractional-caio",
  "/individual",
  "/team",
  "/builder",
  "/builder-session",
  "/leadership-lab",
  "/portfolio-program",
];

describe("public route contract", () => {
  it("sends every retired buying route to the private starting point", () => {
    for (const source of TO_START) {
      expect(bySource.get(source)?.destination, source).toBe("/?start=1");
      expect(bySource.get(source)?.permanent, source).toBe(true);
    }
    expect(bySource.get("/workshops/:path*")?.destination).toBe("/?start=1");
  });

  it("keeps the client router in step with edge redirects", () => {
    for (const source of TO_START) {
      expect(app, source).toContain(`"${source}"`);
    }
    expect(app).toContain('path="/workshops/:slug"');
  });

  it("opens the private starting point for old start links", () => {
    for (const source of ["/start", "/decision"]) {
      expect(bySource.get(source)?.destination).toBe("/?start=1");
      expect(bySource.get(source)?.permanent).toBe(false);
    }
  });

  it("uses one current Media destination", () => {
    for (const source of ["/signal", "/builder-economy"]) {
      expect(bySource.get(source)?.destination).toBe("https://mindmakerlive.substack.com");
    }
  });

  it("keeps the old tool route useful", () => {
    expect(bySource.get("/tool")?.destination).toBe("/ai-brain");
    expect(app).toContain('path="/tool" element={<Navigate to="/ai-brain"');
  });

  it("keeps retired public forms and article slugs away from stale surfaces", () => {
    expect(bySource.get("/intake")?.destination).toBe("/?start=1");
    expect(bySource.get("/intake/index.html")?.destination).toBe("/?start=1");
    expect(bySource.get("/testimonials")?.destination).toBe("/case-studies");
    expect(bySource.get("/testimonials/index.html")?.destination).toBe("/case-studies");
    expect(bySource.get("/blog/10-20x-roi-what-real-ai-implementation-looks-like")?.destination)
      .toBe("/blog/measuring-ai-work-that-pays-back");
    expect(bySource.get("/blog/building-ai-systems-in-30-days-sprint-approach")?.destination)
      .toBe("/blog/a-useful-first-30-days-building-with-ai");
    expect(vercel.rewrites).not.toContainEqual({ source: "/intake", destination: "/intake/index.html" });
    expect(vercel.rewrites).not.toContainEqual({ source: "/testimonials", destination: "/testimonials/index.html" });
  });

  it("keeps the unlisted alumni page reachable and hidden from search", () => {
    expect(bySource.has("/alumni")).toBe(false);
    expect(app).toContain('path="/alumni"');
    const noindex = vercel.headers.find((header: { headers: { value: string }[] }) =>
      header.headers.some((value) => value.value.includes("noindex")),
    );
    expect(noindex.source).toContain("alumni");
  });

  it("lets the host return real 404 responses for unknown direct routes", () => {
    const broadSpaRewrite = vercel.rewrites.find((route: { source: string }) => route.source.includes(".*"));
    expect(broadSpaRewrite).toBeUndefined();
    expect(vercel.rewrites).toContainEqual({ source: "/alumni", destination: "/index.html" });
    expect(bySource.get("/operator")?.destination).toBe("/ai-brain");
  });

  it("keeps the internal email test harness out of the deployed site", () => {
    expect(bySource.get("/test-email-flows.html")?.destination).toBe("/");
    expect(bySource.get("/test-email-flows.html")?.permanent).toBe(false);
    const noindex = vercel.headers.find((header: { source: string; headers: { value: string }[] }) =>
      header.source.includes("test-email-flows") && header.headers.some((value) => value.value.includes("noindex")),
    );
    expect(noindex).toBeTruthy();
  });

  it("keeps the retired static tools deleted", () => {
    const returned = retiredToolPaths.filter((path) => existsSync(resolve(ROOT, path)));
    expect(returned).toEqual([]);
  });
});
