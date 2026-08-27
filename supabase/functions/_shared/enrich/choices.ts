/**
 * @file choices.ts
 * @description Tailored pressure choices for the Start-here journey. Given an
 *   assembled dossier, ask the shared completion helper for two or three
 *   company-specific pressure statements, each anchored to one generic lens,
 *   then sign each with the server HMAC so the journey can carry them safely.
 *   Every failure path returns [], and the caller falls back to the locked
 *   generic list, so this can never break the read.
 */

import { completeText } from "./llm.ts";
import { createLogger } from "../logger.ts";
import {
  isCleanTailoredLabel,
  signTailoredChoice,
  TAILORED_LENSES,
  type TailoredLensId,
} from "../lead/choiceSignature.ts";
import type { Dossier } from "./types.ts";

const logger = createLogger("enrich/choices");

const CHOICES_TIMEOUT_MS = 4_000;

export interface TailoredChoice {
  id: string;
  label: string;
  lensId: TailoredLensId;
}

const SYSTEM = [
  "You write short business-pressure statements for a company page.",
  "British English. Words a ten-year-old understands. Never use an em dash.",
  "Each statement must be concrete enough that a leader at this company recognises their situation,",
  "but careful enough to claim no private knowledge: only what a public read could suggest.",
  "Write in the first person plural or first person, as the leader would say it.",
  "Return STRICT JSON only: an array of 2 or 3 objects, each {\"label\": string, \"lens\": string}.",
  `Each label is one sentence, 12 to 110 characters, no quotes inside.`,
  `lens must be exactly one of: ${Object.keys(TAILORED_LENSES).join(", ")}.`,
  "Choose the lens that best names where the pressure sits.",
].join(" ");

/** Generate and sign tailored choices. Returns [] on any failure. */
export async function generateTailoredChoices(
  dossier: Dossier,
  domain: string,
  secret: string,
): Promise<TailoredChoice[]> {
  try {
    const facts = [
      `Company: ${dossier.identity?.name ?? domain} (${domain}).`,
      dossier.understanding?.descriptor ? `What it does: ${dossier.understanding.descriptor}` : "",
      dossier.understanding?.products?.length
        ? `What it appears to sell: ${dossier.understanding.products.slice(0, 4).join(", ")}.`
        : "",
      dossier.synthesis ? `Read: ${String(dossier.synthesis)}` : "",
      ...(dossier.currency ?? []).slice(0, 3).map((item) => item?.text ? `Recent signal: ${item.text}` : ""),
    ].filter(Boolean).join("\n");

    const raw = await completeText({
      system: SYSTEM,
      user: `${facts}\n\nWrite the pressure statements this leader would most recognise right now.`,
      maxTokens: 400,
      temperature: 0.5,
      timeoutMs: CHOICES_TIMEOUT_MS,
    });
    if (!raw) return [];

    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start < 0 || end <= start) return [];
    const parsed: unknown = JSON.parse(raw.slice(start, end + 1));
    if (!Array.isArray(parsed)) return [];

    const lenses = new Set(Object.keys(TAILORED_LENSES));
    const choices: TailoredChoice[] = [];
    for (const item of parsed.slice(0, 3)) {
      if (!item || typeof item !== "object") continue;
      const label = String((item as Record<string, unknown>).label ?? "").trim().replace(/\s{2,}/g, " ");
      const lens = String((item as Record<string, unknown>).lens ?? "");
      if (!isCleanTailoredLabel(label) || !lenses.has(lens)) continue;
      choices.push({
        id: await signTailoredChoice(secret, domain, lens, label),
        label,
        lensId: lens as TailoredLensId,
      });
    }
    return choices.length >= 2 ? choices : [];
  } catch (err) {
    logger.warn("tailored choices failed", { error: err instanceof Error ? err.message : String(err) });
    return [];
  }
}
