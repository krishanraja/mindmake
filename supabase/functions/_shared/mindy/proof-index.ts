/**
 * Mindy proof index, the anonymized proof bank as deployable data.
 *
 * ONLY VERIFIED ENGAGEMENTS BELONG IN THIS FILE.
 *
 * Every entry here is a real engagement that happened, with numbers that can be
 * stood behind. Nothing illustrative, nothing composite, nothing "representative
 * of the kind of work". Mindy draws on this bank to generate co-branded client
 * proposals, so an invented entry here is an invented engagement in a document a
 * prospect reads and may forward. If you cannot point at the invoice, it does not
 * go in.
 *
 * The 26 illustrative B- entries that used to sit below the real ones were removed
 * in August 2026. They were 74% of the bank and were labelled as illustrative only
 * inside their own source file, which meant a prospect could receive a proposal
 * citing an engagement that never happened. Do not reintroduce that pattern.
 *
 * Source of truth: project-documentation/mindy/proof-bank.md
 * Every entry is reduced to sector and role only. Numbers are kept; names are gone.
 *
 * The proposal generator pulls up to THREE entries via selectProof() and never
 * writes its own. Selection keys, in priority order: mode (hard) -> icp (strong)
 * -> industry (soft). With a bank this small, selectProof may legitimately return
 * fewer than three; renderProof handles 1 to 3 tiles. Returning two real entries
 * is correct behaviour, and padding the bank to guarantee three is how fiction got
 * in here the first time.
 *
 * `mode` describes the SHAPE OF THE WORK (reposition, rebuild, os, decide), never
 * the SKU. Offer names change; the shape of the work does not. MODE_FAMILIES maps
 * the current rung names onto those shapes.
 */

export interface ProofEntry {
  id: string;
  mode: string;
  icp: string;
  industry: string;
  situation: string;
  outcome: string;
  /** The pull-quote alone. No attribution, no surrounding punctuation beyond the quote marks. */
  quote: string;
  /**
   * Role and sector only, never a name. Kept as its own field rather than
   * appended to `quote` behind a separator, because the renderer used to
   * recover it by scanning for a dash inside the quote text, which broke the
   * moment a quote contained one.
   */
  attribution: string;
}

export const PROOF_BANK: ProofEntry[] = [
  // Real engagements (anonymized, verified numbers).
  {
    id: 'R-01',
    mode: 'reposition',
    icp: 'enterprise',
    industry: 'data infrastructure / first-party identity',
    situation:
      'A first-party identity and data-infrastructure company with patented identity tech and a strong APAC pipeline, but stuck in a collapsing cookie-replacement category as buyers asked what comes next for the open web.',
    outcome:
      '$254K POC contracted with a major US publisher, pipeline rebuilt with three further major publishers and a large classifieds marketplace, and the category narrative shifted from defence to offence.',
    quote:
      '"He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver."',
    attribution: 'CRO, data-infrastructure company',
  },
  {
    id: 'R-02',
    mode: 'reposition',
    icp: 'enterprise',
    industry: 'media / digital publishing',
    situation:
      'A top-10 US digital publisher whose SVP-level operator had a board mandate to deliver an AI roadmap by quarter-end, with 14 AI vendors on the calendar, every team running a different tool, and no defensible position.',
    outcome:
      '40% production-time reduction on syndicated content, 75% reduction in campaign setup time downstream, and a 22% revenue lift across the affected ad inventory, built by the in-house team in 45 days with zero new headcount.',
    quote:
      '"We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. He led it and landed it."',
    attribution: 'Head of Operations, digital publisher',
  },
  {
    id: 'R-03',
    mode: 'reposition',
    icp: 'enterprise',
    industry: 'media / legacy broadcast',
    situation:
      'A legacy broadcast business where the Head of Strategy was asked to figure out AI on top of an existing role, with a team of four, a $250K budget, no mandate, every team on a different tool, and the CFO threatening to pull the budget.',
    outcome:
      'Budget defended at the next review, the first production AI workflow live in 90 days, and the role pivoted from fractional fire-fighter to ongoing advisory.',
    quote:
      '"He took the problems that matched our business goals and our leadership needs and brought them together into a very thoughtful programme."',
    attribution: 'President, broadcast business',
  },
  {
    id: 'R-04',
    mode: 'rebuild',
    icp: 'sme',
    industry: 'coaching / corporate training',
    situation:
      'A senior operator running a coaching and corporate-training practice on the side, with an outdated website, no CRM, no content cadence, and 6,500 unread emails in her own business while at inbox-zero in her corporate role.',
    outcome:
      'Five videos shipped in week one, a corporate workshop offer live and priced, a new site in final review, and the first L&D outbound batch sent, with the founder back to enjoying the craft instead of running it by hand.',
    quote:
      '"He uses deep knowledge of AI and tech to help me with genuinely human problems. I had an AI mentor before and they were far too technical. He thinks about me and the results I need."',
    attribution: 'CEO, coaching practice',
  },
  {
    id: 'R-05',
    mode: 'rebuild',
    icp: 'founder',
    industry: 'content / wellbeing',
    situation:
      'A breathwork content founder pivoting to a research-led brand, privacy-conscious and energy-managed, who needed a content engine that compounds without burning her out and no autonomy until a human-in-the-loop system was proven.',
    outcome:
      'A total AI stack cost of ~$20 per month replacing a five-figure agency retainer, time per research-backed post compressed from days to under an hour, and posting cadence up from roughly once a month to most days, fully founder-owned.',
    quote:
      '"I\'ve learnt to push through barriers I didn\'t know I could, and the systems make me more effective and more motivated. I used to post once a month, now it\'s most days. It\'s helping my customers see me."',
    attribution: 'Founder, breathwork content brand',
  },
  {
    id: 'R-06',
    mode: 'reposition',
    icp: 'sme',
    industry: 'advisory / TMT',
    situation:
      'A global TMT advisory with deep boardroom relationships and a sharp newsletter brand, but a commercial surface that was speaking rather than selling, no productized AI offer for clients, and no formal investment thesis.',
    outcome:
      'Advisory repositioned from thought leadership to productized strategic product development with AI podcasts as the first product, and Fund One launched with a defined CTO-led thesis focused on application-layer AI ventures.',
    quote:
      '"We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable."',
    attribution: 'Managing Partner, TMT advisory',
  },
  {
    id: 'R-07',
    mode: 'os',
    icp: 'founder',
    industry: 'AI / business operations',
    situation:
      'An operator running multiple ventures who needed the company to run without sitting at the centre of every task, where the bottleneck was judgement applied to repeatable work, not the work itself.',
    outcome:
      'A 14-agent autonomous operating system built up from two agents, with morning briefs that land before the operator does, presenting the data, recommending the play, and executing on approval across multiple ventures.',
    quote:
      '"I built fourteen agents and it started with two. Half the ops pod exists to watch the other half. The management layer is the actual product."',
    attribution: 'Operator-advisor, AI business',
  },
  {
    id: 'R-08',
    mode: 'decide',
    icp: 'enterprise',
    industry: 'media / advertising',
    situation:
      'A major media publisher where the commercial team wanted to build an in-house AI ad product and engineering wanted to partner, with the CRO refereeing for two quarters and a selling season at risk.',
    outcome:
      'A clear go decision in a single day, roughly a year of engineering time not spent on the wrong thing, and a partner agreement signed the following month.',
    quote:
      '"One day. One decision. No more Monday debates. That\'s the entire review."',
    attribution: 'CRO, media company',
  },
  {
    id: 'R-09',
    mode: 'reposition',
    icp: 'enterprise',
    industry: 'adtech / data',
    situation:
      'An adtech firm with a strong first-party data asset and an AI layer on top, technical positioning, guessed pricing, and an empty pipeline, with no clear way to sell either.',
    outcome:
      'Clear positioning and pricing from a 30-day sprint, the first two pilots signed inside the window, and a playbook the sales team runs without the founder present.',
    quote:
      '"We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me."',
    attribution: 'Founder, adtech firm',
  },
];

/**
 * Adjacency families. If a hard mode match yields fewer than n entries, widen
 * to the sibling mode(s) in the same family (per proof-bank.md selection rule).
 *
 * The first four keys are work SHAPES, which is what entries are tagged with.
 * The last two are the current RUNG names, which is what the recommendation
 * arrives as. No entry is tagged with a rung name, so a rung key resolves
 * entirely through its family, by design: when the ladder is repriced or
 * renamed again, only these two lines move.
 */
const MODE_FAMILIES: Record<string, string[]> = {
  // Work shapes.
  decide: ['reposition', 'os'],
  reposition: ['rebuild', 'os'],
  rebuild: ['reposition', 'os'],
  os: ['rebuild', 'reposition'],
  // Current rungs. A Teardown ends in a decision; a Handover rebuilds.
  teardown: ['decide', 'reposition'],
  handover: ['reposition', 'rebuild', 'os'],
};

/** Lowercase, collapse non-alphanumerics to single spaces for soft industry matching. */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Count shared whitespace-delimited tokens between two normalised industry strings. */
function industryOverlap(a: string, b: string): number {
  if (!a || !b) return 0;
  const at = new Set(norm(a).split(' ').filter(Boolean));
  const bt = norm(b).split(' ').filter(Boolean);
  let hits = 0;
  for (const t of bt) if (at.has(t)) hits++;
  return hits;
}

/**
 * Select up to `n` proof entries for the proposal generator.
 *
 * Order of preference:
 *   1. mode: hard match first; if short, widen to adjacent modes in the same family.
 *   2. icp: within a mode tier, entries matching `icp` rank ahead of those that don't.
 *   3. industry: soft, nearest-neighbour token overlap as the final tie-breaker.
 *
 * Never fabricates: only entries that exist in PROOF_BANK are ever returned. If the
 * exact and adjacent modes still don't yield `n`, the last tier is the whole bank,
 * so an unrecognised mode degrades to "the best general proof we have" rather than
 * to nothing. That last tier matters: a stale caller passing a retired mode name
 * would otherwise render a proposal with an empty proof section, which reads worse
 * than a slightly off-target one. Returning fewer than `n` is still fine and normal
 * for a small verified-only bank.
 */
export function selectProof(
  mode: string,
  icp: string,
  industry?: string,
  n = 3,
): ProofEntry[] {
  const wantMode = (mode || '').toLowerCase().trim();
  const wantIcp = (icp || '').toLowerCase().trim();
  const wantIndustry = industry || '';

  // Ordered pool of candidate modes: exact, then each family sibling as its OWN
  // tier so the family array's order is a priority order (a Teardown should reach
  // for a `decide` proof before a `reposition` one), then the whole bank as a
  // last resort so an unrecognised mode never yields an empty proof section.
  const ALL_MODES = [...new Set(PROOF_BANK.map((e) => e.mode))];
  const family = MODE_FAMILIES[wantMode] ?? [];
  const modeTiers: string[][] = [[wantMode], ...family.map((m) => [m]), ALL_MODES];

  const picked: ProofEntry[] = [];
  const seen = new Set<string>();

  const take = (candidates: ProofEntry[]) => {
    // Within a mode tier, sort by: icp match, then industry overlap. Stable on id.
    const scored = candidates
      .filter((e) => !seen.has(e.id))
      .map((e) => ({
        e,
        icpMatch: e.icp.toLowerCase() === wantIcp ? 1 : 0,
        ind: industryOverlap(e.industry, wantIndustry),
      }))
      .sort((a, b) => b.icpMatch - a.icpMatch || b.ind - a.ind || (a.e.id < b.e.id ? -1 : 1));
    for (const { e } of scored) {
      if (picked.length >= n) break;
      picked.push(e);
      seen.add(e.id);
    }
  };

  for (const tier of modeTiers) {
    if (picked.length >= n) break;
    if (tier.length === 0) continue;
    const tierSet = new Set(tier);
    take(PROOF_BANK.filter((e) => tierSet.has(e.mode)));
  }

  return picked.slice(0, n);
}
