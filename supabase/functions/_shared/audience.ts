/**
 * Shared audience capture for the Mindmaker site.
 *
 * Every site capture surface (scoping request, CTRL waitlist, lead email,
 * leadership diagnostic, contact form) calls this so the contact lands in the
 * shared `audience_contacts` table tagged source='mindmaker_site'. That is the
 * unified audience list: "where did this lead come from" is one query across
 * ctrl | mindmaker_site | mindmaker_live | builder_economy.
 *
 * Best-effort by contract: it never throws and never blocks the caller. Each
 * surface keeps writing its own detail table (scoping_requests, leads, etc.);
 * this is an additive, parallel write. audience_contacts has UNIQUE(email,
 * source), so a returning contact (Postgres 23505) is treated as success.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function recordSiteAudienceContact(input: {
  email: string;
  name?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<boolean> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !supabaseServiceKey) return false;
  const email = (input.email ?? "").trim().toLowerCase();
  if (!email) return false;
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
    const { error } = await supabase.from("audience_contacts").insert({
      email,
      name: input.name?.trim() || null,
      source: "mindmaker_site",
      metadata: input.metadata ?? {},
    });
    if (error && error.code !== "23505") {
      console.error(`[audience_contacts] mindmaker_site insert failed: ${error.message}`);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[audience_contacts] mindmaker_site insert threw: ${(e as Error).message}`);
    return false;
  }
}
