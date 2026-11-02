import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  QUOTE_WORDING_VERSION,
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
      quotePermission: false,
    });
  });

  it("refuses unknown, duplicate, empty and oversized input", () => {
    expect(() => parseDtdFeedback({ liked: [{ id: "made-up" }] })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ liked: [{ id: "pace" }, { id: "pace" }] })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ liked: [], better: [] })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ liked: [{ id: "pace", comment: "x".repeat(COMMENT_LIMIT + 1) }] })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ better: [{ id: "timing" }], liked: [{ id: "timing" }] })).toThrow(FeedbackValidationError);
  });

  it("refuses a comment that stops where a starter stops", () => {
    expect(() => parseDtdFeedback({ liked: [{ id: "pace", comment: "The moment it clicked for me was when" }] }))
      .toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ better: [{ id: "timing", comment: "Mornings were hard. I got stuck when " }] }))
      .toThrow(FeedbackValidationError);
    expect(parseDtdFeedback({ liked: [{ id: "pace", comment: "The moment it clicked for me was when Andy changed his own page" }] }))
      .not.toBeNull();
  });

  it("drops a filled honeypot without error", () => {
    expect(parseDtdFeedback({ website: "spam.example", liked: [{ id: "pace" }] })).toBeNull();
  });

  it("renders an escaped email that names the sender or says anonymous", () => {
    const anonymous = renderFeedbackEmail(
      { name: "", liked: [{ id: "pace", label: "Pace and responsiveness", comment: "<b>fast</b>" }], better: [], quotePermission: false },
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

describe("permission to quote", () => {
  const base = { liked: [{ id: "pace", comment: "Quick replies." }] };
  const when = new Date("2026-11-02T10:00:00Z");

  it("is no unless the person ticked it, against the current wording", () => {
    expect(parseDtdFeedback(base)?.quotePermission).toBe(false);
    expect(parseDtdFeedback({ ...base, quotePermission: false, quoteWording: QUOTE_WORDING_VERSION })?.quotePermission).toBe(false);
    expect(parseDtdFeedback({ ...base, quotePermission: true, quoteWording: QUOTE_WORDING_VERSION })?.quotePermission).toBe(true);
    expect(() => parseDtdFeedback({ ...base, quotePermission: true })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ ...base, quotePermission: true, quoteWording: "old" })).toThrow(FeedbackValidationError);
    expect(() => parseDtdFeedback({ ...base, quotePermission: "yes" })).toThrow(FeedbackValidationError);
  });

  it("says yes with name, yes anonymous, or no, and quotes what they agreed to", () => {
    const item = [{ id: "pace", label: "Pace and responsiveness", comment: "Quick replies." }];
    const named = renderFeedbackEmail({ name: "Sam", liked: item, better: [], quotePermission: true }, when);
    expect(named.subject).toBe("DTD feedback: Sam · OK to quote");
    expect(named.text).toContain("Quote permission: YES, with name (Sam)");
    expect(named.text).toContain(`They ticked: "Happy for Krish to quote this, with my name, in Mindmake's materials." (${QUOTE_WORDING_VERSION}, 2026-11-02 10:00 UTC)`);
    const anonymous = renderFeedbackEmail({ name: "", liked: item, better: [], quotePermission: true }, when);
    expect(anonymous.text).toContain('Quote permission: YES, anonymous ("DTD team member")');
    expect(anonymous.text).toContain("without my name");
    const no = renderFeedbackEmail({ name: "Sam", liked: item, better: [], quotePermission: false }, when);
    expect(no.subject).toBe("DTD feedback: Sam");
    expect(no.text).toContain("Quote permission: NO, keep it private");
  });
});

describe("DoThinkDo feedback route", () => {
  it("is reachable, unlisted and hidden from search", () => {
    const vercel = JSON.parse(read("vercel.json"));
    expect(read("src/App.tsx")).toContain('path="/feedback/dtd"');
    expect(read("src/entry-server.tsx")).toContain('path="/feedback/dtd"');
    expect(vercel.rewrites).not.toContainEqual({ source: "/feedback/dtd", destination: "/index.html" });
    expect(read("scripts/prerender.mjs")).toContain(`{ path: "/feedback/dtd" }`);
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
