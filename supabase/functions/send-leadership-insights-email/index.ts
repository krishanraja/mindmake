/**
 * @file send-leadership-insights-email Edge Function
 * @description Decision Readiness Diagnostic (/leaders). Sends TWO emails:
 *   1. the VISITOR their styled score-card results (unchanged, visitor-facing), and
 *   2. Krish a notification — now routed through the unified lead pipeline so it matches
 *      every other lead digest and carries company research + an operator's read.
 *   Response `{ success, userEmailSent }` is unchanged.
 * @secrets RESEND_API_KEY, + enrichment keys
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { recordSiteAudienceContact } from "../_shared/audience.ts";
import { json, handlePreflight } from "../_shared/http/cors.ts";
import { sendResendEmail, hasResendKey } from "../_shared/http/resend.ts";
import { esc } from "../_shared/lead/escape.ts";
import { dispatchLead } from "../_shared/lead/pipeline.ts";
import { fromLeadershipInsights } from "../_shared/lead/adapters.ts";

const leadershipInsightsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  department: z.string().optional(),
  aiFocus: z.string().optional(),
  results: z
    .object({
      score: z.number(),
      tier: z.string(),
      percentile: z.number(),
      strengths: z.array(z.string()),
      growthAreas: z.array(z.string()),
      strategicInsights: z.array(z.string()),
      promptTemplates: z.array(z.string()),
      actionPlan: z.array(z.string()),
    })
    .optional(),
});

type Results = z.infer<typeof leadershipInsightsSchema>["results"];

const getTierColor = (tier: string) => {
  if (tier.includes("Visionary") || tier.includes("Advanced")) return "#22c55e";
  if (tier.includes("Strategic") || tier.includes("Developing")) return "#f59e0b";
  return "#ef4444";
};

/** The visitor-facing results email (their score card). Unchanged from the original. */
function buildVisitorResultsHtml(name: string, results: Results): string {
  if (!results) {
    return `<!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h1>Thank you for your interest!</h1>
      <p>Hi ${esc(name)},</p>
      <p>We received your submission but couldn't generate detailed results. Please try the assessment again or reach out to us directly.</p>
      <a href="https://www.themindmaker.ai/#book">Book a Session</a>
    </body></html>`;
  }
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f7f7f5;">
  <div style="background: linear-gradient(135deg, #0e1a2b 0%, #1a2b3d 100%); padding: 40px 24px; text-align: center;">
    <p style="color: #00D9B6; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">AI Leadership Benchmark</p>
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Results Are In</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 12px 0 0 0; font-size: 16px;">Personalized for ${esc(name)}</p>
  </div>
  <div style="background: #ffffff; padding: 32px 24px;">
    <div style="background: linear-gradient(135deg, #f7f7f5 0%, #e8f5f0 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
      <p style="color: #666; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your AI Leadership Score</p>
      <div style="font-size: 72px; font-weight: 800; color: #0e1a2b; margin: 0; line-height: 1;">${results.score}</div>
      <p style="color: #666; margin: 4px 0 16px 0; font-size: 14px;">out of 100</p>
      <div style="display: inline-block; background: ${getTierColor(results.tier)}; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">${esc(results.tier)}</div>
      <p style="color: #666; margin: 16px 0 0 0; font-size: 14px;">Top <strong>${100 - results.percentile}%</strong> of executives assessed</p>
    </div>
    <div style="margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Your Strengths</h2>
      ${results.strengths.map((s) => `<div style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 12px 16px; margin-bottom: 8px; border-radius: 0 8px 8px 0;"><p style="margin: 0; color: #166534; font-size: 14px;">${esc(s)}</p></div>`).join("")}
    </div>
    <div style="margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Growth Opportunities</h2>
      ${results.growthAreas.map((g) => `<div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 12px 16px; margin-bottom: 8px; border-radius: 0 8px 8px 0;"><p style="margin: 0; color: #92400e; font-size: 14px;">${esc(g)}</p></div>`).join("")}
    </div>
    <div style="margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Strategic Insights</h2>
      ${results.strategicInsights.map((insight, i) => `<div style="display: flex; margin-bottom: 12px;"><div style="width: 28px; height: 28px; background: #0e1a2b; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 600; flex-shrink: 0; margin-right: 12px;">${i + 1}</div><p style="margin: 0; color: #333; font-size: 14px; padding-top: 4px;">${esc(insight)}</p></div>`).join("")}
    </div>
    <div style="background: #f7f7f5; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">AI Prompt Templates for You</h2>
      <p style="color: #666; margin: 0 0 16px 0; font-size: 13px;">Copy and paste these into ChatGPT or Claude:</p>
      ${results.promptTemplates.map((p, i) => `<div style="background: #ffffff; border: 1px solid #e5e5e3; padding: 16px; border-radius: 8px; margin-bottom: 12px;"><p style="color: #666; margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Prompt ${i + 1}</p><code style="color: #0e1a2b; font-size: 13px; line-height: 1.5; display: block; white-space: pre-wrap;">${esc(p)}</code></div>`).join("")}
    </div>
    <div style="margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Your 90-Day Action Plan</h2>
      ${results.actionPlan.map((action, i) => `<div style="display: flex; align-items: flex-start; margin-bottom: 12px; padding: 12px; background: ${i % 2 === 0 ? "#fafafa" : "#fff"}; border-radius: 8px;"><div style="width: 24px; height: 24px; border: 2px solid #00D9B6; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></div><p style="margin: 0; color: #333; font-size: 14px;">${esc(action)}</p></div>`).join("")}
    </div>
    <div style="background: linear-gradient(135deg, #0e1a2b 0%, #1a2b3d 100%); color: white; padding: 32px 24px; border-radius: 12px; text-align: center;">
      <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">Ready to Accelerate Your AI Journey?</h3>
      <p style="margin: 0 0 20px 0; opacity: 0.9; font-size: 14px;">Book a free consultation with Krish to make your first nervous decision with confidence.</p>
      <a href="https://www.themindmaker.ai/#book" style="display: inline-block; background: #00D9B6; color: #0e1a2b; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">What's your nervous decision? &rarr;</a>
    </div>
  </div>
  <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
    <p style="margin: 0;">You completed the AI Leadership Benchmark at <a href="https://www.themindmaker.ai" style="color: #666;">themindmaker.ai</a></p>
    <p style="margin: 8px 0 0 0;">&copy; ${new Date().getFullYear()} Mindmaker LLC</p>
  </div>
</body></html>`;
}

serve(async (req: Request): Promise<Response> => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  const url = new URL(req.url);
  if (url.pathname.endsWith("/health") || url.searchParams.get("health") === "true") {
    return json(
      { status: hasResendKey() ? "healthy" : "unhealthy", timestamp: new Date().toISOString() },
      hasResendKey() ? 200 : 503,
    );
  }

  const requestId = crypto.randomUUID();

  try {
    const body = await req.json();
    const parseResult = leadershipInsightsSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(`[LeadershipEmail][${requestId}] Validation failed:`, parseResult.error.flatten());
      return json({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }, 400);
    }

    const { name, email, department, aiFocus, results } = parseResult.data;

    await recordSiteAudienceContact({
      email,
      name,
      metadata: {
        capture: "leadership_diagnostic",
        department: department ?? null,
        ai_focus: aiFocus ?? null,
        score: results?.score ?? null,
        tier: results?.tier ?? null,
        percentile: results?.percentile ?? null,
      },
    });

    // 1) Visitor results email — visitor-facing, sent inline (best-effort).
    const userEmail = await sendResendEmail(
      {
        from: "Mindmaker AI Insights <insights@themindmaker.ai>",
        to: [email],
        subject: `${name}, Your AI Leadership Score: ${results?.score ?? "N/A"}/100`,
        html: buildVisitorResultsHtml(name, results),
      },
      { label: "leadership:visitor" },
    );
    if (!userEmail.ok) {
      console.error(`[LeadershipEmail][${requestId}] Visitor email failed (non-blocking):`, userEmail.error);
    }

    // 2) Krish notification — routed through the unified pipeline (research + operator's read).
    await dispatchLead(fromLeadershipInsights({ name, email, department, aiFocus, results }), { depth: "full" });

    return json({ success: true, userEmailSent: userEmail.ok });
  } catch (error) {
    console.error(`[LeadershipEmail][${requestId}] Request failed:`, (error as Error).message);
    return json({ error: (error as Error).message }, 500);
  }
});
