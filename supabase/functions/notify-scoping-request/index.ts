/**
 * @file notify-scoping-request Edge Function
 * @description Persists a scoping request (Signal Session / Revenue Architecture / Immersion)
 *              and notifies krish@themindmaker.ai via Resend.
 * @secrets RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { recordSiteAudienceContact } from "../_shared/audience.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (str: string | undefined | null): string => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    if (!RESEND_API_KEY || !RESEND_API_KEY.trim().startsWith("re_")) {
      console.error(`[ScopingRequest][${requestId}] RESEND_API_KEY missing or invalid`);
      return new Response(
        JSON.stringify({ error: "Email service configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const body = await req.json();
    const parsed = scopingSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
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
        if (error) {
          console.error(`[ScopingRequest][${requestId}] insert failed:`, error.message);
        } else {
          rowId = inserted?.id ?? null;
        }
      } catch (e) {
        console.error(`[ScopingRequest][${requestId}] insert exception:`, (e as Error).message);
      }
    }

    // Unified audience capture (additive, best-effort).
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

    const submittedAt = new Date().toISOString();
    const emailHtml = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a1a;max-width:640px;margin:0 auto;padding:0;background:#f7f7f5;">
  <div style="background:linear-gradient(135deg,#0e1a2b 0%,#1a2b3d 100%);padding:32px 24px;">
    <h1 style="color:#fff;margin:0 0 6px 0;font-size:22px;">New scoping request</h1>
    <p style="color:#00D9B6;margin:0;font-size:13px;">${escapeHtml(data.source_page)}</p>
  </div>
  <div style="background:#fff;padding:28px 24px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#666;width:140px;">Name</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color:#0e1a2b;">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#666;">Company &amp; role</td><td style="padding:6px 0;">${escapeHtml(data.company_role)}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Campaign</td><td style="padding:6px 0;">${escapeHtml(data.source_campaign || "(direct)")}</td></tr>
      <tr><td style="padding:6px 0;color:#666;">Submitted</td><td style="padding:6px 0;">${escapeHtml(submittedAt)}</td></tr>
    </table>
    <div style="margin-top:20px;">
      <p style="margin:0 0 6px 0;font-weight:700;color:#0e1a2b;">Decision or problem to resolve</p>
      <div style="background:#fafafa;border-left:4px solid #00D9B6;padding:14px 18px;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.decision_or_problem)}</div>
    </div>
    <div style="margin-top:18px;">
      <p style="margin:0 0 6px 0;font-weight:700;color:#0e1a2b;">What success looks like in 30 days</p>
      <div style="background:#fafafa;border-left:4px solid #00D9B6;padding:14px 18px;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.success_in_30_days)}</div>
    </div>
    <div style="margin-top:18px;">
      <p style="margin:0 0 6px 0;font-weight:700;color:#0e1a2b;">Notes</p>
      <div style="background:#fafafa;border-left:4px solid #e5e5e3;padding:14px 18px;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.notes || "(none)")}</div>
    </div>
    <div style="text-align:center;padding-top:20px;margin-top:24px;border-top:1px solid #e5e5e3;">
      <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:#0e1a2b;color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${escapeHtml(data.name.split(" ")[0])}</a>
    </div>
  </div>
</body></html>`;

    const requestBody = {
      from: "Mindmaker Scoping <scoping@themindmaker.ai>",
      to: ["krish@themindmaker.ai"],
      reply_to: data.email,
      subject: `[Scoping] ${data.source_page} — ${data.company_role}`,
      html: emailHtml,
    };

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error(`[ScopingRequest][${requestId}] Resend error:`, errorText);
      return new Response(
        JSON.stringify({ error: `Email delivery failed: ${errorText}`, rowId }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    return new Response(JSON.stringify({ success: true, rowId }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error(`[ScopingRequest][${requestId}] Request failed:`, error?.message);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
