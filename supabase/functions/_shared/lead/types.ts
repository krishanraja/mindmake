/**
 * @file types.ts
 * @description The canonical envelope for the unified lead pipeline. Every lead-capture
 *   surface (contact form, consult/lead modal, scoping modal, leadership diagnostic,
 *   CTRL waitlist, /intake, /testimonials, the Diagnosis Room) maps its own bespoke
 *   payload to a `LeadEvent` via a small adapter, then hands it to `processLead`. That is
 *   what "collapse the back end onto one pipeline" means: one shape, one renderer, one send.
 *
 *   Pure types only — no I/O.
 */

import type { Dossier } from "../enrich/types.ts";

export type LeadSource =
  | "contact"
  | "lead"
  | "leadership-diagnostic"
  | "scoping"
  | "ctrl-waitlist"
  | "intake"
  | "testimonial"
  | "session-digest";

/**
 * One labelled captured value. `kind` (or the shape of the value) drives how the
 * renderer styles it:
 *   - `text` / `metric` → a row in a compact facts table.
 *   - `longform`        → a grey left-border, pre-wrapped block (free-text answers).
 *   - `list`            → a bullet list (multi-select / chip answers).
 * Provide exactly one of `value` | `longform` | `list`.
 */
export interface LeadField {
  label: string;
  value?: string | number | null;
  longform?: string | null;
  list?: string[] | null;
  kind?: "text" | "longform" | "list" | "metric";
}

/** A titled cluster of fields, e.g. "What they told us" or "Session activity". */
export interface LeadFieldGroup {
  title: string;
  fields: LeadField[];
}

/** Rich transcript turns — Diagnosis Room only. */
export interface TranscriptTurn {
  role: "user" | "assistant";
  content: string;
}

export interface LeadContact {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
}

export interface LeadEvent {
  source: LeadSource;
  /** Human label for the hero eyebrow + subject, e.g. "Scoping request". */
  sourceLabel: string;

  contact: LeadContact;

  /** Source-specific captured data, rendered under "What they submitted". */
  groups: LeadFieldGroup[];

  /** Optional first-class extras the renderer knows how to style. */
  transcript?: TranscriptTurn[];
  proposal?: { id?: string; html?: string } | null;

  meta: {
    source_page?: string;
    source_campaign?: string;
    user_agent?: string;
    submittedAt: string; // ISO
  };

  /**
   * Enrichment control. If the source already holds a Dossier (the Diagnosis Room
   * builds one client-side), pass it here and set `enrich.skip` so the pipeline does
   * not re-enrich. Otherwise the pipeline enriches from `contact.email` (work domain),
   * falling back to `contact.company` (Brandfetch name search) for personal/absent email.
   */
  prebuiltDossier?: Dossier | null;
  enrich?: { skip?: boolean; depth?: "identity" | "full" };
}

/** Convenience constructor so adapters don't repeat the boilerplate. */
export function makeLeadEvent(
  base: Omit<LeadEvent, "groups" | "meta"> & {
    groups?: LeadFieldGroup[];
    meta?: Partial<LeadEvent["meta"]>;
  },
): LeadEvent {
  return {
    ...base,
    groups: base.groups ?? [],
    meta: {
      submittedAt: base.meta?.submittedAt ?? new Date().toISOString(),
      source_page: base.meta?.source_page,
      source_campaign: base.meta?.source_campaign,
      user_agent: base.meta?.user_agent,
    },
  };
}

/** Drop empty groups / empty fields so the renderer never emits a hollow section. */
export function compactGroups(groups: LeadFieldGroup[]): LeadFieldGroup[] {
  return groups
    .map((g) => ({
      title: g.title,
      fields: g.fields.filter((f) => {
        if (f.list) return f.list.filter(Boolean).length > 0;
        if (f.longform != null) return String(f.longform).trim().length > 0;
        return f.value !== undefined && f.value !== null && String(f.value).trim().length > 0;
      }),
    }))
    .filter((g) => g.fields.length > 0);
}
