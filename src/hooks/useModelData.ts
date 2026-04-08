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

const FALLBACK_MODELS: ModelData[] = [
  { id: "claude-opus-4", name: "Claude Opus 4", creator: "Anthropic", benchmarkScore: 1320, inputPricePerMillion: 15, outputPricePerMillion: 75, tokensPerSecond: 24, timeToFirstToken: 2.1 },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", creator: "Anthropic", benchmarkScore: 1290, inputPricePerMillion: 3, outputPricePerMillion: 15, tokensPerSecond: 80, timeToFirstToken: 0.8 },
  { id: "gpt-4o", name: "GPT-4o", creator: "OpenAI", benchmarkScore: 1260, inputPricePerMillion: 2.5, outputPricePerMillion: 10, tokensPerSecond: 95, timeToFirstToken: 0.5 },
  { id: "gpt-4.1", name: "GPT-4.1", creator: "OpenAI", benchmarkScore: 1300, inputPricePerMillion: 2, outputPricePerMillion: 8, tokensPerSecond: 100, timeToFirstToken: 0.6 },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", creator: "Google", benchmarkScore: 1310, inputPricePerMillion: 1.25, outputPricePerMillion: 10, tokensPerSecond: 120, timeToFirstToken: 0.6 },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", creator: "Google", benchmarkScore: 1200, inputPricePerMillion: 0.15, outputPricePerMillion: 0.6, tokensPerSecond: 190, timeToFirstToken: 0.2 },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", creator: "OpenAI", benchmarkScore: 1140, inputPricePerMillion: 0.15, outputPricePerMillion: 0.6, tokensPerSecond: 160, timeToFirstToken: 0.3 },
  { id: "deepseek-v3", name: "DeepSeek V3", creator: "DeepSeek", benchmarkScore: 1250, inputPricePerMillion: 0.27, outputPricePerMillion: 1.1, tokensPerSecond: 70, timeToFirstToken: 0.7 },
  { id: "llama-4-maverick", name: "Llama 4 Maverick", creator: "Meta", benchmarkScore: 1230, inputPricePerMillion: 0.2, outputPricePerMillion: 0.8, tokensPerSecond: 110, timeToFirstToken: 0.5 },
  { id: "grok-3", name: "Grok 3", creator: "xAI", benchmarkScore: 1270, inputPricePerMillion: 3, outputPricePerMillion: 15, tokensPerSecond: 85, timeToFirstToken: 0.6 },
];

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
            setModels(cachedData.models);
          }
          return;
        }

        setIsLoading(true);
        const { data, error: fetchError } = await supabase.functions.invoke('get-model-data');

        if (fetchError) throw fetchError;
        if (cancelled || !isMountedRef.current) return;

        const response = data as ModelDataResponse;
        if (!response.models || response.models.length === 0) return;

        setModels(response.models);

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
