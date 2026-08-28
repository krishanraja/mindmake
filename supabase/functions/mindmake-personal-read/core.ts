/**
 * The personal read, without Deno.
 *
 * Everything here is pure so the site's own test suite can import it directly,
 * the way it already does for the brief pipeline. The template lines are the
 * same ones the page composes its instant preview from, and a parity test holds
 * the two copies identical.
 */

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

export const CLOSING_LINE =
  "The full version, built from your LinkedIn, lands in your inbox. One email, ever, plus one follow-up.";

export interface PersonalReadRequest {
  action: "preview" | "send";
  linkedin_url?: string;
  q1: Q1;
  q2: Q2;
  email?: string;
}

export class InvalidRequestError extends Error {}

const isQ1 = (value: unknown): value is Q1 => Q1_IDS.includes(value as Q1);
const isQ2 = (value: unknown): value is Q2 => Q2_IDS.includes(value as Q2);

/** Strict allowlist parsing: an unknown key or value is rejected, not ignored. */
export function parsePersonalRead(body: unknown): PersonalReadRequest {
  if (!body || typeof body !== "object") throw new InvalidRequestError("body");
  const raw = body as Record<string, unknown>;

  const allowed = new Set(["action", "linkedin_url", "q1", "q2", "email"]);
  for (const key of Object.keys(raw)) {
    if (!allowed.has(key)) throw new InvalidRequestError(`unexpected:${key}`);
  }

  const action = raw.action;
  if (action !== "preview" && action !== "send") throw new InvalidRequestError("action");
  if (!isQ1(raw.q1)) throw new InvalidRequestError("q1");
  if (!isQ2(raw.q2)) throw new InvalidRequestError("q2");

  const linkedin = typeof raw.linkedin_url === "string" ? raw.linkedin_url.trim().slice(0, 300) : "";

  let email: string | undefined;
  if (action === "send") {
    if (typeof raw.email !== "string") throw new InvalidRequestError("email");
    email = raw.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      throw new InvalidRequestError("email");
    }
  }

  return { action, linkedin_url: linkedin, q1: raw.q1, q2: raw.q2, email };
}

/** What enrichment managed to establish. Every field is optional by design. */
export interface Profile {
  name?: string;
  role?: string;
  company?: string;
  industry?: string;
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
export function openingLine(profile: Profile): string {
  const role = profile.role?.trim();
  const company = profile.company?.trim();
  if (role && company) {
    return `You are ${role} at ${company}. Here is what your first week would look like.`;
  }
  if (company) {
    return `You work at ${company}. Here is what your first week would look like.`;
  }
  if (role) {
    return `You are ${role}. Here is what your first week would look like.`;
  }
  return "Here is what your first week would look like.";
}

export interface PersonalReadEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderPersonalRead(request: PersonalReadRequest, profile: Profile): PersonalReadEmail {
  const opening = openingLine(profile);
  const lines = [Q1_LINES[request.q1], Q2_LINES[request.q2]];

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
