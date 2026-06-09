/**
 * Mindy proof index — the anonymized proof bank as deployable data.
 *
 * Source of truth: project-documentation/mindy/proof-bank.md
 * Every entry is reduced to sector and role only. Numbers are kept; names are gone.
 * R-01..R-09 are real engagements with verified numbers. B-01..B-26 are illustrative,
 * drawn from the per-offer case bank. No entry is ever presented as a named client.
 *
 * The proposal generator pulls THREE entries via selectProof() and never writes its own.
 * Selection keys, in priority order: mode (hard) -> icp (strong) -> industry (soft).
 */

export interface ProofEntry {
  id: string;
  mode: string;
  icp: string;
  industry: string;
  situation: string;
  outcome: string;
  quote: string;
}

export const PROOF_BANK: ProofEntry[] = [
  // ─── Real engagements (anonymized, verified numbers) ───
  {
    id: 'R-01',
    mode: 'reposition',
    icp: 'enterprise',
    industry: 'data infrastructure / first-party identity',
    situation:
      'A first-party identity and data-infrastructure company with patented identity tech and a strong APAC pipeline, but stuck in a collapsing cookie-replacement category as buyers asked what comes next for the open web.',
    outcome:
      '$254K POC contracted with a major US media publisher, pipeline rebuilt with three further major publishers and a large classifieds marketplace, and the category narrative shifted from defence to offence.',
    quote:
      '"He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver." — CRO, data-infrastructure company',
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
      '"We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. He led it and landed it." — Head of Operations, digital publisher',
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
      '"He took the problems that matched our business goals and our leadership needs and brought them together into a very thoughtful programme." — President, broadcast business',
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
      '"He uses deep knowledge of AI and tech to help me with genuinely human problems. I had an AI mentor before and they were far too technical. He thinks about me and the results I need." — CEO, coaching practice',
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
      '"I\'ve learnt to push through barriers I didn\'t know I could, and the systems make me more effective and more motivated. I used to post once a month, now it\'s most days. It\'s helping my customers see me." — Founder, breathwork content brand',
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
      '"We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable." — Managing Partner, TMT advisory',
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
      '"I built fourteen agents and it started with two. Half the ops pod exists to watch the other half. The management layer is the actual product." — Operator-advisor, AI business',
  },
  {
    id: 'R-08',
    mode: 'signal-session',
    icp: 'enterprise',
    industry: 'media / advertising',
    situation:
      'A major media publisher where the commercial team wanted to build an in-house AI ad product and engineering wanted to partner, with the CRO refereeing for two quarters and a selling season at risk.',
    outcome:
      'A clear go decision in a single day, roughly a year of engineering time not spent on the wrong thing, and a partner agreement signed the following month.',
    quote:
      '"One day. One decision. No more Monday debates. That\'s the entire review." — CRO, media company',
  },
  {
    id: 'R-09',
    mode: 'revenue-architecture',
    icp: 'enterprise',
    industry: 'adtech / data',
    situation:
      'An adtech firm with a strong first-party data asset and an AI layer on top, technical positioning, guessed pricing, and an empty pipeline, with no clear way to sell either.',
    outcome:
      'Clear positioning and pricing from a 30-day sprint, the first two pilots signed inside the window, and a playbook the sales team runs without the founder present.',
    quote:
      '"We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me." — Founder, adtech firm',
  },

  // ─── Case bank: Cohort — the AI-Fluent Executive ───
  {
    id: 'B-01',
    mode: 'cohort',
    icp: 'leader',
    industry: 'B2B software',
    situation:
      'A VP of Marketing at a mid-market B2B software company with three martech vendors pitching AI features and a board asking when the spend would land, unable after two pilots to tell which was real, the decision open for four months.',
    outcome:
      'Decision made in week 3, two pilots cancelled and roughly $180K a year recovered, with the first working automation shipped by her rather than a vendor.',
    quote:
      '"I stopped waiting to feel ready. The framework was the permission to decide." — VP Marketing, B2B software',
  },
  {
    id: 'B-02',
    mode: 'cohort',
    icp: 'leader',
    industry: 'logistics',
    situation:
      'A Head of Operations at a regional logistics firm whose team brought him eleven AI tools to approve, leaving him the single point of judgement, guessing, with every request stalled on his desk.',
    outcome:
      'Tool sprawl cut from eleven to three, a written evaluation standard the team now runs without him, and the approval cycle dropped from weeks to days.',
    quote:
      '"I used to be the bottleneck and told myself that meant I mattered. Now the team moves without me and I sleep better." — Head of Operations, logistics firm',
  },
  {
    id: 'B-03',
    mode: 'cohort',
    icp: 'leader',
    industry: 'healthtech',
    situation:
      'A Chief of Staff at a healthtech scaleup whose CEO wanted a clear read on the company\'s AI posture for a board meeting, which she was expected to produce while not feeling qualified to have an opinion.',
    outcome:
      'Board memo delivered and approved, and she now chairs the company\'s internal AI council, pulled into AI strategy as part of the remit.',
    quote:
      '"I walked in hoping not to embarrass myself in front of the board. I walked out running the council." — Chief of Staff, healthtech scaleup',
  },
  {
    id: 'B-04',
    mode: 'cohort',
    icp: 'leader',
    industry: 'infrastructure software',
    situation:
      'A Director of Engineering at an infrastructure startup who could build anything but could not decide which AI bets were worth his team\'s quarter, defaulting to whatever was loudest in his feed.',
    outcome:
      'Two speculative builds stopped, one real bet resourced properly, and a clearer filter for his own team\'s ideas.',
    quote:
      '"I assumed AI literacy was a beginner course for people who can\'t code. It was about judgement, which I was apparently short on." — Director of Engineering, infrastructure startup',
  },
  {
    id: 'B-05',
    mode: 'cohort',
    icp: 'leader',
    industry: 'legal / professional services',
    situation:
      'A Head of People at a regional law firm who watched every other function start using AI and felt the gap widening, wanting not a strategy but to stop feeling left behind.',
    outcome:
      'First AI-assisted hiring workflow live, now leading the firm\'s people-side AI policy, and no longer dreading the topic in leadership meetings.',
    quote:
      '"I\'d been quietly terrified of being left behind. I\'m not anymore, and that on its own was worth the fee." — Head of People, law firm',
  },
  {
    id: 'B-06',
    mode: 'cohort',
    icp: 'leader',
    industry: 'enterprise software',
    situation:
      'An SVP of Sales at an enterprise software company who kept telling his reps to use AI to work smarter while having no idea how to do it himself, with the credibility gap starting to show.',
    outcome:
      'Three rep-facing workflows built and demoed, adoption across the team once he could show rather than tell, and pipeline review time cut noticeably.',
    quote:
      '"I came to sharpen my team and ended up sharpening myself first. Nobody warns you that\'s the order it happens in." — SVP Sales, enterprise software',
  },

  // ─── Case bank: Signal Session ───
  {
    id: 'B-07',
    mode: 'signal-session',
    icp: 'capital',
    industry: 'private equity',
    situation:
      'An Operating Partner at a mid-market PE fund who suspected the portfolio was AI-exposed but had no structured way to rank where, with every portco CEO claiming to be on top of it and no way to verify.',
    outcome:
      'Fourteen portcos ranked and prioritised, two flagged for deeper commercial work, and a repeatable scoring method the fund now reuses each quarter.',
    quote:
      '"I now have a defensible way to tell my LPs which companies are exposed. I did not have that the day before." — Operating Partner, PE fund',
  },
  {
    id: 'B-08',
    mode: 'signal-session',
    icp: 'capital',
    industry: 'venture capital',
    situation:
      'A General Partner at an early-stage venture fund about to deploy against an AI thesis he half believed, wanting someone to push back hard before the capital moved, not after.',
    outcome:
      'A sharpened investment thesis, two prospective deals reframed before term sheets, and a clearer filter for the next twenty pitches.',
    quote:
      '"I went in ready to call most of it hype. I left with a thesis I\'d actually back." — General Partner, venture fund',
  },
  {
    id: 'B-09',
    mode: 'signal-session',
    icp: 'enterprise',
    industry: 'insurance',
    situation:
      'A CTO at an enterprise insurer whose eighteen-month AI program had quietly stalled, with nobody willing to call it, needing to know whether to fund it harder or shut it down.',
    outcome:
      'A stalled program given a clear decision, budget redirected to two viable use cases, and an internal stalemate broken in a day.',
    quote:
      '"I needed someone to tell me whether to kill it or fund it. I got a straight answer. First one in eighteen months." — CTO, enterprise insurer',
  },
  {
    id: 'B-10',
    mode: 'signal-session',
    icp: 'capital',
    industry: 'family office',
    situation:
      'A Principal at a single-family office considering a direct investment into an AI company, with no in-house way to judge whether the commercial story held up.',
    outcome:
      'An investment decision made with eyes open, a diligence checklist the office now reuses, and one follow-on conversation reframed entirely.',
    quote:
      '"Measured, specific, and refreshingly free of jargon. I made the investment. I would not have without the day." — Principal, single-family office',
  },
  {
    id: 'B-11',
    mode: 'signal-session',
    icp: 'capital',
    industry: 'fintech',
    situation:
      'A founder at a Series B fintech whose leadership team had four competing views on the AI roadmap and restarted the debate every Monday, with three side projects running in parallel, none owned, none shipping.',
    outcome:
      'A single roadmap with owners assigned, two side projects killed, and exec alignment reached in a day after months of drift.',
    quote:
      '"We\'d been going in circles for two quarters. Took six hours in a room with someone who\'d actually shipped this to stop us." — Founder, Series B fintech',
  },

  // ─── Case bank: Revenue Architecture ───
  {
    id: 'B-12',
    mode: 'revenue-architecture',
    icp: 'enterprise',
    industry: 'B2B SaaS',
    situation:
      'A Series C B2B SaaS company that shipped an AI feature six months earlier with fine usage but almost zero attached revenue, buried in the base plan with a sales team that did not know how to sell it.',
    outcome:
      'Attach rate moved from low single digits to roughly a third of new deals over the quarter, sales stopped treating it as a footnote, and new pricing went live inside 30 days.',
    quote:
      '"Attach rate went from a rounding error to a third of new deals. My CFO stopped asking what the feature was for." — CFO-adjacent product owner, B2B SaaS',
  },
  {
    id: 'B-13',
    mode: 'revenue-architecture',
    icp: 'capital',
    industry: 'industrial services',
    situation:
      'A PE-backed industrial services group whose fund wanted an AI-enabled service line stood up inside one portco with a commercial engine that could be templated across others, where the portco had capability but no route to market.',
    outcome:
      'One new commercial service line with a defined engine, early pipeline generated inside the sprint window, and a reusable template for two more portcos.',
    quote:
      '"We didn\'t get a strategy deck. We got a service line that books revenue. Big difference." — Operating Partner, PE-backed industrial group',
  },
  {
    id: 'B-14',
    mode: 'revenue-architecture',
    icp: 'enterprise',
    industry: 'telco',
    situation:
      'An enterprise telco with an AI customer-service product the sales team kept improvising around, where every rep pitched it differently and win rates reflected the chaos.',
    outcome:
      'A single GTM motion adopted across the team, win rate on the product up over the following quarter, and onboarding time for new reps cut.',
    quote:
      '"Thirty days, and the team stopped winging it. That consistency is worth more than what we paid." — Sales leader, enterprise telco',
  },
  {
    id: 'B-15',
    mode: 'revenue-architecture',
    icp: 'enterprise',
    industry: 'media',
    situation:
      'A regional media company that built an AI content tool and spent a year arguing whether to subscribe it or license it, where the argument had become the product strategy.',
    outcome:
      'A monetisation model chosen and live, first paying accounts inside two months, and a year-long internal debate closed.',
    quote:
      '"We\'d been arguing subscription versus licensing for a year. Settled it, priced it, shipped it." — Product owner, regional media company',
  },
  {
    id: 'B-16',
    mode: 'revenue-architecture',
    icp: 'enterprise',
    industry: 'logistics',
    situation:
      'A logistics platform with an internal AI tool that worked beautifully and no idea it was sellable until customers started asking for it, where building it and selling it were not the same skill.',
    outcome:
      'An internal tool packaged as a standalone product, first external deals signed, and a new revenue line that did not exist before the sprint.',
    quote:
      '"We built the tool. We had no clue how to sell it. Turns out those are completely different jobs." — Product leader, logistics platform',
  },

  // ─── Case bank: AI Immersion ───
  {
    id: 'B-17',
    mode: 'immersion',
    icp: 'enterprise',
    industry: 'retail',
    situation:
      'A 12-person product team at a multi-brand retailer with a roadmap full of AI ideas and no shared way to judge them, where every planning session turned into the same circular argument.',
    outcome:
      'Three prioritised use cases with owners assigned and the rest parked with a reason, plus a shared vocabulary that survived the next planning cycle.',
    quote:
      '"Half a day, and the circular roadmap argument finally ended. Three use cases, owners, done." — Product lead, multi-brand retailer',
  },
  {
    id: 'B-18',
    mode: 'immersion',
    icp: 'enterprise',
    industry: 'professional services',
    situation:
      'The leadership team at a professional services firm where each partner had a private view on AI and none had said it out loud, while clients were starting to ask what the firm\'s position was.',
    outcome:
      'Written AI principles the partners actually signed, a 90-day plan with named leads, and a consistent answer when clients ask.',
    quote:
      '"Getting eight partners to agree on anything is a minor miracle. We left with signed principles." — Partner, professional services firm',
  },
  {
    id: 'B-19',
    mode: 'immersion',
    icp: 'enterprise',
    industry: 'healthcare',
    situation:
      'The clinical leadership team at a hospital system needing agreement on where AI was acceptable in their workflows and where it was not, wanting defensible boundaries rather than a pitch.',
    outcome:
      'Agreed use boundaries across the team, three low-risk use cases approved to start, and the contentious ones ruled out on the record.',
    quote:
      '"We needed boundaries we could all stand behind, not a sales pitch for AI. That\'s exactly what we got." — Clinical lead, hospital system',
  },
  {
    id: 'B-20',
    mode: 'immersion',
    icp: 'enterprise',
    industry: 'marketing / advertising',
    situation:
      'The creative and strategy team at a marketing agency using AI in roughly a dozen uncoordinated ways and trusting almost none of the output, with quality swinging wildly between people.',
    outcome:
      'One shared usage playbook, output quality steadied across the team, and a clear line on what never goes near a client deliverable.',
    quote:
      '"The team was using AI twelve different ways and trusting none of it. Now there\'s one playbook and a lot less stress." — Team lead, marketing agency',
  },

  // ─── Case bank: Workshops ───
  {
    id: 'B-21',
    mode: 'workshop',
    icp: 'founder',
    industry: 'consumer software',
    situation:
      'A solo founder at an early-stage consumer app who wanted the cohort but found the fee a stretch before he had proof the approach worked for him, where a single workshop was a risk he could take.',
    outcome:
      'First automation shipped same day, converted to the cohort with the workshop credit applied, and the feeder did its job.',
    quote:
      '"I couldn\'t stretch to the cohort yet. The workshop got me a working tool and the nerve to come back." — Solo founder, consumer app',
  },
  {
    id: 'B-22',
    mode: 'workshop',
    icp: 'leader',
    industry: 'manufacturing',
    situation:
      'A Director of Finance at a mid-market manufacturer who did not want a strategy, wanting a working AI assistant for financial analysis and a clear way to know it was trustworthy.',
    outcome:
      'One working tool used the next day, two referrals into the next session, and no oversell or decks.',
    quote:
      '"I wanted one thing that worked. I got one thing that worked." — Director of Finance, manufacturer',
  },
  {
    id: 'B-23',
    mode: 'workshop',
    icp: 'leader',
    industry: 'nonprofit',
    situation:
      'An Operations Manager at a mid-size nonprofit on a real budget where every dollar had to justify itself and the workshop fee needed to pay back fast.',
    outcome:
      'One manual reporting task largely automated, hours returned to the team every week, and approval secured for a second seat next quarter.',
    quote:
      '"On our budget, the fee has to earn its place. This one did, twice over, by the end of the week." — Operations Manager, nonprofit',
  },

  // ─── Case bank: CTRL ───
  {
    id: 'B-24',
    mode: 'ctrl',
    icp: 'leader',
    industry: 'startup / technology',
    situation:
      'A CEO of a 20-person startup who was retyping the same background into every AI tool each session and getting generic output because the tools did not know his world.',
    outcome:
      'Portable context across every AI tool he uses, mornings anchored to his actual priorities, and an upgrade to the paid tier inside two weeks.',
    quote:
      '"I stopped retyping my whole life into a chatbot every morning. That sentence undersells how much time it gives back." — CEO, 20-person startup',
  },
  {
    id: 'B-25',
    mode: 'ctrl',
    icp: 'founder',
    industry: 'consulting',
    situation:
      'An independent strategy consultant who rebuilt context from scratch for every client engagement, with the quality of his AI-assisted work swinging on how much he had remembered to feed it.',
    outcome:
      'Repeatable per-client context, prep time down noticeably per engagement, and consistent quality regardless of how busy the week was.',
    quote:
      '"Every client gets consistent thinking from me now, not whatever I happened to type that day." — Independent strategy consultant',
  },

  // ─── Case bank: Alumni Pass ───
  {
    id: 'B-26',
    mode: 'alumni',
    icp: 'leader',
    industry: 'SaaS',
    situation:
      'A cohort graduate, Head of Data at a SaaS company, who six months on hit a deployment he could not get past internally and brought it to a quarterly alumni session instead of guessing.',
    outcome:
      'A stalled deployment unblocked in one session, with the annual pass paying for itself in a single afternoon.',
    quote:
      '"I was stuck for a fortnight. One session, three people who\'d already solved it, unstuck by the afternoon." — Head of Data, SaaS company',
  },
];

/**
 * Adjacency families. If a hard mode match yields fewer than n entries, widen
 * to the sibling mode(s) in the same family (per proof-bank.md selection rule).
 */
const MODE_FAMILIES: Record<string, string[]> = {
  reposition: ['os'],
  os: ['reposition'],
  'signal-session': ['immersion'],
  immersion: ['signal-session'],
  'revenue-architecture': ['bespoke-enablement', 'rebuild'],
  'bespoke-enablement': ['revenue-architecture', 'rebuild'],
  rebuild: ['bespoke-enablement', 'revenue-architecture'],
  cohort: ['workshop'],
  workshop: ['cohort'],
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
 *   1. mode — hard match first; if short, widen to adjacent modes in the same family.
 *   2. icp  — within a mode tier, entries matching `icp` rank ahead of those that don't.
 *   3. industry — soft, nearest-neighbour token overlap as the final tie-breaker.
 *
 * Never fabricates: only entries that exist in PROOF_BANK are ever returned. If the
 * exact and adjacent modes still don't yield `n`, no further widening occurs — the
 * generator gets whatever genuine matches exist (possibly fewer than `n`).
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

  // Build the ordered pool of candidate modes: exact first, then family siblings.
  const modeTiers: string[][] = [[wantMode], MODE_FAMILIES[wantMode] ?? []];

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
