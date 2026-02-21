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
  { title: "95% of enterprise AI initiatives fail due to workforce literacy gaps, not technology", source: "Gartner" },
  { title: "Companies investing in AI training see 66% average productivity gains across teams", source: "McKinsey" },
  { title: "78% of employees use unauthorized AI tools at work — Shadow AI grows unchecked", source: "Gartner" },
  { title: "AI-skilled workers command 25-56% salary premiums over non-AI peers", source: "HBR" },
  { title: "63% of employers now cite AI skills gaps as primary barrier to business growth", source: "WEF" },
  { title: "New hires with AI training reach expert-level performance in 2 months vs 8 months", source: "MIT Tech Review" },
  { title: "GitHub Copilot users complete tasks 55.8% faster with 84% more successful builds", source: "GitHub" },
  { title: "75% of workers use AI without training — 70% receive zero workplace guidance", source: "McKinsey" },
  { title: "92 million jobs face displacement by 2030 while 170 million new roles emerge", source: "WEF" },
  { title: "Companies with structured AI governance deploy AI systems 2x faster", source: "Gartner" },
  { title: "AI job postings grew 37.5% year-over-year — 12.5x faster than overall market", source: "LinkedIn" },
  { title: "Software developers with AI tools complete 126% more projects per quarter", source: "Bloomberg" },
  { title: "Only 5% of organizations are reskilling their workforce at scale despite 95% demand", source: "WEF" },
  { title: "Employees at companies with required AI training are 89% more likely to report positive impact", source: "McKinsey" },
  { title: "Average organization runs 65-75 GenAI apps with 80-90% completely unmanaged", source: "Gartner" },
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
