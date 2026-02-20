import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsHeadline {
  title: string;
  source: string;
}

interface AINewsResponse {
  headlines: NewsHeadline[];
  timestamp: string;
  provider?: 'lovable' | 'openai' | 'fallback';
  fallback?: boolean;
}

const CACHE_KEY = 'ai_news_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const FALLBACK_HEADLINES: NewsHeadline[] = [
  { title: "[SIGNAL]: Microsoft mandates AI fluency for all managers by Q3", source: "Bloomberg" },
  { title: "[DECISION TRIGGER]: Google cuts Gemini API pricing 40% \u2014 reevaluate vendor costs", source: "Financial Times" },
  { title: "[KRISH'S TAKE]: 80% of companies using AI \u2260 80% using it well", source: "Mindmaker" },
  { title: "[SIGNAL]: Walmart cuts 1,200 middle-management roles after AI workflow rollout", source: "WSJ" },
  { title: "[NOISE]: Another AI startup raises $50M with no enterprise customers", source: "Mindmaker" },
  { title: "[DECISION TRIGGER]: EU AI Act compliance deadline hits enterprise vendors", source: "Financial Times" },
  { title: "[SIGNAL]: JPMorgan deploys AI to automate 50% of internal reporting", source: "Bloomberg" },
  { title: "[KRISH'S TAKE]: Your AI strategy isn't a strategy if it's just a vendor list", source: "Mindmaker" },
  { title: "[SIGNAL]: 67% of C-suite say AI governance is now a board-level agenda item", source: "McKinsey" },
  { title: "[DECISION TRIGGER]: AWS announces enterprise AI credits \u2014 build-vs-buy just shifted", source: "WSJ" },
  { title: "[NOISE]: McKinsey publishes another AI readiness framework nobody will use", source: "Mindmaker" },
  { title: "[SIGNAL]: Fortune 500 CAIO appointments up 300% in 12 months", source: "HBR" },
  { title: "[KRISH'S TAKE]: The leaders who win aren't adopting AI \u2014 they're deciding what to use it for", source: "Mindmaker" },
  { title: "[DECISION TRIGGER]: Salesforce raises AI feature pricing 25% \u2014 check your contract", source: "Bloomberg" },
  { title: "[SIGNAL]: Companies with AI governance frameworks show 2x faster deployment", source: "Gartner" },
];

// Safe cache loading with validation
const loadCache = (): AINewsResponse | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    const { data, timestamp } = parsed;
    
    // Validate cache structure
    if (!data?.headlines || !Array.isArray(data.headlines) || data.headlines.length === 0) {
      console.warn('Invalid cache structure, clearing');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    // Check cache age
    if (Date.now() - timestamp > CACHE_DURATION) {
      console.log('Cache expired');
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Cache read error:', err);
    localStorage.removeItem(CACHE_KEY); // Clear corrupted cache
    return null;
  }
};

export const useAINewsTicker = () => {
  const [headlines, setHeadlines] = useState<NewsHeadline[]>(FALLBACK_HEADLINES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    const fetchNews = async () => {
      try {
        // Check cache first
        const cachedData = loadCache();
        if (cachedData) {
          console.log('✅ Using cached AI news');
          if (cachedData.provider) {
            console.log(`Provider: ${cachedData.provider}`);
          }
          if (!cancelled && isMountedRef.current) {
            setHeadlines(cachedData.headlines);
          }
          return;
        }

        // Fetch fresh headlines
        console.log('🔄 Fetching fresh AI news...');
        const { data, error: fetchError } = await supabase.functions.invoke('get-ai-news');

        if (fetchError) {
          console.error('Error fetching AI news:', fetchError);
          throw fetchError;
        }

        if (cancelled || !isMountedRef.current) return; // Component unmounted or cancelled, don't update state

        const newsData = data as AINewsResponse;
        
        // Log provider info
        if (newsData.provider) {
          console.log(`✅ AI News Provider: ${newsData.provider}`);
        }
        if (newsData.fallback) {
          console.warn('⚠️ Using fallback headlines');
        }
        
        // Validate response
        if (!newsData.headlines || newsData.headlines.length === 0) {
          console.warn('Empty headlines received, keeping fallback');
          return;
        }
        
        // Update headlines only if still mounted and not cancelled
        if (!cancelled && isMountedRef.current) {
          setHeadlines(newsData.headlines);
          
          // Cache the results
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: newsData,
            timestamp: Date.now()
          }));
        }

      } catch (err) {
        if (cancelled || !isMountedRef.current) return; // Component unmounted or cancelled, don't update state
        console.error('Error in useAINewsTicker:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        // Keep showing fallback headlines on error
      }
    };

    fetchNews();
    
    return () => {
      cancelled = true;
    };
  }, []);

  return { headlines, isLoading, error };
};
