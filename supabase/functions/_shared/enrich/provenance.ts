/** A provider lookup is evidence only when its returned website matches the input. */
export function evidenceHostname(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.port) return null;
    return url.hostname.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  } catch { return null; }
}

/** Owned production aliases only; see project-documentation/07_DEPLOYMENT.md.
 * This never follows or trusts arbitrary redirects, and never rewrites recipients.
 */
export function canonicalResearchDomain(domain: string): string {
  const normalized = evidenceHostname(domain) ?? domain;
  return normalized === 'themindmaker.ai' ? 'mindmake.co' : normalized;
}

export function hasExactDomainEvidence(requested: string, returned: unknown): boolean {
  const expected = evidenceHostname(requested);
  return !!expected && evidenceHostname(returned) === expected;
}

/** Unknown third-party articles must not become facts about a similarly named firm. */
export function isFirstPartyEvidence(requested: string, sourceUrl: unknown): boolean {
  return hasExactDomainEvidence(requested, sourceUrl);
}

const nameWords = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  .replace(/^the /, '').replace(/ (?:inc|incorporated|ltd|limited|llc|plc|corp|corporation)$/, '').trim();

export function sameCompanyName(a: string, b: string): boolean {
  const first = nameWords(a);
  return first.length >= 3 && first === nameWords(b);
}

/** An exact-domain brand record alone can still contain a stale entity label. */
export function companyIdentityCorroborated(
  domain: string,
  brandName: string | undefined,
  independentName: string | undefined,
  firstParty: ReadonlyArray<{ text: string; sourceUrl?: string }>,
): boolean {
  if (!brandName) return false;
  if (independentName) return sameCompanyName(brandName, independentName);
  const name = nameWords(brandName);
  if (name.length < 3) return false;
  return firstParty.some(item => isFirstPartyEvidence(domain, item.sourceUrl)
    && ` ${nameWords(item.text)} `.includes(` ${name} `));
}
/** Only quote the corroborated identity provider's literal description. Never a model paraphrase. */
export function literalCompanyRead(descriptor: unknown, tagline: unknown): string | null {
  for (const value of [descriptor, tagline]) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}
