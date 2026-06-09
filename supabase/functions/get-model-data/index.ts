/**
 * @file get-model-data Edge Function
 * @description Fetches LLM model benchmarks, pricing, and performance data
 *              from the Artificial Analysis API. Powers the Vendor Landscape widget,
 *              chatbot market data injection, news ticker market pulse, and
 *              live decision artifacts on sprint pages.
 *
 * @secrets ARTIFICIALANALYSIS_API_KEY
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createLogger, extractRequestContext } from '../_shared/logger.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================
// TYPES
// ============================================================

interface ModelData {
  id: string;
  name: string;
  creator: string;
  benchmarkScore: number | null;
  inputPricePerMillion: number | null;
  outputPricePerMillion: number | null;
  tokensPerSecond: number | null;
  timeToFirstToken: number | null;
}

interface ModelDataResponse {
  models: ModelData[];
  timestamp: string;
  cached: boolean;
  source: 'api' | 'fallback';
}

// ============================================================
// IN-MEMORY CACHE (1 hour TTL)
// ============================================================

let cachedData: ModelData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// ============================================================
// STATIC FALLBACK (approximate data for major models)
// ============================================================

const STATIC_FALLBACK: ModelData[] = [
  { id: "claude-opus-4", name: "Claude Opus 4", creator: "Anthropic", benchmarkScore: 1320, inputPricePerMillion: 15, outputPricePerMillion: 75, tokensPerSecond: 24, timeToFirstToken: 2.1 },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", creator: "Anthropic", benchmarkScore: 1290, inputPricePerMillion: 3, outputPricePerMillion: 15, tokensPerSecond: 80, timeToFirstToken: 0.8 },
  { id: "claude-haiku-3.5", name: "Claude 3.5 Haiku", creator: "Anthropic", benchmarkScore: 1180, inputPricePerMillion: 0.8, outputPricePerMillion: 4, tokensPerSecond: 150, timeToFirstToken: 0.4 },
  { id: "gpt-4o", name: "GPT-4o", creator: "OpenAI", benchmarkScore: 1260, inputPricePerMillion: 2.5, outputPricePerMillion: 10, tokensPerSecond: 95, timeToFirstToken: 0.5 },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", creator: "OpenAI", benchmarkScore: 1140, inputPricePerMillion: 0.15, outputPricePerMillion: 0.6, tokensPerSecond: 160, timeToFirstToken: 0.3 },
  { id: "gpt-4.1", name: "GPT-4.1", creator: "OpenAI", benchmarkScore: 1300, inputPricePerMillion: 2, outputPricePerMillion: 8, tokensPerSecond: 100, timeToFirstToken: 0.6 },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", creator: "Google", benchmarkScore: 1310, inputPricePerMillion: 1.25, outputPricePerMillion: 10, tokensPerSecond: 120, timeToFirstToken: 0.6 },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", creator: "Google", benchmarkScore: 1200, inputPricePerMillion: 0.15, outputPricePerMillion: 0.6, tokensPerSecond: 190, timeToFirstToken: 0.2 },
  { id: "llama-4-maverick", name: "Llama 4 Maverick", creator: "Meta", benchmarkScore: 1230, inputPricePerMillion: 0.2, outputPricePerMillion: 0.8, tokensPerSecond: 110, timeToFirstToken: 0.5 },
  { id: "deepseek-v3", name: "DeepSeek V3", creator: "DeepSeek", benchmarkScore: 1250, inputPricePerMillion: 0.27, outputPricePerMillion: 1.1, tokensPerSecond: 70, timeToFirstToken: 0.7 },
  { id: "grok-3", name: "Grok 3", creator: "xAI", benchmarkScore: 1270, inputPricePerMillion: 3, outputPricePerMillion: 15, tokensPerSecond: 85, timeToFirstToken: 0.6 },
  { id: "mistral-large", name: "Mistral Large", creator: "Mistral", benchmarkScore: 1210, inputPricePerMillion: 2, outputPricePerMillion: 6, tokensPerSecond: 90, timeToFirstToken: 0.5 },
];

// ============================================================
// FETCH FROM ARTIFICIAL ANALYSIS API
// ============================================================

const fetchModelData = async (apiKey: string): Promise<ModelData[]> => {
  console.log('🔍 Fetching model data from Artificial Analysis...');

  const response = await fetch('https://artificialanalysis.ai/api/v2/data/llms/models', {
    headers: {
      'x-api-key': apiKey,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'unable to read body');
    throw new Error(`Artificial Analysis API error: ${response.status} - ${errorBody.substring(0, 200)}`);
  }

  const raw = await response.json();
  const rawModels = raw?.data || raw;

  if (!Array.isArray(rawModels) || rawModels.length === 0) {
    throw new Error('No model data in API response');
  }

  // Map API response to our simplified shape
  const models: ModelData[] = rawModels
    .map((m: any): ModelData | null => {
      const name = m.name;
      const creator = m.model_creator?.name || m.model_creator || 'Unknown';
      if (!name) return null;

      // Extract benchmark score, check common field patterns
      const benchmarkScore =
        m.evaluations?.quality_index ??
        m.evaluations?.overall_quality ??
        m.evaluations?.arena_elo ??
        m.evaluations?.chatbot_arena_elo ??
        null;

      // Extract pricing
      const inputPricePerMillion =
        m.pricing?.input_per_million_tokens ??
        m.pricing?.input ??
        m.pricing?.prompt ??
        null;

      const outputPricePerMillion =
        m.pricing?.output_per_million_tokens ??
        m.pricing?.output ??
        m.pricing?.completion ??
        null;

      return {
        id: m.id || m.slug || name.toLowerCase().replace(/\s+/g, '-'),
        name,
        creator,
        benchmarkScore: typeof benchmarkScore === 'number' ? benchmarkScore : null,
        inputPricePerMillion: typeof inputPricePerMillion === 'number' ? inputPricePerMillion : null,
        outputPricePerMillion: typeof outputPricePerMillion === 'number' ? outputPricePerMillion : null,
        tokensPerSecond: typeof m.median_output_tokens_per_second === 'number'
          ? Math.round(m.median_output_tokens_per_second)
          : null,
        timeToFirstToken: typeof m.median_time_to_first_token_seconds === 'number'
          ? Math.round(m.median_time_to_first_token_seconds * 100) / 100
          : null,
      };
    })
    .filter((m): m is ModelData => m !== null)
    // Sort by benchmark score descending, nulls last
    .sort((a, b) => (b.benchmarkScore ?? 0) - (a.benchmarkScore ?? 0));

  console.log(`✅ Parsed ${models.length} models from Artificial Analysis`);
  return models;
};

// ============================================================
// MAIN HANDLER
// ============================================================

serve(async (req) => {
  // CORS preflight. Return an explicit 200 with the cors headers so the
  // browser preflight always has HTTP ok status, matching the working
  // pattern in nervous-decision-machine.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  const respond = (data: ModelDataResponse) =>
    new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  try {
    const { requestId, sessionId } = extractRequestContext(req);
    const logger = createLogger('get-model-data', requestId, sessionId);

    logger.info('Model data request started');

    // Check in-memory cache
    if (cachedData && (Date.now() - cacheTimestamp) < CACHE_TTL) {
      logger.info('Returning cached model data', { modelCount: cachedData.length });
      return respond({
        models: cachedData,
        timestamp: new Date(cacheTimestamp).toISOString(),
        cached: true,
        source: 'api',
      });
    }

    const apiKey = Deno.env.get('ARTIFICIALANALYSIS_API_KEY');
    if (!apiKey) {
      logger.warn('ARTIFICIALANALYSIS_API_KEY not configured, using fallback');
      return respond({
        models: STATIC_FALLBACK,
        timestamp: new Date().toISOString(),
        cached: false,
        source: 'fallback',
      });
    }

    try {
      const models = await fetchModelData(apiKey);
      if (models.length > 0) {
        // Update cache
        cachedData = models;
        cacheTimestamp = Date.now();

        logger.info('API fetch succeeded', { modelCount: models.length });
        return respond({
          models,
          timestamp: new Date().toISOString(),
          cached: false,
          source: 'api',
        });
      }
    } catch (e) {
      logger.error('API fetch failed', { error: e instanceof Error ? e.message : String(e) });
    }

    // Fallback
    logger.info('Using static fallback model data');
    return respond({
      models: STATIC_FALLBACK,
      timestamp: new Date().toISOString(),
      cached: false,
      source: 'fallback',
    });

  } catch (error) {
    // Never surface a 502. Any unexpected failure (including logger or
    // context setup) degrades to a 200 with the static fallback so the
    // homepage price ticker can always render.
    console.error('[get-model-data] Fatal error', error instanceof Error ? error.message : String(error));
    return respond({
      models: STATIC_FALLBACK,
      timestamp: new Date().toISOString(),
      cached: false,
      source: 'fallback',
    });
  }
});
