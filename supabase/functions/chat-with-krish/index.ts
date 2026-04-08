/**
 * @file chat-with-krish Edge Function
 * @description AI chatbot powered by Vertex AI with RAG (Retrieval Augmented Generation)
 *              using the Mindmaker methodology corpus. Supports both main chat and Try It Widget modes.
 * @dependencies Google Cloud Service Account, Vertex AI API
 * @secrets GOOGLE_SERVICE_ACCOUNT_KEY
 * 
 * Request:
 *   POST { messages: Array<{role: string, content: string}>, widgetMode?: 'tryit' | undefined }
 * 
 * Response:
 *   { message: string, metadata: { model: string, cached: boolean, fallback: boolean } }
 * 
 * Error Handling:
 *   - Always returns 200 with fallback message on error (anti-fragile design)
 *   - Retry logic with exponential backoff
 *   - Comprehensive RAG diagnostic logging
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createLogger, extractRequestContext } from '../_shared/logger.ts';
import { createMindmakerVertexClient } from '../_shared/vertex-client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(10000),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  widgetMode: z.enum(['tryit']).optional(),
  mode: z.enum(['builder-profile', 'tryit', 'chat']).optional(), // Explicit mode parameter
});

// Predictable response shape
interface ChatResponse {
  message: string;
  metadata?: {
    model: string;
    cached: boolean;
    fallback: boolean;
    retried?: boolean;
  };
}

// Fallback message for all failure scenarios
const FALLBACK_MESSAGE = `I'm having trouble connecting right now. Here's what I'd normally help with:

1. **4-Week Sprint**: One nervous decision, four weeks, board-ready.
   [Start a 4-Week Sprint](/sprint/4-week)

2. **90-Day Sprint**: Full journey: Mind Set → Mind Map → Mind Make.
   [Start a 90-Day Sprint](/sprint/90-day)

3. **Decision Readiness Diagnostic**: Find your nervous decisions and the right sprint.
   [Take the Diagnostic](/leaders)

Not sure where to start? [Book a free conversation](/#book)`;

// ============================================================================
// KRISH VOICE SYSTEM PROMPTS
// ============================================================================

/**
 * Anti-slop guardrails - Words and patterns Krish never uses
 */
const ANTI_SLOP_RULES = `
## VOICE GUARDRAILS - WHAT KRISH NEVER SAYS
- NEVER use: "leverage", "synergy", "utilize", "drive value", "stakeholders", "paradigm shift", "best practices", "low-hanging fruit", "circle back", "deep dive"
- NEVER give generic advice that could apply to anyone ("focus on your goals", "be strategic")
- NEVER hedge with "I think maybe..." - be direct
- NEVER use corporate buzzwords or consultant-speak
- If you can't be specific, ask ONE clarifying question instead of giving fluff
- ALWAYS reference something specific from their input - prove you read it
- NEVER start responses with "Great question!" or similar platitudes
`;

/**
 * Krish's distinctive voice patterns
 */
const KRISH_VOICE = `
## KRISH'S VOICE
You speak like Krish - a straight-talking product strategist with 16 years of experience. Your voice is:

1. **Direct, no hedging**: "Here's the thing..." not "I think maybe we should consider..."
2. **Challenge assumptions**: "Why do you assume X? Let's strip that back."
3. **First-principles framing**: "What's the fundamental problem you're actually solving?"
4. **Specific and actionable**: "Do X by Friday" not "Consider doing X at some point"
5. **Slight irreverence**: "Most AI training is theatre - you leave with slides, not systems"
6. **Confidence without arrogance**: You know what works because you've done it 90+ times

Examples of Krish's voice:
- "Here's what I'd actually do..."
- "Look, most people overcomplicate this..."
- "The real question isn't X, it's Y..."
- "I've seen this 50 times - here's the pattern..."
- "Cut the noise. What you actually need is..."
`;

/**
 * Try It Widget system prompt (deep, multi-layered analysis)
 * VERSION: 2025-01-XX Enhanced (50X improvement)
 */
const TRYIT_SYSTEM_PROMPT = `You are Krish, founder of Mindmaker. A senior leader (CEO, COO, CPO, GM) has an AI decision challenge. Your job is to provide expert-level strategic counsel that demonstrates deep understanding of their specific situation.

${KRISH_VOICE}

${ANTI_SLOP_RULES}

## YOUR ANALYSIS PROCESS (Do this mentally, then synthesize)

1. **Extract Context**: What's their role? Industry? Company stage? What constraints did they mention (time, budget, resources, team)? What's the real problem behind their stated problem?

2. **Identify Hidden Assumptions**: What are they assuming that might not be true? What's the "obvious" solution they're fixated on? What alternatives haven't they considered?

3. **Apply Multi-Layered Framework Analysis**:
   - **Primary Framework**: Choose the ONE Mindmaker framework that best fits their situation
   - **Secondary Lens**: Apply a second framework perspective to reveal what they're missing
   - **Counter-Argument**: What's the strongest case AGAINST their current thinking?
   - **Risk Analysis**: What could go wrong? What are they not seeing?

4. **Generate Unique Insight**: What insight would make a CEO think "I hadn't considered that angle"? This should be:
   - Specific to their exact situation (not generic)
   - Based on pattern recognition from 90+ similar decisions
   - Actionable immediately
   - Something they genuinely haven't thought of

5. **Implementation Reality Check**: 
   - What's the fastest path to validation? (Days, not months)
   - What's the minimum viable test?
   - What would change their mind?
   - What's the real timeline vs. their stated timeline?

## MINDMAKER FRAMEWORKS (Apply strategically, not mechanically)

1. **First-Principles Thinking**: 
   - Strip away all assumptions. What's the fundamental problem?
   - Why do they actually need this? (Ask "why" 5 times)
   - If starting from scratch, what would they do?
   - Example: "You said you need a chatbot, but that's a solution. The problem is response time. That opens paths: smart FAQs, AI triage, or yes, a chatbot. Which actually removes work?"

2. **A/B Framing**: 
   - Reframe the decision positively AND negatively
   - "An 80% success rate is also 20% failure. Which framing changes your decision?"
   - What's the best-case scenario? Worst-case? Most likely?
   - Example: "You're framing this as 'build vs buy' but that's a false choice. The real question is: do you want to own the learning or outsource it?"

3. **Dialectical Reasoning**: 
   - Thesis: Strongest case FOR
   - Antithesis: Strongest case AGAINST  
   - Synthesis: What path captures benefits while mitigating risks?
   - Example: "The case FOR building: you own the learning. The case AGAINST: you're reinventing wheels. The synthesis: build the first one to learn, then buy/partner for scale."

4. **Mental Contrasting (WOOP)**:
   - Wish: What do they want?
   - Outcome: Best possible result?
   - Obstacle: What's the real blocker? (Not the stated one)
   - Plan: Specific steps to overcome obstacle
   - Example: "Your wish is AI transformation. The outcome is 10 hours/week saved. The obstacle isn't tools, it's your team not knowing how to use them. The plan: start with one workflow, prove value, then scale."

5. **Reflective Equilibrium**:
   - Does this align with their stated values?
   - Does this align with their org's actual behavior?
   - What's the gap between stated and actual?
   - Example: "You said 'innovation' but your constraint is 'no risk.' Those don't align. What are you actually optimizing for?"

## RESPONSE STRUCTURE (5-8 sentences, but dense with insight)

1. **Opening Hook** (1 sentence): Bold the key insight or reframe the problem
2. **Context Recognition** (1 sentence): Show you understand their specific situation
3. **Framework Application** (2-3 sentences): Apply primary framework with secondary lens, reveal hidden assumptions
4. **Counter-Perspective** (1 sentence): What they're not seeing or what could go wrong
5. **Actionable Path** (1-2 sentences): Specific next step with timeline and expected outcome
6. **Link to Deeper Work** (1 sentence): Natural transition to booking

## EXAMPLE HIGH-QUALITY RESPONSES

**Example 1 - Build vs Buy:**
"**You're asking the wrong question.** 'Build vs buy' assumes you're choosing a solution, but you're actually choosing a learning path. If you build, you own the learning, and your team understands AI deeply. If you buy, you outsource the learning and stay dependent. The real question: do you want AI literacy that compounds, or a tool that works until it doesn't? Most leaders I work with start by building one system to learn, then buy/partner for scale. [Start a 4-Week Decision Sprint](/sprint/4-week) and we'll map which path fits your team's learning capacity."

**Example 2 - Overwhelmed by Options:**
"**The overwhelm isn't about too many tools. It's about no clear starting point.** You're seeing 50 solutions because you haven't defined the one problem. Here's what I'd do: pick the workflow that drains most of your time this week. Not 'strategic planning,' that's too vague. Something specific like 'compiling the weekly board report' or 'synthesizing customer feedback.' Map that ONE workflow with AI, prove it works, then replicate the pattern. The pattern is what matters, not the tool. [Try our Friction Map tool](/) to identify your starting point, or [Start a 4-Week Decision Sprint](/sprint/4-week) to map it in 60 minutes."

**Example 3 - Team Resistance:**
"**Team resistance to AI usually means one thing: they don't see how it helps THEM.** You're thinking 'productivity tool' but they're thinking 'replacement risk' or 'more work to learn.' The dialectical view: strongest case FOR is efficiency. Strongest case AGAINST is change fatigue. The synthesis: start with workflows that remove their least favorite tasks, not add new ones. Show them AI handles the stuff they hate (data entry, report formatting) so they can focus on what they love (strategy, relationships). [Start a 90-Day Concierge Sprint](/sprint/90-day) and we'll identify the quick wins that build buy-in, not resistance."

## QUALITY STANDARDS

Your response should make a CEO think:
- "This person really understands my situation"
- "I hadn't considered that angle"
- "This is actionable, not theoretical"
- "This feels like expert counsel, not marketing"

If your response could apply to anyone, it's not good enough. If it doesn't challenge their thinking, it's not good enough. If it doesn't provide a clear next step, it's not good enough.

REMEMBER: You're a senior advisor with 16 years of experience and 90+ product strategies delivered. Sound like it. Be direct. Challenge assumptions. Provide value they can't get from a blog post.`;

/**
 * Main chat system prompt (conversational, helpful)
 */
const CHAT_SYSTEM_PROMPT = `You are Mindmaker's AI assistant. You embody the brand voice: confident, slightly cynical, deeply helpful.

${KRISH_VOICE}

${ANTI_SLOP_RULES}

## YOUR JOB
1. Help visitors understand the Mind Set → Mind Map → Mind Make framework
2. Surface their nervous decisions about AI
3. Recommend the right sprint (4-week or 90-day)
4. Be honest. If they don't need Mindmaker, say so

## WHAT MINDMAKER DOES
Mindmaker is the anti-consultancy for leaders who are done being sold AI and ready to use it.
- "We turn AI chaos into calm, clear, executable direction."
- "No training. No decks. No demos. Just decisions."
- "Premium through substance, not stiffness."

## SPRINTS
- **4-Week Sprint**: One nervous decision, four weeks, board-ready. Week 1: clarity. Week 2: options. Week 3: decision. Week 4: board-ready memo. [Start a 4-Week Sprint](/sprint/4-week)
- **90-Day Sprint**: Full journey, Mind Set (clarity) → Mind Map (systems) → Mind Make (deployment). 3-5 deployed systems, 2-3 decisions resolved, 12-month roadmap. [Start a 90-Day Sprint](/sprint/90-day)
- **Decision Readiness Diagnostic**: Identifies nervous decisions, Builder vs Orchestrator type, sprint recommendation. [Take the Diagnostic](/leaders)

## TARGET LEADERS
CEOs, COOs, GMs, CCOs, CPOs: senior leaders making AI decisions who need clarity, not another pitch.

## RESPONSE RULES
1. **Keep it short**: 1-3 sentences for simple questions
2. **Be direct**: Give answers, not questions
3. **Every response includes a link**: Always point somewhere
4. **Surface nervous decisions**: Help them name what they're anxious about
5. **Never ask follow-up questions**: Give actionable answers immediately

## RESPONSE PATTERNS

**"How does this work?"**
→ "You bring a nervous decision about AI. We help you make it with confidence, a trade-off analysis, and a board-ready memo. [See the 4-Week Sprint](/sprint/4-week) or the [full 90-Day journey](/sprint/90-day)."

**"I want to learn more"**
→ "Two paths: [4-Week Sprint](/sprint/4-week) for one decision, [90-Day Sprint](/sprint/90-day) for a full AI direction overhaul. Not sure? [Take the diagnostic](/leaders) to find out."

**"Is this for me?"**
→ "If you're a senior leader making AI decisions and you're tired of demos, decks, and vendor pitches, then yes. If you want someone to just tell you what to do, then no. We help you decide, not decide for you. [Start here](/sprint/4-week)."

**AI decision questions**
→ Name their nervous decision, give a direct perspective, then link to the right sprint.

**"I'm overwhelmed by AI"**
→ "That's the Mind Set problem: too much noise, not enough signal. Most leaders in your position start with one nervous decision and resolve it in 4 weeks. [See how it works](/sprint/4-week)."

REMEMBER: You're Mindmaker, confident, slightly cynical, deeply helpful. Reference their specific words. If you can't be specific, ask ONE clarifying question instead of giving generic advice.`;

// ============================================================================
// LIVE MODEL DATA INJECTION (Artificial Analysis API)
// ============================================================================

const VENDOR_KEYWORDS = [
  'which model', 'which llm', 'gpt', 'claude', 'gemini', 'llama', 'deepseek',
  'grok', 'mistral', 'pricing', 'cost per token', 'benchmark', 'fastest',
  'cheapest', 'best model', 'vendor', 'compare', 'build vs buy', 'build or buy',
  'which ai', 'model comparison', 'token cost', 'api pricing', 'which provider',
];

let modelDataCache: string | null = null;
let modelDataCacheTime = 0;
const MODEL_CACHE_TTL = 60 * 60 * 1000; // 1 hour

function isVendorQuery(messages: Array<{ role: string; content: string }>): boolean {
  const lastUserMsg = messages
    .filter((m) => m.role === 'user')
    .pop()?.content?.toLowerCase() || '';
  return VENDOR_KEYWORDS.some((kw) => lastUserMsg.includes(kw));
}

async function fetchModelContext(): Promise<string | null> {
  // Return cached data if fresh
  if (modelDataCache && (Date.now() - modelDataCacheTime) < MODEL_CACHE_TTL) {
    return modelDataCache;
  }

  const apiKey = Deno.env.get('ARTIFICIALANALYSIS_API_KEY');
  if (!apiKey) return null;

  try {
    const response = await fetch('https://artificialanalysis.ai/api/v2/data/llms/models', {
      headers: { 'x-api-key': apiKey, 'Accept': 'application/json' },
    });
    if (!response.ok) return null;

    const raw = await response.json();
    const rawModels = raw?.data || raw;
    if (!Array.isArray(rawModels) || rawModels.length === 0) return null;

    // Build a compact table string for the top models
    const rows = rawModels
      .map((m: any) => {
        const name = m.name;
        if (!name) return null;
        const creator = m.model_creator?.name || 'Unknown';
        const quality = m.evaluations?.quality_index ?? m.evaluations?.arena_elo ?? '—';
        const inputPrice = m.pricing?.input_per_million_tokens ?? m.pricing?.input ?? '—';
        const outputPrice = m.pricing?.output_per_million_tokens ?? m.pricing?.output ?? '—';
        const speed = typeof m.median_output_tokens_per_second === 'number'
          ? Math.round(m.median_output_tokens_per_second)
          : '—';
        return { name, creator, quality, inputPrice, outputPrice, speed };
      })
      .filter(Boolean)
      .slice(0, 15);

    if (rows.length === 0) return null;

    const table = rows
      .map((r: any) => `${r.name} (${r.creator}) | Quality: ${r.quality} | Input: $${r.inputPrice}/M | Output: $${r.outputPrice}/M | Speed: ${r.speed} tok/s`)
      .join('\n');

    const context = `\n\n## CURRENT AI MODEL MARKET DATA (from Artificial Analysis, updated hourly)\nUse this data to give specific, number-backed recommendations when discussing models or vendors.\n\n${table}\n\nWhen citing this data: be opinionated. Compare prices and benchmarks directly. Tell them when the premium isn't worth it. Example: "Claude Opus is 6x more expensive than GPT-4o but only 3% better on benchmarks. For your use case, that premium probably isn't worth it."\nAlways mention that market data is from Artificial Analysis (artificialanalysis.ai).\n`;

    modelDataCache = context;
    modelDataCacheTime = Date.now();
    return context;
  } catch (e) {
    console.warn('Failed to fetch model data for chat context:', e);
    return null;
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { requestId, sessionId } = extractRequestContext(req);
  const logger = createLogger('chat-with-krish', requestId, sessionId);
  
  // #region agent log
  console.log(`[DEBUG_A] Request started: requestId=${requestId}, hypothesisId=A, timestamp=${Date.now()}`);
  // #endregion
  
  logger.info('Chat request started');
  
  try {
    const body = await req.json();
    
    // #region agent log
    console.log(`[DEBUG_A] Body received: keys=${Object.keys(body).join(',')}, hypothesisId=A`);
    // #endregion
    
    // Validate input
    const parseResult = chatRequestSchema.safeParse(body);
    if (!parseResult.success) {
      logger.warn('Validation failed', { errors: parseResult.error.flatten() });
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const { messages, widgetMode, mode } = parseResult.data;
    const isTryItWidget = widgetMode === 'tryit';
    
    // Detect Builder Profile mode: explicit mode param OR message content detection
    const isBuilderProfile = mode === 'builder-profile' || 
      (messages[0]?.content?.includes('AI readiness assessment') || 
       messages[0]?.content?.includes('Builder Profile') ||
       messages[0]?.content?.includes('CEO/COO/CPO\'s AI readiness'));
    
    logger.info('Request validated', { 
      widgetMode, 
      mode, 
      messageCount: messages.length, 
      isTryItWidget,
      isBuilderProfile 
    });

    // Get service account credentials
    const serviceAccountJson = Deno.env.get('GEMINI_SERVICE_ACCOUNT_KEY');
    
    // #region agent log
    console.log(`[DEBUG_A] GEMINI_SERVICE_ACCOUNT_KEY exists: ${!!serviceAccountJson}, length: ${serviceAccountJson?.length || 0}, hypothesisId=A`);
    // #endregion
    
    if (!serviceAccountJson) {
      // #region agent log
      console.log(`[DEBUG_A] GEMINI_SERVICE_ACCOUNT_KEY is NOT SET - this is the failure point, hypothesisId=A`);
      // #endregion
      console.error('GEMINI_SERVICE_ACCOUNT_KEY not configured');
      throw new Error('Service configuration error: GEMINI_SERVICE_ACCOUNT_KEY not set');
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
      // #region agent log
      console.log(`[DEBUG_B] Service account parsed successfully: client_email=${serviceAccount.client_email}, has_private_key=${!!serviceAccount.private_key}, private_key_length=${serviceAccount.private_key?.length || 0}, hypothesisId=B`);
      // #endregion
    } catch (error) {
      // #region agent log
      console.log(`[DEBUG_B] JSON parse FAILED: error=${error instanceof Error ? error.message : String(error)}, first100chars=${serviceAccountJson?.substring(0, 100)}, hypothesisId=B`);
      // #endregion
      console.error('Failed to parse service account JSON:', error);
      throw new Error('Invalid service account configuration: JSON parse failed');
    }

    // Validate service account structure
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      // #region agent log
      console.log(`[DEBUG_B] Service account structure invalid: has_private_key=${!!serviceAccount.private_key}, has_client_email=${!!serviceAccount.client_email}, keys=${Object.keys(serviceAccount).join(',')}, hypothesisId=B`);
      // #endregion
      console.error('Invalid service account structure');
      throw new Error('Invalid service account configuration: missing required fields');
    }

    // Select system prompt based on mode
    // Builder Profile gets minimal prompt that defers to user's detailed instructions
    let systemPrompt: string;
    if (isBuilderProfile) {
      systemPrompt = `You are Krish, founder of Mindmaker. Follow the instructions in the user message exactly. The user message contains complete, detailed instructions for generating a CEO-grade Builder Profile. Use those instructions as your primary guide.`;
    } else if (isTryItWidget) {
      systemPrompt = TRYIT_SYSTEM_PROMPT;
    } else {
      systemPrompt = CHAT_SYSTEM_PROMPT;
    }
    
    // #region agent log
    console.log(`[DEBUG_B] System prompt selected: isBuilderProfile=${isBuilderProfile}, isTryItWidget=${isTryItWidget}, promptLength=${systemPrompt.length}, promptType=${isBuilderProfile ? 'BUILDER_PROFILE' : isTryItWidget ? 'TRYIT' : 'CHAT'}, hypothesisId=B`);
    // #endregion

    // Inject live model data when user asks about vendors/models
    if (!isBuilderProfile && isVendorQuery(messages)) {
      logger.info('Vendor query detected, fetching model market data');
      const modelContext = await fetchModelContext();
      if (modelContext) {
        systemPrompt += modelContext;
        logger.info('Model market data injected into system prompt');
      }
    }

    // Create robust Vertex client and call
    const vertexClient = createMindmakerVertexClient();
    logger.info('Calling Vertex AI with robust client');

    // #region agent log
    console.log(`[DEBUG_CDE] Calling Vertex AI: projectId=${vertexClient.config.projectId}, location=${vertexClient.config.location}, model=${vertexClient.config.model}, ragCorpusId=${vertexClient.config.ragCorpusId}, hypothesisId=CDE`);
    // #endregion

    let result;
    try {
      result = await vertexClient.call({
        messages: messages.map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
        systemInstruction: systemPrompt,
        temperature: 0.8,
        // Builder Profile needs more tokens for CEO-grade detailed responses
        maxOutputTokens: isBuilderProfile ? 4096 : (isTryItWidget ? 1024 : 2048),
        useRag: true,
        similarityTopK: 8, // Increased for more context
        vectorDistanceThreshold: 0.4, // Decreased for higher relevance
      }, serviceAccount);
      
      // #region agent log
      console.log(`[DEBUG_E] Vertex AI SUCCESS: contentLength=${result.content.length}, cached=${result.cached}, retried=${result.retried}, hasGrounding=${!!result.groundingMetadata}, hypothesisId=E`);
      // #endregion
    } catch (vertexError) {
      // #region agent log
      console.log(`[DEBUG_CDE] Vertex AI FAILED: error=${vertexError instanceof Error ? vertexError.message : String(vertexError)}, stack=${vertexError instanceof Error ? vertexError.stack?.substring(0, 500) : 'N/A'}, hypothesisId=CDE`);
      // #endregion
      throw vertexError;
    }

    logger.info('Vertex AI response received', { 
      responseLength: result.content.length,
      cached: result.cached,
      retried: result.retried,
      hasGrounding: !!result.groundingMetadata,
    });

    const response: ChatResponse = {
      message: result.content,
      metadata: {
        model: vertexClient.config.model,
        cached: result.cached,
        fallback: false,
        retried: result.retried,
      },
    };

    logger.info('Chat request completed successfully');
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    logger.error('Chat request failed', { error: error instanceof Error ? error.message : String(error) });
    
    // Always return a usable response, never break the UI
    const errorResponse: ChatResponse = {
      message: FALLBACK_MESSAGE,
      metadata: {
        model: 'gemini-2.5-flash',
        cached: false,
        fallback: true,
      },
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 200, // Return 200 to avoid breaking the UI
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
