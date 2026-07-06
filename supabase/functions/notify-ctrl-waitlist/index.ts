/**
 * @file notify-ctrl-waitlist Edge Function
 * @description Records a CTRL waitlist signup and notifies Krish via the unified lead
 *   pipeline (so even a bare email gets researched into a real digest). Best-effort email,
 *   backgrounded. Response `{ success: true }`.
 * @secrets RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, + enrichment keys
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { recordSiteAudienceContact } from "../_shared/audience.ts";
import { json, handlePreflight } from "../_shared/http/cors.ts";
import { dispatchLead } from "../_shared/lead/pipeline.ts";
import { fromCtrlWaitlist } from "../_shared/lead/adapters.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const waitlistSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(200).optional().nullable(),
  source_page: z.string().max(100).optional().nullable(),
});

serve(async (req: Request): Promise<Response> => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      return json({ error: "Invalid input" }, 400);
    }
    const data = parsed.data;

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { error } = await admin
          .from("ctrl_waitlist")
          .insert({ email: data.email, name: data.name ?? null, source_page: data.source_page ?? null });
        if (error) console.error(`[CtrlWaitlist][${requestId}] insert failed:`, error.message);
      } catch (e) {
        console.error(`[CtrlWaitlist][${requestId}] insert exception:`, (e as Error).message);
      }
    }

    await recordSiteAudienceContact({
      email: data.email,
      name: data.name ?? null,
      metadata: { capture: "ctrl_waitlist", source_page: data.source_page ?? null },
    });

    await dispatchLead(fromCtrlWaitlist(data), { depth: "full" });

    return json({ success: true });
  } catch (error) {
    console.error(`[CtrlWaitlist][${requestId}] Request failed:`, (error as Error)?.message);
    // Waitlist is best-effort: never surface a hard error to the widget.
    return json({ success: true });
  }
});
