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

/**
 * The house voice, applied to anything a provider wrote.
 *
 * The LLM synthesis is scrubbed on its way out of `completeText`, and PDL's
 * fields never were, so a job title carrying an em dash walked straight into
 * the first sentence of the email. Provider text is provider text wherever it
 * comes from: it all gets the same treatment before it is allowed into a
 * sentence written in our name.
 */
export function houseVoice(input: string): string {
  return input
    /* Not between digits. The first live battery produced "now employing 501,
       1000 people" out of a headcount band, because a dash separating numbers
       is a range and not a clause, and replacing it with a comma turns one fact
       into two wrong ones. */
    .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, "$1-$2")
    .replace(/\s*[\u2013\u2014]\s*/g, ", ")
    .replace(/\s+--\s+/g, ", ")
    .replace(/\bjudgment(al|s)?\b/gi, (m) => (m[0] === "J" ? "Judgement" : "judgement") + m.slice(8))
    .replace(/,\s*,/g, ",")
    .replace(/\s+,/g, ",")
    .replace(/,\s*([.!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* Words that stay lowercase inside a job title unless they open it. */
const MINOR_WORDS = new Set(["of", "and", "the", "for", "at", "in", "to", "a", "an"]);

/**
 * Provider data, made fit to appear in a sentence about a person.
 *
 * PDL returns "chief executive officer" and "salesforce", and the read puts
 * both straight into the first line a visitor sees about themselves. Lowercase
 * is the provider's storage convention, not a fact about the company, so
 * presenting it verbatim is not honesty, it is just untidiness.
 *
 * A word that already carries a capital is left exactly as it is. That is what
 * protects the names that are deliberately odd: eBay and iRobot survive, and
 * only all-lowercase words are touched.
 */
export function present(value: string | undefined, isTitle = false): string | undefined {
  const clean = houseVoice(value?.trim().replace(/\s+/g, " ") ?? "");
  if (!clean) return undefined;
  return clean
    .split(" ")
    .map((word, at) => {
      if (/[A-Z]/.test(word)) return word;
      if (isTitle && at > 0 && MINOR_WORDS.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * A company's name, without the address it happens to live at.
 *
 * The providers sometimes hand back the domain as the name, so the live battery
 * addressed Shopify as "Shopify.com". Nobody writes their own company that way,
 * and a reader who sees it knows immediately that no one looked.
 */
export function companyName(value: string | undefined, domain = ""): string | undefined {
  const clean = value?.trim();
  if (!clean) return undefined;
  /* The signal is that the name restates the address, not that it is lower
     case. A first attempt keyed on case, on the theory that a provider writes
     a raw hostname in lower case and a real name carries a capital; the live
     pipeline then returned "Shopify.com" with the capital, and the rule never
     fired on the one case it was written for.
     
     So: strip the suffix only when the whole name is the visitor's own domain
     restated, which is the situation where it carries nothing the reader does
     not already know. The cost is that a visitor at Booking.com, which really
     is called that, would be addressed as "Booking". That is one company
     against every company whose provider hands back a hostname, and it is a
     smaller wrong than the alternative. */
  if (!domain) return clean;
  const root = domain.toLowerCase().replace(/^www\./, "");
  if (clean.toLowerCase() !== root) return clean;
  const label = root.split(".")[0];
  return label.length > 2 ? label : clean;
}

/** The same tidy-up applied to every field the read will actually say aloud. */
export function tidyProfile(profile: Profile): Profile {
  return {
    ...profile,
    name: present(profile.name, true),
    /* Company names take the minor-word rule too. Without it the live battery
       returned "University Of Oxford", which is a spelling of that name nobody
       has ever used. */
    role: present(profile.role, true),
    company: present(profile.company, true),
    industry: present(profile.industry, true),
  };
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
/** What the company enrichment established, as far as the read is allowed to say it. */
export interface CompanySeen {
  name?: string;
  /** The synthesised outside read: one paragraph of what this company does. */
  descriptor?: string;
  industry?: string;
  products?: string[];
}

export interface PersonalRead {
  opening: string;
  /**
   * What we can see about this company from the outside. The one part of the
   * read that could not have been written before the visitor arrived.
   */
  seen?: string;
  lines: string[];
  /** Present only when enrichment actually resolved the company. */
  company?: string;
  /** True when we are reading from the division alone, which the page says out loud. */
  companyOnly: boolean;
}

/**
 * The read.
 *
 * The first version was the opening line and three template sentences, and the
 * templates were chosen by two taps, so everybody who tapped the same pair got
 * the same email with their job title pasted on the front. That is the mirror
 * this business exists to argue against, and it went out once before anybody
 * noticed, which is the reason `seen` is now the part that leads.
 *
 * `seen` is the synthesised outside read of the actual company. Everything after
 * it is what the brain would do about it, and those lines are templates on
 * purpose: they describe our product, which does not vary by visitor. What has
 * to vary is the company, and now it does.
 */
export function buildRead(
  request: PersonalReadRequest,
  profile: Profile,
  company?: CompanySeen,
  domain = "",
): PersonalRead {
  const named = present(companyName(company?.name, domain), true) ?? profile.company?.trim();
  const descriptor = company?.descriptor
    ? sanitiseDescriptor(houseVoice(company.descriptor.trim())) || undefined
    : undefined;
  const industry = present(company?.industry) ?? profile.industry;

  /* Only ever what enrichment actually established. With no descriptor we say
     what little we have and stop, rather than padding it into a paragraph. */
  let seen: string | undefined;
  if (descriptor) {
    seen = descriptor;
  } else if (named && industry) {
    seen = `${named} works in ${industry.toLowerCase()}.`;
  }

  return {
    opening: openingLine(profile, request.division),
    seen,
    lines: [Q1_LINES[request.q1], Q2_LINES[request.q2], DIVISION_LINES[request.division]],
    company: named || undefined,
    companyOnly: !profile.role,
  };
}

export interface PersonalReadEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderPersonalRead(
  request: PersonalReadRequest,
  profile: Profile,
  company?: CompanySeen,
  domain = "",
): PersonalReadEmail {
  const { opening, seen, lines } = buildRead(request, profile, company, domain);

  const text = [
    "Your first week with an AI brain",
    "",
    opening,
    ...(seen ? ["", `What we can see from the outside: ${seen}`] : []),
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
${seen ? `<p style="margin:0 0 20px;padding:14px 16px;border:1px solid #23342c;background:#0e1613;color:#e6ede8"><span style="display:block;margin-bottom:6px;font:500 10.5px/1 'Courier New',monospace;letter-spacing:.12em;text-transform:uppercase;color:#7fe3b4">What we can see from the outside</span>${escapeHtml(seen)}</p>` : ""}
${lines.map((line) => `<p style="margin:0 0 14px;padding-left:14px;border-left:2px solid #3e8e68;color:#e6ede8">${escapeHtml(line)}</p>`).join("\n")}
<h2 style="margin:28px 0 10px;font:700 17px/1.3 Arial,sans-serif;color:#f2f8f5">What happens next</h2>
<p style="margin:0 0 14px;color:#b0c0b7">If this is useful, reply to this email and we will look at your business properly. There is no diary link to book and no sales sequence behind this.</p>
<p style="margin:24px 0 0;font:400 13px/1.5 Arial,sans-serif;color:#788c82">You will hear from us once more, two weeks from now, and never again after that.</p>
</div></body></html>`;

  return { subject: "Your first week with an AI brain", html, text };
}

/**
 * Deterministic, so a retry cannot become a second email.
 *
 * The address alone is not enough to key on, and the reason is worth keeping.
 * Resend holds an idempotency key for 24 hours and refuses it with a 409 if the
 * body has changed since, so keying on the address alone meant that the moment
 * the read itself improved, every address emailed in the last day got a hard
 * delivery failure rather than the better email. The content is part of the
 * identity of the send: the same read to the same person is one email however
 * many times it is retried, and a genuinely different read is a different send.
 */
export async function personalReadIdempotencyKey(email: string, content = ""): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${email}\n${content}`));
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `mindmake-personal-read/${hex}`;
}

/* ---------------------------------------------------------------------------
 * The gate the read has to clear before it is allowed to be sent
 *
 * The first version of this read went out as a job title pasted on the front of
 * three template sentences, and the verdict on it was "embarrassingly generic,
 * I'd rather send nothing". That is now the implemented behaviour rather than a
 * preference: a read that cannot clear this bar is not sent at all.
 *
 * The questions are asked from the reader's side. They are a senior operator at
 * a real company, short of time and tired of being marketed at, and the whole
 * job of this email is that they finish it feeling somebody actually looked at
 * their business. Anything that reads as a form letter with their name on it
 * costs more than sending nothing would.
 *
 * These are deterministic on purpose. A judge that scores differently on two
 * runs of the same input cannot be a hard gate on a live send path, and a gate
 * that sometimes lets a bad email through is not a gate. What a machine cannot
 * check is written down in the rubric rather than pretended away.
 * ------------------------------------------------------------------------- */

/** Words so common in company copy that a sentence made of them says nothing. */
const EMPTY_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "for", "with", "on", "at", "by", "from",
  "is", "are", "was", "were", "be", "been", "it", "its", "their", "they", "this", "that",
  "company", "business", "solution", "solutions", "platform", "service", "services",
  "software", "technology", "innovative", "leading", "global", "world", "class",
  "customer", "customers", "client", "clients", "product", "products", "team", "teams",
  "help", "helps", "helping", "provide", "provides", "providing", "enable", "enables",
  "offering", "offers", "focused", "dedicated", "committed", "mission", "vision",
]);

/** Phrases that mean the synthesis gave up and wrote filler. */
const FILLER = [
  "a company that", "is a company", "provides solutions", "wide range of",
  "cutting edge", "cutting-edge", "state of the art", "best in class",
  "industry leading", "industry-leading", "one stop shop", "we could not",
  "no information", "not available", "unknown", "n/a",
];

/**
 * Judgements about the reader's standing.
 *
 * The synthesis wrote "you're a newly founded consulting practice, still
 * establishing your market position" about a real business, which is a verdict
 * on somebody's company delivered to them unasked. The house rule against doom
 * framing is not only about failure words: telling a leader their business is
 * small or immature is the same move in a politer register.
 */
const VERDICTS = [
  /\b(?:still|yet to)\s+(?:establish|find|prove|build|gain)/i,
  /\bnewly (?:founded|established|formed)\b/i,
  /\b(?:small|tiny|modest|limited|minimal|little)\s+(?:team|presence|footprint|scale|reach|traction)/i,
  /\b(?:lagging|immature|unproven|nascent|fledgling)\b/i,
  /* "behind" only where it is a verdict. As a bare word it is a preposition,
     and the reasoning behind a decision tripped this on every visitor who
     picked Product, which the simulations caught and a live run would not
     have: the read would simply have been refused and nobody would have known
     why. */
  /\b(?:falling|fallen|lag(?:ging)?)\s+behind\b|\bbehind\s+(?:the curve|your competitors|the market|peers)\b/i,
  /\byou(?:'re| are) (?:a )?(?:small|new|young|emerging)\b/i,
];

/**
 * Infrastructure a reader did not ask us to notice.
 *
 * Naming somebody's hosting stack back to them reads as surveillance rather
 * than insight, and to a leader it is not even interesting. The enrichment
 * knows the stack because BuiltWith reports it; that is a routing signal, not
 * something to recite.
 */
const INFRASTRUCTURE = [
  "supabase", "vercel", "netlify", "heroku", "cloudflare", "wordpress", "webflow",
  "squarespace", "wix", "shopify plus", "hubspot", "google analytics", "segment",
  "aws", "azure", "gcp", "digitalocean", "react", "next.js", "tailwind",
  "salesforce", "contentful", "ruby on rails", "django", "laravel", "kubernetes",
  "snowflake", "databricks", "marketo", "zendesk", "stripe.js", "algolia",
];

/**
 * The sentence shape the synthesis keeps reaching for.
 *
 * A vendor list can never be complete: the first live battery caught a read
 * that named Salesforce, Contentful and Ruby on Rails, none of which were on a
 * list that had been written around hosting. The construction is the tell, not
 * the vendor. "Built on", "powered by", "runs on" followed by named products is
 * a stack recital whatever the products happen to be, and to the person reading
 * it about their own company it is never the interesting part.
 */
const STACK_RECITAL =
  /\b(?:built|running|runs|powered|hosted|based)\s+(?:on|by|with)\s+[A-Z][A-Za-z0-9.]*(?:[\s,]+(?:and\s+)?[A-Z][A-Za-z0-9.]*)*/;

/**
 * Problems attributed to the reader.
 *
 * The house style bans doom, fear and failure framing about the reader's
 * business, and the verdict rule only caught the "you are small" register. The
 * live battery then told the NHS it "faces chronic funding pressures and
 * waiting list backlogs that constrain your capacity to deliver timely care",
 * which is all true, widely reported, and still not ours to hand somebody
 * unasked in an email they did not ask for.
 *
 * Observing a market is fine: "competing in a crowded market" stays. Telling a
 * reader their organisation is failing does not.
 */
const DOOM = [
  /\byou (?:face|suffer|struggle|contend with|grapple with)\b/i,
  /\b(?:chronic|mounting|severe|persistent|acute)\s+(?:\w+\s+)?(?:pressure|shortage|deficit|backlog|problem)/i,
  /\bbacklogs?\b/i,
  /\b(?:funding|budget|cash|staffing)\s+(?:pressures?|shortfalls?|crisis|constraints?)/i,
  /\bconstrain(?:s|ing)?\s+your\b/i,
  /\byour\s+(?:decline|struggles|failures|shortcomings|weaknesses)\b/i,
];

/**
 * Praise.
 *
 * The verdict rule caught the read telling a business it was small. The live
 * battery then produced "You remain the world's leading research and teaching
 * institution", which is the same move with the sign flipped. The read is meant
 * to be a read. Flattery is what the visitor came here to get away from, and a
 * paragraph that opens by admiring them has stopped observing them.
 */
const FLATTERY = [
  /\b(?:world|industry|market)(?:'s)?[- ]?(?:leading|best|foremost|premier|number one|largest|biggest)\b/i,
  /\b(?:you|it|they|\w+)\s+(?:remain|remains|are|is)\s+the\s+(?:leading|best|premier|foremost|dominant|top|backbone|gold standard)\b/i,
  /\bdemonstrat\w+\s+your\s+commitment\b/i,
  /\b(?:unrivalled|unmatched|unparalleled|second to none|gold standard)\b/i,
  /\bgenuine innovation\b/i,
  /\b(?:rare|shining) example\b/i,
];

/** Claims about the reader's own situation that nothing outside could know. */
const OVERREACH = [
  /\byou(?:'re| are)\s+(?:struggling|failing|losing|behind|missing out)/i,
  /\byour team (?:is|are)\s+(?:struggling|failing|not)/i,
  /\byou need to\b/i,
  /\byou should\b/i,
  /\byou must\b/i,
  /\bwe know (?:that )?you\b/i,
];

/** House voice, the parts of it a machine can actually check. */
const VOICE = [
  { pattern: /—/, question: "Does it use an em dash, which the house style does not?" },
  { pattern: /\b(judgment|organiz|analyz|behavior|optimiz|personaliz|leverage|utilize|synerg)/i, question: "Does it use American spellings or business jargon?" },
  /* Only where we are the one shouting. Marks and Spencer sell a range called
     "YAY! Mushrooms", and a bare test for an exclamation mark refused an
     otherwise good read because a real product has one in its name. Our own
     shouting ends a word: "brilliant!". A brand carries the mark inside a
     capitalised token, so the letter before it is a capital. */
  { pattern: /[a-z]!/, question: "Does it raise its voice at the reader?" },
  { pattern: /\b(undefined|null|NaN|\{\{|TODO|Lorem)\b/, question: "Does it carry placeholder residue from the template?" },
];

/**
 * Drops the sentences that cannot be sent, and keeps the ones that can.
 *
 * The synthesis writes a good paragraph and then, reliably, appends one more
 * sentence reciting the stack or passing a verdict on how established the
 * company is. Refusing the whole read over that last sentence throws away four
 * good ones to avoid a bad one, which is the wrong trade: the reader loses a
 * real read because a model would not stop writing.
 *
 * So the sentence goes and the rest stays. The gate still runs afterwards on
 * what is left, so anything this misses is still caught, and a paragraph that
 * is nothing but bad sentences ends up empty and is refused on the specificity
 * question, which is the honest outcome for it.
 */
export function sanitiseDescriptor(text: string): string {
  const kept = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => {
      if (!sentence) return false;
      if (STACK_RECITAL.test(sentence)) return false;
      if (INFRASTRUCTURE.some((tool) => new RegExp(`\\b${tool.replace(".", "\\.")}\\b`, "i").test(sentence))) return false;
      if (VERDICTS.some((pattern) => pattern.test(sentence))) return false;
      if (FLATTERY.some((pattern) => pattern.test(sentence))) return false;
      if (DOOM.some((pattern) => pattern.test(sentence))) return false;
      if (OVERREACH.some((pattern) => pattern.test(sentence))) return false;
      if (FILLER.some((phrase) => sentence.toLowerCase().includes(phrase))) return false;
      return true;
    });
  return kept.join(" ").trim();
}

export interface ReadAssessment {
  passed: boolean;
  /** How many of the rubric's questions the read answered well. */
  score: number;
  outOf: number;
  /** The questions it failed, in the rubric's own words. */
  failures: string[];
}

/** The specific words in a sentence: what is left once the empty ones go. */
function substantiveWords(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/)
    .filter((word) => word.length > 2 && !EMPTY_WORDS.has(word));
}

const sentences = (text: string) => text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

/**
 * Reads the assembled read the way its recipient would, and refuses it if the
 * answer to any of these is anything short of yes.
 */
export function assessRead(read: PersonalRead, profile: Profile, domain = ""): ReadAssessment {
  const failures: string[] = [];
  const body = [read.opening, read.seen ?? "", ...read.lines].join(" ");
  const seen = read.seen?.trim() ?? "";
  const seenWords = substantiveWords(seen);
  const unique = new Set(seenWords);

  const ask = (question: string, ok: boolean) => { if (!ok) failures.push(question); };

  // 1. The question the whole email lives or dies on.
  /* The floor applies after repair, not before it. Stripping the NHS read of
     its doom sentence and its flattery left two sentences, which cleared a
     word count measured across the whole body while the part that was supposed
     to carry the specifics had almost nothing left in it. */
  ask(
    "Is there anything here that could only have been written about this company?",
    seen.length >= 140 && unique.size >= 12,
  );

  // 2. Filler is worse than silence, because it looks like an answer.
  ask(
    "Would this same paragraph fit their closest competitor without changing a word?",
    Boolean(seen) && !FILLER.some((phrase) => seen.toLowerCase().includes(phrase)),
  );

  // 3. We are reading from the outside and must never pretend otherwise.
  ask(
    "Does it claim to know something about them that nothing outside could know?",
    !OVERREACH.some((pattern) => pattern.test(body)),
  );

  // 4. A wrong job title is worse than no job title.
  ask(
    "Does it state a role or company that enrichment did not actually establish?",
    (!/^You are /.test(read.opening) || Boolean(profile.role))
    && (!read.opening.includes(" at ") || Boolean(profile.company || read.company)),
  );

  // 5. Reciting their own data back is the mirror this business argues against.
  ask(
    "Is the only specific thing in it their own job title, handed back to them?",
    Boolean(seen) && substantiveWords(seen).some((w) => !read.opening.toLowerCase().includes(w)),
  );

  // 6. A senior reader gives this under a minute.
  const words = body.split(/\s+/).filter(Boolean).length;
  ask("Is it short enough to be read in under a minute?", words >= 60 && words <= 320);

  // 7. The house voice, as far as a machine can see it.
  for (const rule of VOICE) ask(rule.question, !rule.pattern.test(body));

  // 8. A seam a reader can see is a seam that says nobody looked.
  const all = sentences(body);
  ask("Does the same sentence appear twice?", new Set(all).size === all.length);

  // 9. Plain English, which here means no sentence anybody has to re-read.
  ask(
    "Is every sentence plain enough for someone to follow at speed?",
    all.every((s) => s.split(/\s+/).length <= 42),
  );

  // 10. The name we call their company had better be their company.
  const root = domain.split(".")[0]?.toLowerCase() ?? "";
  const named = (read.company ?? "").toLowerCase();
  ask(
    "Is the company we are naming actually the one behind their email address?",
    !named || !root || named.replace(/[^a-z0-9]/g, "").includes(root.replace(/[^a-z0-9]/g, ""))
      || root.replace(/[^a-z0-9]/g, "").includes(named.split(" ")[0].replace(/[^a-z0-9]/g, "")),
  );

  // 11. A verdict on their business is not ours to hand them.
  ask(
    "Does it pass judgement on how established or successful they are?",
    !VERDICTS.some((pattern) => pattern.test(body)),
  );

  // 12. Doom about their business is banned by the house style, in any register.
  ask(
    "Does it tell them their organisation is failing or under strain?",
    !DOOM.some((pattern) => pattern.test(body)),
  );

  // 13. Praise is not a read, and it is what they came here to get away from.
  ask(
    "Does it flatter them instead of observing them?",
    !FLATTERY.some((pattern) => pattern.test(body)),
  );

  // 14. Their stack is a routing signal, not an observation worth reciting.
  ask(
    "Does it recite their infrastructure back at them?",
    !INFRASTRUCTURE.some((tool) => new RegExp(`\\b${tool.replace(".", "\\.")}\\b`, "i").test(body))
    && !STACK_RECITAL.test(body),
  );

  // 15. One clear next step, and nothing else asked of them.
  ask("Does it ask the reader more than one thing?", (body.match(/\?/g) ?? []).length <= 1);

  const outOf = 15 + VOICE.length - 1;
  return { passed: failures.length === 0, score: outOf - failures.length, outOf, failures };
}
