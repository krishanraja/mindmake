// Expected visible states are the accepted page copy, independent of runtime data.
// From r35 the homepage carries the three /new-age-leadership chapters in place
// of R3's history, authority and leadership dividend (Ruling, Krish, 2026-09-25).
// Each pins under the homepage's fixed masthead. From r45 the practice scenes
// pin on a phone too, under their introduction, and build by the signal sweep
// (Krish, 2026-09-25: "should really build with scroll"), so the phone
// declares a pinned practice case like the desktop.
// From r41 the R3 history chapter is back ahead of them (Krish, 2026-09-25:
// "reinstate"), pinned at the top of the viewport by pinnedChapters.ts.
export const APPROVED_SCROLL_STATES = {
  history: [
    'If knowledge lives outside us, will memory grow weaker?',
    'If the machine can do the work, what happens to the worker?',
    'If the device does the arithmetic, will children stop learning to think?',
    'If the device knows the route, will we lose our sense of direction?',
  ],
  reach: [
    'The feeling is familiar. The reach is new.',
    'The organisation changes shape.',
  ],
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
// The history chapter's section carries the masthead inside its own padding
// and pins at the very top.
export const HISTORY_PIN_TOP = 0;

export const CHAPTERS_BY_VIEWPORT = {
  '1440x900': ['history', 'reach', 'practice', 'benefits'],
  '390x844': ['history', 'reach', 'practice', 'benefits'],
};

export function createHomepageScrollContract({ engines = ['chromium', 'firefox', 'webkit'], candidateDigest, acceptedDecision, acceptedDecisionDigest }) {
  const cases = [];
  for (const engine of engines) {
    for (const [viewport, chapters] of Object.entries(CHAPTERS_BY_VIEWPORT)) {
      for (const chapter of chapters) {
        cases.push({ id: `${engine}-${viewport}-${chapter}`, route: '/', viewport, states: APPROVED_SCROLL_STATES[chapter], pinTop: chapter === 'history' ? HISTORY_PIN_TOP : PIN_TOP[viewport], tolerance: 2 });
      }
    }
  }
  return { candidateDigest, acceptedDecision, acceptedDecisionDigest, cases };
}
