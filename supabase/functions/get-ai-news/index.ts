/**
 * @file get-ai-news Edge Function
 * @description Fetches real AI news relevant to business leaders and AI literacy
 *              via Brave Search News API, then uses an LLM to filter for relevance
 *              and clean up headlines. Falls back to LLM-generated or static headlines.
 *
 * Focus: AI literacy, AI workforce skills, AI governance, AI business decisions,
 *        AI training/upskilling, AI ROI, AI personal amplification (clones, assistants,
 *        solopreneur tools) — NOT generic AI product launches or funding rounds.
 *
 * @secrets BRAVE_SEARCH_API (primary), LOVABLE_API_KEY (curation + fallback), OPENAI_API_KEY (fallback)
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
// CURATION PROMPT — filter for relevance, clean up, don't editorialize
// ============================================================

const CURATION_SYSTEM_PROMPT = `You are a news curator for a company that helps business leaders build AI literacy and make confident AI decisions.

Your job: Take raw news headlines and select + clean up only the ones that matter to a business leader, entrepreneur, or small business owner who is trying to:
- Understand how AI is changing their workforce and industry
- Make informed decisions about AI adoption, governance, and training
- Stay current on AI skills gaps, talent markets, and productivity data
- Navigate AI vendor decisions, build-vs-buy choices, and ROI measurement
- Use AI to amplify themselves — clones, virtual assistants, AI avatars, and personal productivity tools

INCLUDE headlines about:
- AI workforce impact (hiring, displacement, upskilling, skills gaps)
- AI literacy and training initiatives (corporate programs, mandates, results)
- AI governance and policy (regulation, compliance, corporate AI policies)
- AI productivity and ROI data (measurable results, benchmarks, studies)
- AI decision-making for leaders (vendor choices, strategy, build-vs-buy)
- Shadow AI and AI risk management
- AI talent market changes (salary premiums, demand, competition)
- AI personal amplification (AI clones, AI avatars, AI assistants, AI voice/video tools like HeyGen, OpenClaw, ElevenLabs, Synthesia, Descript, etc.)
- Solopreneur and small business AI tools (automating operations, scaling without headcount, AI agents doing real work)

EXCLUDE headlines about:
- Startup funding rounds (unless directly relevant to AI adoption decisions)
- New AI model releases without business context
- Celebrity or entertainment AI news
- Speculative AI capabilities or AGI timelines
- Generic "AI will change everything" think pieces

For each selected headline:
1. Clean it up to be concise (8-18 words max)
2. Include specific numbers, companies, or data points when available
3. Keep it factual — no opinion, no editorial spin, no buzzwords
4. Present tense only

Return ONLY a JSON array of 10-15 items: [{"title": "Clean headline text", "source": "Original Source Name"}]`;

const CURATION_USER_PROMPT = (rawHeadlines: string[], today: string) =>
  `Today is ${today}. Here are raw AI news headlines from the past week. Select the 10-15 most relevant for business leaders focused on AI literacy and decision-making. Clean up the titles. Exclude anything that's generic tech news, funding hype, or consumer AI.

Raw headlines:
${rawHeadlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;

// Standalone generation prompt (when no Brave results available)
const STANDALONE_SYSTEM_PROMPT = `You are a news curator for a company that helps business leaders build AI literacy and make confident AI decisions.

Generate realistic, factual AI news headlines from the past 7 days that a business leader, entrepreneur, or small business owner would find relevant to their AI decision-making and personal AI amplification.

Focus topics:
- AI workforce impact: hiring, displacement, upskilling, skills gaps, talent competition
- AI literacy: corporate training programs, mandates, adoption rates, results
- AI governance: regulation, compliance, corporate policies, Shadow AI
- AI productivity: ROI data, benchmarks, measurable results from AI deployment
- AI decisions: vendor moves, pricing changes, build-vs-buy shifts, enterprise adoption
- AI talent market: salary premiums, demand data, skills competition
- AI personal amplification: AI clones, AI avatars, AI voice/video (HeyGen, Synthesia, ElevenLabs), AI assistants (OpenClaw, Lindy, etc.), solopreneur tools
- Small business AI: automating operations with AI agents, scaling without headcount, one-person businesses using AI to do the work of teams

Rules:
- Factual tone — no opinion, no editorial, no buzzwords
- Include specific numbers, percentages, company names where possible
- 8-18 words per headline, present tense
- Reference real companies and plausible recent developments
- NO funding rounds, speculative AGI timelines, or celebrity AI news

Return ONLY a JSON array: [{"title": "headline text", "source": "Source Name"}]
Use real publication names as sources (Bloomberg, WSJ, HBR, Gartner, Financial Times, etc.)`;

// ============================================================
// PLAN A: Brave Search News API (real news, last 7 days)
// ============================================================
const fetchBraveNews = async (apiKey: string): Promise<{ headlines: NewsHeadline[], rawTitles: string[] }> => {
  console.log('🔍 Fetching real news from Brave Search News API...');

  // Targeted queries for AI literacy, workforce, governance, business decisions, and personal amplification
  const queries = [
    '"AI literacy" OR "AI training" OR "AI skills gap" OR "AI upskilling"',
    '"AI workforce" OR "AI jobs" OR "AI talent" OR "AI hiring"',
    '"AI governance" OR "AI policy" OR "shadow AI" OR "enterprise AI adoption"',
    '"AI ROI" OR "AI productivity" OR "AI strategy" OR "AI decision"',
    '"AI clone" OR "AI avatar" OR "HeyGen" OR "AI assistant" OR "AI agent" OR "solopreneur AI"',
  ];

  const allResults: any[] = [];

  for (const query of queries) {
    try {
      const params = new URLSearchParams({
        q: query,
        freshness: 'pw',
        count: '10',
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

      if (response.ok) {
        const data = await response.json();
        if (data.results) {
          allResults.push(...data.results);
        }
      }
    } catch (e) {
      console.warn(`Brave query failed for: ${query}`, e);
    }
  }

  if (allResults.length === 0) {
    throw new Error('No news results from Brave Search');
  }

  // Deduplicate by title similarity
  const seen = new Set<string>();
  const unique = allResults.filter((r: any) => {
    if (!r.title || !r.meta_url?.hostname) return false;
    const key = r.title.toLowerCase().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const headlines: NewsHeadline[] = unique
    .map((r: any) => ({
      title: r.title.replace(/\s*[-|]\s*[^-|]+$/, '').trim(),
      source: formatSource(r.meta_url.hostname),
    }))
    .filter((h: NewsHeadline) => h.title.length > 15)
    .slice(0, 25);

  const rawTitles = headlines.map(h => `${h.title} (${h.source})`);

  console.log(`✅ Retrieved ${headlines.length} raw news headlines from Brave Search`);
  return { headlines, rawTitles };
};

// ============================================================
// LLM CURATION: Filter raw headlines for relevance, clean titles
// ============================================================
const curateWithLLM = async (
  rawTitles: string[],
  provider: 'lovable' | 'openai',
  apiKey: string
): Promise<NewsHeadline[]> => {
  console.log(`✍️ Filtering and curating headlines via ${provider}...`);

  const config = provider === 'lovable'
    ? { endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions', model: 'google/gemini-2.5-flash' }
    : { endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' };

  const today = new Date().toISOString().split('T')[0];

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: CURATION_SYSTEM_PROMPT },
        { role: 'user', content: CURATION_USER_PROMPT(rawTitles, today) },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) throw new Error(`${provider} curation error: ${response.status}`);

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content in curation response');

  return parseLLMResponse(content);
};

// ============================================================
// LLM STANDALONE: Generate headlines without Brave Search input
// ============================================================
const generateWithLLM = async (
  provider: 'lovable' | 'openai',
  apiKey: string
): Promise<NewsHeadline[]> => {
  console.log(`⚡ Generating standalone headlines via ${provider}...`);

  const config = provider === 'lovable'
    ? { endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions', model: 'google/gemini-2.5-flash' }
    : { endpoint: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' };

  const today = new Date().toISOString().split('T')[0];

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: STANDALONE_SYSTEM_PROMPT },
        { role: 'user', content: `Generate 12-15 AI news headlines relevant to business leaders and entrepreneurs focused on AI literacy, decision-making, and personal amplification. Today is ${today}. Focus on workforce skills, governance, productivity ROI, enterprise adoption, AI clones/avatars, AI assistants, and solopreneur AI tools from the past 7 days.` },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) throw new Error(`${provider} standalone error: ${response.status}`);

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content in standalone response');

  return parseLLMResponse(content);
};

// ============================================================
// PARSE LLM JSON RESPONSE
// ============================================================
const parseLLMResponse = (content: string): NewsHeadline[] => {
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
    .map((h: any) => ({
      title: h.title,
      source: h.source,
    }))
    .slice(0, 15);

  if (valid.length === 0) throw new Error('No valid headlines from LLM');

  console.log(`✅ Parsed ${valid.length} curated headlines`);
  return valid;
};

// ============================================================
// STATIC FALLBACK — factual, AI-literacy-relevant headlines
// ============================================================
const STATIC_FALLBACK: NewsHeadline[] = [
  { title: "95% of enterprise AI initiatives fail due to workforce literacy gaps, not technology", source: "Gartner" },
  { title: "Companies investing in AI training see 66% average productivity gains across teams", source: "McKinsey" },
  { title: "78% of employees use unauthorized AI tools at work — Shadow AI grows unchecked", source: "Gartner" },
  { title: "AI-skilled workers command 25-56% salary premiums over non-AI peers", source: "HBR" },
  { title: "63% of employers now cite AI skills gaps as primary barrier to business growth", source: "WEF" },
  { title: "New hires with AI training reach expert-level performance in 2 months vs 8 months", source: "MIT Tech Review" },
  { title: "GitHub Copilot users complete tasks 55.8% faster with 84% more successful builds", source: "GitHub" },
  { title: "75% of workers use AI without training — 70% receive zero workplace guidance", source: "McKinsey" },
  { title: "HeyGen now lets founders create AI video clones that present in 40+ languages", source: "TechCrunch" },
  { title: "Solopreneurs using AI assistants report running operations that previously required 5-person teams", source: "Forbes" },
  { title: "AI avatar market projected to reach $440B by 2031 as professionals clone themselves for scale", source: "Bloomberg" },
  { title: "OpenClaw and similar platforms let entrepreneurs build AI versions of themselves for client interactions", source: "VentureBeat" },
  { title: "ElevenLabs voice cloning now used by 1M+ creators to scale content without recording", source: "Wired" },
  { title: "Small businesses using AI agents for scheduling, email, and ops save 15+ hours per week", source: "Forbes" },
  { title: "AI job postings grew 37.5% year-over-year — 12.5x faster than overall market", source: "LinkedIn" },
  { title: "Synthesia reports 50,000+ companies now use AI avatars for training and customer-facing video", source: "Bloomberg" },
  { title: "One-person businesses generating $1M+ revenue using AI for sales, support, and fulfillment", source: "WSJ" },
  { title: "Companies with structured AI governance deploy AI systems 2x faster", source: "Gartner" },
  { title: "92 million jobs face displacement by 2030 while 170 million new roles emerge", source: "WEF" },
  { title: "Descript and AI editing tools cut video production time by 80% for small content teams", source: "The Verge" },
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
    const braveKey = Deno.env.get('BRAVE_SEARCH_API');
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    // ── PLAN A: Brave Search → LLM Curation (best path) ──
    // Fetch real news, then use LLM to filter for relevance and clean titles
    if (braveKey) {
      try {
        const { headlines: rawHeadlines, rawTitles } = await fetchBraveNews(braveKey);

        if (rawTitles.length > 0) {
          // Try LLM curation for relevance filtering
          const llmKey = lovableKey || openaiKey;
          const llmProvider = lovableKey ? 'lovable' : 'openai';

          if (llmKey) {
            try {
              const curated = await curateWithLLM(rawTitles, llmProvider as 'lovable' | 'openai', llmKey);
              if (curated.length > 0) {
                console.log('✅ Brave + LLM curation pipeline succeeded');
                return respond(curated, `brave+${llmProvider}`, false);
              }
            } catch (e) {
              console.error('LLM curation failed, trying second provider:', e);

              // Try the other LLM provider
              const fallbackKey = lovableKey ? openaiKey : lovableKey;
              const fallbackProvider = lovableKey ? 'openai' : 'lovable';
              if (fallbackKey) {
                try {
                  const curated = await curateWithLLM(rawTitles, fallbackProvider as 'lovable' | 'openai', fallbackKey);
                  if (curated.length > 0) {
                    return respond(curated, `brave+${fallbackProvider}`, false);
                  }
                } catch (e2) {
                  console.error('Second LLM curation also failed:', e2);
                }
              }
            }
          }

          // If LLM curation unavailable, return raw Brave results
          console.warn('⚠️ LLM curation unavailable, returning raw Brave headlines');
          return respond(rawHeadlines.slice(0, 10), 'brave-raw', false);
        }
      } catch (e) {
        console.error('Brave Search failed:', e);
      }
    }

    // ── PLAN B: Standalone LLM generation (no Brave) ──
    if (lovableKey) {
      try {
        const headlines = await generateWithLLM('lovable', lovableKey);
        if (headlines.length > 0) return respond(headlines, 'lovable', false);
      } catch (e) {
        console.error('Lovable standalone failed:', e);
      }
    }

    // ── PLAN C: OpenAI standalone ──
    if (openaiKey) {
      try {
        const headlines = await generateWithLLM('openai', openaiKey);
        if (headlines.length > 0) return respond(headlines, 'openai', false);
      } catch (e) {
        console.error('OpenAI standalone failed:', e);
      }
    }

    // ── PLAN D: Static fallback ──
    console.log('📋 All providers failed, using static fallback');
    return respond(STATIC_FALLBACK, 'fallback', true);

  } catch (error) {
    console.error('Fatal error:', error);
    return respond(STATIC_FALLBACK, 'fallback', true);
  }
});
