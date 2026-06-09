/**
 * @file People Data Labs (PDL) company-enrich client for the Mindy dossier pipeline.
 * @description Resolves a registrable domain to firmographics: headcount, size band,
 *   industry, a short descriptor, founding year, and a silent ICP routing signal.
 *   PDL is a 'full'-depth source; it never powers the fast identity gasp.
 *
 * Contract: returns a DossierPartial on success, null on any failure. Never throws.
 * The `scale` layer (employeeCount / sizeBand / icp) is internal routing only and is
 * never recited back to the visitor; only `understanding` copy is user-facing.
 *
 * @see ./types.ts for the Dossier / DossierPartial shape.
 */

import type { DossierPartial } from './types.ts';
import { fetchWithTimeout } from '../timeout.ts';
import { retryWithBackoff } from '../retry.ts';
import { createLogger } from '../logger.ts';

/** PDL company-enrich endpoint. Domain is passed via the `website` query param. */
const PDL_ENRICH_URL = 'https://api.peopledatalabs.com/v5/company/enrich';

/** Per-call ceiling. PDL is one of several parallel full-depth sources. */
const TIMEOUT_MS = 6000;

/** Trim a free-text descriptor to this many characters (whole, with ellipsis). */
const DESCRIPTOR_MAX = 240;

/**
 * Industries / tags that mark a visitor as a capital allocator (fund, family office,
 * PE/VC, asset manager). These route to the `capital` ICP door silently.
 */
const CAPITAL_RE = /venture capital|private equity|investment management|family office|asset management/i;

/**
 * The subset of the PDL company-enrich response we read. PDL returns far more;
 * anything absent is simply skipped. `status` mirrors the HTTP code in the body.
 */
interface PdlCompany {
  status?: number;
  name?: string;
  display_name?: string;
  size?: string; // e.g. "1001-5000"
  employee_count?: number;
  industry?: string;
  founded?: number;
  summary?: string;
  tags?: string[];
}

/**
 * Trim a descriptor to <= DESCRIPTOR_MAX chars without slicing a word in half.
 * Returns undefined for empty/whitespace input so the field is dropped on merge.
 */
function trimDescriptor(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const text = raw.trim();
  if (!text) return undefined;
  if (text.length <= DESCRIPTOR_MAX) return text;
  // Cut on the last word boundary inside the budget, leaving room for the ellipsis.
  const slice = text.slice(0, DESCRIPTOR_MAX - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const body = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${body.replace(/[.,;:]+$/, '')}…`;
}

/**
 * Detect a capital-allocator ICP from the industry string and the tag list.
 * @returns true if any tag or the industry matches the capital pattern.
 */
function isCapitalIcp(industry: string | undefined, tags: string[] | undefined): boolean {
  if (industry && CAPITAL_RE.test(industry)) return true;
  if (Array.isArray(tags)) {
    return tags.some((t) => typeof t === 'string' && CAPITAL_RE.test(t));
  }
  return false;
}

/**
 * Enrich a company from its registrable domain via People Data Labs.
 *
 * Maps into the dossier as:
 *   - scale.employeeCount  ← employee_count
 *   - scale.sizeBand       ← size
 *   - scale.icp            ← 'capital' when industry/tags match the capital pattern
 *   - understanding.industry   ← industry (only when set)
 *   - understanding.descriptor ← summary, trimmed to <= 240 chars
 *   - identity.founded     ← founded
 *
 * confidence.scale is 0.85 when a headcount came back, else omitted. tools is ['pdl'].
 *
 * @param domain Bare registrable domain, e.g. "gong.io" (already normalised by the caller).
 * @returns A DossierPartial, or null on any failure (missing key, non-200, network, parse).
 */
export async function fetchPDL(domain: string): Promise<DossierPartial | null> {
  const logger = createLogger('enrich-pdl');

  const apiKey = Deno.env.get('PEOPLEDATALABS_API_KEY');
  if (!apiKey) {
    logger.error('PEOPLEDATALABS_API_KEY is not set; skipping PDL enrich');
    return null;
  }
  if (!domain) {
    logger.warn('fetchPDL called with empty domain');
    return null;
  }

  try {
    const url = `${PDL_ENRICH_URL}?website=${encodeURIComponent(domain)}`;

    const data = await retryWithBackoff(async () => {
      const res = await fetchWithTimeout(
        url,
        { method: 'GET', headers: { 'X-Api-Key': apiKey } },
        TIMEOUT_MS,
      );

      // PDL returns 404 for an unknown company and 4xx for quota/auth issues.
      // Surface 5xx/429 as throwable so retryWithBackoff can back off; treat other
      // non-2xx as a terminal "no data" by returning a body with a non-200 status.
      if (!res.ok) {
        if (res.status >= 500 || res.status === 429) {
          throw new Error(`PDL request failed: ${res.status}`);
        }
        return { status: res.status } as PdlCompany;
      }

      return (await res.json()) as PdlCompany;
    });

    // The enrich body carries its own status; anything other than 200 means no match.
    if (!data || data.status !== 200) {
      logger.info('PDL returned no usable company', { domain, status: data?.status });
      return null;
    }

    const partial: DossierPartial = { tools: ['pdl'] };
    const identity: NonNullable<DossierPartial['identity']> = {};
    const understanding: NonNullable<DossierPartial['understanding']> = {};
    const scale: NonNullable<DossierPartial['scale']> = {};

    if (typeof data.employee_count === 'number') scale.employeeCount = data.employee_count;
    if (typeof data.size === 'string' && data.size.trim()) scale.sizeBand = data.size.trim();

    if (typeof data.industry === 'string' && data.industry.trim()) {
      understanding.industry = data.industry.trim();
    }

    const descriptor = trimDescriptor(data.summary);
    if (descriptor) understanding.descriptor = descriptor;

    if (typeof data.founded === 'number') identity.founded = data.founded;

    if (isCapitalIcp(data.industry, data.tags)) scale.icp = 'capital';

    // Only attach non-empty layers; mergeDossier() also strips empties, but keeping
    // the partial tidy avoids surfacing bare objects in logs/tests.
    if (Object.keys(identity).length) partial.identity = identity;
    if (Object.keys(understanding).length) partial.understanding = understanding;
    if (Object.keys(scale).length) partial.scale = scale;

    // A headcount is the strongest firmographic signal PDL gives us.
    if (typeof scale.employeeCount === 'number') {
      partial.confidence = { scale: 0.85 };
    }

    logger.info('PDL enrich complete', {
      domain,
      employeeCount: scale.employeeCount,
      sizeBand: scale.sizeBand,
      icp: scale.icp,
    });

    return partial;
  } catch (err) {
    logger.error('PDL enrich failed', {
      domain,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
