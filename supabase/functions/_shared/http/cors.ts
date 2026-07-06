/**
 * @file cors.ts
 * @description First shared CORS + JSON-response helper for the edge functions.
 *
 *   Historically every function declared its own inline `corsHeaders`. This is the
 *   one place that set now lives. The header set is a SUPERSET of every function's
 *   previous headers — critically it includes `Access-Control-Allow-Methods`, which
 *   only the two static-page functions (submit-intake / submit-testimonial) used to
 *   send, so migrating those functions here keeps the hardcoded `/intake` and
 *   `/testimonials` pages working unchanged.
 */

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/** Standard JSON response with the shared CORS headers attached. */
export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/**
 * If the request is a CORS preflight, return the canonical `ok` response;
 * otherwise return null so the caller continues. Mirrors the two response
 * bodies used across the existing functions (`"ok"` and `null`); we standardise
 * on `"ok"` (what enrich-company / session-digest already return).
 */
export const handlePreflight = (req: Request): Response | null =>
  req.method === "OPTIONS" ? new Response("ok", { headers: corsHeaders }) : null;
