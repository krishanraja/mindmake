/**
 * @file send-contact-email Edge Function
 * @description Contact-form submissions. Persists a `leads` row + audience contact, then
 *   hands off to the unified lead pipeline (`dispatchLead`) which researches the company
 *   and emails Krish one consistent, well-formatted digest. The email send is backgrounded
 *   so the form returns instantly. Response contract `{ success, leadId }` is unchanged.
 * @secrets RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, + enrichment keys
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { recordSiteAudienceContact } from "../_shared/audience.ts";
import { corsHeaders, json, handlePreflight } from "../_shared/http/cors.ts";
import { hasResendKey } from "../_shared/http/resend.ts";
import { dispatchLead } from "../_shared/lead/pipeline.ts";
import { fromContact } from "../_shared/lead/adapters.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const mapInterestToProgram = (interest: string | undefined): string => {
  if (interest === "4-week-sprint") return "4-week";
  if (interest === "90-day-sprint") return "90-day";
  return "not-sure";
};
const mapInterestToCommitment = (interest: string | undefined): string => {
  if (interest === "4-week-sprint") return "4wk";
  if (interest === "90-day-sprint") return "90d";
  return "not-sure";
};

const contactEmailSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  message: z.string().min(1, "Message is required").max(5000, "Message too long"),
  company: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  interest: z.string().max(200).optional(),
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
    const parseResult = contactEmailSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(`[ContactEmail][${requestId}] Validation failed:`, parseResult.error.flatten());
      return json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
    }

    const { name, email, message, company, role, interest } = parseResult.data;

    // Persist the contact as a lead row (system of record). Non-blocking.
    let leadId: string | null = null;
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await admin
          .from("leads")
          .insert({
            name,
            email,
            job_title: role || null,
            selected_program: mapInterestToProgram(interest),
            commitment_level: mapInterestToCommitment(interest),
            audience_type: "individual",
            path_type: null,
            session_data: {
              source: "contact-form",
              message,
              company: company || null,
              role: role || null,
              interest: interest || null,
              submittedAt: new Date().toISOString(),
            },
            engagement_score: 40,
          })
          .select("id")
          .single();
        if (error) console.error(`[ContactEmail][${requestId}] leads insert failed:`, error.message);
        else leadId = data?.id ?? null;
      } catch (e) {
        console.error(`[ContactEmail][${requestId}] leads insert exception:`, (e as Error).message);
      }
    }

    await recordSiteAudienceContact({
      email,
      name,
      metadata: { capture: "contact_form", company: company || null, role: role || null, interest: interest || null },
    });

    // Research + email Krish the digest in the background.
    await dispatchLead(
      fromContact({ name, email, message, company, role, interest }),
      { depth: "full" },
      async ({ sent }) => {
        if (sent && leadId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
          try {
            const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
            await admin.from("leads").update({ email_sent: true, email_sent_at: new Date().toISOString() }).eq("id", leadId);
          } catch (e) {
            console.error(`[ContactEmail][${requestId}] email_sent flag update failed:`, (e as Error).message);
          }
        }
      },
    );

    return json({ success: true, leadId });
  } catch (error) {
    console.error(`[ContactEmail][${requestId}] Request failed:`, (error as Error).message);
    return json({ error: (error as Error).message }, 500);
  }
});
