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

const CACHE_KEY = 'ai_news_cache_v2';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Clear old cache keys from previous versions
if (typeof window !== 'undefined') {
  localStorage.removeItem('ai_news_cache');
}

const FALLBACK_HEADLINES: NewsHeadline[] = [
  { title: "[SIGNAL] Claude 3.5 Sonnet outperforms GPT-4o on coding benchmarks — build-vs-buy math just changed", source: "The Verge" },
  { title: "[DECISION TRIGGER] OpenAI cuts API pricing 50% — time to reevaluate your LLM vendor costs", source: "TechCrunch" },
  { title: "[KRISH'S TAKE] 80% of companies using AI != 80% using it well. Most are running demos, not systems", source: "Mindmaker" },
  { title: "[SIGNAL] GitHub Copilot users complete tasks 55.8% faster — real productivity data, not hype", source: "GitHub" },
  { title: "[NOISE] Another AI startup raises $200M to build 'the future of work' — wake me when they ship", source: "TechCrunch" },
  { title: "[DECISION TRIGGER] Google drops Gemini API prices by 40% — your vendor spreadsheet needs updating", source: "Bloomberg" },
  { title: "[SIGNAL] AI agents now handle 60% of tier-1 support tickets at companies that actually deployed them", source: "Forbes" },
  { title: "[KRISH'S TAKE] Everyone's building AI prototypes. Almost nobody is measuring if they work", source: "Mindmaker" },
  { title: "[DECISION TRIGGER] Anthropic launches tool-use API — custom AI workflows just got dramatically easier to build", source: "Wired" },
  { title: "[SIGNAL] HeyGen lets founders create AI video clones that present in 40+ languages", source: "TechCrunch" },
  { title: "[NOISE] AI will replace all jobs by 2030 says person selling AI consulting — sure it will", source: "Forbes" },
  { title: "[SIGNAL] One-person businesses generating $1M+ revenue using AI for sales, support, and fulfillment", source: "WSJ" },
  { title: "[KRISH'S TAKE] Your team is using 14 AI tools. You need 3. The rest is noise", source: "Mindmaker" },
  { title: "[DECISION TRIGGER] AWS launches managed AI agents — build-vs-buy decision just got more nuanced", source: "Reuters" },
  { title: "[SIGNAL] Companies deploying AI in production see 3x ROI vs those stuck in pilot phase", source: "McKinsey" },
  { title: "[KRISH'S TAKE] If your AI strategy is a slide deck, it's not a strategy. Ship something this week", source: "Mindmaker" },
  { title: "[SIGNAL] ElevenLabs voice cloning used by 1M+ creators to scale content without recording", source: "Wired" },
  { title: "[DECISION TRIGGER] Open-source Llama 3 closes the gap with GPT-4 — vendor lock-in risk drops", source: "The Verge" },
  { title: "[NOISE] Enterprise AI adoption hits 80% — but 80% of that is ChatGPT in a browser tab", source: "Gartner" },
  { title: "[SIGNAL] AI agents save small businesses 15+ hours per week on scheduling, email, and ops", source: "Forbes" },
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
