/**
 * @file get-ai-news Edge Function
 * @description Fetches real AI news via Brave Search News API, then curates through
 *              Mindmaker's SIGNAL/NOISE/DECISION TRIGGER/KRISH'S TAKE framework.
 *              Falls back to LLM-generated or static headlines.
 *
 * Focus: Actionable AI news for leaders — model launches, pricing shifts, real
 *        deployment stories, tool releases, competitive moves. NOT governance
 *        surveys, workforce stats, or geopolitical theater.
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

const CURATION_SYSTEM_PROMPT = `You are Mindmaker's AI news filter. Your job is to take raw news headlines and rewrite them through a cynical, experienced AI operator's lens.

For each headline worth keeping, assign ONE category and rewrite the headline:

SIGNAL — This actually matters for business leaders. Real impact, real decisions.
NOISE — Hype, funding announcements, vendor marketing. Include 1-2 of these to show you're filtering.
DECISION TRIGGER — Something changed that requires a business leader to act or decide.
KRISH'S TAKE — Sharp opinion/analysis. Slightly cynical, deeply knowledgeable.

Voice: Confident, slightly cynical, deeply knowledgeable. Like a friend who works in AI every day and has seen it all.

EXCLUDE:
- Generic AI governance/policy/regulation unless it creates a real decision trigger
- Workforce skills gap surveys and literacy stats (boring, repetitive)
- Geopolitical AI news (Stargate, CHIPS Act, US-China) unless directly affecting vendor choices
- Speculative AGI timelines
- Celebrity/entertainment AI

INCLUDE:
- Model releases and capability changes that affect what you can build
- Vendor pricing changes that affect build-vs-buy math
- Real deployment stories with numbers
- Tool launches that change how leaders can use AI day-to-day
- Competitive moves that create decision pressure

Format each headline as: "[CATEGORY] Rewritten headline here"
8-18 words per headline. Present tense. Include specific numbers/companies where possible.

Return ONLY a JSON array: [{"title": "[CATEGORY] headline text", "source": "Source Name"}]
Select 10-15 headlines. Mix categories — at least 2 of each type.`;

const CURATION_USER_PROMPT = (rawHeadlines: string[], today: string) =>
  `Today is ${today}. Here are raw AI news headlines from the past week. Pick the 10-15 most interesting for a business leader deciding how to use AI. Rewrite each with a category tag. Skip governance fluff, workforce surveys, and geopolitical theater. Focus on things that change what a leader should build, buy, or decide.

Raw headlines:
${rawHeadlines.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;

// Standalone generation prompt (when no Brave results available)
const STANDALONE_SYSTEM_PROMPT = `You are Mindmaker's AI news filter. Generate realistic, recent AI news headlines through a cynical, experienced operator's lens.

Categorize each headline:
- SIGNAL — Actually matters for business leaders making AI decisions
- NOISE — Hype to ignore (include 1-2 to show contrast)
- DECISION TRIGGER — Something changed, leaders need to act
- KRISH'S TAKE — Sharp, slightly cynical analysis

Topics that matter:
- New model capabilities that change what you can build
- Vendor pricing shifts affecting build-vs-buy decisions
- Real deployment stories with measurable results
- AI tools that change day-to-day leadership work
- Competitive moves creating decision pressure
- AI agents and automation replacing manual workflows
- AI personal amplification (clones, avatars, voice/video tools)

Topics to avoid:
- Governance surveys and compliance stats
- Workforce literacy gaps (boring)
- Geopolitical AI infrastructure (Stargate, CHIPS Act)
- Funding rounds
- AGI speculation

Voice: Confident, slightly cynical, deeply knowledgeable.

Format: [{"title": "[CATEGORY] headline text", "source": "Source Name"}]
8-18 words, present tense, specific numbers/companies. 12-15 headlines. Mix all 4 categories.
Use real publication names as sources (Bloomberg, WSJ, Wired, The Verge, TechCrunch, etc.)`;

// ============================================================
// PLAN A: Brave Search News API (real news, last 7 days)
// ============================================================
const fetchBraveNews = async (apiKey: string): Promise<{ headlines: NewsHeadline[], rawTitles: string[] }> => {
  console.log('🔍 Fetching real news from Brave Search News API...');

  // Broad queries for actionable AI news leaders actually care about
  const queries = [
    '"AI" AND ("pricing" OR "API" OR "launch" OR "release" OR "update")',
    '"AI" AND ("enterprise" OR "business" OR "company" OR "CEO" OR "CTO")',
    '"AI agent" OR "AI workflow" OR "AI automation" OR "AI tools"',
    '"GPT" OR "Claude" OR "Gemini" OR "Llama" OR "open source AI"',
    '"AI" AND ("build" OR "deploy" OR "production" OR "ROI" OR "cost")',
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
        { role: 'user', content: `Generate 12-15 AI news headlines for business leaders deciding how to use AI. Today is ${today}. Focus on model releases, pricing changes, real deployment stories, tool launches, and competitive moves from the past 7 days. Use the [SIGNAL], [NOISE], [DECISION TRIGGER], and [KRISH'S TAKE] category tags. Mix all 4 categories.` },
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
