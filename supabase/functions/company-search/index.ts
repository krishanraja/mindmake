/**
 * @file company-search Edge Function
 * @description A thin, fast typeahead for the Diagnosis Room opener. Given a
 *   partial company NAME, returns a short ranked list of matching companies
 *   (display name + registrable domain + CDN icon) via the Brandfetch Search API.
 *
 *   The visitor picks their company from this list, which hands the client the
 *   exact DOMAIN — a precise enrichment key, as reliable as a work email and far
 *   lower friction. The client then calls `enrich-company` with that domain.
 *
 * ## Request (POST, application/json)
 *   { "query": string }   // 2+ chars
 *
 * ## Response (200, application/json)
 *   { "results": [ { "name"?: string, "domain": string, "iconUrl"?: string } ] }
 *
 * Empty/short query or any upstream failure returns `{ "results": [] }` (200) so
 * the typeahead degrades to "just type your decision" rather than erroring.
 *
 * Env: BRANDFETCH_API_KEY (or BRANDFETCH_CLIENT_ID). Rate limit: 80 / IP / 5 min.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { searchBrands } from '../_shared/enrich/brandfetch.ts';
import { createLogger } from '../_shared/logger.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// Per-IP sliding-window rate limit (in-memory, best-effort).
const ipHits = new Map<string, number[]>();
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX = 80;

function allow(ip: string, now: number): boolean {
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown';
  if (!allow(ip, Date.now())) return json({ results: [] });

  let body: { query?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ results: [] });
  }

  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (query.length < 2) return json({ results: [] });

  const logger = createLogger('company-search');
  try {
    const results = await searchBrands(query, 6);
    return json({ results });
  } catch (err) {
    logger.error('company-search failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    return json({ results: [] });
  }
});
