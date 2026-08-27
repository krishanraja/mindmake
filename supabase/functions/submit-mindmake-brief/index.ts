/**
 * V2 request and confirmation endpoint for the private Mindmake brief.
 *
 * The browser supplies identifiers only. Company research, every narrative
 * sentence and all three emails are created by trusted server code.
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { assembleDossier } from "../_shared/enrich/orchestrate.ts";
import type { Dossier } from "../_shared/enrich/types.ts";
import { sendResendEmail, toBase64 } from "../_shared/http/resend.ts";
import { verifyTailoredChoice } from "../_shared/lead/choiceSignature.ts";
import {
  BODY_LIMIT_BYTES,
  BriefValidationError,
  confirmedBriefResponse,
  createStoredBrief,
  deliveryIdempotencyKey,
  hmacIdentifier,
  parseMindmakeBriefRequest,
  payloadHash,
  renderOperatorEmail,
  renderVerificationEmail,
  renderVisitorEmail,
  safeAttachmentName,
  verificationRequiredResponse,
  type DeliveryKind,
  type DeliveryState,
  type MindmakeBriefConfirmActionV2,
  type MindmakeBriefRequestActionV2,
  type StoredBrief,
  type StoredCompanyResearch,
} from "./core.ts";

const RPC_NAME = "mindmake_brief_rpc";
const RPC_STALE_SECONDS = 120;
const ALLOWED_REQUEST_HEADERS = "authorization, x-client-info, apikey, content-type";

type AdminClient = ReturnType<typeof createClient>;

interface RuntimeConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
  rateLimitSalt: string;
  verificationSecret: string;
  from: string;
  operatorEmail: string;
  allowedOrigins: ReadonlySet<string>;
}

interface BriefRow {
  id: string;
  created_at: string;
  request_id: string;
  request_payload_sha256: string;
  email: string;
  company_domain: string;
  pressure_id: MindmakeBriefRequestActionV2["choices"]["pressureId"];
  returned_time_id: MindmakeBriefRequestActionV2["choices"]["returnedTimeId"];
  entry_route: MindmakeBriefRequestActionV2["choices"]["entryRoute"];
  publication_requested: boolean;
  consent_wording_version: MindmakeBriefRequestActionV2["consent"]["wordingVersion"];
  company_research: StoredCompanyResearch | null;
  assembly_state: "pending" | "sending" | "ready" | "failed";
  verification_nonce: string;
  verification_code_hash: string;
  verification_expires_at: string;
  verified_at: string | null;
  verification_delivery: DeliveryState;
  visitor_delivery: DeliveryState;
  operator_delivery: DeliveryState;
}

interface RpcEnvelope {
  outcome: string;
  row?: BriefRow;
  claim_token?: string;
}

class PayloadTooLargeError extends Error {}
class InvalidJsonError extends Error {}
class ConfigurationError extends Error {}
class StorageError extends Error {}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isEmail = (value: string | undefined): value is string =>
  Boolean(value && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

const isSafeSender = (value: string | undefined): value is string =>
  Boolean(
    value
    && value.length <= 320
    && !/[\r\n]/.test(value)
    && /^[^<>]{1,100}<[^\s@]+@[^\s@]+\.[^\s@]+>$/.test(value),
  );

const isAllowedUrl = (url: URL): boolean =>
  url.protocol === "https:"
  || ((url.hostname === "localhost" || url.hostname === "127.0.0.1") && url.protocol === "http:");

function readRequiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new ConfigurationError(`${name} is missing`);
  return value;
}

function loadRuntimeConfig(): RuntimeConfig {
  const supabaseUrl = readRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const rateLimitSalt = readRequiredEnv("MINDMAKE_RATE_LIMIT_SALT");
  const verificationSecret = readRequiredEnv("MINDMAKE_VERIFICATION_SECRET");
  const resendKey = readRequiredEnv("RESEND_API_KEY");
  const from = readRequiredEnv("MINDMAKE_BRIEF_FROM");
  const operatorEmail = readRequiredEnv("MINDMAKE_OPERATOR_EMAIL").toLowerCase();
  const publicUrlValue = readRequiredEnv("MINDMAKE_PUBLIC_URL");
  const allowedOriginValue = readRequiredEnv("MINDMAKE_ALLOWED_ORIGINS");

  let serviceUrl: URL;
  let publicUrl: URL;
  try {
    serviceUrl = new URL(supabaseUrl);
    publicUrl = new URL(publicUrlValue);
  } catch {
    throw new ConfigurationError("A configured URL is invalid");
  }
  if (!isAllowedUrl(serviceUrl) || !isAllowedUrl(publicUrl)) {
    throw new ConfigurationError("Configured URLs must use HTTPS outside local development");
  }
  if (publicUrl.username || publicUrl.password || publicUrl.search || publicUrl.hash) {
    throw new ConfigurationError("MINDMAKE_PUBLIC_URL must be a fixed public URL");
  }
  if (serviceRoleKey.length < 32 || rateLimitSalt.length < 32 || verificationSecret.length < 32) {
    throw new ConfigurationError("Server keys and salts are too short");
  }
  if (rateLimitSalt === verificationSecret) {
    throw new ConfigurationError("Rate and verification secrets must be independent");
  }
  if (!resendKey.startsWith("re_") || !isSafeSender(from) || !isEmail(operatorEmail)) {
    throw new ConfigurationError("Email delivery configuration is invalid");
  }

  const allowedOrigins = new Set<string>();
  for (const candidate of allowedOriginValue.split(",").map((item) => item.trim()).filter(Boolean)) {
    let parsed: URL;
    try {
      parsed = new URL(candidate);
    } catch {
      throw new ConfigurationError("MINDMAKE_ALLOWED_ORIGINS contains an invalid origin");
    }
    if (
      !isAllowedUrl(parsed)
      || parsed.origin !== candidate
      || parsed.pathname !== "/"
      || parsed.search
      || parsed.hash
      || parsed.username
      || parsed.password
    ) {
      throw new ConfigurationError("MINDMAKE_ALLOWED_ORIGINS must contain exact origins only");
    }
    allowedOrigins.add(candidate);
  }
  if (!allowedOrigins.size || !allowedOrigins.has(publicUrl.origin)) {
    throw new ConfigurationError("The fixed public URL must be in MINDMAKE_ALLOWED_ORIGINS");
  }

  return {
    supabaseUrl: serviceUrl.origin,
    serviceRoleKey,
    rateLimitSalt,
    verificationSecret,
    from,
    operatorEmail,
    allowedOrigins,
  };
}

const corsHeaders = (origin: string): Record<string, string> => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Headers": ALLOWED_REQUEST_HEADERS,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "600",
  "Vary": "Origin",
});

const responseJson = (
  body: unknown,
  status: number,
  origin: string | null,
  extraHeaders: Record<string, string> = {},
): Response => new Response(JSON.stringify(body), {
  status,
  headers: {
    ...(origin ? corsHeaders(origin) : { Vary: "Origin" }),
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  },
});

async function readJsonWithLimit(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > BODY_LIMIT_BYTES) {
    throw new PayloadTooLargeError();
  }
  if (!request.body) throw new InvalidJsonError();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > BODY_LIMIT_BYTES) {
        await reader.cancel();
        throw new PayloadTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new InvalidJsonError();
  }
}

const getClientIdentifier = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded.slice(0, 64);
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp.slice(0, 64);
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);
  return "unavailable";
};

async function callRpc(
  admin: AdminClient,
  operation: string,
  payload: Record<string, unknown>,
): Promise<RpcEnvelope> {
  const { data, error } = await admin.rpc(RPC_NAME, {
    p_operation: operation,
    p_payload: payload,
  });
  if (error || !isRecord(data) || typeof data.outcome !== "string") {
    console.error(`[mindmake-brief] ${operation} RPC failed`);
    throw new StorageError();
  }
  return data as unknown as RpcEnvelope;
}

const requireRow = (envelope: RpcEnvelope): BriefRow => {
  if (!envelope.row || typeof envelope.row.id !== "string") throw new StorageError();
  return envelope.row;
};

async function deriveVerificationCode(
  secret: string,
  requestId: string,
  nonce: string,
): Promise<string> {
  const digest = await hmacIdentifier(secret, `mindmake-code:${requestId}:${nonce}`);
  const value = Number.parseInt(digest.slice(0, 13), 16) % 1_000_000;
  return value.toString().padStart(6, "0");
}

const verificationCodeHash = (
  secret: string,
  requestId: string,
  email: string,
  code: string,
): Promise<string> => hmacIdentifier(
  secret,
  `mindmake-code-check:${requestId}:${email}:${code}`,
);

const cleanResearchText = (value: unknown, max: number): string | null => {
  if (typeof value !== "string") return null;
  const clean = value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
  if (!clean) return null;
  return clean.slice(0, max);
};

const fallbackCompanyName = (domain: string): string => {
  const root = domain.split(".")[0]?.replace(/[-_]+/g, " ").trim() || domain;
  return root.replace(/\b\w/g, (letter) => letter.toUpperCase()).slice(0, 160);
};

/* The read must land as a written statement. The synthesis prompt already
   forbids questions and invitations to correct, but models drift; any
   sentence that asks the visitor something is dropped rather than sent. */
const declarativeOnly = (value: string | null): string | null => {
  if (!value) return null;
  const sentences = value.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [];
  const kept = sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) =>
      sentence.length > 0
      && !sentence.includes("?")
      && !/\b(tell me|let me know|correct me|if I(?:'| a)m (?:wrong|off))\b/i.test(sentence)
    );
  const joined = kept.join(" ").trim();
  return joined.length ? joined : null;
};

function researchFromDossier(domain: string, dossier: Dossier | null): StoredCompanyResearch {
  const name = cleanResearchText(dossier?.identity.name, 160) ?? fallbackCompanyName(domain);
  const liveRead = declarativeOnly(cleanResearchText(
    dossier?.synthesis
      ?? dossier?.understanding.descriptor
      ?? dossier?.understanding.tagline,
    3000,
  ));
  const read = liveRead
    ?? "Mindmake could not verify enough public company detail, so this brief starts with the choices you made about the work.";

  const candidates: string[] = [];
  const add = (prefix: string, value: unknown) => {
    const clean = cleanResearchText(value, Math.max(1, 500 - prefix.length));
    if (clean) candidates.push(`${prefix}${clean}`);
  };
  const descriptor = cleanResearchText(dossier?.understanding.descriptor, 500);
  const tagline = cleanResearchText(dossier?.understanding.tagline, 500);
  if (descriptor && descriptor !== liveRead) add("", descriptor);
  if (tagline && tagline !== liveRead && tagline !== descriptor) add("", tagline);
  add("Industry: ", dossier?.understanding.industry);
  for (const product of dossier?.understanding.products?.slice(0, 3) ?? []) add("Product: ", product);
  for (const item of dossier?.currency.slice(0, 3) ?? []) add("Recent signal: ", item.text);

  const evidence = [...new Set(candidates)].filter((item) => item !== read).slice(0, 8);
  return {
    name,
    read,
    evidence,
    readSource: liveRead ? "live" : "fallback",
  };
}

async function assembleResearch(request: MindmakeBriefRequestActionV2): Promise<StoredCompanyResearch> {
  const result = await assembleDossier({
    domain: request.company.domain,
    depth: "full",
    visitorCountry: "GB",
  });
  return researchFromDossier(request.company.domain, result.dossier);
}

function storedBriefFromRow(row: BriefRow, tailoredLabel?: string): StoredBrief {
  if (!row.company_research) throw new StorageError();
  const reconstructed = parseMindmakeBriefRequest({
    version: 2,
    action: "request",
    requestId: row.request_id,
    contact: { email: row.email },
    company: { domain: row.company_domain },
    choices: {
      pressureId: row.pressure_id,
      returnedTimeId: row.returned_time_id,
      entryRoute: row.entry_route,
    },
    consent: {
      publicationRequested: row.publication_requested,
      wordingVersion: row.consent_wording_version,
    },
    website: "",
  });
  if (reconstructed.action !== "request") throw new StorageError();
  return createStoredBrief(reconstructed, row.company_research, tailoredLabel);
}

async function finishDelivery(
  admin: AdminClient,
  rowId: string,
  kind: DeliveryKind,
  claimToken: string,
  result: { ok: boolean; id?: string },
): Promise<void> {
  const envelope = await callRpc(admin, "finish_delivery", {
    row_id: rowId,
    delivery_kind: kind,
    claim_token: claimToken,
    ok: result.ok,
    delivery_id: result.ok ? result.id ?? null : null,
  });
  if (envelope.outcome !== "finished" && envelope.outcome !== "stale_claim") {
    throw new StorageError();
  }
}

async function deliverVerification(
  admin: AdminClient,
  row: BriefRow,
  config: RuntimeConfig,
): Promise<boolean> {
  const claim = await callRpc(admin, "claim_delivery", {
    row_id: row.id,
    delivery_kind: "verification",
    stale_seconds: RPC_STALE_SECONDS,
  });
  if (claim.outcome !== "claimed") {
    const current = claim.row ?? row;
    return claim.outcome === "not_claimed"
      && (current.verification_delivery === "queued" || current.verification_delivery === "sending");
  }
  if (!claim.claim_token) throw new StorageError();

  const current = requireRow(claim);
  const code = await deriveVerificationCode(
    config.verificationSecret,
    current.request_id,
    current.verification_nonce,
  );
  const expectedHash = await verificationCodeHash(
    config.verificationSecret,
    current.request_id,
    current.email,
    code,
  );
  if (expectedHash !== current.verification_code_hash) throw new StorageError();

  const email = renderVerificationEmail(code);
  const result = await sendResendEmail({
    from: config.from,
    to: [current.email],
    reply_to: config.operatorEmail,
    subject: email.subject,
    html: email.html,
    text: email.text,
  }, {
    label: "mindmake-brief:verification",
    idempotencyKey: await deliveryIdempotencyKey(
      "verification",
      `${current.request_id}:${current.verification_nonce}`,
    ),
  });
  await finishDelivery(admin, current.id, "verification", claim.claim_token, result);
  return result.ok;
}

async function deliverBrief(
  admin: AdminClient,
  row: BriefRow,
  kind: "visitor" | "operator",
  brief: StoredBrief,
  config: RuntimeConfig,
): Promise<void> {
  const claim = await callRpc(admin, "claim_delivery", {
    row_id: row.id,
    delivery_kind: kind,
    stale_seconds: RPC_STALE_SECONDS,
  });
  if (claim.outcome !== "claimed") return;
  if (!claim.claim_token) throw new StorageError();

  let result: { ok: boolean; id?: string } = { ok: false };
  try {
    const idempotencyKey = await deliveryIdempotencyKey(kind, row.request_id);
    if (kind === "visitor") {
      const email = renderVisitorEmail(brief);
      result = await sendResendEmail({
        from: config.from,
        to: [row.email],
        reply_to: config.operatorEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        attachments: [{
          filename: safeAttachmentName(row.company_domain),
          content: toBase64(email.attachmentHtml),
        }],
      }, { label: "mindmake-brief:visitor", idempotencyKey });
    } else {
      const email = renderOperatorEmail(brief);
      result = await sendResendEmail({
        from: config.from,
        to: [config.operatorEmail],
        reply_to: row.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }, { label: "mindmake-brief:operator", idempotencyKey });
    }
  } catch {
    console.error(`[mindmake-brief] ${kind} rendering or delivery failed`);
  }
  await finishDelivery(admin, row.id, kind, claim.claim_token, result);
}

async function deliverConfirmedBrief(
  admin: AdminClient,
  row: BriefRow,
  config: RuntimeConfig,
  tailoredLabel?: string,
): Promise<BriefRow> {
  const brief = storedBriefFromRow(row, tailoredLabel);
  await Promise.all([
    deliverBrief(admin, row, "visitor", brief, config),
    deliverBrief(admin, row, "operator", brief, config),
  ]);
  return requireRow(await callRpc(admin, "get", { row_id: row.id }));
}

async function handleRequestAction(
  admin: AdminClient,
  request: Request,
  parsed: MindmakeBriefRequestActionV2,
  config: RuntimeConfig,
  origin: string,
): Promise<Response> {
  const requestHash = await payloadHash(parsed);
  const ipHash = await hmacIdentifier(config.rateLimitSalt, getClientIdentifier(request));
  const emailHash = await hmacIdentifier(config.rateLimitSalt, parsed.contact.email);
  const rawUserAgent = request.headers.get("user-agent")?.trim();
  const userAgentHash = rawUserAgent
    ? await hmacIdentifier(config.rateLimitSalt, rawUserAgent.slice(0, 500))
    : null;
  if (parsed.choices.tailored) {
    const tailoredValid = await verifyTailoredChoice(
      config.verificationSecret,
      parsed.company.domain,
      parsed.choices.pressureId,
      parsed.choices.tailored.label,
      parsed.choices.tailored.id,
    );
    if (!tailoredValid) {
      return responseJson({ success: false, error: "tailored_choice_invalid" }, 400, origin);
    }
  }

  const proposedNonce = crypto.randomUUID();
  const proposedCode = await deriveVerificationCode(
    config.verificationSecret,
    parsed.requestId,
    proposedNonce,
  );
  const proposedCodeHash = await verificationCodeHash(
    config.verificationSecret,
    parsed.requestId,
    parsed.contact.email,
    proposedCode,
  );

  let envelope = await callRpc(admin, "begin", {
    request_id: parsed.requestId,
    request_payload_sha256: requestHash,
    email: parsed.contact.email,
    company_domain: parsed.company.domain,
    pressure_id: parsed.choices.pressureId,
    returned_time_id: parsed.choices.returnedTimeId,
    entry_route: parsed.choices.entryRoute,
    publication_requested: parsed.consent.publicationRequested,
    consent_wording_version: parsed.consent.wordingVersion,
    rate_limit_ip_hash: ipHash,
    rate_limit_email_hash: emailHash,
    user_agent_hash: userAgentHash,
    verification_nonce: proposedNonce,
    verification_code_hash: proposedCodeHash,
    stale_seconds: RPC_STALE_SECONDS,
  });

  if (envelope.outcome === "conflict") {
    return responseJson({ success: false, error: "request_id_conflict" }, 409, origin);
  }
  if (envelope.outcome === "rate_limited") {
    return responseJson(
      { success: false, error: "too_many_requests" },
      429,
      origin,
      { "Retry-After": "3600" },
    );
  }
  if (envelope.outcome === "processing") {
    return responseJson(
      { success: false, error: "request_in_progress" },
      409,
      origin,
      { "Retry-After": "2" },
    );
  }
  if (envelope.outcome === "assembly_failed") throw new StorageError();

  let row = requireRow(envelope);
  if (envelope.outcome === "assemble") {
    if (!envelope.claim_token) throw new StorageError();
    const assemblyClaimToken = envelope.claim_token;
    try {
      const research = await assembleResearch(parsed);
      createStoredBrief(parsed, research);
      envelope = await callRpc(admin, "finish_assembly", {
        row_id: row.id,
        claim_token: assemblyClaimToken,
        ok: true,
        company_research: research,
      });
      if (envelope.outcome !== "finished" && envelope.outcome !== "stale_claim") {
        throw new StorageError();
      }
      row = requireRow(envelope);
    } catch (error) {
      await callRpc(admin, "finish_assembly", {
        row_id: row.id,
        claim_token: assemblyClaimToken,
        ok: false,
        company_research: null,
      }).catch(() => undefined);
      console.error("[mindmake-brief] company research assembly failed");
      throw error instanceof StorageError ? error : new StorageError();
    }
  }

  if (envelope.outcome === "already_confirmed" || row.verified_at) {
    row = await deliverConfirmedBrief(admin, row, config);
    return responseJson(confirmedBriefResponse(row), 200, origin);
  }
  if (row.assembly_state !== "ready") throw new StorageError();

  const accepted = await deliverVerification(admin, row, config);
  if (!accepted) {
    return responseJson({ success: false, error: "verification_delivery_failed" }, 503, origin);
  }
  return responseJson(verificationRequiredResponse(parsed.requestId), 200, origin);
}

async function handleConfirmAction(
  admin: AdminClient,
  parsed: MindmakeBriefConfirmActionV2,
  config: RuntimeConfig,
  origin: string,
): Promise<Response> {
  const codeHash = await verificationCodeHash(
    config.verificationSecret,
    parsed.requestId,
    parsed.contact.email,
    parsed.code,
  );
  const envelope = await callRpc(admin, "confirm", {
    request_id: parsed.requestId,
    email: parsed.contact.email,
    verification_code_hash: codeHash,
  });

  if (["invalid", "not_found"].includes(envelope.outcome)) {
    return responseJson({ success: false, error: "verification_invalid" }, 400, origin);
  }
  if (envelope.outcome === "locked") {
    return responseJson(
      { success: false, error: "verification_locked" },
      429,
      origin,
      { "Retry-After": "600" },
    );
  }
  if (envelope.outcome === "expired") {
    return responseJson({ success: false, error: "verification_expired" }, 410, origin);
  }
  if (envelope.outcome === "not_ready") {
    return responseJson(
      { success: false, error: "request_in_progress" },
      409,
      origin,
      { "Retry-After": "2" },
    );
  }
  if (envelope.outcome !== "verified" && envelope.outcome !== "already_confirmed") {
    throw new StorageError();
  }

  const verifiedRow = requireRow(envelope);
  let tailoredLabel: string | undefined;
  if (parsed.tailored) {
    const tailoredValid = await verifyTailoredChoice(
      config.verificationSecret,
      verifiedRow.company_domain,
      verifiedRow.pressure_id,
      parsed.tailored.label,
      parsed.tailored.id,
    );
    if (tailoredValid) tailoredLabel = parsed.tailored.label;
    else console.warn("[mindmake-brief] tailored choice signature failed; using the lens label");
  }
  const row = await deliverConfirmedBrief(admin, verifiedRow, config, tailoredLabel);
  return responseJson(confirmedBriefResponse(row), 200, origin);
}

export async function handleMindmakeBriefRequest(request: Request): Promise<Response> {
  let config: RuntimeConfig;
  try {
    config = loadRuntimeConfig();
  } catch {
    console.error("[mindmake-brief] required runtime configuration is missing or invalid");
    return responseJson({ success: false, error: "service_unavailable" }, 503, null);
  }

  const origin = request.headers.get("origin")?.trim() ?? "";
  if (!config.allowedOrigins.has(origin)) {
    return responseJson({ success: false, error: "origin_not_allowed" }, 403, null);
  }
  if (request.method === "OPTIONS") {
    return responseJson({ success: true }, 200, origin);
  }
  if (request.method !== "POST") {
    return responseJson(
      { success: false, error: "method_not_allowed" },
      405,
      origin,
      { Allow: "POST, OPTIONS" },
    );
  }
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return responseJson({ success: false, error: "content_type_not_supported" }, 415, origin);
  }

  try {
    const parsed = parseMindmakeBriefRequest(await readJsonWithLimit(request));
    const admin = createClient(config.supabaseUrl, config.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    return parsed.action === "request"
      ? await handleRequestAction(admin, request, parsed, config, origin)
      : await handleConfirmAction(admin, parsed, config, origin);
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return responseJson({ success: false, error: "payload_too_large" }, 413, origin);
    }
    if (error instanceof InvalidJsonError) {
      return responseJson({ success: false, error: "invalid_json" }, 400, origin);
    }
    if (error instanceof BriefValidationError) {
      return responseJson(
        { success: false, error: "invalid_input", issues: error.issues },
        400,
        origin,
      );
    }
    if (error instanceof StorageError) {
      console.error("[mindmake-brief] storage operation failed");
      return responseJson({ success: false, error: "service_unavailable" }, 503, origin);
    }
    console.error("[mindmake-brief] unexpected failure");
    return responseJson({ success: false, error: "service_unavailable" }, 503, origin);
  }
}

serve(handleMindmakeBriefRequest);
