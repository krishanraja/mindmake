/**
 * @file notify-ctrl-waitlist Edge Function
 * @description Records a CTRL waitlist signup and notifies krish@themindmaker.ai via Resend.
 * @secrets RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const waitlistSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(200).optional().nullable(),
  source_page: z.string().max(100).optional().nullable(),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    if (!RESEND_API_KEY || !RESEND_API_KEY.trim().startsWith("re_")) {
      console.error(`[CtrlWaitlist][${requestId}] RESEND_API_KEY missing or invalid`);
      return new Response(
        JSON.stringify({ error: "Email service configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const body = await req.json();
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const data = parsed.data;

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { error } = await admin
          .from("ctrl_waitlist")
          .insert({
            email: data.email,
            name: data.name ?? null,
            source_page: data.source_page ?? null,
          });
        if (error) {
          console.error(`[CtrlWaitlist][${requestId}] insert failed:`, error.message);
        }
      } catch (e) {
        console.error(`[CtrlWaitlist][${requestId}] insert exception:`, (e as Error).message);
      }
    }

    const emailHtml = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;background:#f7f7f5;">
  <div style="background:#fff;padding:24px;border-radius:8px;">
    <h1 style="margin:0 0 12px 0;font-size:18px;color:#0e1a2b;">New CTRL waitlist signup</h1>
    <p style="margin:0 0 4px 0;font-size:14px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color:#0e1a2b;">${escapeHtml(data.email)}</a></p>
    ${data.name ? `<p style="margin:0 0 4px 0;font-size:14px;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>` : ""}
    ${data.source_page ? `<p style="margin:0;font-size:13px;color:#666;">Source: ${escapeHtml(data.source_page)}</p>` : ""}
  </div>
</body></html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mindmaker CTRL <ctrl@themindmaker.ai>",
        to: ["krish@themindmaker.ai"],
        reply_to: data.email,
        subject: `[CTRL waitlist] ${data.email}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error(`[CtrlWaitlist][${requestId}] Resend error:`, errorText);
      return new Response(
        JSON.stringify({ error: "Email delivery failed", success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error(`[CtrlWaitlist][${requestId}] Request failed:`, error?.message);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
