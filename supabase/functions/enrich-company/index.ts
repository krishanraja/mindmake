/**
 * @file enrich-company Edge Function (the dossier orchestrator)
 * @description Turns a visitor's work email or domain into a company Dossier so the
 *   on-site guide ("Mindy") can show she already understands the business before
 *   asking a single question. Fans out to the enrichment clients, merges their
 *   partials, derives an internal ICP routing signal, and (at full depth) writes a
 *   one-paragraph synthesis in Krish's operator voice.
 *
 * ---------------------------------------------------------------------------
 * REQUEST  (POST, JSON):
 *   {
 *     "domain"?: string,   // e.g. "gong.io" — accepted raw, normalised internally
 *     "email"?:  string,   // e.g. "ceo@gong.io" — domain is lifted from the address
 *     "name"?:   string,   // e.g. "Gong" — resolved to a domain via Brandfetch search
 *     "depth"?:  "identity" | "full"   // default "full"
 *   }
 *   Provide at least one of `domain` / `email` / `name`. `email`/`domain` win; a
 *   bare `name` is resolved to a domain via Brandfetch search (so a company named
 *   only in conversation still enriches).
 *
 *   depth "identity"  → Brandfetch + Tranco only. The fast (~1s) co-brand paint.
 *   depth "full"      → adds PDL + BuiltWith + Currency, then Gemini/Anthropic synthesis.
 *
 * RESPONSE (200, JSON):
 *   - Resolvable work domain:        the full {@link Dossier} object.
 *   - Free-email domain (gmail etc): { "skipped": "free-email", "dossier": null }
 *     so the front-end degrades gracefully — no gasp, just ask the question.
 *
 * ERRORS:
 *   400 { error }  — no usable domain could be resolved from the body.
 *   404 { error }  — depth "identity" but NO identity layer resolved (hard miss).
 *   405 { error }  — non-POST method.
 *   429 { error }  — per-IP soft rate limit or global request ceiling tripped.
 *
 * INTERNAL-ONLY FIELDS — NEVER RECITED TO THE USER:
 *   `dossier.scale.*` (employeeCount, sizeBand, trancoRank, icp, recommendedMode)
 *   is silent routing for Mindy. It tells the front-end which door/mode to steer
 *   towards. Mindy must never read an employee count, a rank, or an ICP label back
 *   at the visitor. Only `identity`, `understanding`, `currency`, and `synthesis`
 *   are user-facing surfaces.
 *
 * CACHING / ABUSE CONTROLS (per cold start, in-memory, best-effort):
 *   - Result cache keyed by `${domain}:${depth}`, 1-hour TTL. Doubles as a cheap
 *     circuit breaker so a hammered domain isn't re-fanned-out every hit.
 *   - Per-IP soft rate limit: 40 requests / IP / 10 minutes.
 *   - Global REQUEST_CEILING since cold start as a hard backstop.
 *
 * ENV (each missing key just disables its tool — the dossier degrades, it does not
 * fail; a tool with no key simply contributes nothing):
 *   BRANDFETCH_API_KEY, PEOPLEDATALABS_API_KEY, BUILTWITH_API_KEY,
 *   EXA_API_KEY, PERPLEXITY_API_KEY, NEWSAPI_API_KEY, GOOGLE_AI_API_KEY,
 *   ANTHROPIC_API_KEY.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

import {
  type Dossier,
  type Icp,
  emptyDossier,
  mergeDossier,
  toDomain,
  FREE_EMAIL_DOMAINS,
} from '../_shared/enrich/types.ts';
import { fetchBrandfetch, searchBrandDomain } from '../_shared/enrich/brandfetch.ts';
import { fetchPDL } from '../_shared/enrich/pdl.ts';
import { fetchTranco } from '../_shared/enrich/tranco.ts';
import { fetchBuiltWith } from '../_shared/enrich/builtwith.ts';
import { fetchCurrency } from '../_shared/enrich/currency.ts';
import { synthesizeDescriptor } from '../_shared/enrich/synthesize.ts';
import { createLogger } from '../_shared/logger.ts';

// --- CORS / response helpers (mirrors nervous-decision-machine) -------------

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// --- Abuse controls (per cold start, in-memory, best-effort) ----------------

/** Per-IP request timestamps within the sliding window. */
const ipHits = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX_PER_WINDOW = 40; // 40 requests / IP / window

/** Global backstop since the last cold start. */
let totalServed = 0;
const REQUEST_CEILING = 5000;

/** Result cache: `${domain}:${depth}` -> { dossier, ts }. */
interface CacheEntry {
  dossier: Dossier;
  ts: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// --- Latency budgets --------------------------------------------------------

/**
 * Hard wall-clock cap for the whole 'full' fan-out, kept under the ~9s target.
 * If synthesis or a slow tool blows past this, we return what we have so far.
 */
const FULL_DEADLINE_MS = 8500;

// ---------------------------------------------------------------------------

/** Returns the registrable domain from a request body, or null if none usable. */
function resolveDomain(body: { domain?: unknown; email?: unknown }): string | null {
  const email = typeof body.email === 'string' ? body.email : '';
  const domainField = typeof body.domain === 'string' ? body.domain : '';
  // Email wins when it resolves; otherwise fall back to the domain field.
  return toDomain(email) ?? toDomain(domainField);
}

/** Pull a usable per-request IP for the soft rate limiter. */
function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

/**
 * Best-effort ISO-3166 alpha-2 country for the visitor, used to bias enrichment
 * toward the visitor's locale (so a US visitor is not handed a regional subsidiary
 * with the wrong currency). Prefers edge-provided geo headers; falls back to a fast
 * IP lookup; defaults to 'US' so synthesis always has a locale anchor.
 *
 * - Edge geo headers (free, no network): Cloudflare 'cf-ipcountry', Vercel
 *   'x-vercel-ip-country'.
 * - Fallback: geolocate the first 'x-forwarded-for' IP via ipapi.co with a tight
 *   1500ms timeout. Best-effort only; any failure returns the default.
 */
async function resolveVisitorCountry(req: Request): Promise<string> {
  const DEFAULT_COUNTRY = 'US';

  const normalise = (raw: string | null): string | null => {
    const v = (raw ?? '').trim().toUpperCase();
    // ISO alpha-2 only; ignore placeholders like 'XX', 'T1' (Tor), 'ZZ'.
    return /^[A-Z]{2}$/.test(v) && !['XX', 'ZZ', 'T1'].includes(v) ? v : null;
  };

  const header =
    normalise(req.headers.get('cf-ipcountry')) ??
    normalise(req.headers.get('x-vercel-ip-country'));
  if (header) return header;

  // Fall back to a fast IP geolocation; never let it block enrichment.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip && ip !== 'unknown') {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 1500);
      try {
        const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, {
          signal: ctrl.signal,
          headers: { Accept: 'text/plain' },
        });
        if (res.ok) {
          const country = normalise(await res.text());
          if (country) return country;
        }
      } finally {
        clearTimeout(timer);
      }
    } catch {
      // Swallow: geo is a nice-to-have, the default carries us.
    }
  }

  return DEFAULT_COUNTRY;
}

/**
 * Sliding-window per-IP rate check. Records the hit and returns false if the IP
 * has exceeded the window allowance.
 */
function withinRateLimit(ip: string, now: number): boolean {
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX_PER_WINDOW) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

/** A bare company name lifted from the domain root, used when no brand name resolved. */
function domainRootName(domain: string): string {
  const root = domain.split('.')[0] ?? domain;
  return root ? root.charAt(0).toUpperCase() + root.slice(1) : domain;
}

/**
 * Derive the internal ICP + recommended routing mode from the merged scale layer.
 *
 * INTERNAL ONLY. This decides which door/mode the front-end nudges towards; it is
 * never recited to the visitor. Heuristic, deliberately coarse:
 *   - PDL may already have set icp='capital' (fund / family office). Keep it and
 *     route to a Signal Session.
 *   - Otherwise bucket on headcount (preferred) or the size band:
 *       < 50      -> founder       -> bespoke-enablement
 *       50–1000   -> sme           -> bespoke-enablement
 *       > 1000    -> enterprise    -> signal-session
 *   - When we have no headcount at all, lean on Tranco rank as a weak proxy:
 *       top ~30k  -> enterprise    -> signal-session  (well-known site)
 *       else      -> sme           -> bespoke-enablement
 *   - Tranco only NUDGES confidence; it never overrides a real headcount bucket.
 */
function deriveRouting(dossier: Dossier): void {
  const s = dossier.scale;

  // Capital is sticky — a fund stays a fund regardless of headcount.
  if (s.icp === 'capital') {
    if (!s.recommendedMode) s.recommendedMode = 'signal-session';
    return;
  }

  // Respect anything an upstream client already decided.
  if (s.icp && s.recommendedMode) return;

  let icp: Icp | undefined = s.icp;
  let mode: string | undefined = s.recommendedMode;

  const headcount =
    typeof s.employeeCount === 'number' ? s.employeeCount : sizeBandToCount(s.sizeBand);

  if (typeof headcount === 'number') {
    if (headcount < 50) {
      icp ??= 'founder';
      mode ??= 'bespoke-enablement';
    } else if (headcount <= 1000) {
      icp ??= 'sme';
      mode ??= 'bespoke-enablement';
    } else {
      icp ??= 'enterprise';
      mode ??= 'signal-session';
    }
  } else if (typeof s.trancoRank === 'number') {
    // No firmographics — use popularity as a weak size proxy.
    if (s.trancoRank > 0 && s.trancoRank <= 30000) {
      icp ??= 'enterprise';
      mode ??= 'signal-session';
    } else {
      icp ??= 'sme';
      mode ??= 'bespoke-enablement';
    }
  }

  if (icp) s.icp = icp;
  if (mode) s.recommendedMode = mode;

  // Tranco nudges confidence only: a strongly-ranked site lifts our scale read.
  if (typeof s.trancoRank === 'number' && s.trancoRank > 0 && s.trancoRank <= 50000) {
    const cur = dossier.confidence.scale ?? 0;
    dossier.confidence.scale = Math.min(1, Math.max(cur, cur ? cur + 0.05 : 0.5));
  }
}

/**
 * Lower bound of a PDL-style size band (e.g. "1001-5000" -> 1001, "10001+" -> 10001).
 * Returns undefined when the band can't be parsed.
 */
function sizeBandToCount(band: string | undefined): number | undefined {
  if (!band) return undefined;
  const m = band.match(/\d[\d,]*/);
  if (!m) return undefined;
  const n = Number.parseInt(m[0].replace(/,/g, ''), 10);
  return Number.isFinite(n) ? n : undefined;
}

/** Whether any usable identity was resolved (name or logo). */
function hasIdentity(dossier: Dossier): boolean {
  return Boolean(dossier.identity.name || dossier.identity.logoUrl);
}

/** Race a promise against a deadline; resolves to `fallback` if the deadline wins. */
function withDeadline<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  const logger = createLogger('enrich-company');

  // Global backstop.
  if (totalServed >= REQUEST_CEILING) {
    return json({ error: 'High demand right now. Try again later.' }, 429);
  }

  // Per-IP soft rate limit.
  const now = Date.now();
  const ip = clientIp(req);
  if (!withinRateLimit(ip, now)) {
    return json({ error: 'Too many lookups. Give it a minute.' }, 429);
  }

  // Parse body.
  let body: { domain?: unknown; email?: unknown; name?: unknown; depth?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Resolve domain. Email/domain win; otherwise resolve a bare company NAME to a
  // domain via Brandfetch search so the dossier still lights up when the visitor
  // only ever said their company name in conversation (no work email).
  let domain = resolveDomain(body);
  let searched: { domain: string; name?: string; iconUrl?: string } | null = null;
  if (!domain && typeof body.name === 'string' && body.name.trim()) {
    searched = await searchBrandDomain(body.name.trim());
    if (searched) domain = searched.domain;
  }
  if (!domain) {
    return json(
      { error: 'Give me a work email, a company domain, or a company name.' },
      400,
    );
  }

  // Free-email domains: degrade gracefully, no gasp.
  if (FREE_EMAIL_DOMAINS.has(domain)) {
    return json({ skipped: 'free-email', dossier: null });
  }

  // Depth.
  const depth: 'identity' | 'full' = body.depth === 'identity' ? 'identity' : 'full';

  // Visitor country biases synthesis toward the right entity/locale (best-effort).
  // Only needed for the synthesis step, so skip the lookup on the identity fast path.
  const visitorCountry = depth === 'full' ? await resolveVisitorCountry(req) : 'US';

  // Cache hit?
  const cacheKey = `${domain}:${depth}`;
  const cached = cache.get(cacheKey);
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    logger.info('cache hit', { domain, depth });
    return json(cached.dossier);
  }

  const started = Date.now();

  try {
    const dossier = emptyDossier(domain, depth);

    // --- Layer 1: name-bearing identity sources first ----------------------
    // Brandfetch + (full) PDL resolve the company name needed by the currency
    // layer; Tranco rides along here since it is cheap and identity-relevant.
    const identityCalls: Array<Promise<unknown>> = [
      fetchBrandfetch(domain).then((p) => mergeDossier(dossier, p)),
      fetchTranco(domain).then((p) => mergeDossier(dossier, p)),
    ];
    if (depth === 'full') {
      identityCalls.push(fetchPDL(domain).then((p) => mergeDossier(dossier, p)));
    }
    await Promise.allSettled(identityCalls);

    // Seed from the name-search hit when Brandfetch-by-domain left gaps (e.g. the
    // brand record is thin): a name and a CDN icon are better than nothing and
    // keep the co-brand alive.
    if (searched) {
      if (!dossier.identity.name && searched.name) {
        dossier.identity.name = searched.name;
      }
      if (
        !dossier.identity.logoUrl &&
        !dossier.identity.iconUrl &&
        searched.iconUrl
      ) {
        dossier.identity.iconUrl = searched.iconUrl;
      }
    }

    // Hard miss on the fast path: identity depth with nothing to show.
    if (depth === 'identity' && !hasIdentity(dossier)) {
      logger.warn('identity depth resolved no identity', { domain });
      return json({ error: 'I could not find anything on that domain.' }, 404);
    }

    // --- Layer 2 (full only): name-dependent + remaining sources -----------
    if (depth === 'full') {
      // Currency needs a company name; prefer the resolved brand name, else the
      // domain root. BuiltWith is name-independent and runs alongside it.
      const companyName = dossier.identity.name || domainRootName(domain);

      const elapsed = Date.now() - started;
      const remaining = Math.max(1000, FULL_DEADLINE_MS - elapsed);

      await withDeadline(
        Promise.allSettled([
          fetchCurrency(companyName, domain).then((p) => mergeDossier(dossier, p)),
          fetchBuiltWith(domain).then((p) => mergeDossier(dossier, p)),
        ]),
        remaining,
        [] as PromiseSettledResult<unknown>[],
      );
    }

    // --- Internal routing (never recited to the user) ----------------------
    deriveRouting(dossier);

    // --- Synthesis (full only, best-effort, null ok) -----------------------
    if (depth === 'full' && hasIdentity(dossier)) {
      const elapsed = Date.now() - started;
      const remaining = Math.max(1500, FULL_DEADLINE_MS - elapsed);
      const line = await withDeadline(
        synthesizeDescriptor(dossier, visitorCountry).catch(() => null),
        remaining,
        null,
      );
      if (line) dossier.synthesis = line;
    }

    // --- Finalise meta -----------------------------------------------------
    dossier.meta.tools = [...new Set(dossier.meta.tools)];
    dossier.meta.ms = Date.now() - started;

    // Cache and account.
    cache.set(cacheKey, { dossier, ts: Date.now() });
    totalServed += 1;

    logger.info('dossier assembled', {
      domain,
      depth,
      visitorCountry,
      ms: dossier.meta.ms,
      tools: dossier.meta.tools,
      name: dossier.identity.name,
      icp: dossier.scale.icp,
      recommendedMode: dossier.scale.recommendedMode,
      hasSynthesis: Boolean(dossier.synthesis),
    });

    return json(dossier);
  } catch (err) {
    logger.error('enrich-company failed', {
      domain,
      depth,
      error: err instanceof Error ? err.message : String(err),
    });
    return json({ error: 'Enrichment hit a snag. Try again in a moment.' }, 500);
  }
});
