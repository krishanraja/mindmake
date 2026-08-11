/**
 * @file adapters.ts
 * @description One pure mapper per lead-capture source: raw (already-validated) payload
 *   → the canonical `LeadEvent`. No I/O, no side effects, trivially unit-testable. Each
 *   edge function calls its adapter, then hands the event to `dispatchLead`.
 */

import { makeLeadEvent, type LeadEvent, type LeadFieldGroup, type TranscriptTurn } from "./types.ts";
import type { Dossier } from "../enrich/types.ts";

// ── shared label maps (kept compact; mirror the originals) ──────────────────

const PROGRAM_LABELS: Record<string, string> = {
  "for-you": "For You (Individual)",
  "for-team": "For Your Leadership Team",
  "for-portfolio": "For Your Business Portfolio",
  "not-sure": "Not sure yet",
  build: "Build with AI",
  orchestrate: "Orchestrate AI",
  team: "Team Alignment",
  individual: "Individual",
  teardown: "The Teardown",
  handover: "The Handover",
  capital: "Capital (for a portfolio company)",
  "1-1-inquiry": "1:1 inquiry",
};

/*
 * The retired ladder's keys (cohort-enrollment, signal-session,
 * revenue-architecture, the five workshop keys, alumni, free-lesson,
 * immersion) were removed in August 2026 along with the offers themselves.
 *
 * They are not mapped to a replacement on purpose. label() falls back to the
 * raw key, so a lead captured under the old ladder still renders something
 * readable in Krish's digest, and reads unambiguously as a historical record
 * rather than as a live offer someone can still buy.
 */

const COMMITMENT_LABELS: Record<string, string> = {
  "1hr": "1 Hour Session",
  "3hr": "3 Hour Session",
  "4wk": "4 Week Program",
  "90d": "90 Day Program",
};

const label = (map: Record<string, string>, k?: string | null): string | null =>
  k ? map[k] || k : null;

// ── responses[] helpers (shared by intake + testimonial static forms) ───────

interface RawResponse {
  key?: string;
  eyebrow?: string;
  stage?: string;
  question?: string;
  type?: string;
  picked?: string | string[];
  more?: string;
  value?: string;
}

const pickedList = (r: RawResponse | undefined): string[] => {
  if (!r) return [];
  const p = Array.isArray(r.picked) ? r.picked : r.picked ? [r.picked] : [];
  const out = p.filter(Boolean);
  if (r.more && String(r.more).trim()) out.push(`added: ${r.more}`);
  return out;
};

const pickedByKey = (responses: RawResponse[], key: string): string[] => {
  const e = responses.find((r) => r.key === key);
  return e ? pickedList(e) : [];
};

// ── 1) contact form → send-contact-email ────────────────────────────────────

export function fromContact(d: {
  name: string;
  email: string;
  message: string;
  company?: string;
  role?: string;
  interest?: string;
}): LeadEvent {
  return makeLeadEvent({
    source: "contact",
    sourceLabel: "Contact form",
    contact: { name: d.name, email: d.email, company: d.company, role: d.role },
    groups: [
      { title: "Message", fields: [{ label: "Message", longform: d.message }] },
      { title: "Details", fields: [{ label: "Interest", value: d.interest }] },
    ],
  });
}

// ── 2) consult / lead modal → send-lead-email ────────────────────────────────

export function fromLead(
  d: {
    name: string;
    email: string;
    jobTitle?: string;
    selectedProgram?: string;
    commitmentLevel?: string;
    audienceType?: string;
    pathType?: string;
    qualifierAnswers?: { decision?: string; tried?: string; stakes?: string };
    sessionData?: Record<string, unknown>;
  },
  opts: { engagementScore?: number } = {},
): LeadEvent {
  const q = d.qualifierAnswers ?? {};
  const sd = (d.sessionData ?? {}) as Record<string, unknown>;

  const groups: LeadFieldGroup[] = [];

  groups.push({
    title: "What they told us",
    fields: [
      { label: "The decision they're wrestling with", longform: q.decision ?? null },
      { label: "Their timeline", longform: q.tried ?? null },
      { label: "The real cost of not solving it", longform: q.stakes ?? null },
    ],
  });

  groups.push({
    title: "Program interest",
    fields: [
      { label: "Program", value: label(PROGRAM_LABELS, d.selectedProgram) },
      { label: "Commitment", value: label(COMMITMENT_LABELS, d.commitmentLevel) },
      { label: "Audience", value: d.audienceType },
      { label: "Path", value: label(PROGRAM_LABELS, d.pathType) },
    ],
  });

  // Session activity (best-effort, only what's present).
  const activity: LeadFieldGroup["fields"] = [];
  const friction = sd.frictionMap as { problem?: string; timeSaved?: number } | undefined;
  if (friction) {
    activity.push({ label: "Friction map, problem", longform: friction.problem ?? null });
    if (typeof friction.timeSaved === "number") activity.push({ label: "Potential time saved", value: `${friction.timeSaved}h/week` });
  }
  const portfolio = sd.portfolioBuilder as { totalTimeSaved?: number; totalCostSavings?: number; selectedTasks?: unknown[] } | undefined;
  if (portfolio && (portfolio.selectedTasks?.length ?? 0) > 0) {
    if (typeof portfolio.totalTimeSaved === "number") activity.push({ label: "Portfolio time savings", value: `${portfolio.totalTimeSaved}h/week` });
    if (typeof portfolio.totalCostSavings === "number") activity.push({ label: "Portfolio cost savings", value: `$${portfolio.totalCostSavings.toLocaleString()}/month` });
  }
  const assessment = sd.assessment as { profileType?: string; recommendedProduct?: string } | undefined;
  if (assessment) {
    activity.push({ label: "Assessment profile", value: assessment.profileType });
    activity.push({ label: "Recommended product", value: assessment.recommendedProduct });
  }
  const tryIt = sd.tryItWidget as { challenges?: { input?: string }[] } | undefined;
  if (tryIt?.challenges?.length) {
    const last = tryIt.challenges[tryIt.challenges.length - 1];
    activity.push({ label: `Try-it widget (${tryIt.challenges.length}×)`, longform: last?.input ?? null });
  }
  if (typeof opts.engagementScore === "number") {
    activity.push({ label: "Engagement score", value: `${opts.engagementScore}/100`, kind: "metric" });
  }
  const timeOnSite = typeof sd.timeOnSite === "number" ? (sd.timeOnSite as number) : undefined;
  if (typeof timeOnSite === "number" && timeOnSite > 0) {
    const m = Math.floor(timeOnSite / 60);
    const s = timeOnSite % 60;
    activity.push({ label: "Time on site", value: `${m}:${s.toString().padStart(2, "0")}` });
  }
  if (activity.length) groups.push({ title: "Session activity", fields: activity });

  return makeLeadEvent({
    source: "lead",
    sourceLabel: "New lead",
    contact: { name: d.name, email: d.email, role: d.jobTitle },
    groups,
  });
}

// ── 3) leadership diagnostic → send-leadership-insights-email ────────────────

export function fromLeadershipInsights(d: {
  name: string;
  email: string;
  department?: string;
  aiFocus?: string;
  results?: {
    score?: number;
    tier?: string;
    percentile?: number;
    strengths?: string[];
    growthAreas?: string[];
  };
}): LeadEvent {
  const r = d.results ?? {};
  const groups: LeadFieldGroup[] = [
    {
      title: "Diagnostic",
      fields: [
        { label: "Department", value: d.department },
        { label: "AI focus", value: d.aiFocus },
        { label: "Score", value: r.score != null ? `${r.score}/100` : null, kind: "metric" },
        { label: "Tier", value: r.tier },
        { label: "Percentile", value: r.percentile != null ? `Top ${100 - r.percentile}%` : null, kind: "metric" },
      ],
    },
    { title: "Strengths", fields: [{ label: "Strengths", list: r.strengths ?? [] }] },
    { title: "Growth areas", fields: [{ label: "Growth areas", list: r.growthAreas ?? [] }] },
  ];

  return makeLeadEvent({
    source: "leadership-diagnostic",
    sourceLabel: "Leadership benchmark",
    contact: { name: d.name, email: d.email, role: d.department },
    groups,
  });
}

// ── 4) scoping modal → notify-scoping-request ────────────────────────────────

export function fromScoping(d: {
  name: string;
  email: string;
  company_role: string;
  decision_or_problem: string;
  success_in_30_days: string;
  notes?: string | null;
  source_page: string;
  source_campaign?: string | null;
  user_agent?: string | null;
}): LeadEvent {
  return makeLeadEvent({
    source: "scoping",
    sourceLabel: "Scoping request",
    contact: { name: d.name, email: d.email, role: d.company_role },
    groups: [
      {
        title: "What they want",
        fields: [
          { label: "Decision or problem to resolve", longform: d.decision_or_problem },
          { label: "What success looks like in 30 days", longform: d.success_in_30_days },
          { label: "Notes", longform: d.notes ?? null },
        ],
      },
    ],
    meta: {
      source_page: d.source_page,
      source_campaign: d.source_campaign ?? undefined,
      user_agent: d.user_agent ?? undefined,
    },
  });
}

// ── 5) CTRL waitlist → notify-ctrl-waitlist ──────────────────────────────────

export function fromCtrlWaitlist(d: {
  email: string;
  name?: string | null;
  source_page?: string | null;
}): LeadEvent {
  return makeLeadEvent({
    source: "ctrl-waitlist",
    sourceLabel: "CTRL waitlist",
    contact: { name: d.name ?? undefined, email: d.email },
    groups: [],
    meta: { source_page: d.source_page ?? undefined },
  });
}

// ── 6) pre-session intake (static /intake) → submit-intake ───────────────────

export function fromIntake(b: {
  name?: string;
  role?: string;
  company?: string;
  email?: string;
  link?: string;
  seat?: string;
  confidence_now?: number | string | null;
  business_oneliner?: string;
  north_star?: string;
  value_frame?: string;
  wish?: string;
  anything_else?: string;
  responses?: RawResponse[];
}): LeadEvent {
  const responses = Array.isArray(b.responses) ? b.responses : [];
  const aspiration = pickedByKey(responses, "aspiration");
  const handoff = pickedByKey(responses, "handoff");

  const groups: LeadFieldGroup[] = [];

  groups.push({
    title: "Snapshot",
    fields: [
      { label: "Seat", value: b.seat },
      { label: "AI confidence today", value: b.confidence_now != null ? `${b.confidence_now}/10` : null, kind: "metric" },
      { label: '"Worth it" looks like', value: b.value_frame },
      { label: "Where they want to be in a year", list: aspiration },
      { label: "Link", value: b.link },
    ],
  });

  groups.push({ title: "What they do", fields: [{ label: "Business", longform: b.business_oneliner ?? null }] });
  groups.push({ title: "The one thing this has to nail", fields: [{ label: "North star", longform: b.north_star ?? null }] });
  groups.push({ title: "What only they should be doing (role-aware)", fields: [{ label: "Handoff", list: handoff }] });
  groups.push({ title: "Wish they could do but can't", fields: [{ label: "Wish", longform: b.wish ?? null }] });

  // The picture: remaining chip answers (aspiration + handoff featured above).
  const chips = responses.filter(
    (e) => (e.type === "multi" || e.type === "single") && e.key !== "aspiration" && e.key !== "handoff",
  );
  if (chips.length) {
    groups.push({
      title: "The picture",
      fields: chips.map((e) => ({ label: e.eyebrow || e.key || "Answer", list: pickedList(e) })),
    });
  }

  groups.push({ title: "Anything else", fields: [{ label: "Notes", longform: b.anything_else ?? null }] });

  return makeLeadEvent({
    source: "intake",
    sourceLabel: "Pre-session intake",
    contact: { name: b.name, email: b.email, company: b.company, role: b.role },
    groups,
  });
}

// ── 7) testimonial (static /testimonials) → submit-testimonial ───────────────

export function fromTestimonial(row: {
  name?: string | null;
  role?: string | null;
  company?: string | null;
  email?: string | null;
  link?: string | null;
  permission?: string | null;
  willing_reference?: boolean;
  confidence_before?: number | null;
  confidence_after?: number | null;
  nps?: number | null;
  rating?: number | null;
  summary_line?: string | null;
  responses?: RawResponse[];
}): LeadEvent {
  const responses = Array.isArray(row.responses) ? row.responses : [];
  const permMap: Record<string, string> = {
    free: "Use freely",
    edits: "Use, run edits past me first",
    private: "Keep private",
  };

  const reflection: LeadFieldGroup["fields"] = [
    { label: "Summary", longform: row.summary_line ?? null },
    {
      label: "Confidence",
      value:
        row.confidence_before != null && row.confidence_after != null
          ? `${row.confidence_before} → ${row.confidence_after} (out of 10)`
          : null,
      kind: "metric",
    },
    { label: "Would recommend", value: row.nps != null ? `${row.nps}/10` : null, kind: "metric" },
    { label: "Overall rating", value: row.rating != null ? `${row.rating}/5` : null, kind: "metric" },
    { label: "Permission", value: row.permission ? permMap[row.permission] ?? row.permission : null },
    { label: "Willing reference / video", value: row.willing_reference ? "Yes" : "No" },
    { label: "Link", value: row.link ?? null },
  ];

  const answers: LeadFieldGroup["fields"] = [];
  for (const r of responses) {
    if (r.type === "scale" || r.type === "nps" || r.type === "rating") continue;
    const heading = r.eyebrow || r.stage || r.question || "Answer";
    if (r.type === "multi" || r.type === "single") {
      answers.push({ label: heading, list: pickedList(r) });
    } else {
      answers.push({ label: heading, longform: r.value ?? null });
    }
  }

  const groups: LeadFieldGroup[] = [{ title: "Reflection", fields: reflection }];
  if (answers.length) groups.push({ title: "In their words", fields: answers });

  return makeLeadEvent({
    source: "testimonial",
    sourceLabel: "Reflection",
    contact: {
      name: row.name ?? undefined,
      email: row.email ?? undefined,
      company: row.company ?? undefined,
      role: row.role ?? undefined,
    },
    groups,
    // A reflection is not a hot lead; identity-depth enrichment (logo + name) is enough.
    enrich: { depth: "identity" },
  });
}

// ── 8) Diagnosis Room → session-digest ───────────────────────────────────────

export function fromSessionDigest(body: {
  dossier?: Dossier | null;
  decisionBrief?: {
    realDecision?: string;
    paths?: { name?: string; tradeoff?: string }[];
    weakAssumption?: string;
    next14Days?: string | string[];
  } | null;
  recommendation?: { mode?: string; rung?: string; range?: string; exit?: string } | null;
  transcript?: TranscriptTurn[];
  contact?: { name?: string; email?: string; company?: string };
  proposalId?: string;
  proposalHtml?: string;
  endedVia?: string;
}): LeadEvent {
  const rec = body.recommendation ?? {};
  const brief = body.decisionBrief ?? {};

  const groups: LeadFieldGroup[] = [
    {
      title: "Session outcome",
      fields: [
        { label: "Ended via", value: body.endedVia || "session" },
        { label: "Mode", value: rec.mode },
        { label: "Rung", value: rec.rung },
        { label: "Range", value: rec.range },
        { label: "Exit", value: rec.exit },
      ],
    },
  ];

  const briefFields: LeadFieldGroup["fields"] = [
    { label: "Real decision", longform: brief.realDecision ?? null },
    {
      label: "Paths",
      list: (brief.paths ?? [])
        .filter((p) => p && (p.name || p.tradeoff))
        .map((p) => (p.tradeoff ? `${p.name || "(path)"}: ${p.tradeoff}` : p.name || "(path)")),
    },
    { label: "Weak assumption", longform: brief.weakAssumption ?? null },
    {
      label: "Next 14 days",
      list: Array.isArray(brief.next14Days) ? brief.next14Days : undefined,
      longform: Array.isArray(brief.next14Days) ? undefined : brief.next14Days ?? null,
    },
  ];
  groups.push({ title: "Decision brief", fields: briefFields });

  return makeLeadEvent({
    source: "session-digest",
    sourceLabel: `Diagnosis Room · ${body.endedVia || "session"}`,
    contact: {
      name: body.contact?.name,
      email: body.contact?.email,
      company: body.contact?.company,
    },
    groups,
    transcript: Array.isArray(body.transcript) ? body.transcript : undefined,
    proposal: body.proposalId || body.proposalHtml ? { id: body.proposalId, html: body.proposalHtml } : null,
    prebuiltDossier: body.dossier ?? null,
    enrich: { skip: true },
  });
}
