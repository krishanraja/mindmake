/**
 * Per-mode deterministic scaffolds for the proposal generator.
 *
 * These are the deterministic 60% the LLM never rewrites: the canonical
 * deliverables list, the WHAT-YOU-KEEP artifacts, the GUARANTEE copy, the
 * PHASE-2 tracks, and the default NEXT-STEPS, per pricing/proof mode. Mindy
 * supplies the reflective prose (hero lead, what-i-heard, intros, card bodies);
 * these scaffolds supply the spine so the shell always renders, even with a
 * null dossier and no LLM output.
 *
 * Two paid engagements, plus CTRL as a product rather than an engagement:
 *   handover, teardown, ctrl.
 *
 * Voice rules baked in (these strings are NOT re-linted at runtime, so they must
 * pass cleanly on sight): no em dashes, sentence case, British-Australian,
 * operator tone, second person. NO price appears here at all. Every price band
 * lives only in ProposalPayload.price, and only ever as a range or a label. Any
 * cost reference in copy is qualitative ("costed", "scoped together", "set on
 * the call"), never a figure.
 *
 * `teardown` is the fallback for any unknown mode, deliberately. It is the
 * entry rung and the gate, so a misrouted proposal lands on the smaller, more
 * honest recommendation rather than pitching six weeks at someone the router
 * could not read.
 *
 * The seven scaffolds that used to live here (cohort, workshop, signal-session,
 * revenue-architecture, immersion, bespoke-enablement) were removed in August
 * 2026. They described a ladder that no longer exists, and this file builds the
 * PDF a prospect downloads, so they were selling retired engagements in a
 * document that leaves the building.
 */

import type {
  Deliverable,
  Phase2Track,
  ValueCard,
} from './types.ts';

/** The deterministic spine for one mode. */
export interface ModeScaffold {
  /** Canonical mode key. */
  mode: string;
  /** Section label for THE ENGAGEMENT, e.g. "Phase 1 / The engagement". */
  engagementLabel: string;
  /** Default H2 for THE ENGAGEMENT (Mindy may override with a sharper line). */
  engagementHeading: string;
  /** The canonical numbered deliverables. */
  deliverables: Deliverable[];
  /** The WHAT-YOU-KEEP value cards (the artifacts that survive the engagement). */
  keepCards: ValueCard[];
  /** Default keep-hero line: what stays when the engagement ends. */
  keepHero: string;
  /** Default keep-foot line. */
  keepFoot: string;
  /** GUARANTEE: the inverted-panel kicker, the definition-of-done intro, the carry-the-risk body. */
  guarantee: { title: string; intro: string; body: string };
  /** PHASE-2 tracks (the "later, scoped together" panel). */
  phase2: { heading: string; intro: string; cap: string; tracks: Phase2Track[]; commercial: string };
  /** Default NEXT-STEPS list. */
  nextSteps: string[];
}


// Handover. Six weeks, then it ends. The larger rung, stated first.
const HANDOVER: ModeScaffold = {
  mode: 'handover',
  engagementLabel: 'The engagement / Six weeks',
  engagementHeading: 'Six weeks. Then I leave and you keep it.',
  deliverables: [
    {
      title: 'Week 1. Your context, loaded and corrected',
      desc:
        'Most of week one is discovering what the organisation believes that is no longer true. We load how the business actually decides and sells, and fix the parts that are out of date before anything gets built on top of them.',
    },
    {
      title: 'Week 2. An adversarial pre-mortem',
      desc:
        'We assume the plan already failed and work backwards to why. It is faster to find the fatal assumption now than to discover it in month four, and it is the cheapest week of the six.',
    },
    {
      title: 'Week 3. The fork',
      desc:
        'If you are not AI-native yet, we rebuild go-to-market, pricing and positioning. If you already are, we set the build order instead. One of those two, chosen on the evidence rather than on preference.',
    },
    {
      title: 'Week 4. You drive',
      desc:
        'You run it and I watch and correct. The point is not that it works when I do it. The point is that it works when you do.',
    },
    {
      title: 'Week 5. I do not attend',
      desc:
        'The load-bearing week. If the system only runs when I am in the room, we both find that out while there is still time to fix it, rather than after the invoice.',
    },
    {
      title: 'Week 6. Exit, and a Day 90 recheck',
      desc:
        'You keep the system, the context and the way of deciding. Ninety days later we check whether it held, because a handover that decays quietly is not a handover.',
    },
  ],
  keepHero:
    'You keep a business that decides and sells differently, run by your own people, with the context layer that makes it repeatable. Not a deck describing one.',
  keepCards: [
    {
      role: 'The org',
      title: 'A way of deciding',
      body:
        'Your team runs the decision method themselves, on their own decisions, without waiting for an outside opinion to arrive.',
      worth: '<b>Decisions that do not queue</b> behind one person.',
    },
    {
      role: 'The commercial layer',
      title: 'A rebuilt go-to-market',
      body:
        'Positioning, pricing and the sales motion rebuilt around what your buyer actually responds to, with the reasoning written down rather than held in someone\'s head.',
      worth: '<b>A story that sells</b> without you in the room.',
    },
    {
      role: 'The system',
      title: 'Context you own',
      body:
        'The context layer lives in your systems, in plain text and version control, model-agnostic and not rented from a platform.',
      worth: '<b>Your IP stays yours</b>, and stays portable.',
    },
  ],
  keepFoot:
    'Everything here survives the end of the engagement. That is the test it is built to pass.',
  guarantee: {
    title: 'Week five',
    intro: 'The engagement is built to end, on a date you know at the start.',
    body:
      'In week five I do not attend at all. <b>A system that only runs when I am in the room is not a system</b>, and week five is where that stops being a claim and becomes something you can watch happen. The Day 90 recheck is included for the same reason.',
  },
  phase2: {
    heading: 'What comes after is yours to run.',
    intro:
      'There is no phase two by default, and no retainer. If something genuinely new shows up later, it starts the same way anything else does: with one decision.',
    cap: 'Optional, and only if a real decision shows up. Nothing here is part of the engagement.',
    tracks: [
      {
        kicker: 'Later / One decision at a time',
        title: 'When the next fork arrives',
        desc:
          'A Teardown on the new decision, the same ten days as the first one. Most people do not need anything more than that, and I would rather they did not buy it.',
        chips: [
          { label: 'One decision', key: true },
          { label: 'Ten business days' },
          { label: 'Only if it is real' },
        ],
      },
    ],
    commercial:
      'No pressure to continue. The engagement is designed so you do not need me afterwards, and the referral comes from the result rather than the invoice.',
  },
  nextSteps: [
    'Book the call. First conversation is free.',
    'We confirm the decision, the timeline and who owns the work between sessions.',
    'A Teardown first, always, so we both see how one decision goes.',
    'Six weeks from kickoff, on dates fixed at the start.',
  ],
};

// Teardown. The entry rung, the gate, and the fallback for an unknown mode.
const TEARDOWN: ModeScaffold = {
  mode: 'teardown',
  engagementLabel: 'The engagement / Ten business days',
  engagementHeading: 'Bring the decision you keep not making.',
  deliverables: [
    {
      title: 'Your decision comes apart',
      desc:
        'Whatever you bring gets broken into the claims it is actually resting on. Most decisions turn out to rest on four or five, and most people have never written them down.',
    },
    {
      title: 'Every claim gets checked',
      desc:
        'Each one is tested against live evidence and comes back with a reliability tier, so you can see which parts of your thinking are load-bearing and which are just repeated.',
    },
    {
      title: 'Every consideration gets classed',
      desc:
        'External, meaning the world decides. Only you, meaning no amount of research will help. Or nobody yet, meaning the answer does not exist and waiting will not produce it.',
    },
    {
      title: 'Four models cross-examine it',
      desc:
        'Where they disagree, you see the disagreement. Averaging four models into one confident answer hides exactly the part you needed to look at.',
    },
  ],
  keepHero:
    'A one-page memo you can send to whoever reads it next, with the decision mapped to what it actually rests on and three claims placed under a 90-day watch.',
  keepCards: [
    {
      role: 'The decision',
      title: 'One page, sendable',
      body:
        'The decision, its load-bearing claims, the evidence behind each, and the recommendation. Written to be forwarded rather than presented.',
      worth: '<b>A decision in writing</b>, not a folder of notes.',
    },
    {
      role: 'The reasoning',
      title: 'Disagreement preserved',
      body:
        'Where the models disagreed, you see the disagreement rather than an average that hides it. The uncertainty is the useful part.',
      worth: '<b>You see the soft spot</b>, not a confident blur.',
    },
    {
      role: 'The next 90 days',
      title: 'What would change your mind',
      body:
        'Three claims under a 90-day watch, so you know in advance which new fact should reopen this and which should not.',
      worth: '<b>You stop relitigating</b> a settled decision.',
    },
  ],
  keepFoot:
    'Under two hours of your time across the ten days. The rest is not your problem.',
  guarantee: {
    title: 'It might talk you out of it',
    intro: 'A Teardown is the cheap way to find out whether more is worth it.',
    body:
      'This is the gate for the six-week engagement, and <b>it has talked people out of that as often as into it</b>. If the honest answer is that you do not need me, the memo will say so, which is the whole reason it is worth reading.',
  },
  phase2: {
    heading: 'If the decision points at something bigger.',
    intro:
      'Some decisions turn out to be a symptom of how the business decides and sells. If yours is, that is a six-week engagement, and the Teardown is what tells us.',
    cap: 'Optional, and only if the decision genuinely points there. Most do not.',
    tracks: [
      {
        kicker: 'Later / The Handover',
        title: 'When one decision was not the problem',
        desc:
          'Six weeks rebuilding how the business decides and sells, ending on a date fixed at the start, with a week where I do not attend and a Day 90 recheck.',
        chips: [
          { label: 'Six weeks', key: true },
          { label: 'Week five I am not there' },
          { label: 'Capped at six a year' },
        ],
      },
    ],
    commercial:
      'No push. The Teardown stands on its own and most people stop there, which is the correct outcome.',
  },
  nextSteps: [
    'Confirm the one decision to take apart.',
    'A short kickoff, then under two hours of your time across ten business days.',
    'The memo lands, and it may tell you not to spend anything else.',
  ],
};

// CTRL. The product, not an engagement, and not sold on this site.
const CTRL: ModeScaffold = {
  mode: 'ctrl',
  engagementLabel: 'The product',
  engagementHeading: 'AI that knows your business, and stops forgetting.',
  deliverables: [
    {
      title: 'A portable context layer',
      desc:
        'Your world, your priorities and your voice held in one place and carried into every AI tool you use, so you stop retyping your background into a chatbot every session.',
    },
    {
      title: 'Mornings anchored to your real priorities',
      desc:
        'A daily read that starts from what actually matters to you, not a blank prompt, so the day opens on signal rather than setup.',
    },
    {
      title: 'Consistent output, regardless of the week',
      desc:
        'Repeatable context per client or project, so the quality of your AI-assisted work stops swinging on how much you remembered to feed it.',
    },
  ],
  keepHero:
    'CTRL is yours to keep using: a context layer that travels with you across every AI tool, mornings anchored to your priorities, and consistent output whether the week is calm or chaos.',
  keepCards: [
    {
      role: 'Every tool',
      title: 'Portable context',
      body:
        'Your context on file and carried into every AI tool, so each one knows your world without being re-briefed.',
      worth: '<b>No more retyping your life</b> into a chatbot every morning.',
    },
    {
      role: 'Every morning',
      title: 'A real starting point',
      body:
        'A daily anchor to your actual priorities, so AI opens on what matters rather than a cold blank prompt.',
      worth: '<b>Mornings on signal</b>, not setup.',
    },
    {
      role: 'Every engagement',
      title: 'Consistency',
      body:
        'Repeatable per-client context, so your AI-assisted work is the same quality however busy you are.',
      worth: '<b>Consistent thinking</b>, not whatever you typed that day.',
    },
  ],
  keepFoot:
    'CTRL is a separate product with its own pricing, and it is not sold here.',
  guarantee: {
    title: 'A tool, not an engagement',
    intro: 'CTRL stands on its own and asks nothing of you first.',
    body:
      'There is no engagement to commit to and <b>no call to sit through first</b>. Its pricing lives on its own site, because it is a product rather than something I sell you.',
  },
  phase2: {
    heading: 'The tool gives you time back. The systems compound it.',
    intro:
      'CTRL holds your context and gives you the time back. If you decide you want a faster business rather than just faster outputs, that is a decision, and decisions start with a Teardown.',
    cap: 'Only if you want to go from a tool to a system. CTRL stands on its own.',
    tracks: [
      {
        kicker: 'Later / From tool to system',
        title: 'When faster outputs are not enough',
        desc:
          'If the time CTRL gives back gets reinvested into systems and loops rather than pocketed, that is worth one real decision taken apart properly.',
        chips: [
          { label: 'A faster business', key: true },
          { label: 'Systems you own' },
          { label: 'Only if you will reinvest' },
        ],
      },
    ],
    commercial:
      'Not everyone needs a fleet, and I will say so even though I sell it. If you just want faster outputs, CTRL is the whole answer.',
  },
  nextSteps: [
    'Open CTRL at ctrl.themindmaker.ai.',
    'Load your context once.',
    'Use it across every AI tool you already run.',
  ],
};

// Registry + selector.

/** All canonical mode scaffolds, keyed by mode. */
export const MODE_SCAFFOLDS: Record<string, ModeScaffold> = {
  handover: HANDOVER,
  teardown: TEARDOWN,
  ctrl: CTRL,
};

/**
 * Normalise a loosely-formatted mode key to a canonical scaffold key.
 *
 * The alias list carries the work-shape keys the proof bank uses, and the
 * retired offer names, so a stale caller or a cached session still resolves to
 * a live scaffold instead of falling through. `reposition`, `rebuild` and `os`
 * are Handover-shaped; `decide` is Teardown-shaped.
 */
function canonicalMode(mode: string): string | undefined {
  const m = (mode || '').toLowerCase().trim().replace(/[\s_]+/g, '-');
  if (MODE_SCAFFOLDS[m]) return m;
  const ALIASES: Record<string, string> = {
    // Work shapes, as tagged in the proof bank.
    decide: 'teardown',
    reposition: 'handover',
    rebuild: 'handover',
    os: 'handover',
    // Retired offer names, mapped by what the work actually was.
    'signal-session': 'teardown',
    signal: 'teardown',
    signalsession: 'teardown',
    workshop: 'teardown',
    workshops: 'teardown',
    cohort: 'teardown',
    'ai-fluent-executive': 'teardown',
    'cohort-ai-fluent-executive': 'teardown',
    'revenue-architecture': 'handover',
    revenue: 'handover',
    'revenue-arch': 'handover',
    architecture: 'handover',
    'bespoke-enablement': 'handover',
    bespoke: 'handover',
    enablement: 'handover',
    immersion: 'handover',
    immersions: 'handover',
    'ctrl-free': 'ctrl',
  };
  return ALIASES[m];
}

/**
 * Return the deterministic scaffold for a mode.
 *
 * Unknown or empty modes fall back to `teardown`, the entry rung. A misrouted
 * proposal should land on the smaller, more honest recommendation rather than
 * pitch six weeks at someone the router could not read.
 */
export function getModeScaffold(mode: string): ModeScaffold {
  const key = canonicalMode(mode);
  return (key && MODE_SCAFFOLDS[key]) || TEARDOWN;
}
