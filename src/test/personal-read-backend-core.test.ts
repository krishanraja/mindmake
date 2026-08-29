import { describe, expect, it } from "vitest";
import {
  CLOSING_LINE as FUNCTION_CLOSING,
  InvalidRequestError,
  Q1_LINES as FUNCTION_Q1,
  Q2_LINES as FUNCTION_Q2,
  DIVISION_IDS,
  buildRead,
  present,
  tidyProfile,
  openingLine,
  parsePersonalRead,
  parseHandoff,
  personalReadIdempotencyKey,
  renderHandoffNotice,
  renderPersonalRead,
  HANDOFF_REASONS,
  HANDOFF_REASON_LINES,
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

describe("provider data is made fit to say out loud", () => {
  /* PDL stores lowercase. Putting that straight into the first sentence a
     visitor reads about themselves gave "You are chief executive officer at
     salesforce", which is not honesty about the data, just untidiness. */
  it("capitalises an all-lowercase role and company", () => {
    expect(present("chief executive officer", true)).toBe("Chief Executive Officer");
    expect(present("salesforce")).toBe("Salesforce");
  });

  it("keeps the small words small inside a title", () => {
    expect(present("head of people and culture", true)).toBe("Head of People and Culture");
    /* Not at the front, though. */
    expect(present("of counsel", true)).toBe("Of Counsel");
  });

  /* The rule that protects the names that are deliberately odd. */
  it("never touches a word that already carries a capital", () => {
    expect(present("eBay")).toBe("eBay");
    expect(present("iRobot")).toBe("iRobot");
    expect(present("Chief of Staff", true)).toBe("Chief of Staff");
    expect(present("BAE Systems")).toBe("BAE Systems");
  });

  it("drops empty values rather than presenting a blank", () => {
    expect(present("")).toBeUndefined();
    expect(present("   ")).toBeUndefined();
    expect(present(undefined)).toBeUndefined();
  });

  it("tidies every field the read says aloud, and nothing else", () => {
    const tidied = tidyProfile({
      name: "marc benioff",
      role: "chief executive officer",
      company: "salesforce",
      industry: "computer software",
      linkedin: "linkedin.com/in/marcbenioff",
    });
    expect(tidied.name).toBe("Marc Benioff");
    expect(tidied.role).toBe("Chief Executive Officer");
    expect(tidied.company).toBe("Salesforce");
    /* The URL is data, not prose: it must survive untouched. */
    expect(tidied.linkedin).toBe("linkedin.com/in/marcbenioff");
  });
});

describe("a retry cannot become a second email", () => {
  /* Resend holds a key for 24 hours and 409s if the body changed under it, so
     an address-only key turned every improvement to the read into a hard
     delivery failure for everyone emailed that day. */
  it("treats a different read to the same person as a different send", async () => {
    const first = await personalReadIdempotencyKey("leader@example.com", "the old read");
    const second = await personalReadIdempotencyKey("leader@example.com", "a better read");
    expect(first).not.toBe(second);
  });

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

/**
 * The handoff: what the server accepts when the machine has already failed.
 *
 * This action exists because refusing to send something generic is right and
 * closing the door afterwards is not. Its whole value is that it cannot fail
 * for the reasons the read just did, so what is worth holding here is that it
 * stays that simple: strict parsing, no q1 or q2, and the one rule that would
 * defeat the point deliberately not applied.
 */
describe("the handoff contract", () => {
  const valid = {
    action: "handoff",
    reason: "read-refused",
    first_name: "Ada",
    last_name: "Lovelace",
    division: "leadership",
    email: "ada@northwind.com",
  };

  it("accepts the shape the offer sends", () => {
    expect(parseHandoff(valid)).toEqual(valid);
  });

  it("takes a personal address, because the rule that bans one has nothing left to protect", () => {
    /* The work-address rule exists to serve the reading: the company comes out
       of the domain. By the time anybody reaches this action the reading has
       failed or been refused, and "personal-email" is one of the reasons they
       can arrive with. Applying it here would answer "we cannot read your
       company" with "and we will not talk to you either". */
    expect(parseHandoff({ ...valid, reason: "personal-email", email: "ada@gmail.com" }).email)
      .toBe("ada@gmail.com");
  });

  it("refuses a reason it does not recognise", () => {
    expect(() => parseHandoff({ ...valid, reason: "just-because" })).toThrow(InvalidRequestError);
    expect(() => parseHandoff({ ...valid, reason: "" })).toThrow(InvalidRequestError);
  });

  it("refuses an unexpected key rather than ignoring it", () => {
    expect(() => parseHandoff({ ...valid, q1: "writing" })).toThrow(InvalidRequestError);
    expect(() => parseHandoff({ ...valid, note: "call me" })).toThrow(InvalidRequestError);
  });

  it("holds the same rules as the read on everything it shares with it", () => {
    expect(() => parseHandoff({ ...valid, division: "growth" })).toThrow(InvalidRequestError);
    expect(() => parseHandoff({ ...valid, email: "not-an-address" })).toThrow(InvalidRequestError);
    expect(() => parseHandoff({ ...valid, first_name: "" })).toThrow(InvalidRequestError);
    expect(() => parseHandoff({ ...valid, first_name: "A".repeat(81) })).toThrow(InvalidRequestError);
    expect(() => parseHandoff({ ...valid, action: "preview" })).toThrow(InvalidRequestError);
  });

  it("names every reason the pages can send", () => {
    for (const reason of HANDOFF_REASONS) {
      expect(parseHandoff({ ...valid, reason }).reason).toBe(reason);
      expect(HANDOFF_REASON_LINES[reason].length).toBeGreaterThan(20);
    }
  });
});

describe("the notice the operator gets", () => {
  const asked = parseHandoff({
    action: "handoff",
    reason: "read-refused",
    first_name: "Ada",
    last_name: "Lovelace",
    division: "leadership",
    email: "ada@northwind.com",
  });

  it("carries the person, the company and which dead end they hit", () => {
    const notice = renderHandoffNotice(asked);
    expect(notice.subject).toBe("Asked for a person: Ada Lovelace at northwind.com");
    for (const fact of ["Ada Lovelace", "ada@northwind.com", "northwind.com", "leadership", "read-refused"]) {
      expect(notice.text).toContain(fact);
      expect(notice.html).toContain(fact);
    }
    expect(notice.text).toContain(HANDOFF_REASON_LINES["read-refused"]);
  });

  it("says plainly that the visitor was sent nothing", () => {
    /* Two emails ever is a published promise, and a handoff is neither of them.
       The operator has to know that replying is the whole hand-off, because
       nothing else is going to happen on its own. */
    const notice = renderHandoffNotice(asked);
    expect(notice.text).toMatch(/nothing has been sent to them/i);
    expect(notice.html).toMatch(/nothing has been sent to them/i);
  });

  it("escapes what a browser typed before it reaches an operator's inbox", () => {
    const nasty = renderHandoffNotice(parseHandoff({
      ...asked,
      first_name: "<script>alert(1)</script>",
    }));
    expect(nasty.html).not.toContain("<script>");
    expect(nasty.html).toContain("&lt;script&gt;");
  });
});
