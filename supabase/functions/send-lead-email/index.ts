/**
 * @file send-lead-email Edge Function
 * @description Lead submissions from the consult modal / `sendLeadEmail` helper. Persists a
 *   `leads` row + audience contact, then hands off to the unified lead pipeline, which
 *   researches the company (via the shared enrichment orchestrator) and emails Krish one
 *   consistent digest. The resolved dossier is written back into `leads.company_research`.
 *   The email send is backgrounded so the modal returns instantly. Response `{ success, leadId }`.
 * @secrets RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, + enrichment keys
 *
 * Note: `leads.company_research` now stores an enrichment {@link Dossier} (previously a
 * CompanyResearch). jsonb tolerates the shape change; consumers reading that column should
 * expect the dossier shape (`identity` / `understanding` / `scale` / `currency` / `synthesis`).
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { recordSiteAudienceContact } from "../_shared/audience.ts";
import { json, handlePreflight } from "../_shared/http/cors.ts";
import { hasResendKey } from "../_shared/http/resend.ts";
import { dispatchLead } from "../_shared/lead/pipeline.ts";
import { fromLead } from "../_shared/lead/adapters.ts";

const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
};

const sessionDataSchema = z.object({
  frictionMap: z
    .object({
      problem: z.string().max(1000),
      timeSaved: z.number(),
      toolRecommendations: z.array(z.string()),
      generatedAt: z.string(),
    })
    .optional(),
  portfolioBuilder: z
    .object({
      selectedTasks: z.array(z.object({ name: z.string(), hours: z.number(), savings: z.number() })),
      totalTimeSaved: z.number(),
      totalCostSavings: z.number(),
    })
    .optional(),
  assessment: z
    .object({ profileType: z.string(), profileDescription: z.string(), recommendedProduct: z.string() })
    .optional(),
  tryItWidget: z
    .object({ challenges: z.array(z.object({ input: z.string(), response: z.string(), timestamp: z.string() })) })
    .optional(),
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
  commitmentLevel: z.string().max(20).optional(),
  audienceType: z.string().max(20).optional(),
  pathType: z.string().max(20).optional(),
  qualifierAnswers: qualifierAnswersSchema.optional(),
  sessionData: sessionDataSchema.default({ pagesVisited: [], timeOnSite: 0, scrollDepth: 0 }),
});

const healthCheck = (): Response =>
  json(
    {
      status: hasResendKey() ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      configuration: { resendApiKey: { configured: hasResendKey(), valid: hasResendKey() } },
    },
    hasResendKey() ? 200 : 503,
  );

serve(async (req: Request): Promise<Response> => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  const url = new URL(req.url);
  if (url.pathname.endsWith("/health") || url.searchParams.get("health") === "true") {
    return healthCheck();
  }

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    const parseResult = leadRequestSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(`[LeadEmail][${requestId}] Validation failed:`, parseResult.error.flatten());
      return json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
    }

    const { name, email, jobTitle, selectedProgram, commitmentLevel, audienceType, pathType, qualifierAnswers, sessionData } =
      parseResult.data;

    // Engagement score (same weighting as before), used for the DB row + the digest.
    const engagementFactors = [
      sessionData.frictionMap ? 25 : 0,
      sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0 ? 25 : 0,
      sessionData.assessment ? 20 : 0,
      sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0 ? 15 : 0,
      Math.min((sessionData.timeOnSite / 180) * 10, 10),
      Math.min((sessionData.scrollDepth / 100) * 5, 5),
    ];
    const engagementScore = Math.round(engagementFactors.reduce((a, b) => a + b, 0));

    // Insert the lead FIRST so it is captured even if enrichment/email fail.
    let leadId: string | null = null;
    const supabaseClient = getSupabaseClient();
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("leads")
          .insert({
            name,
            email,
            job_title: jobTitle,
            selected_program: selectedProgram,
            commitment_level: commitmentLevel,
            audience_type: audienceType,
            path_type: pathType,
            session_data: sessionData,
            engagement_score: engagementScore,
          })
          .select("id")
          .single();
        if (error) console.error(`[LeadEmail][${requestId}] leads insert failed:`, error.message);
        else leadId = data?.id ?? null;
      } catch (e) {
        console.error(`[LeadEmail][${requestId}] leads insert exception:`, (e as Error).message);
      }
    }

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

    // Research + email Krish in the background; persist the dossier + email_sent when done.
    await dispatchLead(
      fromLead(
        { name, email, jobTitle, selectedProgram, commitmentLevel, audienceType, pathType, qualifierAnswers, sessionData },
        { engagementScore },
      ),
      { depth: "full" },
      async ({ sent, dossier }) => {
        if (!leadId || !supabaseClient) return;
        const patch: Record<string, unknown> = {};
        if (dossier) patch.company_research = dossier;
        if (sent) {
          patch.email_sent = true;
          patch.email_sent_at = new Date().toISOString();
        }
        if (Object.keys(patch).length) {
          try {
            await supabaseClient.from("leads").update(patch).eq("id", leadId);
          } catch (e) {
            console.error(`[LeadEmail][${requestId}] lead update failed:`, (e as Error).message);
          }
        }
      },
    );

    return json({ success: true, leadId });
  } catch (error) {
    console.error(`[LeadEmail][${requestId}] Request failed:`, (error as Error).message);
    return json({ error: (error as Error).message }, 500);
  }
});
