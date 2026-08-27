/**
 * @file enrich-company Edge Function (thin HTTP wrapper over the shared orchestrator)
 * @description Turns a visitor's work email / domain / company name into a company Dossier
 *   so the on-site guide ("Mindy") can show she already understands the business before
 *   asking a single question.
 *
 *   The actual fan-out / merge / routing / synthesis now lives in
 *   `../_shared/enrich/orchestrate.ts` (`assembleDossier`), so the unified lead pipeline can
 *   reuse it in-process without an HTTP hop. This function keeps the HTTP concerns: CORS,
 *   per-IP rate limiting, the global request ceiling, visitor-country geo resolution, and
 *   mapping the orchestrator's result to the response contract below (UNCHANGED from before).
 *
 * ---------------------------------------------------------------------------
 * REQUEST  (POST, JSON):
 *   { "domain"?: string, "email"?: string, "name"?: string, "depth"?: "identity" | "full" }
 *   Provide at least one of `domain` / `email` / `name`.
 *   depth "identity" → Brandfetch + Tranco only (~1s co-brand paint).
 *   depth "full"     → adds PDL + BuiltWith + Currency, then Gemini/Anthropic synthesis.
 *
 * RESPONSE (200, JSON):
 *   - Resolvable work domain:        the full Dossier object.
 *   - Free-email domain (gmail etc): { "skipped": "free-email", "dossier": null }
 * ERRORS: 400 no usable domain · 404 identity hard miss · 405 non-POST · 429 rate/ceiling.
 *
 * INTERNAL-ONLY FIELDS, NEVER RECITED TO THE USER: `dossier.scale.*`.
 *
 * @env BRANDFETCH_API_KEY, PEOPLEDATALABS_API_KEY, BUILTWITH_API_KEY, EXA_API_KEY,
 *      PERPLEXITY_API_KEY, NEWSAPI_API_KEY, GOOGLE_AI_API_KEY, ANTHROPIC_API_KEY.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { assembleDossier } from "../_shared/enrich/orchestrate.ts";
import { generateTailoredChoices } from "../_shared/enrich/choices.ts";
import { createLogger } from "../_shared/logger.ts";

// --- CORS / response helpers ------------------------------------------------

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// --- Abuse controls (per cold start, in-memory, best-effort) ----------------

const ipHits = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX_PER_WINDOW = 40; // 40 requests / IP / window

let totalServed = 0;
const REQUEST_CEILING = 5000;

// ---------------------------------------------------------------------------

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function withinRateLimit(ip: string, now: number): boolean {
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX_PER_WINDOW) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

/**
 * Best-effort ISO-3166 alpha-2 country for the visitor, used to bias enrichment toward
 * the visitor's locale. Prefers edge geo headers; falls back to a fast IP lookup;
 * defaults to 'US'. Stays at the HTTP boundary because it needs the request headers.
 */
async function resolveVisitorCountry(req: Request): Promise<string> {
  const DEFAULT_COUNTRY = "US";
  const normalise = (raw: string | null): string | null => {
    const v = (raw ?? "").trim().toUpperCase();
    return /^[A-Z]{2}$/.test(v) && !["XX", "ZZ", "T1"].includes(v) ? v : null;
  };
  const header =
    normalise(req.headers.get("cf-ipcountry")) ??
    normalise(req.headers.get("x-vercel-ip-country"));
  if (header) return header;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip && ip !== "unknown") {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 1500);
      try {
        const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`, {
          signal: ctrl.signal,
          headers: { Accept: "text/plain" },
        });
        if (res.ok) {
          const country = normalise(await res.text());
          if (country) return country;
        }
      } finally {
        clearTimeout(timer);
      }
    } catch {
      // Swallow: geo is a nice-to-have, the default carries us.
    }
  }
  return DEFAULT_COUNTRY;
}

// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const logger = createLogger("enrich-company");

  if (totalServed >= REQUEST_CEILING) {
    return json({ error: "High demand right now. Try again later." }, 429);
  }

  const now = Date.now();
  const ip = clientIp(req);
  if (!withinRateLimit(ip, now)) {
    return json({ error: "Too many lookups. Give it a minute." }, 429);
  }

  let body: { domain?: unknown; email?: unknown; name?: unknown; depth?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const depth: "identity" | "full" = body.depth === "identity" ? "identity" : "full";

  // Visitor country biases synthesis; only needed on the full path.
  const visitorCountry = depth === "full" ? await resolveVisitorCountry(req) : "US";

  const result = await assembleDossier({
    email: typeof body.email === "string" ? body.email : undefined,
    domain: typeof body.domain === "string" ? body.domain : undefined,
    name: typeof body.name === "string" ? body.name : undefined,
    depth,
    visitorCountry,
  });

  if (result.noDomain) {
    return json({ error: "Give me a work email, a company domain, or a company name." }, 400);
  }
  if (result.skipped === "free-email") {
    return json({ skipped: "free-email", dossier: null });
  }
  if (result.notFound) {
    return json({ error: "I could not find anything on that domain." }, 404);
  }
  if (!result.dossier) {
    return json({ error: "Enrichment hit a snag. Try again in a moment." }, 500);
  }

  totalServed += 1;

  /* Tailored pressure choices, signed server-side. Only attempted on the
     full read, only while the time budget allows, and never allowed to
     fail the read: on any miss the journey falls back to the locked list. */
  let choices: Awaited<ReturnType<typeof generateTailoredChoices>> = [];
  const choiceSecret = Deno.env.get("MINDMAKE_VERIFICATION_SECRET");
  if (depth === "full" && choiceSecret && result.dossier.meta.ms < 6_500) {
    choices = await generateTailoredChoices(result.dossier, result.dossier.domain, choiceSecret);
  }

  logger.info("served dossier", {
    domain: result.dossier.domain,
    depth,
    ms: result.dossier.meta.ms,
    tailoredChoices: choices.length,
  });
  return json(choices.length ? { ...result.dossier, choices } : result.dossier);
});
