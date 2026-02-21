/**
 * @file send-contact-email Edge Function
 * @description Processes contact form submissions and sends notification emails via Resend.
 * @dependencies Resend API
 * @secrets RESEND_API_KEY
 *
 * Request:
 *   POST { name, email, message, company?, role?, interest? }
 *
 * Response:
 *   { success: true } or { error: string }
 *
 * Features:
 *   - RESEND_API_KEY validation (fail-fast)
 *   - Exponential backoff retry (3 attempts)
 *   - Structured error logging with requestId
 *   - Health check endpoint
 *   - Null-safe HTML escaping
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// HTML escape helper - handles undefined/null safely
const escapeHtml = (str: string | undefined | null): string => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Input validation schema - includes optional structured fields
const contactEmailSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  message: z.string().min(1, "Message is required").max(5000, "Message too long"),
  company: z.string().max(200).optional(),
  role: z.string().max(200).optional(),
  interest: z.string().max(200).optional(),
});

// Health check endpoint
const healthCheck = (): Response => {
  const hasApiKey = !!RESEND_API_KEY;
  const keyValid = RESEND_API_KEY ? RESEND_API_KEY.startsWith('re_') : false;

  return new Response(
    JSON.stringify({
      status: hasApiKey && keyValid ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      configuration: {
        resendApiKey: { configured: hasApiKey, valid: keyValid },
      },
    }),
    {
      status: hasApiKey && keyValid ? 200 : 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint
  const url = new URL(req.url);
  if (url.pathname.endsWith('/health') || url.searchParams.get('health') === 'true') {
    return healthCheck();
  }

  const requestId = crypto.randomUUID();
  const requestStartTime = Date.now();

  try {
    // Fail-fast: Validate RESEND_API_KEY
    if (!RESEND_API_KEY || RESEND_API_KEY.trim() === '') {
      console.error(`[ContactEmail][${requestId}] CRITICAL: RESEND_API_KEY is not configured`);
      return new Response(
        JSON.stringify({ error: "Email service configuration error. Please contact support." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const sanitizedApiKey = RESEND_API_KEY.trim();
    if (!sanitizedApiKey.startsWith('re_')) {
      console.error(`[ContactEmail][${requestId}] CRITICAL: RESEND_API_KEY format invalid (should start with 're_')`);
      return new Response(
        JSON.stringify({ error: "Email service configuration error. Please contact support." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();

    // Validate input
    const parseResult = contactEmailSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(`[ContactEmail][${requestId}] Validation failed:`, parseResult.error.flatten());
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, message, company, role, interest } = parseResult.data;

    console.log(`[ContactEmail][${requestId}] Processing:`, {
      email: email.substring(0, 10) + '...',
      hasCompany: !!company,
      hasRole: !!role,
      hasInterest: !!interest,
      timestamp: new Date().toISOString(),
    });

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f7f7f5;">
  <div style="background: linear-gradient(135deg, #0e1a2b 0%, #1a2b3d 100%); padding: 32px 24px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">New Contact Form Submission</h1>
    <p style="color: #7ef4c2; margin: 0; font-size: 14px;">themindmaker.ai/contact</p>
  </div>

  <div style="background: #ffffff; padding: 32px 24px; border-radius: 0 0 8px 8px;">
    <div style="background: #f7f7f5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Contact Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px; width: 100px;">Name</td>
          <td style="padding: 8px 0; color: #0e1a2b; font-size: 14px; font-weight: 600;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; color: #0e1a2b; font-size: 14px;"><a href="mailto:${escapeHtml(email)}" style="color: #0e1a2b; text-decoration: underline;">${escapeHtml(email)}</a></td>
        </tr>
        ${company ? `
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Company</td>
          <td style="padding: 8px 0; color: #0e1a2b; font-size: 14px;">${escapeHtml(company)}</td>
        </tr>
        ` : ''}
        ${role ? `
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Role</td>
          <td style="padding: 8px 0; color: #0e1a2b; font-size: 14px;">${escapeHtml(role)}</td>
        </tr>
        ` : ''}
        ${interest ? `
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Interest</td>
          <td style="padding: 8px 0; color: #0e1a2b; font-size: 14px;"><span style="background: #7ef4c2; color: #0e1a2b; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${escapeHtml(interest)}</span></td>
        </tr>
        ` : ''}
      </table>
    </div>

    <div style="margin-bottom: 24px;">
      <h2 style="color: #0e1a2b; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Message</h2>
      <div style="background: #fafafa; border-left: 4px solid #7ef4c2; padding: 16px 20px; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #333; font-size: 14px; white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      </div>
    </div>

    <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e5e3;">
      <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background: #0e1a2b; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 8px;">Reply to ${escapeHtml(name.split(' ')[0])}</a>
    </div>
  </div>

  <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
    <p style="margin: 0;">Sent from the contact form at <a href="https://www.themindmaker.ai/contact" style="color: #666;">themindmaker.ai</a></p>
    <p style="margin: 8px 0 0 0;">&copy; ${new Date().getFullYear()} Mindmaker LLC</p>
  </div>
</body>
</html>
    `;

    const requestBody = {
      from: 'Mindmaker Contact <contact@themindmaker.ai>',
      to: ['krish@themindmaker.ai'],
      reply_to: email,
      subject: `📬 New Contact: ${name}${company ? ` from ${company}` : ''}${interest ? ` - ${interest}` : ''}`,
      html: emailHtml,
    };

    // Send email with retry logic (3 attempts, exponential backoff)
    let emailSent = false;
    let lastError: Error | null = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[ContactEmail][${requestId}] Send attempt ${attempt}/${maxRetries}`);

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sanitizedApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error(`[ContactEmail][${requestId}] Resend API error:`, {
            attempt,
            status: emailResponse.status,
            statusText: emailResponse.statusText,
            errorBody: errorText,
          });

          lastError = new Error(`Resend API error (${emailResponse.status}): ${errorText}`);

          if (attempt < maxRetries) {
            const backoffMs = Math.pow(2, attempt - 1) * 1000;
            console.log(`[ContactEmail][${requestId}] Retrying in ${backoffMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }

          throw lastError;
        }

        const result = await emailResponse.json();
        emailSent = true;

        const duration = Date.now() - requestStartTime;
        console.log(`[ContactEmail][${requestId}] Email sent successfully:`, {
          attempt,
          duration: `${duration}ms`,
          emailId: result.id,
        });

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`[ContactEmail][${requestId}] Attempt ${attempt} failed:`, {
          error: lastError.message,
        });

        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }

    // All retries exhausted
    const duration = Date.now() - requestStartTime;
    console.error(`[ContactEmail][${requestId}] CRITICAL: Email failed after all retries:`, {
      totalAttempts: maxRetries,
      duration: `${duration}ms`,
      lastError: lastError?.message,
    });

    throw new Error(`Email delivery failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
  } catch (error: any) {
    const duration = Date.now() - requestStartTime;
    console.error(`[ContactEmail][${requestId}] Request failed:`, {
      duration: `${duration}ms`,
      error: error.message,
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
