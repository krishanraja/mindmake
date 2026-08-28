import { describe, expect, it } from "vitest";
import {
  CLOSING_LINE as FUNCTION_CLOSING,
  InvalidRequestError,
  Q1_LINES as FUNCTION_Q1,
  Q2_LINES as FUNCTION_Q2,
  openingLine,
  parsePersonalRead,
  personalReadIdempotencyKey,
  renderPersonalRead,
} from "../../supabase/functions/mindmake-personal-read/core";
import {
  CLOSING_LINE as PAGE_CLOSING,
  Q1_LINES as PAGE_Q1,
  Q2_LINES as PAGE_Q2,
} from "@/content/personalRead";

/**
 * The personal read sends the one results email a visitor asked for, so the
 * things worth testing are the promises around it: only allowed input reaches
 * the send, the email never states something enrichment did not establish, and
 * a retry cannot become a second email.
 */

describe("the request contract", () => {
  const valid = { action: "preview", linkedin_url: "linkedin.com/in/someone", q1: "writing", q2: "network" };

  it("accepts the shape the page sends", () => {
    expect(parsePersonalRead(valid)).toMatchObject({ action: "preview", q1: "writing", q2: "network" });
  });

  it("rejects an answer outside the allowed set", () => {
    expect(() => parsePersonalRead({ ...valid, q1: "everything" })).toThrow(InvalidRequestError);
    expect(() => parsePersonalRead({ ...valid, q2: "" })).toThrow(InvalidRequestError);
  });

  it("rejects an unexpected key rather than ignoring it", () => {
    expect(() => parsePersonalRead({ ...valid, admin: true })).toThrow(InvalidRequestError);
  });

  it("requires a usable email before it will send", () => {
    expect(() => parsePersonalRead({ ...valid, action: "send" })).toThrow(InvalidRequestError);
    expect(() => parsePersonalRead({ ...valid, action: "send", email: "nope" })).toThrow(InvalidRequestError);
    expect(parsePersonalRead({ ...valid, action: "send", email: " Leader@Example.com " }).email)
      .toBe("leader@example.com");
  });

  it("bounds the profile URL rather than trusting its length", () => {
    const parsed = parsePersonalRead({ ...valid, linkedin_url: "x".repeat(5_000) });
    expect(parsed.linkedin_url!.length).toBeLessThanOrEqual(300);
  });
});

describe("the email says only what it knows", () => {
  const request = { action: "send" as const, q1: "deciding" as const, q2: "decisions" as const, email: "a@b.co" };

  it("uses the role and company when enrichment found them", () => {
    expect(openingLine({ role: "Chief Executive", company: "Northwind" }))
      .toBe("You are Chief Executive at Northwind. Here is what your first week would look like.");
  });

  it("says nothing about the reader when enrichment found nothing", () => {
    /* An empty profile must not become a guess about who they are. */
    expect(openingLine({})).toBe("Here is what your first week would look like.");
  });

  it("carries both chosen lines and the email cap", () => {
    const email = renderPersonalRead(request, {});
    expect(email.text).toContain(FUNCTION_Q1.deciding);
    expect(email.text).toContain(FUNCTION_Q2.decisions);
    expect(email.text).toMatch(/once more, two weeks from now, and never again/i);
    expect(email.html).toMatch(/once more, two weeks from now, and never again/i);
  });

  it("escapes anything enrichment returned before it reaches the HTML", () => {
    const email = renderPersonalRead(request, { role: '<script>alert(1)</script>', company: "A & B" });
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&amp;");
  });

  it("offers no diary link, because there is not one", () => {
    const email = renderPersonalRead(request, {});
    for (const source of [email.text, email.html]) {
      expect(source.toLowerCase()).not.toContain("calendly");
      expect(source.toLowerCase()).not.toMatch(/book (a|your) (call|time|slot|meeting)/);
    }
  });
});

describe("a retry cannot become a second email", () => {
  it("keys the send on the address", async () => {
    const first = await personalReadIdempotencyKey("leader@example.com");
    const second = await personalReadIdempotencyKey("leader@example.com");
    const other = await personalReadIdempotencyKey("someone@example.com");
    expect(first).toBe(second);
    expect(first).not.toBe(other);
    expect(first.startsWith("mindmake-personal-read/")).toBe(true);
  });

  it("stays inside the header-safe character set", async () => {
    const key = await personalReadIdempotencyKey("leader@example.com");
    expect(key).toMatch(/^[\x21-\x7e]+$/);
    expect(key.length).toBeLessThanOrEqual(256);
  });
});

describe("the page and the function agree", () => {
  /* The page composes the preview itself so it can render instantly. That only
     stays honest while both copies of the template say the same thing. */
  it("uses identical template lines on both sides", () => {
    expect(PAGE_Q1).toEqual(FUNCTION_Q1);
    expect(PAGE_Q2).toEqual(FUNCTION_Q2);
    expect(PAGE_CLOSING).toEqual(FUNCTION_CLOSING);
  });
});
