/**
 * @file BuiltWith enrichment client for the Mindy company-dossier pipeline.
 * @description Resolves a domain's technology stack via the BuiltWith Domain API and
 *   returns the handful of recognisable, CMO-legible tools (analytics, CRM, marketing
 *   automation, CDP, ABM, ads, payments, frameworks, CMS) as `understanding.stack`.
 *
 *   BuiltWith returns ~2400 raw technologies per domain, most of it infrastructure and
 *   front-end noise (jQuery, nginx, Cloudflare, Font Awesome, reCAPTCHA, CrUX, DNS/SPF,
 *   currency markers, shipping descriptors). The whole job of this module is the filter:
 *   we keep only the stuff a chief marketing officer would nod at and recognise, capped
 *   at 12 names, so Mindy can say "I can see you run Segment and Marketo" instead of
 *   reciting a server-config dump.
 *
 *   Contract: returns a DossierPartial, NEVER throws. On any failure (no key, non-200,
 *   network error, empty result) it logs and returns null so the orchestrator can carry on.
 *
 * @see ./types.ts for the Dossier / DossierPartial contract.
 */

import type { DossierPartial } from './types.ts';
import { fetchWithTimeout } from '../timeout.ts';
import { retryWithBackoff } from '../retry.ts';
import { createLogger } from '../logger.ts';

const TIMEOUT_MS = 7000;
const STACK_CAP = 12;
/** Min meaningful techs before we attach a confidence signal. */
const CONFIDENCE_THRESHOLD = 3;

/** ---- Minimal shape of the slice of the BuiltWith response we read. ---- */
interface BwTechnology {
  Name?: string;
  Tag?: string;
  Categories?: string[];
  Description?: string;
}
interface BwPath {
  Technologies?: BwTechnology[];
}
interface BwResponse {
  Results?: Array<{ Result?: { Paths?: BwPath[] } }>;
  Errors?: Array<{ Message?: string; Lookup?: string }>;
}

/**
 * BuiltWith `Tag` values that map to genuinely meaningful product categories.
 * (Verified live against gong.io, 2026-06-09. BuiltWith has no literal `crm`,
 * `marketing-automation`, `cdp` or `cdn`-vs-`cdns` consistency, so we lean on a
 * mix of Tag, Categories, and a curated name allowlist rather than Tag alone.)
 */
const MEANINGFUL_TAGS = new Set([
  'analytics', // Segment, Marketo, 6sense, Clearbit, Mixpanel, Amplitude, HubSpot, Salesforce...
  'framework', // Next.js, Ruby on Rails, ASP.NET Core, Material UI, Apollo GraphQL...
  'ads', // LinkedIn Ads, The Trade Desk, AdRoll, StackAdapt, Microsoft Advertising...
  'cms', // WordPress, Sanity, Contentful, Zendesk Guide, Intercom Help...
  'payment', // Stripe, PayPal, Apple Pay, Shopify Pay...
  'shop', // Shopify, Spree, Mirakl, Thinkific...
]);

/**
 * `Tag` values that are pure plumbing and never reach the user. Anything tagged
 * here is dropped before we even look at the name (unless its NAME is on the
 * recognised-tools allowlist below, which rescues e.g. Intercom/Drift from `widgets`).
 */
const NOISE_TAGS = new Set([
  'javascript', // jQuery and friends
  'hosting',
  'cdn',
  'cdns',
  'ssl',
  'mx',
  'ns',
  'link',
  'robots',
  'feeds',
  'language',
  'copyright',
  'registrar',
  'mapping',
  'media',
  'mobile',
  'operations',
  'web server',
  'server',
  'web master',
]);

/**
 * Recognised, CMO-legible product names. These are rescued even when BuiltWith files
 * them under a noisy Tag like `widgets` (where Intercom, Drift, Chili Piper, Algolia,
 * Marketo Forms, WalkMe etc. live next to Font Awesome and reCAPTCHA). Matched as a
 * case-insensitive substring against the tech Name.
 */
const RECOGNISED_NAMES = [
  // Chat / conversational / scheduling
  'intercom', 'drift', 'chili piper', 'livechat', 'snapengage', 'zendesk', 'zopim',
  'qualified', 'livestorm', 'walkme', 'storylane', 'get stream', 'tidio', 'olark',
  // CRM / marketing automation / forms
  'salesforce', 'hubspot', 'marketo', 'pardot', 'act-on', 'eloqua', 'mailchimp',
  'klaviyo', 'braze', 'iterable', 'customer.io', 'activecampaign',
  // CDP / data / analytics
  'segment', 'rudderstack', 'mparticle', 'tealium', 'mixpanel', 'amplitude', 'heap',
  'fullstory', 'hotjar', 'crazyegg', 'lucky orange', 'mouseflow', 'pendo', 'optimizely',
  'plausible', 'matomo', 'snowplow',
  // ABM / intent / enrichment
  '6sense', 'demandbase', 'clearbit', 'zoominfo', 'apollo', 'leadfeeder', 'bombora',
  'madkudu', 'mutiny', 'folloze', 'highspot', 'gong',
  // Search / commerce / infra-as-product
  'algolia', 'shopify', 'stripe', 'braintree', 'adyen', 'recurly', 'chargebee',
  'docusign', 'onetrust', 'cookiebot', 'usercentrics',
  // Frameworks / dev platforms worth a nod
  'next.js', 'nuxt', 'svelte', 'remix', 'gatsby', 'vercel', 'netlify',
  'ruby on rails', 'django', 'laravel', 'webflow', 'contentful', 'sanity', 'storyblok',
];

/**
 * Name substrings that are descriptors, plumbing, or generic infra dressed up under a
 * meaningful Tag (e.g. "Shopify US Dollar" under `shop`, "Google Conversion Tracking"
 * under `analytics`, "* Schema" / "* Token" under `framework`). Always dropped.
 */
const NAME_DENY_SUBSTRINGS = [
  // generic web / front-end noise
  'jquery', 'nginx', 'cloudflare', 'font awesome', 'google font', 'modernizr', 'imgur',
  'godaddy', 'recaptcha', 'crux', 'commoncrawl', 'common crawl', 'twemoji', 'fastclick',
  'gravatar', 'lorem ipsum', 'httrack', 'fingerprint', 'wp ', 'wordpress weekly',
  'wordpress monthly', 'wordpress daily', 'yoast', 'autoptimize', 'smush', 'elementor',
  'contact form 7', 'wpml', 'column shortcodes', 'google code prettify', 'katex',
  'accelerated mobile pages', 'amp ', 'embedly', 'addthis', 'sumome', 'hello bar',
  'global site tag', 'google tag manager',
  // conversion / pixel / tag plumbing (not "a tool", just tracking glue)
  'conversion tracking', 'conversion linker', 'conversion', 'pixel', 'remarketing',
  'website universal tag', 'insights tag', 'event tracking', 'doubleclick', 'floc',
  'ip anonymization', 'domain insights', 'universal analytics', 'analytics classic',
  'ads.txt', 'ads txt', 'direct ads', 'consent', 'cmp ', 'privacy control', 'optanon',
  'us privacy', 'gdpr', 'ketch', 'cheq', 'proofpoint', 'turnstile',
  // schema.org / tokens / verification / proxies under `framework`
  'schema', 'token', 'verification', 'proxy', 'vegur', 'openresty',
  // currencies / shipping / product-count descriptors under `shop`/`payment`
  'dollar', 'euro', 'pound sterling', 'yen', 'riyal', 'rupee', 'shipping', 'ships to',
  'shopify products', 'shopify theme', 'brooklyn theme', 'custom theme', 'coming soon',
  'gift cards', 'discounts', 'geolocation', 'account', 'order limits', 'min',
  // error monitoring / observability that no CMO recognises (keep stack marketing-legible)
  'honeybadger', 'rollbar', 'bugsnag', 'stackify', 'opentelemetry', 'dynatrace',
  'new relic', 'incident.io',
  // activity / metadata descriptors
  'activity', 'less than', 'top 5', 'top 1', 'top 10', 'top 50', 'top 100', 'covid',
];

/**
 * Category strings (case-insensitive substring) that mark a tool as marketing-legible
 * even if its Tag is generic. Used to rescue meaningful tech that landed under `widgets`
 * or a borderline Tag without being on the name allowlist.
 */
const MEANINGFUL_CATEGORY_HINTS = [
  'crm', 'marketing automation', 'customer data', 'analytics', 'a/b testing',
  'tag management', 'live chat', 'help desk', 'email marketing', 'advertising',
  'retargeting', 'personalization', 'personalisation', 'lead generation',
  'account based', 'ecommerce', 'e-commerce', 'payment', 'framework',
  'content management', 'search', 'web personalization',
];

/**
 * Vendor families where BuiltWith emits several near-duplicate product rows
 * (e.g. "Marketo", "Marketo Mail", "Marketo Forms"; "Shopify", "Shopify Pay").
 * A CMO reads the brand once, so we collapse all variants to a single canonical
 * label and keep only the first survivor of each family. Matched case-insensitively
 * as a substring; the value is the clean label we surface.
 */
const VENDOR_FAMILIES: Array<{ match: string; label: string }> = [
  { match: 'marketo', label: 'Marketo' },
  { match: 'hubspot', label: 'HubSpot' },
  { match: 'salesforce', label: 'Salesforce' },
  { match: 'google analytics', label: 'Google Analytics' },
  { match: 'shopify', label: 'Shopify' },
  { match: 'zendesk', label: 'Zendesk' },
  { match: 'segment', label: 'Segment' },
  { match: '6sense', label: '6sense' },
  { match: 'cloudflare', label: 'Cloudflare' },
  { match: 'facebook', label: 'Facebook' },
  { match: 'linkedin', label: 'LinkedIn' },
  { match: 'twitter', label: 'Twitter' },
  { match: 'stackadapt', label: 'StackAdapt' },
  { match: 'appnexus', label: 'AppNexus' },
];

/**
 * Maps a tech name to its canonical vendor identity. Returns a stable key (for
 * dedupe) and a display label. Non-family names map to themselves.
 */
function canonicalVendor(name: string): { key: string; label: string } {
  const n = name.toLowerCase();
  for (const fam of VENDOR_FAMILIES) {
    if (n.includes(fam.match)) return { key: fam.match, label: fam.label };
  }
  return { key: n, label: name };
}

const lc = (s: string | undefined): string => (s ?? '').toLowerCase();

/** True if the tech name contains any denied substring. */
function isDeniedName(name: string): boolean {
  const n = lc(name);
  return NAME_DENY_SUBSTRINGS.some((bad) => n.includes(bad));
}

/** True if the tech name is on the recognised-tools allowlist. */
function isRecognisedName(name: string): boolean {
  const n = lc(name);
  return RECOGNISED_NAMES.some((good) => n.includes(good));
}

/** True if any of the tech's categories signal a marketing-legible product. */
function hasMeaningfulCategory(categories?: string[]): boolean {
  if (!categories?.length) return false;
  const joined = categories.join(' | ').toLowerCase();
  return MEANINGFUL_CATEGORY_HINTS.some((hint) => joined.includes(hint));
}

/**
 * Decide whether a single technology survives the filter.
 *
 * Order of operations:
 *   1. No name -> out.
 *   2. Name on the denylist -> out (kills descriptors/plumbing even under a good Tag).
 *   3. Name on the recognised-tools allowlist -> in (rescues martech from noisy Tags).
 *   4. Tag is a known noise Tag -> out.
 *   5. Tag is a meaningful Tag -> in.
 *   6. Otherwise, in only if Categories signal a marketing-legible product.
 */
function isMeaningful(t: BwTechnology): boolean {
  const name = t.Name?.trim();
  if (!name) return false;
  if (isDeniedName(name)) return false;
  if (isRecognisedName(name)) return true;

  const tag = lc(t.Tag);
  if (NOISE_TAGS.has(tag)) return false;
  if (MEANINGFUL_TAGS.has(tag)) return true;

  return hasMeaningfulCategory(t.Categories);
}

/**
 * Rank survivors so the 12-name cap keeps the most recognisable tools first.
 * Recognised-name allowlist hits rank highest, then meaningful-Tag hits, then
 * category-only rescues. Within a tier, original order is preserved (stable sort).
 */
function rankScore(t: BwTechnology): number {
  if (isRecognisedName(t.Name ?? '')) return 0;
  if (MEANINGFUL_TAGS.has(lc(t.Tag))) return 1;
  return 2;
}

/**
 * Fetches and filters a domain's technology stack from BuiltWith.
 *
 * @param domain - A bare registrable domain (e.g. "gong.io"). Caller normalises via toDomain().
 * @returns A DossierPartial carrying `understanding.stack` (<=12 meaningful tech names),
 *   `confidence.builtwith`, and `tools:['builtwith']`. Returns null on any failure or when
 *   no meaningful tech survives the filter. Never throws.
 */
export async function fetchBuiltWith(domain: string): Promise<DossierPartial | null> {
  const logger = createLogger('enrich:builtwith').child({ domain });

  const apiKey = Deno.env.get('BUILTWITH_API_KEY');
  if (!apiKey) {
    logger.warn('BUILTWITH_API_KEY not set; skipping');
    return null;
  }
  if (!domain) {
    logger.warn('no domain provided; skipping');
    return null;
  }

  const url =
    `https://api.builtwith.com/v21/api.json?KEY=${encodeURIComponent(apiKey)}` +
    `&LOOKUP=${encodeURIComponent(domain)}`;

  try {
    const data = await retryWithBackoff(async () => {
      const res = await fetchWithTimeout(url, { headers: { accept: 'application/json' } }, TIMEOUT_MS);
      if (!res.ok) {
        // Surface the status so retry.ts can decide if 5xx/429 is worth another go.
        throw new Error(`BuiltWith HTTP ${res.status}`);
      }
      return (await res.json()) as BwResponse;
    });

    // BuiltWith reports per-lookup problems in Errors[] even on a 200.
    if (data.Errors?.length) {
      logger.warn('BuiltWith returned lookup errors', {
        errors: data.Errors.map((e) => e.Message).filter(Boolean),
      });
    }

    const paths = data.Results?.[0]?.Result?.Paths ?? [];
    if (paths.length === 0) {
      logger.info('no technology paths for domain');
      return null;
    }

    // 1. Flatten all Technologies across all Paths.
    const all: BwTechnology[] = [];
    for (const p of paths) {
      for (const tech of p.Technologies ?? []) all.push(tech);
    }

    // 2. Dedupe by Name (first occurrence wins).
    const byName = new Map<string, BwTechnology>();
    for (const tech of all) {
      const name = tech.Name?.trim();
      if (name && !byName.has(name)) byName.set(name, tech);
    }
    const unique = [...byName.values()];

    // 3. Filter to meaningful, recognisable tech.
    const meaningful = unique.filter(isMeaningful);

    // 4. Rank (stable) so the cap keeps the most recognisable names.
    const ranked = meaningful
      .map((t, i) => ({ t, i, score: rankScore(t) }))
      .sort((a, b) => a.score - b.score || a.i - b.i)
      .map((x) => x.t);

    // 5. Collapse same-vendor variants (Marketo / Marketo Mail / Marketo Forms ->
    //    one "Marketo") so the cap surfaces distinct vendors, not duplicate strings.
    const seenVendors = new Set<string>();
    const stack: string[] = [];
    for (const tech of ranked) {
      const { key, label } = canonicalVendor(tech.Name!.trim());
      if (seenVendors.has(key)) continue;
      seenVendors.add(key);
      stack.push(label);
      if (stack.length >= STACK_CAP) break;
    }

    if (stack.length === 0) {
      logger.info('no meaningful tech survived the filter', {
        rawTechs: all.length,
        unique: unique.length,
      });
      return null;
    }

    logger.info('extracted stack', {
      rawTechs: all.length,
      unique: unique.length,
      meaningful: meaningful.length,
      stackCount: stack.length,
    });

    return {
      understanding: { stack },
      confidence: {
        builtwith: stack.length >= CONFIDENCE_THRESHOLD ? 0.6 : 0.3,
      },
      tools: ['builtwith'],
    };
  } catch (err) {
    logger.error('BuiltWith enrichment failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
