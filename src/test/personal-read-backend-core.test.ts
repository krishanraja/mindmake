import { describe, expect, it } from "vitest";
import {
  CLOSING_LINE as FUNCTION_CLOSING,
  InvalidRequestError,
  Q1_LINES as FUNCTION_Q1,
  Q2_LINES as FUNCTION_Q2,
  DIVISION_IDS,
  buildRead,
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
  const valid = {
    action: "preview",
    first_name: "Ada",
    last_name: "Lovelace",
    division: "leadership",
    email: "ada@northwind.com",
    q1: "writing",
    q2: "network",
  };

  it("accepts the shape the page sends", () => {
    expect(parsePersonalRead(valid)).toMatchObject({
      action: "preview", first_name: "Ada", last_name: "Lovelace", division: "leadership",
    });
  });

  it("rejects an answer outside the allowed set", () => {
    expect(() => parsePersonalRead({ ...valid, q1: "everything" })).toThrow(InvalidRequestError);
    expect(() => parsePersonalRead({ ...valid, q2: "" })).toThrow(InvalidRequestError);
    expect(() => parsePersonalRead({ ...valid, division: "legal" })).toThrow(InvalidRequestError);
  });

  it("rejects an unexpected key rather than ignoring it", () => {
    expect(() => parsePersonalRead({ ...valid, admin: true })).toThrow(InvalidRequestError);
  });

  /* linkedin_url was the old way in. A stale client must fail loudly rather
     than have a profile URL we no longer read quietly accepted and dropped. */
  it("refuses the retired profile field", () => {
    expect(() => parsePersonalRead({ ...valid, linkedin_url: "linkedin.com/in/someone" }))
      .toThrow(InvalidRequestError);
  });

  it("requires a name, and bounds it", () => {
    expect(() => parsePersonalRead({ ...valid, first_name: "" })).toThrow(InvalidRequestError);
    expect(() => parsePersonalRead({ ...valid, last_name: "  " })).toThrow(InvalidRequestError);
    expect(() => parsePersonalRead({ ...valid, first_name: "x".repeat(5_000) })).toThrow(InvalidRequestError);
  });

  it("flattens control characters out of a name rather than storing them", () => {
    expect(parsePersonalRead({ ...valid, first_name: "Ada\u0000\u001fB" }).first_name).toBe("Ada B");
  });

  it("requires a usable email on every action, because the read is built from it", () => {
    expect(() => parsePersonalRead({ ...valid, email: undefined })).toThrow(InvalidRequestError);
    expect(() => parsePersonalRead({ ...valid, email: "nope" })).toThrow(InvalidRequestError);
    expect(parsePersonalRead({ ...valid, email: " Leader@Example.com " }).email)
      .toBe("leader@example.com");
  });

  /* The browser refuses these too, but a browser is not a gate. */
  it("refuses a personal address at the server as well as the page", () => {
    for (const address of ["someone@gmail.com", "someone@outlook.com", "someone@mailinator.com"]) {
      expect(() => parsePersonalRead({ ...valid, email: address })).toThrow(InvalidRequestError);
    }
  });
});

describe("the email says only what it knows", () => {
  const request = {
    action: "send" as const,
    first_name: "Ada",
    last_name: "Lovelace",
    division: "leadership" as const,
    q1: "deciding" as const,
    q2: "decisions" as const,
    email: "a@b.co",
  };

  it("uses the role and company when enrichment found them", () => {
    expect(openingLine({ role: "Chief Executive", company: "Northwind" }))
      .toBe("You are Chief Executive at Northwind. Here is what your first week would look like.");
  });

  it("says nothing about the reader when enrichment found nothing", () => {
    /* An empty profile must not become a guess about who they are. */
    expect(openingLine({})).toBe("Here is what your first week would look like.");
  });

  /* The division is the one thing here the visitor told us themselves, so it
     can stand in for a role. It must never dress up a company we did not find. */
  it("falls back to the division, and never invents a company", () => {
    expect(openingLine({}, "sales")).toBe("You work in sales. Here is what your first week would look like.");
    expect(openingLine({ company: "Northwind" }, "finance"))
      .toBe("You are in finance at Northwind. Here is what your first week would look like.");
    /* " at " with no company on either side of it: the sentence must not
       acquire a workplace we never resolved. */
    expect(openingLine({}, "people")).not.toMatch(/\bat\b/);
  });

  it("marks a company-only read as one, so the page can say so", () => {
    expect(buildRead(request, { company: "Northwind" }).companyOnly).toBe(true);
    expect(buildRead(request, { company: "Northwind", role: "Chief Executive" }).companyOnly).toBe(false);
  });

  it("gives every division a line, so none of them reads as a gap", () => {
    for (const division of DIVISION_IDS) {
      const read = buildRead({ ...request, division }, {});
      expect(read.lines).toHaveLength(3);
      expect(read.lines.every((line) => line.trim().length > 20)).toBe(true);
    }
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
  /* The page no longer composes the read, but it still holds the question
     labels and the closing line, and those only stay honest while both copies
     say the same thing. */
  it("uses identical template lines on both sides", () => {
    expect(PAGE_Q1).toEqual(FUNCTION_Q1);
    expect(PAGE_Q2).toEqual(FUNCTION_Q2);
    expect(PAGE_CLOSING).toEqual(FUNCTION_CLOSING);
  });
});
