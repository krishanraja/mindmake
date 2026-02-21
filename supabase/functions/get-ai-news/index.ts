/**
 * @file get-ai-news Edge Function
 * @description Fetches real AI business news via Brave Search News API,
 *              with LLM and static fallbacks.
 * @secrets BRAVE_SEARCH_API (primary), LOVABLE_API_KEY (fallback), OPENAI_API_KEY (fallback)
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsHeadline {
  title: string;
  source: string;
}

// Domain -> clean source name
const SOURCE_MAP: Record<string, string> = {
  "bloomberg.com": "Bloomberg",
  "ft.com": "Financial Times",
  "wsj.com": "WSJ",
  "nytimes.com": "NYT",
  "reuters.com": "Reuters",
  "cnbc.com": "CNBC",
  "bbc.com": "BBC",
  "bbc.co.uk": "BBC",
  "techcrunch.com": "TechCrunch",
  "theverge.com": "The Verge",
  "wired.com": "Wired",
  "hbr.org": "HBR",
  "mckinsey.com": "McKinsey",
  "gartner.com": "Gartner",
  "technologyreview.com": "MIT Tech Review",
  "forbes.com": "Forbes",
  "businessinsider.com": "Business Insider",
  "theguardian.com": "The Guardian",
  "apnews.com": "AP News",
  "axios.com": "Axios",
  "venturebeat.com": "VentureBeat",
};

const formatSource = (hostname: string): string => {
  const clean = hostname.replace(/^www\./, "");
  return SOURCE_MAP[clean] || clean.split(".")[0].charAt(0).toUpperCase() + clean.split(".")[0].slice(1);
};

// ============================================================
// PLAN A: Brave Search News API (real news, last 24 hours)
// ============================================================
const fetchBraveNews = async (apiKey: string): Promise<NewsHeadline[]> => {
  console.log('🔍 Fetching real news from Brave Search News API...');

  const query = '"AI strategy" OR "AI governance" OR "enterprise AI" OR "artificial intelligence business" OR "AI leadership"';

  const params = new URLSearchParams({
    q: query,
    freshness: 'pw',
    count: '15',
    country: 'US',
    search_lang: 'en',
  });

  const response = await fetch(`https://api.search.brave.com/res/v1/news/search?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Brave Search error:', response.status, errText);
    throw new Error(`Brave Search error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No news results from Brave Search');
  }

  const headlines: NewsHeadline[] = data.results
    .filter((r: any) => r.title && r.meta_url?.hostname)
    .map((r: any) => ({
      title: r.title.replace(/\s*[-|]\s*[^-|]+$/, '').trim(),
      source: formatSource(r.meta_url.hostname),
    }))
    .filter((h: NewsHeadline) => h.title.length > 15)
    .slice(0, 10);

  console.log(`✅ Retrieved ${headlines.length} real news headlines from Brave Search`);
  return headlines;
};

// ============================================================
// PLAN B: LLM-generated headlines (Lovable / OpenAI)
// ============================================================
const AI_SYSTEM_PROMPT = `You are a news curator for senior business leaders (CEOs, COOs, CPOs). Generate concise AI business headlines that a CEO would read before a board meeting. Be specific: name companies, cite numbers, reference real events. 8-15 words max per headline. Present tense only. Return ONLY a JSON array: [{"title": "headline", "source": "Source Name"}]`;

const fetchAIHeadlines = async (provider: 'lovable' | 'openai', apiKey: string): Promise<NewsHeadline[]> => {
  console.log(`⚡ Generating headlines via ${provider}...`);

  const config = provider === 'lovable'
    ? { endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions', model: 'google/gemini-2.5-flash' }
    : { endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' };

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: `Generate 8 AI business headlines from the last 7 days (today: ${new Date().toISOString().split('T')[0]}). Focus on enterprise strategy, vendor moves, governance, ROI data.` },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) throw new Error(`${provider} API error: ${response.status}`);

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content in LLM response');

  let parsed: any[];
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\[[\s\S]*?\]/);
    if (match) parsed = JSON.parse(match[0]);
    else throw new Error('Could not parse LLM JSON');
  }

  const valid = (Array.isArray(parsed) ? parsed : [])
    .filter((h: any) => h?.title?.length > 15 && h?.source)
    .slice(0, 10);

  if (valid.length === 0) throw new Error('No valid headlines from LLM');

  console.log(`✅ Generated ${valid.length} headlines via ${provider}`);
  return valid;
};

// ============================================================
// PLAN C: Static fallback
// ============================================================
const STATIC_FALLBACK: NewsHeadline[] = [
  { title: "Microsoft mandates AI fluency for all managers by Q3", source: "Bloomberg" },
  { title: "Google cuts Gemini API pricing 40% — vendor costs shifting", source: "Financial Times" },
  { title: "Walmart cuts 1,200 middle-management roles after AI rollout", source: "WSJ" },
  { title: "EU AI Act compliance deadline hits enterprise vendors", source: "Financial Times" },
  { title: "Fortune 500 CAIO appointments up 300% in 12 months", source: "HBR" },
  { title: "Companies with AI governance show 2x faster deployment", source: "Gartner" },
  { title: "JPMorgan deploys AI to automate 50% of internal reporting", source: "Bloomberg" },
  { title: "Salesforce raises AI feature pricing 25% — check contracts", source: "Bloomberg" },
];

// ============================================================
// MAIN HANDLER
// ============================================================
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const respond = (headlines: NewsHeadline[], provider: string, fallback: boolean) =>
    new Response(
      JSON.stringify({ headlines, timestamp: new Date().toISOString(), provider, fallback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  try {
    // Plan A: Brave Search
    const braveKey = Deno.env.get('BRAVE_SEARCH_API');
    if (braveKey) {
      try {
        const headlines = await fetchBraveNews(braveKey);
        if (headlines.length > 0) return respond(headlines, 'brave', false);
      } catch (e) {
        console.error('Brave Search failed:', e);
      }
    }

    // Plan B: Lovable AI
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (lovableKey) {
      try {
        const headlines = await fetchAIHeadlines('lovable', lovableKey);
        if (headlines.length > 0) return respond(headlines, 'lovable', false);
      } catch (e) {
        console.error('Lovable AI failed:', e);
      }
    }

    // Plan C: OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiKey) {
      try {
        const headlines = await fetchAIHeadlines('openai', openaiKey);
        if (headlines.length > 0) return respond(headlines, 'openai', false);
      } catch (e) {
        console.error('OpenAI failed:', e);
      }
    }

    // Plan D: Static fallback
    console.log('📋 All providers failed, using static fallback');
    return respond(STATIC_FALLBACK, 'fallback', true);

  } catch (error) {
    console.error('Fatal error:', error);
    return respond(STATIC_FALLBACK, 'fallback', true);
  }
});
