/**
 * @file escape.ts
 * @description The single canonical HTML-escape for the unified lead pipeline.
 *   Every value interpolated into a lead-digest email flows through this. Lifted
 *   verbatim from session-digest's `esc` (the 5-replacement version) so the escaping
 *   behaviour is identical to the existing "11/10" reference email.
 *
 *   Before this module, each edge function reimplemented its own `escapeHtml`/`esc`.
 *   New code should import from here; do not add another copy.
 */

/** HTML-escape any interpolated user/transcript content to prevent injection. */
export const esc = (str: unknown): string => {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/** Light email sanity check (intentionally permissive, not RFC-strict). */
export const looksLikeEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
