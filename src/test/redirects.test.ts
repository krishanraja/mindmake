import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const vercel = JSON.parse(readFileSync(resolve(ROOT, "vercel.json"), "utf8"));
const app = readFileSync(resolve(ROOT, "src/App.tsx"), "utf8");
const bySource = new Map<string, { destination: string; permanent?: boolean }>(
  vercel.redirects.map((route: { source: string; destination: string; permanent?: boolean }) => [route.source, route]),
);

const TO_SPRINT = [
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
  "/tool",
  "/individual",
  "/team",
  "/builder",
  "/builder-session",
  "/leadership-lab",
  "/portfolio-program",
];

describe("public route contract", () => {
  it("sends every retired buying route straight to the Sprint", () => {
    for (const source of TO_SPRINT) {
      expect(bySource.get(source)?.destination, source).toBe("/sprint");
      expect(bySource.get(source)?.permanent, source).toBe(true);
    }
    expect(bySource.get("/workshops/:path*")?.destination).toBe("/sprint");
  });

  it("keeps the client router in step with edge redirects", () => {
    for (const source of TO_SPRINT) {
      expect(app, source).toContain(`"${source}"`);
    }
    expect(app).toContain('path="/workshops/:slug"');
  });

  it("uses the one booking destination for old start links", () => {
    for (const source of ["/start", "/decision"]) {
      expect(bySource.get(source)?.destination).toBe("https://calendly.com/krish-raja/mindmaker-meeting");
      expect(bySource.get(source)?.permanent).toBe(false);
    }
  });

  it("uses only the branded Mindmaker Live URL", () => {
    for (const source of ["/signal", "/builder-economy"]) {
      expect(bySource.get(source)?.destination).toBe("https://live.themindmaker.ai");
    }
  });

  it("keeps the invitation-only alumni page reachable and hidden from search", () => {
    expect(bySource.has("/alumni")).toBe(false);
    expect(app).toContain('path="/alumni"');
    const noindex = vercel.headers.find((header: { headers: { value: string }[] }) =>
      header.headers.some((value) => value.value.includes("noindex")),
    );
    expect(noindex.source).toContain("alumni");
  });
});
