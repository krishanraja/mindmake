/**
 * Pure validation and email rendering for the DoThinkDo staff feedback form at
 * /feedback/dtd. No Deno or database dependency, so the page and the unit
 * tests import the same chip lists the server accepts.
 */

export const BODY_LIMIT_BYTES = 32 * 1024;
export const COMMENT_LIMIT = 2_000;
export const NAME_LIMIT = 80;
export const OTHER_CHIP_ID = "other";

export interface FeedbackChip {
  id: string;
  label: string;
  /** The question over the chip's own text box. */
  prompt: string;
}

export const LIKED_CHIPS: readonly FeedbackChip[] = [
  { id: "build-lab", label: "Build Lab sessions", prompt: "What made the Build Lab sessions useful for you?" },
  { id: "one-to-one", label: "One-to-one setup and coaching", prompt: "What helped most when we worked one to one?" },
  { id: "skills-plugin", label: "Having your own Claude skills and plugin", prompt: "What has having your own Claude skills changed for you?" },
  { id: "account-plans", label: "Account plans and boards", prompt: "What did the account plans and boards do for you?" },
  { id: "linkedin-lookups", label: "LinkedIn lookups", prompt: "Where have the LinkedIn lookups earned their keep?" },
  { id: "setup-sheet", label: "The setup sheet", prompt: "What worked about the setup sheet for you?" },
  { id: "pace", label: "Pace and responsiveness", prompt: "When did the pace feel right to you?" },
  { id: OTHER_CHIP_ID, label: "Something else", prompt: "What else worked for you?" },
];

export const BETTER_CHIPS: readonly FeedbackChip[] = [
  { id: "hands-on-time", label: "More hands-on time", prompt: "Where would more time with me have helped most?" },
  { id: "clearer-plan", label: "A clearer plan up front", prompt: "What would have made the plan clearer from day one?" },
  { id: "fewer-tools", label: "Fewer tools at once", prompt: "Which tools should I have held back, or brought in later?" },
  { id: "follow-through", label: "Faster follow-through", prompt: "Where did I leave you waiting?" },
  { id: "written-guides", label: "Written guides to keep", prompt: "What would you want written down to keep?" },
  { id: "timing", label: "Timing and scheduling", prompt: "What would have worked better on timing?" },
  { id: OTHER_CHIP_ID, label: "Something else", prompt: "What else should I do differently?" },
];

/* One tap drops the opening of a sentence into the box with the cursor at its
   end, so the person just keeps typing. Every starter has one gap, at the end:
   two gaps made people hunt for the second (Krish, 2026-11-02: "fiddly to use
   and glitches"). A comment that stops where a starter stops is unfinished. */
export const LIKED_STARTERS: readonly string[] = [
  "The moment it clicked for me was when",
  "The biggest change for me is",
  "Something I still use every week is",
  "If a colleague asked, I'd tell them",
];

export const BETTER_STARTERS: readonly string[] = [
  "I got stuck when",
  "I wish we had done more of",
  "If you ran it again, I'd change",
  "I never really got into",
];

/** The starter a comment stops on, with nothing of the person's own after it. */
export function unfinishedStarter(comment: string, starters: readonly string[] = [...LIKED_STARTERS, ...BETTER_STARTERS]): string | null {
  const text = comment.trim().replace(/[\s.…]+$/, "").toLowerCase();
  if (!text) return null;
  return starters.find((starter) => text.endsWith(starter.toLowerCase())) ?? null;
}

export interface FeedbackItem {
  id: string;
  label: string;
  comment: string;
}

export interface DtdFeedback {
  name: string;
  liked: FeedbackItem[];
  better: FeedbackItem[];
  /** True only when the person ticked the unticked quote box. */
  quotePermission: boolean;
}

/* Permission to quote is an unticked box the person ticks themselves: a
   pre-ticked box is not valid consent under UK GDPR, the same reason the
   brief's publication choice is unticked (Krish, 2026-11-02, chose
   unticked). The version names the exact sentence they agreed to, and the
   server refuses a yes given against any other wording. */
export const QUOTE_WORDING_VERSION = "dtd-quote-consent-v1";
export const ANONYMOUS_ATTRIBUTION = "DTD team member";

/** The sentence beside the box, which changes with whether a name is given. */
export const quoteConsentSentence = (hasName: boolean): string =>
  `Happy for Krish to quote this, ${hasName ? "with my name" : "without my name"}, in Mindmake's materials.`;

export class FeedbackValidationError extends Error {}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Strips control characters except line breaks and tabs, then trims. */
const clean = (value: unknown, limit: number): string => {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") throw new FeedbackValidationError("Text fields must be strings");
  // deno-lint-ignore no-control-regex
  // eslint-disable-next-line no-control-regex
  const text = value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (text.length > limit) throw new FeedbackValidationError("A text field is too long");
  return text;
};

const parseGroup = (value: unknown, chips: readonly FeedbackChip[]): FeedbackItem[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > chips.length) {
    throw new FeedbackValidationError("Choices must be a short list");
  }
  const seen = new Set<string>();
  return value.map((entry) => {
    if (!isRecord(entry) || typeof entry.id !== "string") throw new FeedbackValidationError("Each choice needs an id");
    const chip = chips.find((candidate) => candidate.id === entry.id);
    if (!chip) throw new FeedbackValidationError("Unknown choice");
    if (seen.has(chip.id)) throw new FeedbackValidationError("Duplicate choice");
    seen.add(chip.id);
    const comment = clean(entry.comment, COMMENT_LIMIT);
    if (unfinishedStarter(comment)) throw new FeedbackValidationError("Finish each sentence before sending");
    return { id: chip.id, label: chip.label, comment };
  });
};

/**
 * Validates the browser's payload. Returns null for a filled honeypot, which
 * the endpoint answers as a success without sending anything.
 */
export function parseDtdFeedback(input: unknown): DtdFeedback | null {
  if (!isRecord(input)) throw new FeedbackValidationError("Expected an object");
  if (typeof input.website === "string" && input.website.trim() !== "") return null;
  if (input.quotePermission !== undefined && typeof input.quotePermission !== "boolean") {
    throw new FeedbackValidationError("Quote permission must be yes or no");
  }
  const quotePermission = input.quotePermission === true;
  if (quotePermission && input.quoteWording !== QUOTE_WORDING_VERSION) {
    throw new FeedbackValidationError("Quote permission was given against unknown wording");
  }
  const feedback = {
    name: clean(input.name, NAME_LIMIT).replace(/\s+/g, " "),
    liked: parseGroup(input.liked, LIKED_CHIPS),
    better: parseGroup(input.better, BETTER_CHIPS),
    quotePermission,
  };
  if (feedback.liked.length === 0 && feedback.better.length === 0) {
    throw new FeedbackValidationError("Pick at least one choice");
  }
  return feedback;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const NO_COMMENT = "(no comment)";

export function renderFeedbackEmail(feedback: DtdFeedback, receivedAt: Date) {
  const who = feedback.name || "Anonymous";
  const when = receivedAt.toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const permission = !feedback.quotePermission
    ? "NO, keep it private"
    : feedback.name
      ? `YES, with name (${feedback.name})`
      : `YES, anonymous ("${ANONYMOUS_ATTRIBUTION}")`;
  const agreed = feedback.quotePermission
    ? `They ticked: "${quoteConsentSentence(Boolean(feedback.name))}" (${QUOTE_WORDING_VERSION}, ${when})`
    : "The quote box was left unticked.";
  const groups = [
    { heading: "What they liked", items: feedback.liked },
    { heading: "What we could do better next time", items: feedback.better },
  ];

  const text = [
    `DTD feedback from ${who}`,
    `Received ${when}`,
    `Quote permission: ${permission}`,
    agreed,
    ...groups.flatMap(({ heading, items }) => [
      "",
      heading.toUpperCase(),
      ...(items.length
        ? items.flatMap((item) => [`- ${item.label}`, `  ${(item.comment || NO_COMMENT).replace(/\n/g, "\n  ")}`])
        : ["- Nothing picked"]),
    ]),
  ].join("\n");

  const htmlGroup = ({ heading, items }: (typeof groups)[number]) => `
    <h2 style="font:600 16px/1.3 Arial,sans-serif;margin:28px 0 10px">${escapeHtml(heading)}</h2>
    ${items.length
      ? items.map((item) => `
      <div style="margin:0 0 14px;padding:12px 14px;border-left:3px solid #3e8e68;background:#f2f1ea">
        <div style="font:600 14px/1.4 Arial,sans-serif">${escapeHtml(item.label)}</div>
        <div style="font:14px/1.5 Georgia,serif;white-space:pre-wrap;color:${item.comment ? "#131c17" : "#7c857a"}">${escapeHtml(item.comment || NO_COMMENT)}</div>
      </div>`).join("")
      : `<p style="font:14px/1.5 Georgia,serif;color:#7c857a">Nothing picked</p>`}`;

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#ffffff;color:#131c17">
    <div style="max-width:620px">
      <h1 style="font:600 20px/1.3 Arial,sans-serif;margin:0 0 4px">DTD feedback from ${escapeHtml(who)}</h1>
      <p style="font:13px/1.4 Arial,sans-serif;color:#7c857a;margin:0">Received ${when} via mindmake.co/feedback/dtd</p>
      <p style="font:600 14px/1.4 Arial,sans-serif;margin:14px 0 2px;color:${feedback.quotePermission ? "#2f6f51" : "#9a5a1c"}">Quote permission: ${escapeHtml(permission)}</p>
      <p style="font:12px/1.4 Arial,sans-serif;color:#7c857a;margin:0">${escapeHtml(agreed)}</p>
      ${groups.map(htmlGroup).join("")}
    </div></body></html>`;

  return { subject: `DTD feedback: ${who}${feedback.quotePermission ? " · OK to quote" : ""}`, text, html };
}
