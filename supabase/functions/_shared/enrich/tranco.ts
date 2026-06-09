/**
 * @file Tranco client for the company-enrichment dossier pipeline.
 * @description Fetches a domain's web-popularity rank from the Tranco list
 * (a research-grade aggregate of the major top-site rankings). The rank is an
 * internal scale signal only: it routes ICP silently and is never recited back
 * to the visitor by Mindy.
 *
 * No auth required. Best-effort: returns null on any failure (never throws).
 *
 * API shape (verified live 2026-06-09):
 *   GET https://tranco-list.eu/api/ranks/domain/{domain}
 *   -> { ranks: [{ date, rank }, ...] }   // newest-first; use the FIRST entry
 */

import type { DossierPartial } from './types.ts';
import { fetchWithTimeout } from '../timeout.ts';
import { retryWithBackoff } from '../retry.ts';
import { createLogger } from '../logger.ts';

const TRANCO_BASE = 'https://tranco-list.eu/api/ranks/domain';
const TIMEOUT_MS = 4000;

interface TrancoRankEntry {
  date?: string;
  rank?: number;
}

interface TrancoResponse {
  ranks?: TrancoRankEntry[];
}

/**
 * Looks up a domain's most-recent Tranco rank.
 *
 * @param domain - A bare registrable domain (e.g. "gong.io"). Caller should have
 *   already normalised via {@link toDomain}; this function does not re-parse.
 * @returns A DossierPartial carrying `scale.trancoRank` plus a 0.8 confidence
 *   under the 'tranco' key, or `null` if the domain has no rank or any error
 *   occurs.
 */
export async function fetchTranco(domain: string): Promise<DossierPartial | null> {
  const logger = createLogger('enrich-tranco');

  if (!domain) {
    logger.warn('No domain supplied to fetchTranco');
    return null;
  }

  try {
    const url = `${TRANCO_BASE}/${encodeURIComponent(domain)}`;

    const res = await retryWithBackoff(() =>
      fetchWithTimeout(url, { headers: { accept: 'application/json' } }, TIMEOUT_MS)
    );

    if (!res.ok) {
      // 404 simply means the domain isn't ranked; treat as a clean miss.
      logger.warn('Tranco lookup non-ok', { domain, status: res.status });
      return null;
    }

    const data = (await res.json()) as TrancoResponse;
    const ranks = data?.ranks;

    if (!Array.isArray(ranks) || ranks.length === 0) {
      logger.info('Tranco returned no ranks', { domain });
      return null;
    }

    // Tranco returns observations newest-first, so the most recent is index 0.
    // Be defensive: if dates are present, pick the entry with the max date.
    const latest = ranks.reduce((best, cur) =>
      (cur?.date && best?.date && cur.date > best.date) ? cur : best, ranks[0]);
    const rank = latest?.rank;

    if (typeof rank !== 'number' || !Number.isFinite(rank) || rank <= 0) {
      logger.info('Tranco latest entry had no usable rank', { domain, latest });
      return null;
    }

    logger.info('Tranco rank resolved', { domain, rank, date: latest?.date });

    return {
      scale: { trancoRank: rank },
      confidence: { tranco: 0.8 },
      tools: ['tranco'],
    };
  } catch (err) {
    logger.error('Tranco fetch failed', {
      domain,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
