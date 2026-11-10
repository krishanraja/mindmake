/**
 * Words the Brain's record shows for its sources.
 *
 * The fixture keeps each source's assertion as it was captured. A few of them
 * name things the page must not: CTRL stays unnamed on the page (Ruling,
 * owner, 2026-10-24, history/LOG.md BRAIN-NARRATIVE-S5). S9 put the record
 * permanently in view, which made SRC-004's line visible (audit RECORD-13,
 * 2026-11-10), so its plain line is set here and the test suite checks that
 * no displayed source line names CTRL.
 */
export const plainSources: Readonly<Record<string, string>> = {
  "SRC-004": "The work should help willing leaders rebuild categories and industries rather than persuade sceptics or automate only administrative work.",
};

export const sourceLine = (source: { id: string; assertion: string }) => plainSources[source.id] ?? source.assertion;
