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

export const isFreeEmailDomain = (domain: string): boolean => FREE_EMAIL_DOMAINS.has(domain);

/**
 * Why we cannot use this address, in the visitor's language, or null if we can.
 *
 * Every one of these is written as a limitation of ours rather than a mistake of
 * theirs, because in the personal-address case that is exactly what it is: the
 * address is perfectly valid and we are the ones who cannot do anything with it.
 */
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
  if (isFreeEmailDomain(domain)) {
    return "We read your company from your email address, so a personal one gives us nothing to go on. Use your work address and we can do the reading.";
  }
  return null;
}
