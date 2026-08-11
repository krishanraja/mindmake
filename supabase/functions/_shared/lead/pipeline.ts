/**
 * @file pipeline.ts
 * @description The unified lead pipeline core. Given a normalised `LeadEvent`, it:
 *   1. enriches the lead's company (unless a dossier is prebuilt or enrichment is skipped),
 *   2. generates the operator's read (best-effort),
 *   3. renders the one consistent Krish digest, and
 *   4. sends it via the shared Resend helper (with the proposal attached, if any).
 *
 *   `dispatchLead` wraps that in a background task so a form submission returns instantly:
 *   it uses `EdgeRuntime.waitUntil` when available; otherwise it awaits (so the promise is
 *   not dropped on worker teardown). Everything here is best-effort and never throws to
 *   the caller, a lead capture must never 5xx because enrichment or email hiccuped.
 */

import { assembleDossier } from "../enrich/orchestrate.ts";
import { toDomain, FREE_EMAIL_DOMAINS, type Dossier } from "../enrich/types.ts";
import { generateOperatorRead } from "./operator-read.ts";
import { renderLeadDigest } from "./render.ts";
import { looksLikeEmail } from "./escape.ts";
import { sendResendEmail, toBase64 } from "../http/resend.ts";
import type { LeadEvent } from "./types.ts";

const KRISH_TO = "krish@themindmaker.ai";
// One consistent sender for every lead digest (all @themindmaker.ai is verified in Resend).
const DIGEST_FROM = "Mindmaker Leads <leads@themindmaker.ai>";

export interface ProcessOptions {
  /** Default enrichment depth when the event doesn't specify one. */
  depth?: "identity" | "full";
}

export interface LeadResult {
  /** Whether the Krish digest email was accepted by Resend. */
  sent: boolean;
  /** The dossier the pipeline resolved (null if free-email / no domain / disabled). */
  dossier: Dossier | null;
}

/** Resolve the dossier for an event: prebuilt → work email → self-reported company name. */
async function resolveDossier(event: LeadEvent, opts: ProcessOptions): Promise<Dossier | null> {
  if (event.prebuiltDossier) return event.prebuiltDossier;
  if (event.enrich?.skip) return null;

  const depth = event.enrich?.depth ?? opts.depth ?? "full";
  const email = event.contact.email;
  const domain = email ? toDomain(email) : null;
  const isWorkDomain = domain && !FREE_EMAIL_DOMAINS.has(domain);

  try {
    if (isWorkDomain) {
      const res = await assembleDossier({ email, depth, visitorCountry: "US" });
      return res.dossier;
    }
    // Personal / absent email: fall back to the self-reported company name so a
    // Gmail lead who typed "Acme" still gets researched (Brandfetch name search).
    if (event.contact.company && event.contact.company.trim()) {
      const res = await assembleDossier({ name: event.contact.company.trim(), depth, visitorCountry: "US" });
      return res.dossier;
    }
  } catch (e) {
    console.error("[lead-pipeline] enrichment failed:", (e as Error).message);
  }
  return null;
}

/**
 * Run the full pipeline for one lead and email Krish the digest. Best-effort;
 * never throws. Returns the send outcome + the resolved dossier (so callers can
 * persist the research, e.g. into `leads.company_research`).
 */
export async function processLead(event: LeadEvent, opts: ProcessOptions = {}): Promise<LeadResult> {
  let dossier: Dossier | null = null;
  try {
    dossier = await resolveDossier(event, opts);

    let operatorRead: string | null = null;
    try {
      operatorRead = await generateOperatorRead(event, dossier);
    } catch (e) {
      console.error("[lead-pipeline] operator read failed:", (e as Error).message);
    }

    const { subject, html } = renderLeadDigest({ event, dossier, operatorRead, audience: "krish" });

    const attachments = event.proposal?.html
      ? [{ filename: `proposal-${event.proposal.id || "mindmaker"}.html`, content: toBase64(event.proposal.html) }]
      : undefined;

    const result = await sendResendEmail(
      {
        from: DIGEST_FROM,
        to: [KRISH_TO],
        reply_to: looksLikeEmail(event.contact.email) ? event.contact.email : undefined,
        subject,
        html,
        attachments,
      },
      { label: `lead:${event.source}` },
    );

    if (!result.ok) console.error(`[lead-pipeline] digest send failed for ${event.source}:`, result.error);
    return { sent: result.ok, dossier };
  } catch (e) {
    console.error("[lead-pipeline] processLead threw:", (e as Error).message);
    return { sent: false, dossier };
  }
}

/**
 * Dispatch the pipeline. When the Edge Runtime supports background tasks, schedule it
 * with `waitUntil` and return immediately so the form response is instant. Otherwise
 * await it (never float a post-response promise, the worker can be torn down once the
 * Response is sent, dropping the work). Either way this never throws.
 *
 * @param onComplete optional callback with the send result (e.g. to flag `email_sent`).
 */
export async function dispatchLead(
  event: LeadEvent,
  opts: ProcessOptions = {},
  onComplete?: (result: LeadResult) => Promise<void> | void,
): Promise<void> {
  const task = async () => {
    const result = await processLead(event, opts);
    if (onComplete) {
      try {
        await onComplete(result);
      } catch (e) {
        console.error("[lead-pipeline] onComplete failed:", (e as Error).message);
      }
    }
  };

  const g = globalThis as unknown as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } };
  if (typeof g.EdgeRuntime?.waitUntil === "function") {
    g.EdgeRuntime.waitUntil(task());
    return;
  }
  // No background runtime available: await so the work actually completes.
  await task();
}
