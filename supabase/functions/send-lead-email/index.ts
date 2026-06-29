/**
 * @file send-lead-email Edge Function
 * @description Processes lead submissions with AI-powered company research and sends
 *              enriched lead notification emails via Resend with retry logic.
 * @dependencies Resend API, Google AI (Gemini) API
 * @secrets RESEND_API_KEY, GOOGLE_AI_API_KEY
 * 
 * Request:
 *   POST { name, email, jobTitle, selectedProgram, commitmentLevel, audienceType, pathType, sessionData }
 * 
 * Response:
 *   { success: true } or { error: string }
 * 
 * Features:
 *   - Company research via Gemini with Google Search grounding (skipped for personal email domains)
 *   - Structured output for reliable parsing
 *   - Exponential backoff retry (3 attempts)
 *   - Session engagement data included in email
 *   - Commitment level prominently displayed
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createLogger, extractRequestContext } from '../_shared/logger.ts';
import { fetchWithTimeout } from '../_shared/timeout.ts';
import { recordSiteAudienceContact } from '../_shared/audience.ts';
import { extractDomain, validateEnvVars, ensureString } from '../_shared/validation.ts';
import { researchCompany, getDefaultResearch, type CompanyResearch } from '../_shared/company-research.ts';

// Validate required environment variables at startup
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const googleAIApiKey = Deno.env.get("GOOGLE_AI_API_KEY");

const envValidation = validateEnvVars({
  RESEND_API_KEY: RESEND_API_KEY,
});

if (!envValidation.isValid) {
  console.error("CRITICAL: Missing required environment variables:", envValidation.missing);
  // Don't throw here - we'll handle it in the handler to return proper error response
}

// Configuration validation on startup
async function validateConfiguration(): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  // Validate RESEND_API_KEY
  if (!RESEND_API_KEY || RESEND_API_KEY.trim() === '') {
    errors.push('RESEND_API_KEY is not configured');
  } else if (!RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY format invalid (should start with "re_")');
  }
  
  // Validate GOOGLE_AI_API_KEY format (if present)
  if (googleAIApiKey) {
    if (googleAIApiKey.trim() === '') {
      errors.push('GOOGLE_AI_API_KEY is empty');
    } else {
      // Test API key by making a minimal request
      try {
        const testResponse = await fetchWithTimeout(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${googleAIApiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'test' }] }],
              generationConfig: { maxOutputTokens: 1 }
            })
          },
          5000 // 5 second timeout for health check
        );
        
        if (!testResponse.ok && testResponse.status === 401) {
          errors.push('GOOGLE_AI_API_KEY is invalid or expired');
        } else if (!testResponse.ok && testResponse.status === 403) {
          errors.push('GOOGLE_AI_API_KEY lacks required permissions');
        }
      } catch (error) {
        // Timeout or network error - don't fail validation, just log
        console.warn('Could not validate GOOGLE_AI_API_KEY (network/timeout):', error);
      }
    }
  } else {
    console.warn('GOOGLE_AI_API_KEY not configured - company research will be disabled');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Run configuration validation on module load (non-blocking)
let configValidation: Promise<{ isValid: boolean; errors: string[] }> | null = null;
if (import.meta.main) {
  configValidation = validateConfiguration();
  configValidation.then(result => {
    if (!result.isValid) {
      console.error('Configuration validation failed:', result.errors);
    } else {
      console.log('✅ Configuration validation passed');
    }
  }).catch(err => {
    console.error('Configuration validation error:', err);
  });
}

// Initialize Supabase client for database operations
// In Supabase Edge Functions, these are available via environment variables
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY should be set in Supabase dashboard
const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials not available - database insert will be skipped");
    console.warn("Required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// HTML escape helper to prevent XSS in email content
const escapeHtml = (str: string | undefined | null): string => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Input validation schemas
const sessionDataSchema = z.object({
  frictionMap: z.object({
    problem: z.string().max(1000),
    timeSaved: z.number(),
    toolRecommendations: z.array(z.string()),
    generatedAt: z.string(),
  }).optional(),
  portfolioBuilder: z.object({
    selectedTasks: z.array(z.object({
      name: z.string(),
      hours: z.number(),
      savings: z.number(),
    })),
    totalTimeSaved: z.number(),
    totalCostSavings: z.number(),
  }).optional(),
  assessment: z.object({
    profileType: z.string(),
    profileDescription: z.string(),
    recommendedProduct: z.string(),
  }).optional(),
  tryItWidget: z.object({
    challenges: z.array(z.object({
      input: z.string(),
      response: z.string(),
      timestamp: z.string(),
    })),
  }).optional(),
  pagesVisited: z.array(z.string()).default([]),
  timeOnSite: z.number().default(0),
  scrollDepth: z.number().default(0),
});

const qualifierAnswersSchema = z.object({
  decision: z.string().max(500).default(""),
  tried: z.string().max(500).default(""),
  stakes: z.string().max(500).default(""),
});

const leadRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  jobTitle: z.string().max(100, "Job title too long").default(""),
  selectedProgram: z.string().max(50).default("not-sure"),
  commitmentLevel: z.string().max(20).optional(), // e.g., "1hr", "3hr", "4wk", "90d"
  audienceType: z.string().max(20).optional(), // "individual" or "team"
  pathType: z.string().max(20).optional(), // "build" or "orchestrate" (for individual)
  qualifierAnswers: qualifierAnswersSchema.optional(),
  sessionData: sessionDataSchema.default({
    pagesVisited: [],
    timeOnSite: 0,
    scrollDepth: 0,
  }),
});

// Health check endpoint for configuration validation
const healthCheck = async (): Promise<Response> => {
  const configResult = await validateConfiguration();
  
  return new Response(
    JSON.stringify({
      status: configResult.isValid ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      configuration: {
        resendApiKey: {
          configured: !!RESEND_API_KEY,
          valid: RESEND_API_KEY ? RESEND_API_KEY.startsWith('re_') : false,
        },
        googleAiApiKey: {
          configured: !!googleAIApiKey,
          validated: configResult.errors.length === 0,
        },
      },
      errors: configResult.errors,
    }),
    {
      status: configResult.isValid ? 200 : 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint
  const url = new URL(req.url);
  if (url.pathname.endsWith('/health') || url.searchParams.get('health') === 'true') {
    return await healthCheck();
  }

  // Structured logging for observability - declare at handler start
  const requestId = crypto.randomUUID();
  const requestStartTime = Date.now();

  try {
    // Validate and sanitize RESEND_API_KEY early - fail fast if missing
    if (!RESEND_API_KEY || RESEND_API_KEY.trim() === '') {
      console.error("CRITICAL: RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service configuration error. Please contact support." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize API key: trim whitespace and validate format
    const sanitizedApiKey = RESEND_API_KEY.trim();
    if (!sanitizedApiKey.startsWith('re_')) {
      console.error("CRITICAL: RESEND_API_KEY format invalid (should start with 're_')");
      console.error("API key first 10 chars:", sanitizedApiKey.substring(0, 10));
      return new Response(
        JSON.stringify({ error: "Email service configuration error. Please contact support." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Log API key info (for debugging, not full key)
    console.log("API key configured:", {
      present: true,
      length: sanitizedApiKey.length,
      startsWith: sanitizedApiKey.substring(0, 3),
      format: "valid"
    });

    const body = await req.json();
    
    // Validate input
    const parseResult = leadRequestSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.flatten());
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const { name, email, jobTitle, selectedProgram, commitmentLevel, audienceType, pathType, qualifierAnswers, sessionData } = parseResult.data;
    
    console.log("[LeadEmail] Request received:", {
      requestId,
      timestamp: new Date().toISOString(),
      email: email.substring(0, 10) + '...', // Partial email for privacy
      jobTitle,
      selectedProgram,
      commitmentLevel,
      audienceType,
      pathType,
      hasQualifierAnswers: Boolean(qualifierAnswers),
    });

    // Safely extract domain from email
    const domain = extractDomain(email);
    if (!domain) {
      console.error("Invalid email format - cannot extract domain:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Calculate engagement score early (needed for database insert)
    const engagementFactors = [
      sessionData.frictionMap ? 25 : 0,
      sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0 ? 25 : 0,
      sessionData.assessment ? 20 : 0,
      sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0 ? 15 : 0,
      Math.min(sessionData.timeOnSite / 180 * 10, 10), // Max 10 points for 3+ min
      Math.min(sessionData.scrollDepth / 100 * 5, 5), // Max 5 points for 100% scroll
    ];
    const engagementScore = Math.round(engagementFactors.reduce((a, b) => a + b, 0));
    
    // Research company using improved multi-source architecture
    // Personal email domains to skip
    const personalDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "me.com", "protonmail.com", "aol.com"];
    const isPersonalEmail = personalDomains.some(pd => domain.toLowerCase().includes(pd));

    // Initialize company research with defaults
    let companyResearch: CompanyResearch = getDefaultResearch(domain);
    
    // Metrics tracking
    const researchMetrics = {
      startTime: Date.now(),
      source: 'default' as string,
      cached: false,
      error: null as string | null,
    };

    // Perform research if not personal email
    if (!isPersonalEmail && domain) {
      try {
        console.log(`[CompanyResearch] Starting research for domain: ${domain}`);
        
        const supabaseClient = getSupabaseClient();
        
        // Use new research utility with caching and retry logic
        companyResearch = await researchCompany({
          domain,
          jobTitle,
          googleAIApiKey: googleAIApiKey || undefined,
          useCache: true,
          cacheClient: supabaseClient,
        });

        researchMetrics.source = companyResearch.source || 'unknown';
        researchMetrics.cached = companyResearch.source === 'cached';
        
        console.log(`[CompanyResearch] ✅ Research completed:`, {
          domain,
          companyName: companyResearch.companyName,
          industry: companyResearch.industry,
          companySize: companyResearch.companySize,
          confidence: companyResearch.confidence,
          source: researchMetrics.source,
          cached: researchMetrics.cached,
        });
      } catch (error) {
        researchMetrics.error = error instanceof Error ? error.message : String(error);
        console.error(`[CompanyResearch] ❌ Research failed for domain ${domain}:`, error);
        // Fall back to default research (already set above)
      }
    } else {
      if (isPersonalEmail) {
        console.log(`[CompanyResearch] Skipped: Personal email domain (${domain})`);
      } else if (!domain) {
        console.log(`[CompanyResearch] Skipped: No domain extracted`);
      }
    }

    // Log research metrics
    const researchDuration = Date.now() - researchMetrics.startTime;
    console.log(`[CompanyResearch] Metrics:`, {
      domain,
      duration: `${researchDuration}ms`,
      source: researchMetrics.source,
      cached: researchMetrics.cached,
      success: !researchMetrics.error,
      error: researchMetrics.error,
      industry: companyResearch.industry,
      companySize: companyResearch.companySize,
      confidence: companyResearch.confidence,
    });

    // Build comprehensive email
    const programLabels: Record<string, string> = {
      "for-you": "For You (Individual)",
      "for-team": "For Your Leadership Team",
      "for-portfolio": "For Your Business Portfolio",
      "not-sure": "Not sure yet",
      "build": "Build with AI",
      "orchestrate": "Orchestrate AI",
      "team": "Team Alignment",
      "individual": "Individual",
      "cohort-enrollment": "The AI-Fluent Executive (Cohort)",
      "signal-session": "The Signal Session",
      "revenue-architecture": "The Revenue Architecture",
      "workshop": "Mindmaker Workshop (any)",
      "workshop-chief-of-staff": "Workshop · Build Your AI Chief of Staff",
      "workshop-org-chart": "Workshop · Map Your Agentic Org Chart",
      "workshop-vibe-coding": "Workshop · Vibe Coding for Leaders",
      "workshop-autonomous": "Workshop · Build an Autonomous Business Function",
      "workshop-memory": "Workshop · Give Your AI Memory",
      "alumni": "The Alumni Pass (invitation request)",
      "free-lesson": "Free Lightning Lesson",
    };

    // Commitment level labels
    const commitmentLabels: Record<string, string> = {
      "1hr": "1 Hour Session",
      "3hr": "3 Hour Session",
      "4wk": "4 Week Program",
      "90d": "90 Day Program",
    };

    // Build session type label - ensure it's never undefined
    let sessionTypeLabel = programLabels[selectedProgram] || selectedProgram || "Not specified";
    if (audienceType === "individual" && pathType) {
      const pathLabel = programLabels[pathType] || pathType || "Individual";
      const commitmentLabel = commitmentLevel ? (commitmentLabels[commitmentLevel] || commitmentLevel) : "Not specified";
      sessionTypeLabel = `${pathLabel} - ${commitmentLabel}`;
    } else if (audienceType === "team") {
      const commitmentLabel = commitmentLevel ? (commitmentLabels[commitmentLevel] || commitmentLevel) : "Not specified";
      sessionTypeLabel = `Team Alignment - ${commitmentLabel}`;
    } else if (commitmentLevel) {
      const commitmentLabel = commitmentLabels[commitmentLevel] || commitmentLevel;
      sessionTypeLabel = `${sessionTypeLabel} - ${commitmentLabel}`;
    }
    
    // Final safety check
    if (!sessionTypeLabel || sessionTypeLabel === 'undefined') {
      sessionTypeLabel = "Not specified";
    }

    // Calculate engagement level from already-computed engagementScore
    const engagementLevel = engagementScore >= 70 ? 'Hot 🔥' : engagementScore >= 40 ? 'Warm ☀️' : 'New 🌱';

    const timeMinutes = Math.floor(sessionData.timeOnSite / 60);
    const timeSeconds = sessionData.timeOnSite % 60;

    // Final safety check: Ensure all companyResearch fields are ALWAYS strings
    // This prevents any "Cannot read properties of undefined" errors
    companyResearch.companyName = ensureString(companyResearch.companyName, domain || "Unknown Company");
    companyResearch.industry = ensureString(companyResearch.industry, "Unknown");
    companyResearch.companySize = ensureString(companyResearch.companySize, "unknown");
    companyResearch.latestNews = ensureString(companyResearch.latestNews, "Unable to verify company information");
    companyResearch.suggestedScope = ensureString(companyResearch.suggestedScope, "Discovery call to understand specific needs");
    companyResearch.confidence = (companyResearch.confidence === 'high' || companyResearch.confidence === 'medium' || companyResearch.confidence === 'low') 
      ? companyResearch.confidence 
      : 'low';

    // Insert lead to database FIRST (before email send)
    // This ensures we capture the lead even if email fails
    let leadId: string | null = null;
    const supabaseClient = getSupabaseClient();
    
    if (supabaseClient) {
      try {
        const { data: leadData, error: dbError } = await supabaseClient
          .from('leads')
          .insert({
            name,
            email,
            job_title: jobTitle,
            selected_program: selectedProgram,
            commitment_level: commitmentLevel,
            audience_type: audienceType,
            path_type: pathType,
            session_data: sessionData,
            company_research: companyResearch,
            engagement_score: engagementScore,
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database insert error:', dbError);
          // Continue with email send even if DB fails - don't block the flow
        } else {
          leadId = leadData?.id || null;
          console.log('Lead saved to database:', leadId);
        }
      } catch (dbErr) {
        console.error('Database insert exception:', dbErr);
        // Continue with email send even if DB fails
      }
    } else {
      console.warn('Supabase client not available - skipping database insert');
    }

    // Unified audience capture (additive, best-effort).
    await recordSiteAudienceContact({
      email,
      name,
      metadata: {
        capture: "lead_email",
        job_title: jobTitle ?? null,
        selected_program: selectedProgram ?? null,
        commitment_level: commitmentLevel ?? null,
        audience_type: audienceType ?? null,
        path_type: pathType ?? null,
        engagement_score: engagementScore ?? null,
      },
    });

    // Qualifier-driven leads carry three answers. Show them first, this is the
    // most insightful signal on the call.
    const hasQualifierAnswers = qualifierAnswers && (
      qualifierAnswers.decision.trim() ||
      qualifierAnswers.tried.trim() ||
      qualifierAnswers.stakes.trim()
    );

    // The three questions asked in PreCallQualifier.tsx, kept in sync manually.
    const qualifierQuestions = [
      { q: "What's the decision you're wrestling with?", a: qualifierAnswers?.decision },
      { q: "What's your timeline?", a: qualifierAnswers?.tried },
      { q: "What's the real cost of not solving this?", a: qualifierAnswers?.stakes },
    ];

    const likelyFitLabel = hasQualifierAnswers && programLabels[selectedProgram]
      ? programLabels[selectedProgram]
      : null;

    // Build email HTML - Clean Minimal Apple-Style Design
    // High contrast, excellent readability, professional
    let emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1d1d1f; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f7;">

  <!-- Outer Container -->
  <div style="background: #ffffff; margin: 20px; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: #1d1d1f; padding: 40px 32px; text-align: center;">
      <p style="color: #86868b; margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">New Lead</p>
      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">${escapeHtml(name)}</h1>
      <p style="color: #a1a1a6; margin: 8px 0 0 0; font-size: 17px; font-weight: 400;">${escapeHtml(jobTitle || 'Role not specified')}</p>
      ${likelyFitLabel ? `
      <p style="margin: 14px 0 0 0;">
        <span style="display: inline-block; background: rgba(0, 217, 182, 0.15); color: #00D9B6; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px;">Likely fit · ${escapeHtml(likelyFitLabel)}</span>
      </p>
      ` : ''}
    </div>

    <!-- Contact Email - HIGH CONTRAST -->
    <div style="background: #0071e3; padding: 24px 32px; text-align: center;">
      <p style="color: rgba(255,255,255,0.7); margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Contact Email</p>
      <a href="mailto:${escapeHtml(email)}" style="color: #ffffff; font-size: 20px; font-weight: 600; text-decoration: none; word-break: break-all;">${escapeHtml(email)}</a>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px;">
    `;

    // Pre-call qualifier Q&A (top of email, this is the primary signal)
    if (hasQualifierAnswers) {
      emailHtml += `
      <div style="background: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #1d1d1f; margin: 0 0 6px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">What they told us</h2>
        <p style="color: #86868b; margin: 0 0 16px 0; font-size: 12px;">Three tappable answers from the pre-call qualifier.</p>
      `;
      qualifierQuestions.forEach(({ q, a }, i) => {
        const answer = (a || "").trim() || "(none)";
        const marginBottom = i === qualifierQuestions.length - 1 ? '0' : '12px';
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin-bottom: ${marginBottom};">
          <p style="color: #86868b; margin: 0 0 8px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.2px;">Q: ${escapeHtml(q)}</p>
          <p style="color: #1d1d1f; margin: 0; font-size: 16px; font-weight: 600; line-height: 1.45; white-space: pre-wrap;">${escapeHtml(answer)}</p>
        </div>
        `;
      });
      emailHtml += `</div>`;
    }

    // Company intelligence (domain-inferred research)
    emailHtml += `
      <div style="background: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #1d1d1f; margin: 0 0 6px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Who they are</h2>
        <p style="color: #86868b; margin: 0 0 16px 0; font-size: 12px;">Inferred from their email domain (<strong>${escapeHtml(domain || 'unknown')}</strong>).</p>

        <div style="margin-bottom: 12px;">
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">Company</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 17px; font-weight: 600;">${escapeHtml(companyResearch.companyName)}</p>
        </div>

        <div style="margin-bottom: 12px;">
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">Industry</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 15px; font-weight: 500;">${escapeHtml(companyResearch.industry)}</p>
        </div>

        <div style="margin-bottom: ${companyResearch.latestNews && companyResearch.latestNews !== 'Unable to verify company information' ? '12px' : '0'};">
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">Size</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 15px; font-weight: 500; text-transform: capitalize;">${escapeHtml(companyResearch.companySize)}</p>
        </div>

        ${companyResearch.latestNews && companyResearch.latestNews !== 'Unable to verify company information' ? `
        <div style="margin-bottom: ${companyResearch.suggestedScope && companyResearch.suggestedScope !== 'Discovery call to understand specific needs' ? '12px' : '0'};">
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">Recent news</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 14px; font-weight: 400; line-height: 1.5;">${escapeHtml(companyResearch.latestNews)}</p>
        </div>
        ` : ''}

        ${companyResearch.suggestedScope && companyResearch.suggestedScope !== 'Discovery call to understand specific needs' ? `
        <div>
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">AI-suggested angle</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 14px; font-weight: 400; line-height: 1.5;">${escapeHtml(companyResearch.suggestedScope)}</p>
        </div>
        ` : ''}

        ${companyResearch.confidence && companyResearch.confidence !== 'low' ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #d2d2d7;">
          <span style="display: inline-block; background: ${companyResearch.confidence === 'high' ? '#34c759' : '#ff9500'}; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase;">AI confidence: ${escapeHtml(companyResearch.confidence)}</span>
        </div>
        ` : ''}
      </div>

      ${commitmentLevel ? `
      <!-- Program Interest (only rendered when commitment level set via the modal) -->
      <div style="background: #1d1d1f; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #86868b; margin: 0 0 12px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Program selected on intake</h2>
        <p style="color: #ffffff; margin: 0 0 4px 0; font-size: 24px; font-weight: 700;">${escapeHtml(commitmentLabels[commitmentLevel] || commitmentLevel)}</p>
        <p style="color: #a1a1a6; margin: 0; font-size: 15px; font-weight: 500;">${escapeHtml(sessionTypeLabel)}</p>
      </div>
      ` : ''}
    `;

    // Add session engagement data - only if there's meaningful data
    const hasEngagementData = sessionData.frictionMap ||
      (sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0) ||
      sessionData.assessment ||
      (sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0);
    
    if (hasEngagementData) {
      emailHtml += `
      <!-- Session Activity -->
      <div style="background: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #1d1d1f; margin: 0 0 16px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Session Activity</h2>
      `;
      
      if (sessionData.frictionMap) {
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="color: #1d1d1f; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Friction Map Tool</p>
          <p style="color: #86868b; margin: 0 0 4px 0; font-size: 13px;">Problem: "${escapeHtml(sessionData.frictionMap.problem)}"</p>
          <p style="color: #1d1d1f; margin: 0; font-size: 13px; font-weight: 500;">Potential savings: ${sessionData.frictionMap.timeSaved}h/week</p>
        </div>
        `;
      }

      if (sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0) {
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="color: #1d1d1f; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Portfolio Builder</p>
          <p style="color: #1d1d1f; margin: 0 0 4px 0; font-size: 13px;"><strong>${sessionData.portfolioBuilder.totalTimeSaved}h/week</strong> time savings</p>
          <p style="color: #34c759; margin: 0; font-size: 13px; font-weight: 600;">$${sessionData.portfolioBuilder.totalCostSavings.toLocaleString()}/month potential</p>
        </div>
        `;
      }

      if (sessionData.assessment) {
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="color: #1d1d1f; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Assessment Completed</p>
          <p style="color: #86868b; margin: 0 0 4px 0; font-size: 13px;">Profile: ${escapeHtml(sessionData.assessment.profileType)}</p>
          <p style="color: #1d1d1f; margin: 0; font-size: 13px;">Recommended: ${escapeHtml(sessionData.assessment.recommendedProduct)}</p>
        </div>
        `;
      }

      if (sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0) {
        const lastChallenge = sessionData.tryItWidget.challenges[sessionData.tryItWidget.challenges.length - 1];
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px;">
          <p style="color: #1d1d1f; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Try It Widget (${sessionData.tryItWidget.challenges.length}x)</p>
          <p style="color: #86868b; margin: 0; font-size: 13px; font-style: italic;">"${escapeHtml(lastChallenge.input.substring(0, 100))}${lastChallenge.input.length > 100 ? '...' : ''}"</p>
        </div>
        `;
      }
      
      emailHtml += `</div>`;
    }

    // Add closing sections to email
    emailHtml += `
      <!-- Engagement Metrics -->
      <div style="display: flex; justify-content: space-between; padding: 20px 0; border-top: 1px solid #d2d2d7;">
        <div style="text-align: center; flex: 1;">
          <p style="color: #86868b; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Engagement</p>
          <p style="color: #1d1d1f; margin: 6px 0 0 0; font-size: 18px; font-weight: 600;">${engagementLevel}</p>
        </div>
        <div style="text-align: center; flex: 1; border-left: 1px solid #d2d2d7; border-right: 1px solid #d2d2d7;">
          <p style="color: #86868b; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Score</p>
          <p style="color: #1d1d1f; margin: 6px 0 0 0; font-size: 18px; font-weight: 600;">${engagementScore}/100</p>
        </div>
        <div style="text-align: center; flex: 1;">
          <p style="color: #86868b; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Time on Site</p>
          <p style="color: #1d1d1f; margin: 6px 0 0 0; font-size: 18px; font-weight: 600;">${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}</p>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px 32px;">
      <p style="margin: 0; color: #86868b; font-size: 12px;">Lead captured at <a href="https://www.themindmaker.ai" style="color: #0071e3; text-decoration: none;">themindmaker.ai</a></p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email with retry logic
    let emailSent = false;
    let lastError: Error | null = null;
    const maxRetries = 3;
    const emailStartTime = Date.now();
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[EmailSend] Attempt ${attempt}/${maxRetries}`, {
          requestId,
          timestamp: new Date().toISOString(),
        });
        
        // Log request details for debugging
        const requestBody = {
          from: 'Mindmaker Leads <leads@themindmaker.ai>',
          to: ['krish@themindmaker.ai'],
          reply_to: email,
          subject: `🎯 Lead: ${name} from ${companyResearch.companyName} - ${sessionTypeLabel}`,
          html: emailHtml,
        };
        
        console.log("Resend API request details:", {
          url: 'https://api.resend.com/emails',
          method: 'POST',
          hasApiKey: !!sanitizedApiKey,
          apiKeyLength: sanitizedApiKey.length,
          apiKeyPrefix: sanitizedApiKey.substring(0, 5),
          from: requestBody.from,
          to: requestBody.to,
          subjectLength: requestBody.subject.length,
          htmlLength: requestBody.html.length
        });
        
        // CRITICAL FIX: Use regular fetch instead of fetchWithTimeout
        // Working functions (send-contact-email, send-leadership-insights-email) use regular fetch
        // The AbortController signal in fetchWithTimeout may interfere with Resend API authentication
        const emailResponse = await fetch(
          'https://api.resend.com/emails',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sanitizedApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          
          // Enhanced error logging for debugging
          console.error("[EmailSend] ❌ Resend API error:", {
            requestId,
            attempt,
            status: emailResponse.status,
            statusText: emailResponse.statusText,
            errorBody: errorText,
            timestamp: new Date().toISOString(),
          });
          
          lastError = new Error(`Resend API error (${emailResponse.status}): ${errorText}`);
          
          // Exponential backoff: 1s, 2s, 4s
          if (attempt < maxRetries) {
            const backoffMs = Math.pow(2, attempt - 1) * 1000;
            console.log(`Retrying in ${backoffMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }
          
          throw lastError;
        }

        const emailData = await emailResponse.json();
        const emailDuration = Date.now() - emailStartTime;
        
        console.log("[EmailSend] ✅ Email sent successfully:", {
          requestId,
          attempt,
          duration: `${emailDuration}ms`,
          emailId: emailData.id,
          timestamp: new Date().toISOString(),
        });
        
        emailSent = true;
        
        // Update lead record with email status
        if (leadId && supabaseClient) {
          try {
            await supabaseClient
              .from('leads')
              .update({ 
                email_sent: true,
                email_sent_at: new Date().toISOString()
              })
              .eq('id', leadId);
            console.log('Lead email status updated:', leadId);
          } catch (updateErr) {
            console.error('Failed to update lead email status:', updateErr);
            // Don't fail the whole request if update fails
          }
        }
        
        break;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error("[EmailSend] ❌ Network/request error:", {
          requestId,
          attempt,
          error: lastError.message,
          stack: lastError.stack,
          timestamp: new Date().toISOString(),
        });
        
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt - 1) * 1000;
          console.log(`Network error, retrying in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    if (!emailSent) {
      const totalEmailDuration = Date.now() - emailStartTime;
      console.error("[EmailSend] ❌ CRITICAL: Email failed after all retry attempts:", {
        requestId,
        totalAttempts: maxRetries,
        totalDuration: `${totalEmailDuration}ms`,
        lastError: lastError?.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`Email delivery failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
    }

    const requestDuration = Date.now() - requestStartTime;
    
    console.log("[LeadEmail] Request completed successfully:", {
      requestId,
      duration: `${requestDuration}ms`,
      leadId,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ 
      success: true, 
      leadId: leadId 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    const requestDuration = Date.now() - requestStartTime;
    
    console.error("[LeadEmail] Request failed:", {
      requestId,
      duration: `${requestDuration}ms`,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
