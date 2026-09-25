/**
 * The work email, and what a division is allowed to be.
 *
 * Both pages now ask for the same four things, and both need the same answer to
 * "is this an address we can read a company from". The read is built from the
 * email's domain, so a personal address gives us nothing to read: the gate is
 * honest rather than officious, and the message says so.
 *
 * The domain list is the edge function's, copied. `src/test/work-email.test.ts`
 * holds the two identical, because a gate the page and the server disagree
 * about is worse than no gate: the page would wave somebody through and the
 * server would turn them away after they had typed everything.
 */

import { cleanDomain, isPublicHostname } from "@/lib/domain";
import { FREE_EMAIL_DOMAINS } from "@/lib/freeEmailDomains";

/**
 * The parts of a business someone works in.
 *
 * A fixed set, so what the browser sends stays an allowlisted identifier rather
 * than free text, and so the server can hold the same list. They are the
 * divisions a mid-sized company actually has, named the way the person in them
 * would say it rather than the way an org chart would.
 */
export const DIVISIONS = [
  { id: "leadership", label: "Leadership" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "product", label: "Product" },
  { id: "engineering", label: "Engineering" },
  { id: "operations", label: "Operations" },
  { id: "finance", label: "Finance" },
  { id: "people", label: "People" },
] as const;

export type Division = typeof DIVISIONS[number]["id"];

export const DIVISION_IDS: readonly Division[] = DIVISIONS.map((entry) => entry.id);

export const isDivision = (value: unknown): value is Division =>
  typeof value === "string" && (DIVISION_IDS as readonly string[]).includes(value);

/** The company domain an address belongs to, or "" if it is not an address. */
export function domainFromEmail(email: string): string {
  const at = email.trim().toLowerCase().lastIndexOf("@");
  if (at < 1) return "";
  return cleanDomain(email.trim().toLowerCase().slice(at + 1));
}

/**
 * Mailbox words that name a job, a team or a channel rather than a person.
 *
 * An address containing any of these is not read for a name at all. Words that
 * are also common first names (dev, will, mark) are deliberately left out, so
 * `dev.patel@` still fills in.
 */
const ROLE_MAILBOX_WORDS = new Set([
  "abuse", "account", "accounts", "accounting", "admin", "administrator", "all", "billing", "biz",
  "board", "booking", "bookings", "business", "careers", "ceo", "cfo", "cio", "cmo", "community",
  "company", "compliance", "contact", "contacts", "coo", "cto", "customer", "customers", "demo",
  "design", "digital", "director", "directors", "donotreply", "editor", "editorial", "email",
  "enquiries", "enquiry", "events", "everyone", "facilities", "feedback", "finance", "founder",
  "founders", "cofounder", "general", "global", "group", "growth", "hello", "help", "helpdesk", "hey",
  "hi", "hiring", "hq", "hr", "inquiries", "inquiry", "investor", "investors", "invoices", "ir", "it",
  "jobs", "leadership", "legal", "mail", "management", "marketing", "me", "media", "news",
  "newsletter", "no", "noreply", "office", "online", "operations", "ops", "order", "orders", "owner",
  "partner", "partners", "partnerships", "payments", "people", "postmaster", "pr", "press", "privacy",
  "procurement", "project", "projects", "purchasing", "reception", "recruiting", "recruitment",
  "reply", "sales", "security", "service", "services", "shop", "social", "sponsorship", "staff",
  "store", "studio", "success", "support", "talent", "team", "tech", "test", "uk", "us", "eu",
  "web", "webmaster", "work",
]);

/* Surname particles that join the last name when they sit between two parts.
   The first group is usually written in lower case, the second capitalised. */
const LOWER_PARTICLES = new Set(["van", "von", "der", "den", "ter", "ten", "de"]);
const CAPITAL_PARTICLES = new Set(["da", "di", "del", "della", "du", "la", "le", "dos", "das", "st", "al", "el", "bin", "ibn"]);

const NAME_PART = /^\p{Script=Latin}+(?:['’-]\p{Script=Latin}+)*$/u;

const capitalise = (word: string) =>
  word
    .split(/(['’-])/)
    .map((segment) => (segment.length > 0 && !/['’-]/.test(segment)
      ? segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
      : segment))
    .join("");

const capitaliseSurname = (word: string) => {
  const match = /^mc(\p{Script=Latin}{3,})$/iu.exec(word);
  return match ? `Mc${capitalise(match[1])}` : capitalise(word);
};

/**
 * A first and last name read from the part of a work address before the @,
 * or null when the address does not say.
 *
 * Only a guess the visitor can see and correct, so it errs towards saying
 * nothing: an address with no separator (`anyadivekar@`, `jsmith@`), a role
 * mailbox, digits in the middle, a word from the company's own domain or a
 * shape it cannot place returns null. Hyphens stay inside a name, so
 * `anne-marie@` is one first name rather than two names. A single initial
 * fills only the part it cannot be confused with.
 */
export function nameFromEmail(email: string): { firstName: string; lastName: string } | null {
  const value = email.trim().toLowerCase();
  const at = value.lastIndexOf("@");
  if (at < 1) return null;
  const local = value.slice(0, at).split("+")[0];
  if (!local || /[\s"]/.test(local) || !/[._]/.test(local)) return null;

  const parts = local.split(/[._]+/).filter(Boolean);
  if (parts.length > 0 && /^\d+$/.test(parts[parts.length - 1])) parts.pop();
  if (parts.length > 0) parts[parts.length - 1] = parts[parts.length - 1].replace(/\d+$/, "");
  if (parts.length < 2 || parts.length > 3) return null;
  if (parts.some((part) => !part || part.length > 40 || !NAME_PART.test(part))) return null;

  const companyWords = domainFromEmail(value).split(".").slice(0, -1);
  if (parts.some((part) => ROLE_MAILBOX_WORDS.has(part) || companyWords.includes(part))) return null;

  let first = parts[0];
  let last = parts[parts.length - 1];
  let particle = "";
  if (parts.length === 3) {
    const middle = parts[1];
    if (LOWER_PARTICLES.has(middle)) particle = middle;
    else if (CAPITAL_PARTICLES.has(middle)) particle = capitalise(middle);
    else if (middle.length !== 1) return null;
  }

  if (first.length === 1 && last.length === 1) return null;
  const surname = last.length === 1 ? "" : [particle, capitaliseSurname(last)].filter(Boolean).join(" ");
  first = first.length === 1 ? "" : capitalise(first);
  last = surname;
  return { firstName: first.slice(0, 80), lastName: last.slice(0, 80) };
}

export const isFreeEmailDomain = (domain: string): boolean => FREE_EMAIL_DOMAINS.has(domain);

/**
 * Why we cannot use this address, in the visitor's language, or null if we can.
 *
 * Every one of these is written as a limitation of ours rather than a mistake of
 * theirs, because in the personal-address case that is exactly what it is: the
 * address is perfectly valid and we are the ones who cannot do anything with it.
 */
/**
 * The one problem in this list that is a dead end rather than a typo.
 *
 * Every other message here is answered by fixing what was typed. This one is
 * answered by having a different job: somebody working for themselves, or at a
 * company that runs on a personal address, cannot fix it and should not be
 * asked to. Named so a caller can tell the two apart and offer a person.
 */
export const FREE_EMAIL_PROBLEM =
  "We read your company from your email address, so a personal one gives us nothing to go on. Use your work address and we can do the reading.";

export function workEmailProblem(email: string): string | null {
  const value = email.trim();
  if (!value) return "Add your work email and we will read your company from it.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254) {
    return "That does not look like an email address. Check it and try again.";
  }
  const domain = domainFromEmail(value);
  if (!isPublicHostname(domain)) {
    return "We could not find a company in that address. Try the one you use at work.";
  }
  if (isFreeEmailDomain(domain)) return FREE_EMAIL_PROBLEM;
  return null;
}

/**
 * The same rules without the company in them.
 *
 * Used by the handoff form alone, where somebody is asking to reach a person
 * rather than to have their company read. The work-address rule exists to serve
 * the reading, and once the reading has already failed it is a rule with nothing
 * left to protect: applying it there would turn a rescue into a second refusal.
 */
export function anyEmailProblem(email: string): string | null {
  const value = email.trim();
  if (!value) return "Add an email address we can reply to.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254) {
    return "That does not look like an email address. Check it and try again.";
  }
  return null;
}
