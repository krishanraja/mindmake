/**
 * @file notify-scoping-request Edge Function
 * @description Persists a scoping request (The Teardown / The Handover)
 *   and notifies Krish via the unified lead pipeline (research + one consistent digest).
 *   The email is backgrounded so the modal returns instantly. Response `{ success, rowId }`.
 * @secrets RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, + enrichment keys
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { recordSiteAudienceContact } from "../_shared/audience.ts";
import { json, handlePreflight } from "../_shared/http/cors.ts";
import { dispatchLead } from "../_shared/lead/pipeline.ts";
import { fromScoping } from "../_shared/lead/adapters.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const scopingSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  company_role: z.string().min(1).max(300),
  decision_or_problem: z.string().min(1).max(500),
  success_in_30_days: z.string().min(1).max(500),
  notes: z.string().max(2000).optional().nullable(),
  source_page: z.string().min(1).max(100),
  source_campaign: z.string().max(200).optional().nullable(),
  user_agent: z.string().max(500).optional().nullable(),
});

serve(async (req: Request): Promise<Response> => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    const parsed = scopingSchema.safeParse(body);
    if (!parsed.success) {
      return json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, 400);
    }
    const data = parsed.data;

    let rowId: string | null = null;
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data: inserted, error } = await admin
          .from("scoping_requests")
          .insert({
            name: data.name,
            email: data.email,
            company_role: data.company_role,
            decision_or_problem: data.decision_or_problem,
            success_in_30_days: data.success_in_30_days,
            notes: data.notes ?? null,
            source_page: data.source_page,
            source_campaign: data.source_campaign ?? null,
            user_agent: data.user_agent ?? null,
          })
          .select("id")
          .single();
        if (error) console.error(`[ScopingRequest][${requestId}] insert failed:`, error.message);
        else rowId = inserted?.id ?? null;
      } catch (e) {
        console.error(`[ScopingRequest][${requestId}] insert exception:`, (e as Error).message);
      }
    }

    await recordSiteAudienceContact({
      email: data.email,
      name: data.name,
      metadata: {
        capture: "scoping_request",
        company_role: data.company_role,
        decision_or_problem: data.decision_or_problem,
        success_in_30_days: data.success_in_30_days,
        source_page: data.source_page,
        source_campaign: data.source_campaign ?? null,
      },
    });

    await dispatchLead(fromScoping(data), { depth: "full" });

    return json({ success: true, rowId });
  } catch (error) {
    console.error(`[ScopingRequest][${requestId}] Request failed:`, (error as Error)?.message);
    return json({ error: (error as Error)?.message || "Unknown error" }, 500);
  }
});
