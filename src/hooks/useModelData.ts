import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ModelData {
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

const CACHE_KEY = 'model_data_cache_v1';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Canonical allowlist in display order. The ticker + dashboard only render
// models whose id matches one of these (or loose-matches by creator + name).
// Update this list when a new frontier model is worth surfacing.
const ALLOWED_MODEL_IDS = [
  "claude-opus-4-7",
  "claude-sonnet-4-6",
  "claude-haiku-4-5",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gpt-5",
  "gpt-5-mini",
] as const;

const FALLBACK_MODELS: ModelData[] = [
  { id: "claude-opus-4-7", name: "Claude Opus 4.7", creator: "Anthropic", benchmarkScore: 1365, inputPricePerMillion: 15, outputPricePerMillion: 75, tokensPerSecond: 22, timeToFirstToken: 2.0 },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", creator: "Anthropic", benchmarkScore: 1335, inputPricePerMillion: 3, outputPricePerMillion: 15, tokensPerSecond: 75, timeToFirstToken: 0.8 },
  { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", creator: "Anthropic", benchmarkScore: 1270, inputPricePerMillion: 1, outputPricePerMillion: 5, tokensPerSecond: 180, timeToFirstToken: 0.3 },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", creator: "Google", benchmarkScore: 1325, inputPricePerMillion: 1.25, outputPricePerMillion: 10, tokensPerSecond: 120, timeToFirstToken: 0.6 },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", creator: "Google", benchmarkScore: 1215, inputPricePerMillion: 0.15, outputPricePerMillion: 0.6, tokensPerSecond: 200, timeToFirstToken: 0.2 },
  { id: "gpt-5", name: "GPT-5", creator: "OpenAI", benchmarkScore: 1370, inputPricePerMillion: 5, outputPricePerMillion: 20, tokensPerSecond: 90, timeToFirstToken: 0.6 },
  { id: "gpt-5-mini", name: "GPT-5 Mini", creator: "OpenAI", benchmarkScore: 1240, inputPricePerMillion: 0.25, outputPricePerMillion: 1, tokensPerSecond: 170, timeToFirstToken: 0.3 },
];

// Filter incoming (live or cached) model data to the curated set, in order.
const filterAllowed = (incoming: ModelData[]): ModelData[] => {
  const byId = new Map(incoming.map((m) => [m.id, m]));
  return ALLOWED_MODEL_IDS.map((id) => byId.get(id)).filter(
    (m): m is ModelData => !!m
  );
};

const loadCache = (): ModelDataResponse | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (!data?.models || !Array.isArray(data.models) || data.models.length === 0) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    if (Date.now() - timestamp > CACHE_DURATION) return null;

    return data;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

export const useModelData = () => {
  const [models, setModels] = useState<ModelData[]>(FALLBACK_MODELS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchModels = async () => {
      try {
        const cachedData = loadCache();
        if (cachedData) {
          if (!cancelled && isMountedRef.current) {
            const filtered = filterAllowed(cachedData.models);
            setModels(filtered.length ? filtered : FALLBACK_MODELS);
          }
          return;
        }

        setIsLoading(true);
        const { data, error: fetchError } = await supabase.functions.invoke('get-model-data');

        if (fetchError) throw fetchError;
        if (cancelled || !isMountedRef.current) return;

        const response = data as ModelDataResponse;
        if (!response.models || response.models.length === 0) return;

        const filtered = filterAllowed(response.models);
        setModels(filtered.length ? filtered : FALLBACK_MODELS);

        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: response,
          timestamp: Date.now(),
        }));
      } catch (err) {
        if (cancelled || !isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch model data');
      } finally {
        if (!cancelled && isMountedRef.current) setIsLoading(false);
      }
    };

    fetchModels();

    return () => { cancelled = true; };
  }, []);

  return { models, isLoading, error };
};
