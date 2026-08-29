/**
 * The personal read, without Deno.
 *
 * Everything here is pure so the site's own test suite can import it directly,
 * the way it already does for the brief pipeline. The template lines are the
 * same ones the page composes its instant preview from, and a parity test holds
 * the two copies identical.
 */

import { FREE_EMAIL_DOMAINS } from "../_shared/enrich/types.ts";

export const Q1_IDS = ["writing", "chasing", "admin", "deciding"] as const;
export const Q2_IDS = ["network", "pipeline", "content", "decisions"] as const;

export type Q1 = typeof Q1_IDS[number];
export type Q2 = typeof Q2_IDS[number];

export const Q1_LINES: Record<Q1, string> = {
  writing: "Every draft you touch next week starts already written, in your voice, to your standards. You edit, you do not start.",
  chasing: "Follow-ups, chasers and reminders go out without you, and nothing slips through again.",
  admin: "The admin between decisions disappears into the system, and your week gets its hours back.",
  deciding: "Every decision arrives pre-read: the trade-offs, the counterpoints, and what would change your mind.",
};

export const Q2_LINES: Record<Q2, string> = {
  network: "It maps the people you already know and surfaces the three who matter for what you are working on right now, with the reason attached.",
  pipeline: "It watches your pipeline and tells you each morning which deal moved, why, and what to do about it.",
  content: "It learns exactly what you sound like and drafts the next piece before you ask for it.",
  decisions: "It holds every call you have made, so the next one starts from your own track record instead of a blank page.",
};

/**
 * How each division reads in a sentence about the person.
 *
 * Deliberately a phrase and not a job title: we know which part of the business
 * somebody works in because they told us, and we do not know what they do in it.
 */
export const DIVISION_NOUNS: Record<Division, string> = {
  leadership: "in the leadership team",
  sales: "in sales",
  marketing: "in marketing",
  product: "in product",
  engineering: "in engineering",
  operations: "in operations",
  finance: "in finance",
  people: "in the people team",
};

/**
 * What that part of a business is usually weighing up.
 *
 * One line each, used to point the read at the work the visitor actually does
 * rather than at the company in general. Every one of them is a statement about
 * the job, never about their company, because we know the first and are only
 * ever guessing at the second.
 */
export const DIVISION_LINES: Record<Division, string> = {
  leadership: "It arrives at the calls that only reach you: the ones with no clean answer and no more time to find one.",
  sales: "It knows your pipeline, what moved this week and which conversation is worth your next hour.",
  marketing: "It holds what your best work sounds like, so the next piece starts from your standard rather than a blank page.",
  product: "It keeps the reasoning behind every call you have already made, so the next trade-off starts from your own track record.",
  engineering: "It carries the context around the work, so the decisions land with the reasons attached rather than in someone's head.",
  operations: "It watches the parts of the week that repeat, and takes the ones that never needed you.",
  finance: "It reads the numbers against what you decided last time, and tells you which assumption has quietly stopped being true.",
  people: "It remembers what good looks like here, so the judgement calls stay consistent when you are not in the room.",
};

export const CLOSING_LINE =
  "The full version lands in your inbox. One email, ever, plus one follow-up.";

/**
 * The parts of a business someone works in.
 *
 * A fixed set, so what the browser sends stays an allowlisted identifier rather
 * than free text. `src/lib/workEmail.ts` holds the browser's copy and a test
 * keeps the two identical.
 */
export const DIVISION_IDS = [
  "leadership", "sales", "marketing", "product",
  "engineering", "operations", "finance", "people",
] as const;

export type Division = typeof DIVISION_IDS[number];

/** Names are free text, so they are the one thing here that needs a ceiling. */
const NAME_MAX = 80;

export interface PersonalReadRequest {
  action: "preview" | "send";
  first_name: string;
  last_name: string;
  division: Division;
  q1: Q1;
  q2: Q2;
  email: string;
}

export class InvalidRequestError extends Error {}

const isQ1 = (value: unknown): value is Q1 => Q1_IDS.includes(value as Q1);
const isQ2 = (value: unknown): value is Q2 => Q2_IDS.includes(value as Q2);
const isDivision = (value: unknown): value is Division => DIVISION_IDS.includes(value as Division);

/**
 * One line, no control characters, and short enough to be a name.
 *
 * The control characters are filtered by code point rather than by a regex,
 * because a character class holding literal control characters is the sort of
 * thing both linters here object to and neither of them is wrong.
 */
function readName(value: unknown, field: string): string {
  if (typeof value !== "string") throw new InvalidRequestError(field);
  const printable = Array.from(value, (character) => {
    const code = character.codePointAt(0) ?? 0;
    return code < 0x20 || code === 0x7f ? " " : character;
  }).join("");
  const clean = printable.trim().replace(/\s+/g, " ");
  if (!clean || clean.length > NAME_MAX) throw new InvalidRequestError(field);
  return clean;
}

/** Strict allowlist parsing: an unknown key or value is rejected, not ignored. */
export function parsePersonalRead(body: unknown): PersonalReadRequest {
  if (!body || typeof body !== "object") throw new InvalidRequestError("body");
  const raw = body as Record<string, unknown>;

  /* linkedin_url is deliberately absent. It was the old way in, and an
     unexpected key is rejected rather than ignored, so a stale client fails
     loudly here instead of quietly sending a profile URL we no longer read. */
  const allowed = new Set(["action", "first_name", "last_name", "division", "q1", "q2", "email"]);
  for (const key of Object.keys(raw)) {
    if (!allowed.has(key)) throw new InvalidRequestError(`unexpected:${key}`);
  }

  const action = raw.action;
  if (action !== "preview" && action !== "send") throw new InvalidRequestError("action");
  if (!isQ1(raw.q1)) throw new InvalidRequestError("q1");
  if (!isQ2(raw.q2)) throw new InvalidRequestError("q2");
  if (!isDivision(raw.division)) throw new InvalidRequestError("division");

  const firstName = readName(raw.first_name, "first_name");
  const lastName = readName(raw.last_name, "last_name");

  /* Required on both actions now, not just on send. The company read is built
     from this address's domain, so a preview without one has nothing to read. */
  let email: string;
  {
    if (typeof raw.email !== "string") throw new InvalidRequestError("email");
    email = raw.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      throw new InvalidRequestError("email");
    }
    /* The read is built from this address's domain, so a personal one gives the
       pipeline nothing to work from. The page says so before anybody types, and
       this is the same rule where it actually binds: a browser is not a gate. */
    if (FREE_EMAIL_DOMAINS.has(email.slice(email.lastIndexOf("@") + 1))) {
      throw new InvalidRequestError("personal-email");
    }
  }

  return {
    action,
    first_name: firstName,
    last_name: lastName,
    division: raw.division,
    q1: raw.q1,
    q2: raw.q2,
    email,
  };
}

/** What enrichment managed to establish. Every field is optional by design. */
export interface Profile {
  name?: string;
  role?: string;
  company?: string;
  industry?: string;
  /** What PDL resolved from the name and company, and the reason we can stop asking. */
  linkedin?: string;
}

export const escapeHtml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

/**
 * The opening line.
 *
 * It says only what enrichment actually established. With nothing to go on it
 * says nothing about the reader rather than guessing, which is the same honesty
 * rule the company read follows.
 */
export function openingLine(profile: Profile, division?: Division): string {
  const role = profile.role?.trim();
  const company = profile.company?.trim();
  /* The division is the one fact here the visitor gave us themselves, so it
     stands in when enrichment came back with nothing. It is never used to
     dress up a company we could not resolve: that would be a guess wearing a
     fact's clothes, which is the thing this whole function exists to avoid. */
  const place = role ?? (division ? DIVISION_NOUNS[division] : undefined);
  if (place && company) {
    return `You are ${place} at ${company}. Here is what your first week would look like.`;
  }
  if (company) {
    return `You work at ${company}. Here is what your first week would look like.`;
  }
  if (place) {
    return `You work ${place}. Here is what your first week would look like.`;
  }
  return "Here is what your first week would look like.";
}

/**
 * The read itself, before anything decides where to put it.
 *
 * The page renders this on screen and the email renders the same object, so the
 * two cannot say different things. That mattered enough to be worth a type: the
 * previous shape composed the email in one place and the preview in another,
 * and four of the lines had already drifted apart by the time anyone checked.
 */
export interface PersonalRead {
  opening: string;
  lines: string[];
  /** Present only when enrichment actually resolved the company. */
  company?: string;
  /** True when we are reading from the division alone, which the page says out loud. */
  companyOnly: boolean;
}

export function buildRead(request: PersonalReadRequest, profile: Profile): PersonalRead {
  return {
    opening: openingLine(profile, request.division),
    lines: [Q1_LINES[request.q1], Q2_LINES[request.q2], DIVISION_LINES[request.division]],
    company: profile.company?.trim() || undefined,
    companyOnly: !profile.role,
  };
}

export interface PersonalReadEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderPersonalRead(request: PersonalReadRequest, profile: Profile): PersonalReadEmail {
  const { opening, lines } = buildRead(request, profile);

  const text = [
    "Your first week with an AI brain",
    "",
    opening,
    "",
    ...lines,
    "",
    "What happens next",
    "If this is useful, reply to this email and we will look at your business properly. There is no diary link to book and no sales sequence behind this.",
    "",
    "You will hear from us once more, two weeks from now, and never again after that.",
    "",
    "Mindmake",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Your first week with an AI brain</title></head>
<body style="margin:0;background:#0a100d;color:#e6ede8;font:16px/1.6 Georgia,serif">
<div style="max-width:560px;margin:0 auto;padding:32px 22px">
<p style="margin:0 0 24px;font:600 13px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#788c82">Mindmake</p>
<h1 style="margin:0 0 18px;font:700 26px/1.2 Arial,sans-serif;letter-spacing:-.02em;color:#f2f8f5">Your first week with an AI brain</h1>
<p style="margin:0 0 18px;color:#b0c0b7">${escapeHtml(opening)}</p>
${lines.map((line) => `<p style="margin:0 0 14px;padding-left:14px;border-left:2px solid #3e8e68;color:#e6ede8">${escapeHtml(line)}</p>`).join("\n")}
<h2 style="margin:28px 0 10px;font:700 17px/1.3 Arial,sans-serif;color:#f2f8f5">What happens next</h2>
<p style="margin:0 0 14px;color:#b0c0b7">If this is useful, reply to this email and we will look at your business properly. There is no diary link to book and no sales sequence behind this.</p>
<p style="margin:24px 0 0;font:400 13px/1.5 Arial,sans-serif;color:#788c82">You will hear from us once more, two weeks from now, and never again after that.</p>
</div></body></html>`;

  return { subject: "Your first week with an AI brain", html, text };
}

/** Deterministic, so a retry cannot become a second email. */
export async function personalReadIdempotencyKey(email: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email));
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `mindmake-personal-read/${hex}`;
}
