// Expected visible states are the accepted page copy, independent of runtime data.
// Only these two chapters are authorized to gain pinning in this release.
export const APPROVED_SCROLL_STATES = {
  history: [
    'If knowledge lives outside us, will memory grow weaker?',
    'If the machine can do the work, what happens to the worker?',
    'If the device does the arithmetic, will children stop learning to think?',
    'If the device knows the route, will we lose our sense of direction?',
  ],
  'leadership-dividend': [
    'It notices what changed.',
    'It joins the evidence.',
    'It prepares the next move.',
    'Leadership updates become consistent, even when the week was not.',
    'What will you do with the hours it gives back?',
  ],
};

export function createHomepageScrollContract({ engines = ['chromium', 'firefox', 'webkit'], candidateDigest, acceptedDecision, acceptedDecisionDigest }) {
  const cases = [];
  for (const engine of engines) {
    for (const viewport of ['1440x900', '390x844']) {
      for (const [chapter, states] of Object.entries(APPROVED_SCROLL_STATES)) {
        cases.push({ id: `${engine}-${viewport}-${chapter}`, route: '/', viewport, states, pinTop: 0, tolerance: 2 });
      }
    }
  }
  return { candidateDigest, acceptedDecision, acceptedDecisionDigest, cases };
}
