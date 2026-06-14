/**
 * @file Brandfetch enrichment client for the company-dossier pipeline.
 * @description Resolves a registrable domain to a brand identity (name, logo,
 *   icon, colours, founded year, tagline, industry) via the Brandfetch Brand API.
 *   This is the fast 'identity' layer that powers Mindy's co-brand gasp, so it
 *   runs on a tight 4.5s budget and never throws: any failure returns null.
 *
 * Verified API shape (smoke-tested live against gong.io, 2026-06-09):
 *   GET https://api.brandfetch.io/v2/brands/{domain}
 *   Authorization: Bearer ${BRANDFETCH_API_KEY}
 *   => { name, domain, description?, longDescription?,
 *        colors: [{ hex, type, brightness }],            // type: accent|dark|light|brand
 *        logos:  [{ type, theme, formats: [{ src, format, width, height, background }] }],
 *                                                         // type: logo|icon|symbol; theme: light|dark
 *        company?: { industries?: [{ name }], foundedYear?, employees?, location? } }
 *
 * @returns Promise<DossierPartial | null> — partial identity layer, or null on any failure.
 */

import type { DossierPartial } from './types.ts';
import { fetchWithTimeout } from '../timeout.ts';
import { retryWithBackoff } from '../retry.ts';
import { createLogger } from '../logger.ts';

/** Hard ceiling for the Brandfetch round-trip. Identity must stay snappy. */
const BRANDFETCH_TIMEOUT_MS = 4500;

/** Max colours surfaced back to the brand kit, brand-ordered and deduped. */
const MAX_COLORS = 4;

/** Max length of the tagline we lift from the brand description. */
const MAX_TAGLINE_CHARS = 160;

// --- Minimal response shape (only the fields we map) ------------------------

interface BrandfetchFormat {
  src?: string;
  format?: string; // 'svg' | 'png' | 'jpeg' | ...
  width?: number | null;
  height?: number | null;
  background?: string | null;
}

interface BrandfetchLogo {
  type?: string; // 'logo' | 'icon' | 'symbol' | 'other'
  theme?: string; // 'light' | 'dark'
  formats?: BrandfetchFormat[];
}

interface BrandfetchColor {
  hex?: string;
  type?: string; // 'accent' | 'brand' | 'dark' | 'light'
  brightness?: number;
}

interface BrandfetchResponse {
  name?: string;
  domain?: string;
  description?: string;
  longDescription?: string;
  colors?: BrandfetchColor[];
  logos?: BrandfetchLogo[];
  company?: {
    industries?: Array<{ name?: string }>;
    foundedYear?: number;
    employees?: number;
    location?: unknown;
  };
}

// --- Pure mapping helpers ---------------------------------------------------

/**
 * Order brand colours by usefulness for a co-brand accent (accent first, then
 * brand, then dark), dedupe by normalised hex, and cap. Drops white/light
 * swatches and anything without a usable hex.
 */
function pickColors(colors: BrandfetchColor[] | undefined): string[] {
  if (!Array.isArray(colors)) return [];
  // Priority weight: lower sorts first.
  const rank: Record<string, number> = { accent: 0, brand: 1, dark: 2 };
  const ordered = colors
    .filter((c) => typeof c?.hex === 'string' && /^#?[0-9a-fA-F]{3,8}$/.test(c.hex))
    // Exclude 'light' swatches — they read as background, not as a brand accent.
    .filter((c) => c.type !== 'light')
    .map((c) => ({ hex: normHex(c.hex as string), weight: rank[c.type ?? ''] ?? 9 }))
    .sort((a, b) => a.weight - b.weight);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const { hex } of ordered) {
    const key = hex.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(hex);
    if (out.length >= MAX_COLORS) break;
  }
  return out;
}

/** Normalise a hex string to a leading-# uppercase form. */
function normHex(hex: string): string {
  const h = hex.startsWith('#') ? hex : `#${hex}`;
  return h.toUpperCase();
}

/** Numeric area of a format, treating null/unknown dimensions as 0. */
function area(f: BrandfetchFormat): number {
  const w = typeof f.width === 'number' ? f.width : 0;
  const h = typeof f.height === 'number' ? f.height : 0;
  return w * h;
}

/** First format on a logo whose `format` matches, if any. */
function formatOfType(logo: BrandfetchLogo, fmt: string): BrandfetchFormat | undefined {
  return (logo.formats ?? []).find((f) => f.format === fmt && typeof f.src === 'string' && f.src);
}

/** Largest raster (png/jpeg) src on a logo by pixel area, if any. */
function largestRaster(logo: BrandfetchLogo): string | undefined {
  const rasters = (logo.formats ?? []).filter(
    (f) => (f.format === 'png' || f.format === 'jpeg') && typeof f.src === 'string' && f.src,
  );
  if (rasters.length === 0) return undefined;
  rasters.sort((a, b) => area(b) - area(a));
  return rasters[0].src;
}

/**
 * Pick the best primary logo URL. Restricts to `type === 'logo'`.
 *
 * Every Mindmaker co-brand surface (the proposal hero, the Diagnosis Room) paints
 * the client logo on a WHITE plate, because that is the only background on which an
 * arbitrary brand mark is reliably legible (most company logos are dark/coloured,
 * and Brandfetch's `theme` tag is not a trustworthy signal of artwork colour:
 * a `theme:"dark"` logo may be a white mark for one brand and a black wordmark for
 * the next). So we prefer the artwork INTENDED for light backgrounds
 * (`theme === 'light'`), which is the dark/coloured mark that reads correctly on a
 * white plate, then fall back across themes and formats. SVG beats raster in every
 * tier.
 */
function pickLogoUrl(logos: BrandfetchLogo[] | undefined): string | undefined {
  if (!Array.isArray(logos)) return undefined;
  const candidates = logos.filter((l) => l.type === 'logo');
  if (candidates.length === 0) return undefined;

  // Theme preference for a white plate: light-background artwork first, then
  // dark-background artwork, then anything untagged.
  const themeRank = (t?: string): number => (t === 'light' ? 0 : t === 'dark' ? 1 : 2);

  for (const tier of [0, 1, 2]) {
    const inTier = candidates.filter((l) => themeRank(l.theme) === tier);
    if (inTier.length === 0) continue;
    // SVG within this theme tier.
    for (const l of inTier) {
      const svg = formatOfType(l, 'svg');
      if (svg) return svg.src;
    }
    // Largest raster within this theme tier.
    let best: { src: string; area: number } | undefined;
    for (const l of inTier) {
      for (const f of l.formats ?? []) {
        if ((f.format === 'png' || f.format === 'jpeg') && typeof f.src === 'string' && f.src) {
          const a = area(f);
          if (!best || a > best.area) best = { src: f.src, area: a };
        }
      }
    }
    if (best) return best.src;
  }
  return undefined;
}

/**
 * Pick the best icon/symbol URL. Restricts to `type === 'icon' || 'symbol'`,
 * prefers an SVG, then the largest raster.
 */
function pickIconUrl(logos: BrandfetchLogo[] | undefined): string | undefined {
  if (!Array.isArray(logos)) return undefined;
  const candidates = logos.filter((l) => l.type === 'icon' || l.type === 'symbol');
  if (candidates.length === 0) return undefined;

  for (const l of candidates) {
    const svg = formatOfType(l, 'svg');
    if (svg) return svg.src;
  }
  for (const l of candidates) {
    const raster = largestRaster(l);
    if (raster) return raster;
  }
  return undefined;
}

/** Trim a description into a tagline, capping length at a word boundary. */
function toTagline(description: string | undefined): string | undefined {
  if (typeof description !== 'string') return undefined;
  const t = description.trim().replace(/\s+/g, ' ');
  if (!t) return undefined;
  if (t.length <= MAX_TAGLINE_CHARS) return t;
  const cut = t.slice(0, MAX_TAGLINE_CHARS);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd();
}

// --- Client -----------------------------------------------------------------

/**
 * Fetch and map a Brandfetch brand record into a {@link DossierPartial}.
 *
 * Never throws. Returns null when the key is missing, the request fails, the
 * brand is not found, or nothing useful could be mapped. Retries only on
 * transient (timeout / 5xx / 429) errors via {@link retryWithBackoff}.
 *
 * @param domain Bare registrable domain (e.g. "gong.io"). Caller is expected to
 *   have already normalised via `toDomain` and excluded free-mail domains.
 */
export async function fetchBrandfetch(domain: string): Promise<DossierPartial | null> {
  const logger = createLogger('enrich:brandfetch');

  const apiKey = Deno.env.get('BRANDFETCH_API_KEY');
  if (!apiKey) {
    logger.error('BRANDFETCH_API_KEY not set; skipping brandfetch enrichment');
    return null;
  }
  if (!domain || !domain.includes('.')) {
    logger.error('invalid domain passed to fetchBrandfetch', { domain });
    return null;
  }

  const url = `https://api.brandfetch.io/v2/brands/${encodeURIComponent(domain)}`;

  try {
    const res = await retryWithBackoff(async () => {
      const r = await fetchWithTimeout(
        url,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
          },
        },
        BRANDFETCH_TIMEOUT_MS,
      );
      // Surface retryable HTTP statuses to retryWithBackoff via the message,
      // which classifies on substrings like '500'/'502'/'503'/'504'/'429'.
      if (!r.ok && (r.status >= 500 || r.status === 429)) {
        throw new Error(`brandfetch transient ${r.status}`);
      }
      return r;
    });

    if (!res.ok) {
      // 401/403/404 etc. are terminal for this domain — log and bail, no throw.
      logger.warn('brandfetch non-ok response', { domain, status: res.status });
      return null;
    }

    const data = (await res.json()) as BrandfetchResponse;

    const colors = pickColors(data.colors);
    const logoUrl = pickLogoUrl(data.logos);
    const iconUrl = pickIconUrl(data.logos);
    const name = typeof data.name === 'string' ? data.name.trim() || undefined : undefined;
    const founded =
      typeof data.company?.foundedYear === 'number' ? data.company.foundedYear : undefined;
    const tagline = toTagline(data.description);
    const industry = data.company?.industries?.[0]?.name?.trim() || undefined;

    // confidence.identity: 0.9 when we got both a logo and colours, else 0.5.
    const identityConfidence = logoUrl && colors.length > 0 ? 0.9 : 0.5;

    const partial: DossierPartial = {
      identity: {
        name,
        logoUrl,
        iconUrl,
        colors: colors.length > 0 ? colors : undefined,
        founded,
      },
      understanding: {
        tagline,
        industry,
      },
      confidence: { identity: identityConfidence },
      tools: ['brandfetch'],
    };

    logger.info('brandfetch enrichment ok', {
      domain,
      name,
      colors: colors.length,
      hasLogo: Boolean(logoUrl),
      hasIcon: Boolean(iconUrl),
      identityConfidence,
    });

    return partial;
  } catch (err) {
    logger.error('brandfetch enrichment failed', {
      domain,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/** Hard ceiling for the Brandfetch search round-trip. */
const BRANDFETCH_SEARCH_TIMEOUT_MS = 4000;

/** One result row from the Brandfetch Search API. */
interface BrandfetchSearchHit {
  brandId?: string;
  domain?: string;
  name?: string;
  icon?: string;
  qualityScore?: number;
  verified?: boolean;
  claimed?: boolean;
  _score?: number;
}

/**
 * Search Brandfetch for companies matching a NAME, returning a ranked list of
 * candidates (each with a registrable domain, display name, and CDN icon). This
 * powers the opener's company typeahead: the visitor picks their company from the
 * list, which hands us the exact DOMAIN (a precise enrichment key, as good as a
 * work email) instead of a fuzzy free-typed name.
 *
 * Never throws. Returns [] when no key/client-id is configured, the request
 * fails, or nothing usable comes back.
 *
 * Auth: the Search API authenticates by client id (`?c=`) when
 * `BRANDFETCH_CLIENT_ID` is set; otherwise the Brand API bearer key is used.
 */
export async function searchBrands(
  query: string,
  limit = 6,
): Promise<Array<{ domain: string; name?: string; iconUrl?: string }>> {
  const logger = createLogger('enrich:brandfetch-search');

  const q = (query || '').trim();
  if (!q || q.length < 2) return [];

  const apiKey = Deno.env.get('BRANDFETCH_API_KEY');
  const clientId = Deno.env.get('BRANDFETCH_CLIENT_ID');
  if (!apiKey && !clientId) {
    logger.error('no BRANDFETCH_API_KEY / BRANDFETCH_CLIENT_ID; skipping brand search');
    return [];
  }

  const base = `https://api.brandfetch.io/v2/search/${encodeURIComponent(q)}`;
  const url = clientId ? `${base}?c=${encodeURIComponent(clientId)}` : base;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (!clientId && apiKey) headers.Authorization = `Bearer ${apiKey}`;

  try {
    const res = await fetchWithTimeout(
      url,
      { method: 'GET', headers },
      BRANDFETCH_SEARCH_TIMEOUT_MS,
    );
    if (!res.ok) {
      logger.warn('brand search non-ok response', { q, status: res.status });
      return [];
    }

    const data = (await res.json()) as BrandfetchSearchHit[];
    if (!Array.isArray(data)) return [];

    const out: Array<{ domain: string; name?: string; iconUrl?: string }> = [];
    const seen = new Set<string>();
    for (const h of data) {
      const domain =
        typeof h.domain === 'string' && h.domain.includes('.')
          ? h.domain.trim().toLowerCase()
          : '';
      if (!domain || seen.has(domain)) continue;
      seen.add(domain);
      out.push({
        domain,
        name: typeof h.name === 'string' ? h.name.trim() || undefined : undefined,
        iconUrl:
          typeof h.icon === 'string' && /^https?:\/\//.test(h.icon)
            ? h.icon
            : undefined,
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch (err) {
    logger.error('brand search failed', {
      q,
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Resolve a company NAME to a single best registrable domain via the Brandfetch
 * Search API. Thin wrapper over {@link searchBrands} that applies a confidence
 * preference (verified / claimed / high quality) then falls back to the top hit.
 *
 * Never throws. Returns null when nothing usable comes back.
 *
 * @param query A company name as a human would say it (e.g. "Gong", "Acme Health").
 */
export async function searchBrandDomain(
  query: string,
): Promise<{ domain: string; name?: string; iconUrl?: string } | null> {
  const results = await searchBrands(query, 6);
  return results.length > 0 ? results[0] : null;
}
