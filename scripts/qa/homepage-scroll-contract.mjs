// Expected visible states are the accepted page copy, independent of runtime data.
// From r35 the homepage carries the three /new-age-leadership chapters in place
// of R3's history, authority and leadership dividend (Ruling, Krish, 2026-09-25).
// Each pins under the homepage's fixed masthead. The practice scenes pin only
// above 900px; on a phone they are laid out one after another by design, so
// the phone declares no pinned practice case. From r38 the reach chapter is its
// organisation state alone, one still screen with no scroll track, so it is
// declared below as a single static state rather than an ordered sequence.
export const STATIC_REACH_STATE = 'The organisation changes shape.';
export const RETIRED_HOMEPAGE_WORDS = ['The feeling is familiar.', 'The reach is new.'];
export const APPROVED_SCROLL_STATES = {
  practice: [
    'It notices what changed.',
    'It joins the evidence.',
    'It prepares the next move.',
  ],
  benefits: [
    'Leadership updates become consistent, even when the week was not.',
    'Work nobody owns becomes visible before it becomes a problem.',
    'A change in market pricing becomes a decision, not a forgotten observation.',
    'A CEO who hates writing can still publish ideas worth following.',
    'A CRO who hates the numbers can become better at using them.',
    'Founder-led content can begin with the work, not another content calendar.',
  ],
};

// The masthead the chapters pin beneath, in CSS px, per declared viewport.
export const PIN_TOP = { '1440x900': 66, '390x844': 64 };

export const CHAPTERS_BY_VIEWPORT = {
  '1440x900': ['practice', 'benefits'],
  '390x844': ['benefits'],
};

export function createHomepageScrollContract({ engines = ['chromium', 'firefox', 'webkit'], candidateDigest, acceptedDecision, acceptedDecisionDigest }) {
  const cases = [];
  for (const engine of engines) {
    for (const [viewport, chapters] of Object.entries(CHAPTERS_BY_VIEWPORT)) {
      for (const chapter of chapters) {
        cases.push({ id: `${engine}-${viewport}-${chapter}`, route: '/', viewport, states: APPROVED_SCROLL_STATES[chapter], pinTop: PIN_TOP[viewport], tolerance: 2 });
      }
    }
  }
  return { candidateDigest, acceptedDecision, acceptedDecisionDigest, cases };
}
