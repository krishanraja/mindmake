/**
 * mindmake-personal-read
 *
 * The personal half of the site's two journeys. The page composes its own
 * preview from the same template lines, so this endpoint exists for two things
 * only: enriching what we know about a visitor from their public profile, and
 * sending the one results email when they ask for it.
 *
 * It follows submit-mindmake-brief's posture rather than inventing its own:
 * a strict origin allowlist checked before any work, one-way HMAC identifiers
 * for abuse limits, a deterministic idempotency key so a retry cannot become a
 * second email, and no claim of a delivery the provider did not accept.
 *
 * Deploy with verify_jwt false: the browser calls it directly.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendResendEmail } from "../_shared/http/resend.ts";
import { assembleDossier } from "../_shared/enrich/orchestrate.ts";
import { clientIdentifier, hmacIdentifier } from "../_shared/security/hmac.ts";
import {
  InvalidRequestError,
  parsePersonalRead,
  assessRead,
  buildRead,
  tidyProfile,
  type CompanySeen,
  personalReadIdempotencyKey,
  renderPersonalRead,
  type PersonalReadRequest,
  type Profile,
} from "./core.ts";

const BODY_LIMIT_BYTES = 4 * 1024;
const ENRICH_TIMEOUT_MS = 6_000;
/** Fourteen days, the one follow-up the two-email cap allows. */
const FOLLOW_UP_DAYS = 14;

const ALLOWED_REQUEST_HEADERS = "authorization, x-client-info, apikey, content-type";

interface Config {
  supabaseUrl: string;
  serviceRoleKey: string;
  rateLimitSalt: string;
  from: string;
  operatorEmail: string;
  allowedOrigins: Set<string>;
}

function readConfig(): Config {
  const required = (name: string): string => {
    const value = Deno.env.get(name)?.trim();
    if (!value) throw new Error(`${name} is not configured`);
    return value;
  };

  const allowedOrigins = new Set(
    required("MINDMAKE_ALLOWED_ORIGINS").split(",").map((entry) => entry.trim()).filter(Boolean),
  );
  if (allowedOrigins.size === 0) throw new Error("MINDMAKE_ALLOWED_ORIGINS is empty");

  const salt = required("MINDMAKE_RATE_LIMIT_SALT");
  if (salt.length < 32) throw new Error("MINDMAKE_RATE_LIMIT_SALT is too short");

  return {
    supabaseUrl: required("SUPABASE_URL"),
    serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
    rateLimitSalt: salt,
    from: required("MINDMAKE_BRIEF_FROM"),
    operatorEmail: required("MINDMAKE_OPERATOR_EMAIL"),
    allowedOrigins,
  };
}

const corsHeaders = (origin: string): Record<string, string> => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": ALLOWED_REQUEST_HEADERS,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "600",
  Vary: "Origin",
});

const json = (body: unknown, status: number, origin: string | null): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...(origin ? corsHeaders(origin) : { Vary: "Origin" }),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

/**
 * Resolves a public profile from a name and the company their email belongs to.
 *
 * This used to be keyed on a LinkedIn URL the visitor pasted in, which is a
 * thing most people have to go and find. PDL resolves the same person from a
 * name plus a company, and hands back the profile URL as part of the answer, so
 * the field could go without the read getting weaker.
 *
 * min_likelihood stays where it was. Anything that fails, times out or comes
 * back under that bar degrades to an empty profile, and the caller falls back to
 * a read built from the company alone. That silence is deliberate: a guessed job
 * title in an email addressed to someone by name is worse than no job title.
 */
async function enrichProfile(
  firstName: string,
  lastName: string,
  company: string,
): Promise<Profile> {
  const key = Deno.env.get("PEOPLEDATALABS_API_KEY") ?? Deno.env.get("PDL_API_KEY");
  if (!key || !firstName || !lastName || !company) return {};

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ENRICH_TIMEOUT_MS);
  try {
    /* The domain is what PDL matches on. A fallback that also tried the
       domain's bare label was built and measured here, and removed: every match
       came back on the domain, so the second call only ever ran on a miss, and
       a second paid call on the path that already found nothing is the worst
       place to spend one. */
    const url = new URL("https://api.peopledatalabs.com/v5/person/enrich");
    url.searchParams.set("first_name", firstName);
    url.searchParams.set("last_name", lastName);
    url.searchParams.set("company", company);
    url.searchParams.set("min_likelihood", "6");
    const response = await fetch(url, { headers: { "X-Api-Key": key }, signal: controller.signal });
    if (!response.ok) {
      /* Silence is right for the visitor and wrong for us. A paid provider call
         that fails is a thing somebody has to be able to find out about, and
         the first version of this logged nothing at all, so a swap that had
         stopped resolving anybody would have looked exactly like a run of
         hard-to-find people. Status and provider message only: no key, and
         nothing about the person. */
      console.error("[mindmake-personal-read] pdl", response.status, (await response.text()).slice(0, 200));
      return {};
    }
    const body = await response.json();
    const person = body?.data ?? {};
    if (!person.job_title && !person.job_company_name) {
      console.error("[mindmake-personal-read] pdl matched nothing usable", body?.status ?? "");
    }
    return tidyProfile({
      name: typeof person.full_name === "string" ? person.full_name : undefined,
      role: typeof person.job_title === "string" ? person.job_title : undefined,
      company: typeof person.job_company_name === "string" ? person.job_company_name : undefined,
      industry: typeof person.job_company_industry === "string" ? person.job_company_industry : undefined,
      linkedin: typeof person.linkedin_url === "string" ? person.linkedin_url : undefined,
    });
  } catch {
    return {};
  } finally {
    clearTimeout(timer);
  }
}

async function readBody(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > BODY_LIMIT_BYTES) {
    throw new InvalidRequestError("too-large");
  }
  const text = await request.text();
  if (text.length > BODY_LIMIT_BYTES) throw new InvalidRequestError("too-large");
  try {
    return JSON.parse(text);
  } catch {
    throw new InvalidRequestError("json");
  }
}

async function deliver(
  config: Config,
  parsed: PersonalReadRequest,
  profile: Profile,
  company?: CompanySeen,
): Promise<boolean> {
  const email = parsed.email!;
  const rendered = renderPersonalRead(parsed, profile, company, email.slice(email.lastIndexOf("@") + 1));
  const result = await sendResendEmail(
    {
      from: config.from,
      to: [email],
      reply_to: config.operatorEmail,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
    },
    {
      label: "mindmake-personal-read",
      /* The text of the read is part of the key, so a retry of this exact email
         is one send and a genuinely different read is a different one. */
      idempotencyKey: await personalReadIdempotencyKey(email, rendered.text),
    },
  );
  return result.ok;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  let config: Config;
  try {
    config = readConfig();
  } catch (error) {
    console.error("[mindmake-personal-read] configuration", (error as Error).message);
    return json({ error: "service_unavailable" }, 503, null);
  }

  const allowed = origin && config.allowedOrigins.has(origin) ? origin : null;
  if (request.method === "OPTIONS") {
    return new Response(null, { status: allowed ? 204 : 403, headers: allowed ? corsHeaders(allowed) : {} });
  }
  if (!allowed) return json({ error: "origin_not_allowed" }, 403, null);
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, allowed);

  let parsed: PersonalReadRequest;
  try {
    parsed = parsePersonalRead(await readBody(request));
  } catch (error) {
    const reason = error instanceof InvalidRequestError ? error.message : "invalid";
    return json({ error: "invalid_request", reason }, 400, allowed);
  }

  const email = parsed.email;
  const supabase = createClient(config.supabaseUrl, config.serviceRoleKey, {
    auth: { persistSession: false },
  });

  /* Ahead of the enrichment, and on a preview as well as a send.
     A preview used to cost nothing, so it sat outside the limiter. It now makes
     a paid provider call, and an unauthenticated endpoint that spends money per
     request needs the meter in front of the spending rather than behind it. */
  const ipHash = await hmacIdentifier(config.rateLimitSalt, clientIdentifier(request));
  const emailHash = await hmacIdentifier(config.rateLimitSalt, email);
  /* PostgREST reaches only the public schema, so this calls the public wrapper
     around the private routine, the same way the brief pipeline does. */
  const { data: withinLimit, error: rateError } = await supabase.rpc(
    "mindmake_consume_personal_read_rate",
    { p_ip_hash: ipHash, p_email_hash: emailHash },
  );
  if (rateError) {
    console.error("[mindmake-personal-read] rate limit", rateError.message);
    return json({ error: "service_unavailable" }, 503, allowed);
  }
  if (withinLimit === false) {
    return json({ error: "rate_limited" }, 429, allowed);
  }

  /* The company comes out of the email domain, so nobody types it twice. A miss
     here is silent by design and leaves a read built from the division alone. */
  /* The person and the company, together, because they answer different halves
     of the read and neither is worth waiting for twice.

     The company half is the one that was missing. Without it the email was the
     visitor's job title on the front of three template sentences, identical for
     everyone who tapped the same two chips: a mirror, which is the thing this
     business exists to argue against. assembleDossier is the same orchestrator
     /ai-gtm's read runs on, reused in process exactly as its own comment
     invites, and at full depth it synthesises the outside read. */
  const [profile, assembled] = await Promise.all([
    enrichProfile(parsed.first_name, parsed.last_name, email.slice(email.lastIndexOf("@") + 1)),
    assembleDossier({ email, depth: "full" }).catch((error) => {
      console.error("[mindmake-personal-read] company read", (error as Error).message);
      return { dossier: null };
    }),
  ]);

  const dossier = assembled.dossier;
  const company: CompanySeen | undefined = dossier
    ? {
      name: dossier.identity?.name,
      /* `synthesis` is the paragraph the LLM wrote about this company, and it
         is the whole reason the read is worth anybody's minute. It is a
         top-level field on the dossier; `understanding.descriptor` is the short
         unsynthesised "what they do" that the providers hand over, and reading
         that one first meant the good paragraph was never used at all. */
      descriptor: dossier.synthesis ?? dossier.understanding?.descriptor,
      industry: dossier.understanding?.industry,
      products: dossier.understanding?.products,
    }
    : undefined;
  if (!dossier) console.error("[mindmake-personal-read] no company read for", email.slice(email.lastIndexOf("@") + 1));

  const read = buildRead(parsed, profile, company, email.slice(email.lastIndexOf("@") + 1));
  /* The gate. A read that cannot clear it is not sent, and the page is told so
     plainly rather than being handed something to put on screen that we would
     not stand behind. "I'd rather send nothing" is the rule, not a preference,
     so this is the one place it is enforced for both actions at once. */
  const verdict = assessRead(read, profile, email.slice(email.lastIndexOf("@") + 1));
  if (!verdict.passed) {
    console.error(
      "[mindmake-personal-read] read refused",
      `${verdict.score}/${verdict.outOf}`,
      email.slice(email.lastIndexOf("@") + 1),
      verdict.failures.join(" | "),
    );
    return json({ status: "not_worth_sending", failures: verdict.failures.length }, 200, allowed);
  }

  // A preview asks for nothing to be stored or sent, so nothing is. It hands
  // back the assembled read itself, which is what the page puts on screen.
  if (parsed.action === "preview") {
    return json({ status: "ok", read }, 200, allowed);
  }

  const sent = await deliver(config, parsed, profile, company);
  if (!sent) {
    // Never report a delivery the provider did not accept.
    return json({ error: "delivery_failed" }, 502, allowed);
  }

  // Store the minimum the email needed, and nothing about the profile URL.
  const { error: storeError } = await supabase.from("mindmake_personal_reads").insert({
    email,
    first_name: parsed.first_name,
    last_name: parsed.last_name,
    division: parsed.division,
    q1: parsed.q1,
    q2: parsed.q2,
    enrichment: { ...profile, seen: company?.descriptor, companyName: company?.name },
    delivered_at: new Date().toISOString(),
  });
  if (storeError) console.error("[mindmake-personal-read] store", storeError.message);

  // The one follow-up the cap allows. Best effort: a queue failure must not
  // turn a delivered email into a reported failure.
  const sendAfter = new Date(Date.now() + FOLLOW_UP_DAYS * 864e5).toISOString();
  const { error: queueError } = await supabase
    .from("follow_up_queue")
    .upsert({ email, source: "personal-read", send_after: sendAfter }, { onConflict: "email,source" });
  if (queueError) console.error("[mindmake-personal-read] follow-up queue", queueError.message);

  return json({ status: "queued" }, 200, allowed);
});
