/**
 * @file Currency enrichment client for the company dossier pipeline.
 * @description Gathers up to 3 recent, dated, sourced "what they shipped lately"
 *   items for a company's currency layer. This is what lets the company read
 *   reference a visitor's actual recent launches instead of generic flattery.
 *
 *   Strategy (all best-effort, never throws):
 *     - Perplexity (primary):   one tight summary item with a citation URL.
 *     - Exa (secondary):        up to 2 recent press/blog items with real dates.
 *     - NewsAPI (tertiary):     up to 1 item if anything turns up (often empty).
 *   All three run in parallel via Promise.allSettled under a single 8s budget.
 *   Results are deduped by sourceUrl and capped at 3.
 *
 * Contract: returns Promise<DossierPartial | null>. Returns null only when the
 * whole thing fails or yields nothing; otherwise returns { currency, confidence,
 * tools }. Any single provider failing just drops its contribution.
 */

import type { CurrencyItem, DossierPartial } from './types.ts';
import { defaultEnrichRuntime, type EnrichRuntime } from "./runtime.ts";
import { isFirstPartyEvidence } from './provenance.ts';

export interface CurrencyOptions {
  runtime?: EnrichRuntime;
  /** Opt-in URL discovery for research packs; snippets are never accepted as facts. */
  coverage?: boolean;
  from?: string;
  to?: string;
  query?: string;
  maxItems?: number;
}
const allowed = (domain: string, url: unknown, options: CurrencyOptions) =>
  typeof url === "string" && (options.coverage ? /^https:\/\//.test(url) : isFirstPartyEvidence(domain, url));

/** Overall wall-clock budget for the whole currency layer. */
const OVERALL_MS = 8000;
/** Per-provider fetch timeout, kept under the overall budget. */
const PROVIDER_MS = 7000;
/** Max items returned in the currency layer. */
const MAX_ITEMS = 3;
/** Max length of any item's text, to keep the dossier tight. */
const MAX_TEXT_LEN = 220;

/** Trim and collapse whitespace, then hard-cap to MAX_TEXT_LEN with an ellipsis. */
function tidy(text: string): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= MAX_TEXT_LEN) return collapsed;
  return collapsed.slice(0, MAX_TEXT_LEN - 1).trimEnd() + 'â€¦';
}

/** Strip the markdown emphasis and numbered citation markers chat models emit. */
function stripModelMarkup(text: string): string {
  return text
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/\[\d+\]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * A usable currency signal states a fact about the company. When the model
 * finds nothing it narrates its search instead ("I couldn't verify any
 * launch in the provided results"); that meta-talk must never reach a
 * visitor or the operator digest, so the item is dropped entirely.
 */
function isUsableSignal(text: string): boolean {
  if (!text || text.includes('?')) return false;
  return !/\b(I could(?: not|n't)|I can(?:not|'t| not)|I was unable|unable to (?:find|verify|confirm)|could(?: not|n't) (?:find|verify|confirm)|no (?:specific |verifiable |public )?(?:information|results|evidence|announcements?)|provided (?:search )?results|search results|as an AI)\b/i.test(text);
}

/**
 * Perplexity (primary): a two-sentence, dated summary of recent shipping.
 * @returns a single CurrencyItem, or null on any failure / empty content.
 */
async function fetchPerplexity(company: string, domain: string, options: CurrencyOptions, runtime: EnrichRuntime): Promise<CurrencyItem | null> {
  const logger = runtime.logger;
  const key = runtime.env('PERPLEXITY_API_KEY');
  if (!key) {
    logger.warn('PERPLEXITY_API_KEY missing, skipping perplexity');
    return null;
  }

  try {
    const prompt =
      `In two sentences, what has ${company} (${domain}) recently launched, ` +
      `announced, or shipped ${options.from ? `between ${options.from} and ${options.to}` : "recently"}? ${options.query ?? ""} Include a date if known. Be specific.`;

    const res = await runtime.request(
      'https://api.perplexity.ai/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: prompt }],
        }),
      },
      PROVIDER_MS,
    );

    if (!res.ok) {
      logger.warn('perplexity non-ok', { status: res.status });
      return null;
    }

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content || !content.trim()) return null;

    const cleaned = stripModelMarkup(content);
    if (!isUsableSignal(cleaned)) {
      logger.info('perplexity returned meta-talk, dropping item', { company });
      return null;
    }

    const citations: string[] | undefined = data?.citations;
    const sourceUrl = citations?.find((url) => allowed(domain, url, options));
    if (!sourceUrl) return null;
    return {
      text: tidy(cleaned),
      sourceUrl,
      source: 'perplexity',
    };
  } catch (err) {
    logger.error('perplexity failed', { error: String(err) });
    return null;
  }
}

/**
 * Exa (secondary): up to 2 recent, real-dated press/blog items.
 * @returns an array of CurrencyItems (possibly empty); never throws.
 */
async function fetchExa(company: string, domain: string, options: CurrencyOptions, runtime: EnrichRuntime): Promise<CurrencyItem[]> {
  const logger = runtime.logger;
  const key = runtime.env('EXA_API_KEY');
  if (!key) {
    logger.warn('EXA_API_KEY missing, skipping exa');
    return [];
  }

  try {
    const res = await runtime.request(
      'https://api.exa.ai/search',
      {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `${company} ${domain} ${options.query ?? "product launch announcement 2026"}`,
          ...(!options.coverage ? { includeDomains: [domain] } : {}),
          ...(options.from ? { startPublishedDate: options.from } : {}),
          ...(options.to ? { endPublishedDate: options.to } : {}),
          numResults: options.coverage ? 8 : 3,
          type: 'auto',
        }),
      },
      PROVIDER_MS,
    );

    if (!res.ok) {
      logger.warn('exa non-ok', { status: res.status });
      return [];
    }

    const data = await res.json();
    const results: Array<{ title?: string; url?: string; publishedDate?: string }> =
      Array.isArray(data?.results) ? data.results : [];

    return results
      .filter((r) => r?.title && allowed(domain, r.url, options))
      .slice(0, options.coverage ? 8 : 2)
      .map((r): CurrencyItem => ({
        text: tidy(r.title!),
        sourceUrl: r.url,
        date: r.publishedDate,
        source: 'exa',
      }));
  } catch (err) {
    logger.error('exa failed', { error: String(err) });
    return [];
  }
}

/**
 * NewsAPI (tertiary, best-effort): up to 1 item. Often sparse or empty.
 * @returns an array with 0 or 1 CurrencyItem; never throws.
 */
async function fetchNewsApi(company: string, domain: string, options: CurrencyOptions, runtime: EnrichRuntime): Promise<CurrencyItem[]> {
  const logger = runtime.logger;
  const key = runtime.env('NEWSAPI_API_KEY');
  if (!key) {
    logger.warn('NEWSAPI_API_KEY missing, skipping newsapi');
    return [];
  }

  try {
    const end = new Date(options.to ?? Date.now());
    const floor = new Date(end.getTime() - 29 * 86400000).toISOString();
    const from = options.from && Date.parse(options.from) > Date.parse(floor) ? options.from : floor;
    const url =
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(company)}` +
      `&pageSize=${options.coverage ? 8 : 3}&language=en&sortBy=publishedAt` +
      `&from=${encodeURIComponent(from)}` +
      (options.to ? `&to=${encodeURIComponent(options.to)}` : "");

    const res = await runtime.request(url, { headers: { "X-Api-Key": key } }, PROVIDER_MS);

    if (res.status === 426) return []; // Developer-plan limits make this provider unavailable.
    if (!res.ok) {
      logger.warn('newsapi non-ok', { status: res.status });
      return [];
    }

    const data = await res.json();
    const articles: Array<{ title?: string; url?: string; publishedAt?: string }> =
      Array.isArray(data?.articles) ? data.articles : [];

    return articles.filter(a => a?.title && allowed(domain, a.url, options))
      .slice(0, options.coverage ? 8 : 1).map(a => ({
        text: tidy(a.title!), sourceUrl: a.url, date: a.publishedAt, source: 'newsapi' as const,
      }));
  } catch (err) {
    logger.error('newsapi failed', { error: String(err) });
    return [];
  }
}

/**
 * Build the currency layer of a company dossier.
 *
 * Runs Perplexity, Exa and NewsAPI in parallel under an 8s overall budget,
 * dedupes the merged items by sourceUrl (in source-priority order: perplexity,
 * exa, newsapi), and caps at 3 items.
 *
 * @param company - The company's display name (e.g. "Gong").
 * @param domain  - The bare registrable domain (e.g. "gong.io").
 * @returns A DossierPartial with the currency layer, or null on total failure /
 *   no items found. Never throws.
 */
export async function fetchCurrency(
  company: string,
  domain: string,
  options: CurrencyOptions = {},
): Promise<DossierPartial | null> {
  const runtime = options.runtime ?? defaultEnrichRuntime("enrich-currency");
  const logger = runtime.logger;
  if (!company || !domain) {
    logger.warn('fetchCurrency called without company/domain', { company, domain });
    return null;
  }

  // Hard wall-clock cap for the whole layer so one slow provider can't sink it.
  let timer: ReturnType<typeof setTimeout> | undefined;
  const overallTimeout = new Promise<'timeout'>(resolve => { timer = setTimeout(() => resolve('timeout'), OVERALL_MS); });

  const work = Promise.allSettled([
    fetchExa(company, domain, options, runtime),
    fetchNewsApi(company, domain, options, runtime),
    options.coverage ? fetchPerplexity(company, domain, options, runtime) : Promise.resolve(null),
  ]);

  const raced = await Promise.race([work, overallTimeout]);
  clearTimeout(timer);

  if (raced === 'timeout') {
    logger.warn('currency layer hit overall timeout', { company, domain, ms: OVERALL_MS });
    return null;
  }

  const [exaRes, newsRes, perplexityRes] = raced;
  const tools: string[] = [];
  const merged: CurrencyItem[] = [];

  if (exaRes.status === 'fulfilled' && exaRes.value.length) {
    tools.push('exa');
    merged.push(...exaRes.value);
  }
  if (newsRes.status === 'fulfilled' && newsRes.value.length) {
    tools.push('newsapi');
    merged.push(...newsRes.value);
  }

  if (perplexityRes.status === "fulfilled" && perplexityRes.value) {
    tools.push("perplexity"); merged.push(perplexityRes.value);
  }
  // Dedupe by sourceUrl (items without a URL are always kept), then cap.
  const seen = new Set<string>();
  const items: CurrencyItem[] = [];
  for (const item of merged) {
    if (!allowed(domain, item.sourceUrl, options)) continue;
    if (item.sourceUrl) {
      if (seen.has(item.sourceUrl)) continue;
      seen.add(item.sourceUrl);
    }
    items.push(item);
    if (items.length >= Math.min(options.maxItems ?? MAX_ITEMS, 15)) break;
  }

  if (items.length === 0) {
    logger.info('currency layer found nothing', { company, domain, tools });
    return null;
  }

  logger.info('currency layer assembled', { company, domain, count: items.length, tools });

  return {
    currency: items,
    confidence: { currency: items.length ? 0.7 : 0 },
    tools,
  };
}
