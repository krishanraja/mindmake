/**
 * @file Currency enrichment client for the Mindy dossier pipeline.
 * @description Gathers up to 3 recent, dated, sourced "what they shipped lately"
 *   items for a company's currency layer. This is what lets Mindy reference a
 *   visitor's actual recent launches instead of generic flattery.
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
import { fetchWithTimeout } from '../timeout.ts';
import { createLogger } from '../logger.ts';

const logger = createLogger('enrich-currency');

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
  return collapsed.slice(0, MAX_TEXT_LEN - 1).trimEnd() + '…';
}

/**
 * Perplexity (primary): a two-sentence, dated summary of recent shipping.
 * @returns a single CurrencyItem, or null on any failure / empty content.
 */
async function fetchPerplexity(company: string, domain: string): Promise<CurrencyItem | null> {
  const key = Deno.env.get('PERPLEXITY_API_KEY');
  if (!key) {
    logger.warn('PERPLEXITY_API_KEY missing, skipping perplexity');
    return null;
  }

  try {
    const prompt =
      `In two sentences, what has ${company} (${domain}) recently launched, ` +
      `announced, or shipped in 2025-2026? Include a date if known. Be specific.`;

    const res = await fetchWithTimeout(
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

    const citations: string[] | undefined = data?.citations;
    return {
      text: tidy(content),
      sourceUrl: Array.isArray(citations) ? citations[0] : undefined,
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
async function fetchExa(company: string): Promise<CurrencyItem[]> {
  const key = Deno.env.get('EXA_API_KEY');
  if (!key) {
    logger.warn('EXA_API_KEY missing, skipping exa');
    return [];
  }

  try {
    const res = await fetchWithTimeout(
      'https://api.exa.ai/search',
      {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `${company} product launch announcement 2026`,
          numResults: 3,
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
      .filter((r) => r?.title && r?.url)
      .slice(0, 2)
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
async function fetchNewsApi(company: string): Promise<CurrencyItem[]> {
  const key = Deno.env.get('NEWSAPI_API_KEY');
  if (!key) {
    logger.warn('NEWSAPI_API_KEY missing, skipping newsapi');
    return [];
  }

  try {
    const url =
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(company)}` +
      `&pageSize=3&language=en&sortBy=publishedAt&apiKey=${key}`;

    const res = await fetchWithTimeout(url, {}, PROVIDER_MS);

    if (!res.ok) {
      logger.warn('newsapi non-ok', { status: res.status });
      return [];
    }

    const data = await res.json();
    const articles: Array<{ title?: string; url?: string; publishedAt?: string }> =
      Array.isArray(data?.articles) ? data.articles : [];

    const first = articles.find((a) => a?.title && a?.url);
    if (!first) return [];

    return [{
      text: tidy(first.title!),
      sourceUrl: first.url,
      date: first.publishedAt,
      source: 'newsapi',
    }];
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
): Promise<DossierPartial | null> {
  if (!company || !domain) {
    logger.warn('fetchCurrency called without company/domain', { company, domain });
    return null;
  }

  // Hard wall-clock cap for the whole layer so one slow provider can't sink it.
  const overallTimeout = new Promise<'timeout'>((resolve) =>
    setTimeout(() => resolve('timeout'), OVERALL_MS),
  );

  const work = Promise.allSettled([
    fetchPerplexity(company, domain),
    fetchExa(company),
    fetchNewsApi(company),
  ]);

  const raced = await Promise.race([work, overallTimeout]);

  if (raced === 'timeout') {
    logger.warn('currency layer hit overall timeout', { company, domain, ms: OVERALL_MS });
    return null;
  }

  const [perplexityRes, exaRes, newsRes] = raced;
  const tools: string[] = [];
  const merged: CurrencyItem[] = [];

  // Order matters: perplexity first so its citation wins any sourceUrl dedupe.
  if (perplexityRes.status === 'fulfilled' && perplexityRes.value) {
    tools.push('perplexity');
    merged.push(perplexityRes.value);
  }
  if (exaRes.status === 'fulfilled' && exaRes.value.length) {
    tools.push('exa');
    merged.push(...exaRes.value);
  }
  if (newsRes.status === 'fulfilled' && newsRes.value.length) {
    tools.push('newsapi');
    merged.push(...newsRes.value);
  }

  // Dedupe by sourceUrl (items without a URL are always kept), then cap.
  const seen = new Set<string>();
  const items: CurrencyItem[] = [];
  for (const item of merged) {
    if (item.sourceUrl) {
      if (seen.has(item.sourceUrl)) continue;
      seen.add(item.sourceUrl);
    }
    items.push(item);
    if (items.length >= MAX_ITEMS) break;
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
