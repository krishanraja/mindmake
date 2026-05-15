/**
 * @file get-ai-news Edge Function
 * @description Fetches and curates real-time AI news through Mindmaker's
 *              SIGNAL/NOISE/DECISION TRIGGER/KRISH'S TAKE framework.
 *
 * Pipeline:
 *   Plan A: Perplexity (real-time search + curation in one call)
 *   Plan B: OpenAI curation of Brave Search results
 *   Plan C: Static fallback headlines
 *
 * @secrets PERPLEXITY_API_KEY (primary), BRAVE_SEARCH_API, OPENAI_API_KEY
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

// ============================================================
// PERPLEXITY PROMPT: real-time search + curation in one call
// ============================================================

const PERPLEXITY_SYSTEM_PROMPT = `You are Mindmaker's AI news filter. You search for today's AI news and curate it through a cynical, experienced operator's lens.

For each headline, assign ONE category:

SIGNAL: This actually matters for business leaders. Real impact, real decisions.
NOISE: Hype, funding announcements, vendor marketing. Include 1-2 to show you're filtering.
DECISION TRIGGER: Something changed that requires a business leader to act or decide.
KRISH'S TAKE: Sharp opinion/analysis. Slightly cynical, deeply knowledgeable.

Voice: Confident, slightly cynical, deeply knowledgeable. Like a friend who works in AI every day and has seen it all.

EXCLUDE:
- Generic AI governance/policy/regulation unless it creates a real decision trigger
- Workforce skills gap surveys and literacy stats (boring, repetitive)
- Geopolitical AI news (Stargate, CHIPS Act, US-China) unless directly affecting vendor choices
- Speculative AGI timelines
- Celebrity/entertainment AI
- Funding rounds unless they signal a major competitive shift

INCLUDE:
- Model releases and capability changes that affect what you can build
- Vendor pricing changes that affect build-vs-buy math
- Real deployment stories with numbers
- Tool launches that change how leaders can use AI day-to-day
- Competitive moves that create decision pressure
- AI agents and automation replacing manual workflows

Format each as: "[CATEGORY] headline text"
8-18 words per headline. Present tense. Specific numbers/companies where possible.

Return ONLY a JSON array of 12-15 items:
[{"title": "[SIGNAL] headline here", "source": "Publication Name"}]

Use real source names from the articles you find. Mix all 4 categories, at least 2 of each.`;

// ============================================================
// CURATION PROMPT: for Brave Search + OpenAI fallback path
// ============================================================

const CURATION_SYSTEM_PROMPT = `You are Mindmaker's AI news filter. Rewrite raw headlines through a cynical, experienced AI operator's lens.

For each headline worth keeping, assign ONE category and rewrite:

SIGNAL: Actually matters for business leaders. Real impact, real decisions.
NOISE: Hype to ignore. Include 1-2 to show you're filtering.
DECISION TRIGGER: Something changed, leaders need to act or decide.
KRISH'S TAKE: Sharp, slightly cynical opinion/analysis.

EXCLUDE: governance fluff, workforce surveys, geopolitics, AGI speculation, celebrity AI.
INCLUDE: model releases, pricing changes, deployment stories, tool launches, competitive moves.

Format: "[CATEGORY] headline text", 8-18 words, present tense, specific numbers/companies.
Return ONLY a JSON array: [{"title": "[SIGNAL] headline here", "source": "Source Name"}]
Select 10-15 headlines. Mix all 4 categories.`;

// ============================================================
// PLAN A: Perplexity, real-time search + curation in one call
// ============================================================
const fetchWithPerplexity = async (apiKey: string): Promise<NewsHeadline[]> => {
  console.log('🔍 Fetching real-time AI news via Perplexity...');

  const today = new Date().toISOString().split('T')[0];

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: PERPLEXITY_SYSTEM_PROMPT },
        { role: 'user', content: `Search for the most important AI news from the past 7 days (today is ${today}). Find 12-15 headlines that a business leader deciding how to use AI would care about. Focus on model releases, vendor pricing changes, real deployment stories, tool launches, and competitive moves. Skip governance surveys, workforce stats, funding rounds, and geopolitical theater. Curate with [SIGNAL], [NOISE], [DECISION TRIGGER], and [KRISH'S TAKE] tags.` },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'unable to read body');
    console.error(`❌ Perplexity error: ${response.status} - ${errorBody}`);
    throw new Error(`Perplexity error: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content in Perplexity response');

  return parseLLMResponse(content);
};

// ============================================================
// PLAN B: Brave Search → OpenAI Curation (two-step fallback)
// ============================================================

const SOURCE_MAP: Record<string, string> = {
  "bloomberg.com": "Bloomberg", "ft.com": "Financial Times", "wsj.com": "WSJ",
  "nytimes.com": "NYT", "reuters.com": "Reuters", "cnbc.com": "CNBC",
  "bbc.com": "BBC", "bbc.co.uk": "BBC", "techcrunch.com": "TechCrunch",
  "theverge.com": "The Verge", "wired.com": "Wired", "hbr.org": "HBR",
  "mckinsey.com": "McKinsey", "gartner.com": "Gartner",
  "technologyreview.com": "MIT Tech Review", "forbes.com": "Forbes",
  "businessinsider.com": "Business Insider", "theguardian.com": "The Guardian",
  "apnews.com": "AP News", "axios.com": "Axios", "venturebeat.com": "VentureBeat",
};

const formatSource = (hostname: string): string => {
  const clean = hostname.replace(/^www\./, "");
  return SOURCE_MAP[clean] || clean.split(".")[0].charAt(0).toUpperCase() + clean.split(".")[0].slice(1);
};

const fetchBraveNews = async (apiKey: string): Promise<string[]> => {
  console.log('🔍 Fetching news from Brave Search...');

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
        q: query, freshness: 'pw', count: '10', country: 'US', search_lang: 'en',
      });
      const response = await fetch(`https://api.search.brave.com/res/v1/news/search?${params}`, {
        headers: { 'Accept': 'application/json', 'Accept-Encoding': 'gzip', 'X-Subscription-Token': apiKey },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.results) allResults.push(...data.results);
      }
    } catch (e) {
      console.warn(`Brave query failed: ${query}`, e);
    }
  }

  if (allResults.length === 0) throw new Error('No results from Brave Search');

  const seen = new Set<string>();
  const rawTitles: string[] = [];

  for (const r of allResults) {
    if (!r.title || !r.meta_url?.hostname) continue;
    const key = r.title.toLowerCase().substring(0, 50);
    if (seen.has(key)) continue;
    seen.add(key);

    const title = r.title.replace(/\s*[-|]\s*[^-|]+$/, '').trim();
    if (title.length > 15) {
      rawTitles.push(`${title} (${formatSource(r.meta_url.hostname)})`);
    }
    if (rawTitles.length >= 25) break;
  }

  return rawTitles;
};

const curateWithOpenAI = async (rawTitles: string[], apiKey: string): Promise<NewsHeadline[]> => {
  console.log('✍️ Curating headlines via OpenAI...');

  const today = new Date().toISOString().split('T')[0];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CURATION_SYSTEM_PROMPT },
        { role: 'user', content: `Today is ${today}. Pick the 10-15 most interesting for a business leader deciding how to use AI. Rewrite each with a category tag. Skip governance fluff and geopolitical theater.\n\nRaw headlines:\n${rawTitles.map((h, i) => `${i + 1}. ${h}`).join('\n')}` },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`OpenAI curation error: ${response.status} - ${errorBody.substring(0, 200)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content in OpenAI response');

  return parseLLMResponse(content);
};

// ============================================================
// PARSE LLM JSON RESPONSE (robust)
// ============================================================
const parseLLMResponse = (content: string): NewsHeadline[] => {
  let parsed: any[];

  // Strip markdown code fences if present
  let cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end > start) {
      try {
        parsed = JSON.parse(cleaned.substring(start, end + 1));
      } catch {
        // Fix truncated JSON by removing incomplete trailing object
        let fixable = cleaned.substring(start, end + 1);
        const lastComplete = fixable.lastIndexOf('},');
        if (lastComplete > 0) {
          fixable = fixable.substring(0, lastComplete + 1) + ']';
          try {
            parsed = JSON.parse(fixable);
          } catch {
            throw new Error('Could not parse LLM JSON after cleanup');
          }
        } else {
          throw new Error('Could not parse LLM JSON');
        }
      }
    } else {
      throw new Error('No JSON array found in LLM response');
    }
  }

  const valid = (Array.isArray(parsed) ? parsed : [])
    .filter((h: any) => h?.title?.length > 15 && h?.source)
    .map((h: any) => ({ title: h.title, source: h.source }))
    .slice(0, 15);

  if (valid.length === 0) throw new Error('No valid headlines from LLM');

  console.log(`✅ Parsed ${valid.length} curated headlines`);
  return valid;
};

// ============================================================
// MARKET PULSE: Live model data from Artificial Analysis
// ============================================================

const generateMarketPulseHeadlines = async (): Promise<NewsHeadline[]> => {
  const apiKey = Deno.env.get('ARTIFICIALANALYSIS_API_KEY');
  if (!apiKey) return [];

  try {
    const response = await fetch('https://artificialanalysis.ai/api/v2/data/llms/models', {
      headers: { 'x-api-key': apiKey, 'Accept': 'application/json' },
    });

    if (!response.ok) return [];

    const raw = await response.json();
    const rawModels = raw?.data || raw;
    if (!Array.isArray(rawModels) || rawModels.length === 0) return [];

    // Extract key metrics
    interface SimplifiedModel {
      name: string;
      creator: string;
      quality: number | null;
      inputPrice: number | null;
      outputPrice: number | null;
      speed: number | null;
    }

    const models: SimplifiedModel[] = rawModels
      .map((m: any): SimplifiedModel | null => {
        if (!m.name) return null;
        return {
          name: m.name,
          creator: m.model_creator?.name || 'Unknown',
          quality: m.evaluations?.quality_index ?? m.evaluations?.arena_elo ?? null,
          inputPrice: m.pricing?.input_per_million_tokens ?? m.pricing?.input ?? null,
          outputPrice: m.pricing?.output_per_million_tokens ?? m.pricing?.output ?? null,
          speed: typeof m.median_output_tokens_per_second === 'number'
            ? Math.round(m.median_output_tokens_per_second) : null,
        };
      })
      .filter((m): m is SimplifiedModel => m !== null);

    const headlines: NewsHeadline[] = [];

    // Find fastest model
    const bySpeed = models.filter(m => m.speed !== null).sort((a, b) => (b.speed ?? 0) - (a.speed ?? 0));
    if (bySpeed.length >= 2) {
      const fastest = bySpeed[0];
      const second = bySpeed[1];
      const ratio = Math.round((fastest.speed! / second.speed!) * 10) / 10;
      headlines.push({
        title: `[SIGNAL] Fastest LLM right now: ${fastest.name} at ${fastest.speed} tok/s, ${ratio}x faster than ${second.name}`,
        source: "Artificial Analysis",
      });
    }

    // Find cheapest high-quality model
    const withPricing = models.filter(m => m.inputPrice !== null && m.quality !== null);
    const highQuality = withPricing.filter(m => m.quality! > (withPricing[0]?.quality ?? 0) * 0.85);
    const cheapestGood = highQuality.sort((a, b) => (a.inputPrice ?? Infinity) - (b.inputPrice ?? Infinity))[0];
    const mostExpensive = highQuality.sort((a, b) => (b.inputPrice ?? 0) - (a.inputPrice ?? 0))[0];
    if (cheapestGood && mostExpensive && cheapestGood.name !== mostExpensive.name) {
      const costRatio = Math.round((mostExpensive.inputPrice! / cheapestGood.inputPrice!) * 10) / 10;
      headlines.push({
        title: `[DECISION TRIGGER] ${cheapestGood.name} costs $${cheapestGood.inputPrice}/M input tokens vs $${mostExpensive.inputPrice}/M for ${mostExpensive.name}, ${costRatio}x cheaper at similar quality`,
        source: "Artificial Analysis",
      });
    }

    // Quality leader
    const byQuality = models.filter(m => m.quality !== null).sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0));
    if (byQuality.length >= 2) {
      headlines.push({
        title: `[SIGNAL] Quality leader: ${byQuality[0].name} (${byQuality[0].creator}) scores ${byQuality[0].quality}, ${byQuality[1].name} trails at ${byQuality[1].quality}`,
        source: "Artificial Analysis",
      });
    }

    // Cynical take on the premium models
    if (byQuality.length >= 3 && withPricing.length >= 3) {
      const top = byQuality[0];
      const midRange = byQuality[Math.floor(byQuality.length / 3)];
      if (top.inputPrice && midRange.inputPrice && top.quality && midRange.quality) {
        const priceDiff = Math.round((top.inputPrice / midRange.inputPrice) * 10) / 10;
        const qualityDiff = Math.round(((top.quality - midRange.quality) / midRange.quality) * 100);
        if (priceDiff > 1.5 && qualityDiff < 15) {
          headlines.push({
            title: `[KRISH'S TAKE] ${top.name} is ${priceDiff}x more expensive than ${midRange.name} but only ${qualityDiff}% better on benchmarks, the premium rarely justifies itself`,
            source: "Artificial Analysis",
          });
        }
      }
    }

    console.log(`✅ Generated ${headlines.length} market pulse headlines`);
    return headlines;
  } catch (e) {
    console.warn('Market pulse generation failed:', e);
    return [];
  }
};

// ============================================================
// STATIC FALLBACK
// ============================================================
const STATIC_FALLBACK: NewsHeadline[] = [
  { title: "[SIGNAL] Claude 3.5 Sonnet outperforms GPT-4o on coding benchmarks, and the build-vs-buy math just changed", source: "The Verge" },
  { title: "[DECISION TRIGGER] OpenAI cuts API pricing 50%, so it's time to reevaluate your LLM vendor costs", source: "TechCrunch" },
  { title: "[KRISH'S TAKE] 80% of companies using AI != 80% using it well. Most are running demos, not systems", source: "Mindmaker" },
  { title: "[SIGNAL] GitHub Copilot users complete tasks 55.8% faster. Real productivity data, not hype", source: "GitHub" },
  { title: "[NOISE] Another AI startup raises $200M to build 'the future of work.' Wake me when they ship something", source: "TechCrunch" },
  { title: "[DECISION TRIGGER] Google drops Gemini API prices by 40%, so your vendor spreadsheet needs updating", source: "Bloomberg" },
  { title: "[SIGNAL] AI agents now handle 60% of tier-1 support tickets at companies that actually deployed them", source: "Forbes" },
  { title: "[KRISH'S TAKE] Everyone's building AI prototypes. Almost nobody is measuring if they work", source: "Mindmaker" },
  { title: "[DECISION TRIGGER] Anthropic launches tool-use API, and custom AI workflows just got dramatically easier to build", source: "Wired" },
  { title: "[SIGNAL] HeyGen lets founders create AI video clones that present in 40+ languages", source: "TechCrunch" },
  { title: "[NOISE] AI will replace all jobs by 2030 says person selling AI consulting. Sure it will", source: "Forbes" },
  { title: "[SIGNAL] One-person businesses generating $1M+ revenue using AI for sales, support, and fulfillment", source: "WSJ" },
  { title: "[KRISH'S TAKE] Your team is using 14 AI tools. You need 3. The rest is noise", source: "Mindmaker" },
  { title: "[DECISION TRIGGER] AWS launches managed AI agents, and the build-vs-buy decision just got more nuanced", source: "Reuters" },
  { title: "[SIGNAL] Companies deploying AI in production see 3x ROI vs those stuck in pilot phase", source: "McKinsey" },
  { title: "[KRISH'S TAKE] If your AI strategy is a slide deck, it's not a strategy. Ship something this week", source: "Mindmaker" },
  { title: "[SIGNAL] ElevenLabs voice cloning used by 1M+ creators to scale content without recording", source: "Wired" },
  { title: "[DECISION TRIGGER] Open-source Llama 3 closes the gap with GPT-4, and vendor lock-in risk drops", source: "The Verge" },
  { title: "[NOISE] Enterprise AI adoption hits 80%, but 80% of that is ChatGPT in a browser tab", source: "Gartner" },
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
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    const braveKey = Deno.env.get('BRAVE_SEARCH_API');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    // Fetch market pulse in parallel (non-blocking, best-effort)
    const marketPulsePromise = generateMarketPulseHeadlines().catch(() => [] as NewsHeadline[]);

    // ── PLAN A: Perplexity (real-time search + curation, one call) ──
    if (perplexityKey) {
      try {
        const headlines = await fetchWithPerplexity(perplexityKey);
        if (headlines.length > 0) {
          console.log('✅ Perplexity pipeline succeeded');
          const marketPulse = await marketPulsePromise;
          return respond([...headlines, ...marketPulse], 'perplexity', false);
        }
      } catch (e) {
        console.error('Perplexity failed:', e);
      }
    }

    // ── PLAN B: Brave Search → OpenAI Curation ──
    if (braveKey && openaiKey) {
      try {
        const rawTitles = await fetchBraveNews(braveKey);
        if (rawTitles.length > 0) {
          try {
            const curated = await curateWithOpenAI(rawTitles, openaiKey);
            if (curated.length > 0) {
              console.log('✅ Brave + OpenAI curation pipeline succeeded');
              const marketPulse = await marketPulsePromise;
              return respond([...curated, ...marketPulse], 'brave+openai', false);
            }
          } catch (e) {
            console.error('OpenAI curation failed:', e);
          }
        }
      } catch (e) {
        console.error('Brave Search failed:', e);
      }
    }

    // ── PLAN C: Static fallback + market pulse ──
    console.log('📋 Using static fallback headlines');
    const marketPulse = await marketPulsePromise;
    return respond([...STATIC_FALLBACK, ...marketPulse], 'fallback', true);

  } catch (error) {
    console.error('Fatal error:', error);
    return respond(STATIC_FALLBACK, 'fallback', true);
  }
});
