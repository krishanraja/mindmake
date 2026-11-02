import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BETTER_CHIPS,
  COMMENT_LIMIT,
  FeedbackValidationError,
  LIKED_CHIPS,
  parseDtdFeedback,
  renderFeedbackEmail,
} from "../../supabase/functions/submit-dtd-feedback/core";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("DoThinkDo feedback payload", () => {
  it("keeps chosen chips with their comments and server-owned labels", () => {
    const feedback = parseDtdFeedback({
      name: "  Sam   Tester ",
      liked: [{ id: "build-lab", comment: " Hands on. " }, { id: "other" }],
      better: [{ id: "timing", comment: "Earlier slots" }],
    });
    expect(feedback).toEqual({
      name: "Sam Tester",
      liked: [
        { id: "build-lab", label: "Build Lab sessions", comment: "Hands on." },
        { id: "other", label: "Something else", comment: "" },
      ],
      better: [{ id: "timing", label: "Timing and scheduling", comment: "Earlier slots" }],
    });
  });

  it("refuses unknown, duplicate, empty and oversized input", () => {
    expect(() => parseDtdFeedback({ liked: [{ id: "made-up" }] })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ liked: [{ id: "pace" }, { id: "pace" }] })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ liked: [], better: [] })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ liked: [{ id: "pace", comment: "x".repeat(COMMENT_LIMIT + 1) }] })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ better: [{ id: "timing" }], liked: [{ id: "timing" }] })).toThrow(FeedbackValidationError);
  });

  it("refuses a starter that still has a blank in it", () => {
    expect(() => parseDtdFeedback({ liked: [{ id: "pace", comment: "The moment it clicked for me was when ___" }] }))
      .toThrow(FeedbackValidationError);
    expect(parseDtdFeedback({ liked: [{ id: "pace", comment: "The moment it clicked for me was when Andy changed his own page" }] }))
      .not.toBeNull();
  });

  it("drops a filled honeypot without error", () => {
    expect(parseDtdFeedback({ website: "spam.example", liked: [{ id: "pace" }] })).toBeNull();
  });

  it("renders an escaped email that names the sender or says anonymous", () => {
    const anonymous = renderFeedbackEmail(
      { name: "", liked: [{ id: "pace", label: "Pace and responsiveness", comment: "<b>fast</b>" }], better: [] },
      new Date("2026-11-02T10:00:00Z"),
    );
    expect(anonymous.subject).toBe("DTD feedback: Anonymous");
    expect(anonymous.html).toContain("&lt;b&gt;fast&lt;/b&gt;");
    expect(anonymous.html).not.toContain("<b>fast</b>");
    expect(anonymous.text).toContain("Pace and responsiveness");
    expect(anonymous.text).toContain("Nothing picked");
  });

  it("gives every chip a question and ends each group with Something else", () => {
    for (const chips of [LIKED_CHIPS, BETTER_CHIPS]) {
      expect(new Set(chips.map((chip) => chip.id)).size).toBe(chips.length);
      expect(chips.every((chip) => chip.prompt.endsWith("?"))).toBe(true);
      expect(chips.at(-1)?.label).toBe("Something else");
    }
  });
});

describe("DoThinkDo feedback route", () => {
  it("is reachable, unlisted and hidden from search", () => {
    const vercel = JSON.parse(read("vercel.json"));
    expect(read("src/App.tsx")).toContain('path="/feedback/dtd"');
    expect(read("src/entry-server.tsx")).toContain('path="/feedback/dtd"');
    expect(vercel.rewrites).not.toContainEqual({ source: "/feedback/dtd", destination: "/index.html" });
    expect(read("scripts/prerender.mjs")).toContain(`const unlistedPages = [{ path: "/feedback/dtd" }]`);
    const noindex = vercel.headers.find((header: { headers: { value: string }[] }) =>
      header.headers.some((value) => value.value.includes("noindex")));
    expect(noindex.source).toContain("feedback");
    expect(read("public/robots.txt")).toContain("Disallow: /feedback/");
    expect(read("src/pages/DtdFeedback.tsx")).toContain("noindex");
    expect(read("src/pages/DtdFeedback.tsx")).not.toMatch(/@mindmake\.co/);
  });

  it("mails only the configured operator address, never the person giving feedback", () => {
    const source = read("supabase/functions/submit-dtd-feedback/index.ts");
    expect(source).toContain('Deno.env.get("DTD_FEEDBACK_TO")');
    expect(source.match(/sendResendEmail\(/g)).toHaveLength(1);
    expect(source).toContain("to: [to]");
    expect(source).not.toMatch(/@[a-z0-9-]+\.[a-z]/i);
  });
});
