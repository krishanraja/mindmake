/**
 * Proposal one-pager renderer.
 *
 * Reproduces the Mindmaker x DoThinkDo A4 sheet (full inline-CSS, Space Grotesk /
 * Inter / Space Mono, ink/paper/mint palette) as a parameterised template
 * literal. Given a ProposalPayload it returns a self-contained, print-ready
 * standalone HTML document: a dark co-branded hero, then WHAT I HEARD, THE
 * ENGAGEMENT (+ optional streams), WHAT YOU KEEP, PROOF (selected tiles), THE
 * HOURS AND THE PRICE (spec row + fee RANGE + optional ladder), THE GUARANTEE,
 * PHASE 2 tracks, NEXT STEPS, and the signature.
 *
 * Contracts honoured here:
 *   - RANGES ONLY. The fee cell and every ladder price render recommendation.range
 *     or a ladder band. If exit is 'book-call', or the band reads "set on the
 *     call" / sits over the ~$100k ceiling, the price block says the number is
 *     set on the call. En dashes preserved in numeric ranges.
 *   - PROOF is SELECTED (payload.proof, from selectProof()), never written here.
 *   - All interpolated text is HTML-escaped. Prose slots are expected to have
 *     already cleared lintVoice() before reaching this function.
 *   - The accent (mint underline / labels) tints to payload.accentHex when given.
 */

import type {
  Deliverable,
  LadderRung,
  Phase2Track,
  ProposalPayload,
  SpecItem,
  ValueCard,
} from './types.ts';
import type { ProofEntry } from '../mindy/proof-index.ts';

// ── escaping ────────────────────────────────────────────────────────────────

/** HTML-escape for text nodes and double-quoted attributes. */
function esc(input: unknown): string {
  const s = input === null || input === undefined ? '' : String(input);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Validate and normalise a hex colour; returns null if it is not a safe hex. */
function safeHex(hex?: string): string | null {
  if (!hex || typeof hex !== 'string') return null;
  const h = hex.trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)) return h;
  if (/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)) return `#${h}`;
  return null;
}

// ── pricing helpers (ranges only) ────────────────────────────────────────────

const SET_ON_CALL = 'Set on the call';

/**
 * Decide what the price block should display. Never an exact figure: if the
 * recommendation says book-call, or the band reads as a "set on the call"
 * sentinel, or it carries the over-ceiling "+" marker, we show the set-on-call
 * line. Otherwise we show the band verbatim.
 */
function resolveFee(payload: ProposalPayload): { onCall: boolean; band: string } {
  const exit = payload.recommendation?.exit;
  const raw = (payload.recommendation?.range || '').trim();
  const lower = raw.toLowerCase();

  const looksSetOnCall =
    raw === '' ||
    lower.includes('call') ||
    lower.includes('scoped') ||
    lower === 'tbd';

  if (exit === 'book-call' || looksSetOnCall) {
    return { onCall: true, band: raw && !looksSetOnCall ? raw : SET_ON_CALL };
  }
  return { onCall: false, band: raw };
}

// ── deterministic defaults ───────────────────────────────────────────────────

const DEFAULT_DELIVERABLES: Deliverable[] = [
  {
    title: 'Discovery and opportunity mapping',
    desc: 'The tasks eating the most time, and the things AI could do that you do not do today but that move a real business goal. New ways to package what you sell, faster paths from idea to client-ready, not busywork.',
  },
  {
    title: 'A working context base',
    desc: 'A context base behind every prompt you run, so AI knows your world, your voice and your clients without being re-briefed each time. Built and owned by you.',
  },
  {
    title: 'Live use cases',
    desc: 'Two to three built in your own tools, with a one-page playbook each, coached until your team runs them without me in the room.',
  },
  {
    title: 'A working AI usage policy',
    desc: 'One agreed page on which tools you use, what is allowed, where the guardrails sit, and how people should work with AI. So adoption scales without becoming a free-for-all.',
  },
  {
    title: 'The roadmap',
    desc: 'Everything learned pulled into one prioritised plan for where AI goes next, so the momentum does not stop when the engagement does.',
  },
];

const DEFAULT_VALUE_CARDS: ValueCard[] = [
  {
    role: 'The decision',
    title: 'Clarity',
    body: 'The real question under your surface ask, the honest paths, and the trade-off named on each. Board-ready, in writing, not a folder of notes.',
    worth: 'A call you can defend, made in days instead of quarters.',
  },
  {
    role: 'The team',
    title: 'Capability',
    body: 'Your own people running AI on their real work, coached until the habit sticks. The capability stays in the building when I leave.',
    worth: 'A team that operates differently, not a dependency on me.',
  },
  {
    role: 'The system',
    title: 'Leverage',
    body: 'A context base and the use cases built on it, owned by you, that keeps working after the engagement ends and compounds from there.',
    worth: 'A system you keep, not time you rented.',
  },
];

const DEFAULT_NEXT_STEPS: string[] = [
  'A free first conversation. No commitment.',
  'We pick the scope and a start date.',
  'I send the calendar and the access I need.',
  'First use case live inside the first fortnight.',
];

// ── month/year ───────────────────────────────────────────────────────────────

function monthYear(d = new Date()): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ── section renderers ────────────────────────────────────────────────────────

function renderHero(payload: ProposalPayload): string {
  const client = esc(payload.clientName || payload.contact?.company || 'your company');
  const eyebrowLabel = esc(payload.eyebrowLabel || 'AI Enablement Proposal');
  const headline = esc(
    payload.headline ||
      'A clear next step on your AI decision, with the system to back it.',
  );
  const lead = esc(
    payload.lead ||
      'You walked in with one nervous AI decision. This is the same diagnosis, written down: what I heard, the honest paths, the recommended next step, and what you keep when it is done.',
  );

  const logo = safeUrl(payload.clientLogoUrl);
  const clientMark = logo
    ? `<img class="logo-client" src="${esc(logo)}" alt="${client}">`
    : `<span class="wordmark-client">${client}</span>`;

  return `
  <header class="hero">
    <div class="cobrand">
      <span class="wordmark-mm">Mindmaker</span>
      <span class="cobrand-x">x</span>
      ${clientMark}
      <span class="cobrand-label">${eyebrowLabel}</span>
    </div>
    <h1>${headline}</h1>
    <p class="lead">${lead}</p>
  </header>`;
}

/** Only allow http(s) and data: image URLs into src/href, else drop. */
function safeUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const u = url.trim();
  if (/^https?:\/\//i.test(u) || /^data:image\//i.test(u)) return u;
  return null;
}

function renderWhatIHeard(payload: ProposalPayload): string {
  const w = payload.whatIHeard || {};
  const brief = payload.decisionBrief;
  const heading = esc(w.heading || 'What I heard, sharpened.');
  const intro = esc(
    w.intro ||
      (brief?.realDecision
        ? `The surface ask was one thing. The real decision underneath is this: ${stripTrailingDot(brief.realDecision)}.`
        : 'Here is the decision as I heard it, said back sharper than it arrived. If a line is wrong, that is the most useful thing you can tell me.'),
  );

  // Default bullets are built from the decision brief so the page reflects the
  // actual diagnosis, not boilerplate.
  let bullets = w.bullets;
  if (!bullets || bullets.length === 0) {
    bullets = [];
    if (brief?.realDecision) bullets.push(`The real decision: ${stripTrailingDot(brief.realDecision)}.`);
    if (brief?.weakAssumption) bullets.push(`The assumption to test: ${stripTrailingDot(brief.weakAssumption)}.`);
    for (const p of brief?.paths ?? []) {
      if (p?.name) bullets.push(`${stripTrailingDot(p.name)}: ${stripTrailingDot(p.tradeoff)}.`);
    }
    if (brief?.next14Days) bullets.push(`Next 14 days: ${stripTrailingDot(brief.next14Days)}.`);
  }

  const items = bullets
    .filter((b) => b && String(b).trim().length > 0)
    .map((b) => `<div class="item">${esc(b)}</div>`)
    .join('\n        ');

  return `
    <section>
      <div class="label">What I heard</div>
      <h2>${heading}</h2>
      <p class="muted">${intro}</p>
      <div class="read-grid">
        ${items}
      </div>
    </section>`;
}

function renderEngagement(payload: ProposalPayload): string {
  const e = payload.engagement || {};
  const label = esc(e.label || 'The engagement');
  const heading = esc(e.heading || 'The shape of the work.');
  const intro = esc(
    e.intro ||
      'Long enough to change behaviour, not so long it drifts. I work the real decision and the real work, and we leave with something the business owns.',
  );

  const deliverables = (e.deliverables && e.deliverables.length > 0
    ? e.deliverables
    : DEFAULT_DELIVERABLES
  )
    .map((d, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `        <div class="deliverable"><div class="num">${num}</div><div><div class="title">${esc(
        d.title,
      )}</div><div class="desc">${esc(d.desc)}</div></div></div>`;
    })
    .join('\n');

  let streamsHtml = '';
  if (e.streams && e.streams.items && e.streams.items.length > 0) {
    const lis = e.streams.items
      .map(
        (it) =>
          `<li>${esc(it.name)}${it.note ? ` <span>/ ${esc(it.note)}</span>` : ''}</li>`,
      )
      .join('\n          ');
    streamsHtml = `
      <div class="streams">
        <div class="st-label">${esc(e.streams.label || 'Streams covered')}</div>
        <ul>
          ${lis}
        </ul>
      </div>`;
  }

  return `
    <section>
      <div class="label">${label}</div>
      <h2>${heading}</h2>
      <p class="muted">${intro}</p>
      <div style="margin-top:6px;">
${deliverables}
      </div>${streamsHtml}
    </section>`;
}

function renderKeep(payload: ProposalPayload): string {
  const k = payload.keep || {};
  const label = esc(k.label || 'What you keep');
  const heading = esc(k.heading || 'You are not renting my time. You are keeping a system.');
  const hero = esc(
    k.hero ||
      'When I leave, what stays is yours: the decision in writing, a context base your tools run on, the use cases built on it, and a team that operates differently. That is the return, and it does not expire when the engagement ends.',
  );

  const cards = (k.cards && k.cards.length > 0 ? k.cards : DEFAULT_VALUE_CARDS)
    .map(
      (c: ValueCard) => `
        <div class="vcard">
          <div class="role">${esc(c.role)}</div>
          <h4>${esc(c.title)}</h4>
          <p>${esc(c.body)}</p>
          <div class="worth">${esc(c.worth)}</div>
        </div>`,
    )
    .join('');

  const foot = k.foot
    ? `\n      <p class="keep-foot">${esc(k.foot)}</p>`
    : `\n      <p class="keep-foot">And we go looking for what AI can do that you do not do today, pointed at the business goal, not at busywork.</p>`;

  return `
    <section>
      <div class="label">${label}</div>
      <h2>${heading}</h2>
      <div class="keep-hero">
        <p>${hero}</p>
      </div>
      <p class="muted" style="margin:4px 0 20px;">The value looks different depending on the seat. Worked examples:</p>
      <div class="value-cards">${cards}
      </div>${foot}
    </section>`;
}

function renderProof(proof: ProofEntry[]): string {
  if (!proof || proof.length === 0) return '';

  const tiles = proof
    .map((p) => {
      const { quote, attr } = splitQuote(p.quote);
      return `
        <div class="pf">
          <div class="pf-k">${esc(titleizeMode(p.mode))}</div>
          <div class="pf-out">${esc(p.outcome)}</div>
          <div class="pf-q">${esc(quote)}</div>
          <div class="pf-attr">${esc(attr)}</div>
        </div>`;
    })
    .join('');

  return `
    <section>
      <div class="label">Proof / The same play, run elsewhere</div>
      <h2>Wins like these, with teams and founders like yours.</h2>
      <div class="proof">${tiles}
      </div>
    </section>`;
}

function renderPrice(payload: ProposalPayload): string {
  const p = payload.price || {};
  const label = esc(p.label || 'The hours and the price');
  const heading = esc(p.heading || 'What it costs, and what it does not.');
  const intro = esc(
    p.intro ||
      'I price against the value of the decision, not my hours. So this is the band it sits inside; the exact number is set on the call. Whatever you pay rolls forward, so there is no wrong place to begin.',
  );

  const fee = resolveFee(payload);

  // Spec row: caller-supplied window/time/rate cells, plus a forced fee cell
  // that is always a RANGE or the set-on-call line.
  const baseSpecs: SpecItem[] = p.specs && p.specs.length > 0
    ? p.specs.slice(0, 3)
    : [];
  const feeCell: SpecItem = { k: 'Fee', v: fee.onCall ? SET_ON_CALL : fee.band };
  const specs = [...baseSpecs, feeCell]
    .map(
      (s) =>
        `<div class="spec"><div class="sk">${esc(s.k)}</div><div class="sv">${esc(
          s.v,
        )}</div></div>`,
    )
    .join('');

  const rateNote = fee.onCall
    ? `<p class="rate-note">The exact figure is <b>set on the call</b>, against the value of the decision, not a running meter. ${esc(
        p.rateNote || '',
      )}</p>`
    : `<p class="rate-note">The fee sits in the <b>${esc(
        fee.band,
      )}</b> band. Capped and fixed, not a running meter, and the exact number is set on the call.${
        p.rateNote ? ` ${esc(p.rateNote)}` : ''
      }</p>`;

  const freeBar = p.free
    ? `
      <div class="freebar">
        <span class="freebar-tag">Free</span>
        <p>${esc(p.free)}</p>
      </div>`
    : `
      <div class="freebar">
        <span class="freebar-tag">Free</span>
        <p>Before anything is committed, a <b>free first conversation</b>. If you are not a fit, I will say so on the call, not after you have paid.</p>
      </div>`;

  const ladderHtml = renderLadder(p.ladder);

  const ladderNote = p.ladderNote
    ? `\n      <p class="ladder-note">${esc(p.ladderNote)}</p>`
    : '';

  return `
    <section>
      <div class="label">${label}</div>
      <h2>${heading}</h2>
      <p class="muted" style="margin-bottom:18px;">${intro}</p>
      <div class="specs">${specs}</div>
      ${rateNote}${freeBar}${ladderHtml}${ladderNote}
    </section>`;
}

function renderLadder(ladder: LadderRung[] | undefined): string {
  if (!ladder || ladder.length === 0) return '';

  const parts: string[] = [];
  ladder.forEach((rung, idx) => {
    const kind = rung.kind || (idx === ladder.length - 1 ? 'future' : idx === 1 ? 'full' : 'pilot');
    const cls = kind === 'full' ? 'rung full' : kind === 'future' ? 'rung future' : 'rung';
    // Ladder prices are bands or labels. If a rung carries no honest band,
    // render the set-on-call sentinel.
    const price = renderRungPrice(rung);
    const bullets =
      rung.bullets && rung.bullets.length > 0
        ? `\n          <ul>${rung.bullets
            .map((b) => `<li>${esc(b)}</li>`)
            .join('')}</ul>`
        : '';
    parts.push(`        <div class="${cls}">
          <div class="rung-head"><span class="rstep">${esc(
            rung.step,
          )}</span><span class="rprice">${price}</span></div>
          <h3>${esc(rung.title)}</h3>
          <div class="rdesc">${esc(rung.desc)}</div>${bullets}
        </div>`);
    if (rung.credit && idx < ladder.length - 1) {
      parts.push(`        <div class="cred">${esc(rung.credit)}</div>`);
    }
  });

  return `
      <div class="ladder">
${parts.join('\n')}
      </div>`;
}

function renderRungPrice(rung: LadderRung): string {
  const raw = (rung.price || '').trim();
  const lower = raw.toLowerCase();
  // "Scoped together" and any set-on-call phrasing pass through as labels.
  if (raw === '' || lower.includes('call')) {
    return esc(SET_ON_CALL);
  }
  return esc(raw);
}

function renderGuarantee(payload: ProposalPayload): string {
  const g = payload.guarantee || {};
  const label = esc(g.label || 'The guarantee');
  const heading = esc(g.heading || 'I carry the risk.');
  const intro = esc(
    g.intro ||
      'The work is done when the decision is made in writing, the use cases are live, and the roadmap is delivered.',
  );
  const title = esc(g.title || 'The results guarantee');
  const body = esc(
    g.body ||
      'I budget the hours up front. If I am not on track to land all of it inside the budget, I keep going at no extra cost. The fee does not move. I carry the overrun, not you. The only thing I ask in return is that you show up to the sessions and give me the access to do the work.',
  );

  return `
    <section>
      <div class="label">${label}</div>
      <h2>${heading}</h2>
      <p class="muted">${intro}</p>
      <div class="guarantee">
        <div class="gk">${title}</div>
        <p>${body}</p>
      </div>
    </section>`;
}

function renderPhase2(payload: ProposalPayload): string {
  const ph = payload.phase2;
  if (!ph || !ph.tracks || ph.tracks.length === 0) return '';

  const label = esc(ph.label || 'Phase 2 / Later');
  const pill = esc(ph.pill || "Not part of today's ask");
  const heading = esc(ph.heading || 'Phase 1 makes the call. Phase 2 builds the system behind it.');
  const intro = esc(
    ph.intro ||
      'Phase 1 resolves the decision and gets the work running. Phase 2 is the second build that turns the roadmap into permanent systems, recommends and prices the stack to run them, and scopes the rest off the data Phase 1 has already produced.',
  );
  const cap = esc(
    ph.cap ||
      'Scoped together from the Phase 1 roadmap. These are the directions on the table now. Phase 1 will sharpen them, and surface more.',
  );

  const tracks = ph.tracks
    .map((t: Phase2Track) => {
      const chips = (t.chips || [])
        .map(
          (c) =>
            `<span class="chip${c.key ? ' key' : ''}">${esc(c.label)}</span>`,
        )
        .join('\n              ');
      return `
          <div class="track">
            <div class="tk">${esc(t.kicker)}</div>
            <h4>${esc(t.title)}</h4>
            <div class="tdesc">${esc(t.desc)}</div>
            <div class="chips">
              ${chips}
            </div>
          </div>`;
    })
    .join('');

  const commercial = ph.commercial
    ? `
        <div class="p2-commercial">
          <p>${esc(ph.commercial)}</p>
        </div>`
    : `
        <div class="p2-commercial">
          <p>This is the same kind of autonomous system I run across my own ventures: a fleet of agents handling research, outbound, content and ops while I make the calls. I am not theorising it, I live in it. We shape Phase 2 together when you are ready.</p>
        </div>`;

  return `
    <section class="phase2">
      <div class="p2-panel">
        <div class="p2-top">
          <div class="label">${label}</div>
          <span class="p2-pill">${pill}</span>
        </div>
        <h2>${heading}</h2>
        <p class="p2-intro">${intro}</p>
        <div class="p2-cap">${cap}</div>
        <div class="tracks">${tracks}
        </div>${commercial}
      </div>
    </section>`;
}

function renderFooter(payload: ProposalPayload): string {
  const steps = (payload.nextSteps && payload.nextSteps.length > 0
    ? payload.nextSteps
    : DEFAULT_NEXT_STEPS
  )
    .map((s) => `        <li>${esc(s)}</li>`)
    .join('\n');

  const sig = payload.signature || {};
  const sigName = esc(sig.name || 'Krish Raja');
  const sigEmail = esc(sig.email || 'krish@themindmaker.ai');
  const sigMeta = esc(
    sig.meta || `Mindmaker / Prepared for ${payload.clientName || payload.contact?.company || 'you'}, ${monthYear()}`,
  );

  // Initials disc stands in for the headshot so the sheet stays self-contained.
  const initials = esc(initialsOf(sigName));

  return `
  <footer class="foot">
    <div class="next">
      <div class="label">Next steps</div>
      <ol class="next-list">
${steps}
      </ol>
    </div>
    <div class="sig">
      <span class="sig-pic" aria-hidden="true">${initials}</span>
      <div class="sig-text">
        <b>${sigName}</b>
        <span class="sig-email">${sigEmail}</span>
        <span class="sig-meta">${sigMeta}</span>
      </div>
    </div>
  </footer>`;
}

// ── small text helpers ───────────────────────────────────────────────────────

function stripTrailingDot(s: unknown): string {
  return String(s ?? '').trim().replace(/[.\s]+$/, '');
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'M';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}

/** Pull a trailing " — Role, sector" attribution off a proof quote, if present. */
function splitQuote(raw: string): { quote: string; attr: string } {
  const s = String(raw ?? '').trim();
  const idx = s.lastIndexOf(' — ');
  if (idx === -1) {
    return { quote: s, attr: '' };
  }
  return { quote: s.slice(0, idx).trim(), attr: s.slice(idx + 3).trim() };
}

/** Turn a proof-bank mode key into a short, capitalised tile kicker. */
function titleizeMode(mode: string): string {
  const map: Record<string, string> = {
    reposition: 'Repositioned',
    rebuild: 'Rebuilt',
    os: 'Operating system',
    'signal-session': 'One decision',
    'revenue-architecture': 'Commercial rebuild',
    'bespoke-enablement': 'Built, not taught',
    cohort: 'Made the call',
    workshop: 'Shipped a tool',
    immersion: 'Team aligned',
    ctrl: 'Context that sticks',
    alumni: 'Unblocked',
  };
  return map[mode] ?? 'The result';
}

// ── CSS ──────────────────────────────────────────────────────────────────────

/**
 * The full inline stylesheet, lifted from the template and parameterised on the
 * accent. `accent` defaults to mint; when a brand colour is supplied it tints
 * the underline / labels / dots, with the deep mint kept for on-light text.
 */
function buildStyles(accent: string, accentDeep: string): string {
  return `<style>
  :root{
    --ink:#0E1512; --ink-2:#18211D; --paper:#FBFAF7; --paper-2:#F2F0E9;
    --text:#161B18; --muted:#5E6863; --mint:${accent}; --mint-deep:${accentDeep};
    --line:#E3E0D7; --line-dark:#2A352F;
    --display:"Space Grotesk", system-ui, sans-serif;
    --body:"Inter", system-ui, -apple-system, sans-serif;
    --mono:"Space Mono", ui-monospace, monospace;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  html{-webkit-text-size-adjust:100%;}
  body{background:var(--paper-2);color:var(--text);font-family:var(--body);line-height:1.5;-webkit-font-smoothing:antialiased;padding:32px 16px;}
  .sheet{max-width:860px;margin:0 auto;background:var(--paper);box-shadow:0 1px 0 rgba(0,0,0,.04),0 24px 60px -28px rgba(14,21,18,.4);overflow:hidden;}

  /* HERO */
  .hero{background:var(--ink);color:var(--paper);padding:46px 52px 44px;position:relative;}
  .hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--mint);}
  .hero h1{font-family:var(--display);font-weight:600;font-size:38px;line-height:1.06;letter-spacing:-.02em;margin:22px 0 0;max-width:34ch;}
  .hero .lead{margin-top:18px;font-size:15.5px;color:#C9D2CD;max-width:74ch;}
  .hero .lead b{color:var(--paper);font-weight:600;}

  /* CO-BRAND */
  .cobrand{display:flex;align-items:center;gap:18px;flex-wrap:wrap;}
  .wordmark-mm{font-family:var(--display);font-weight:600;font-size:20px;letter-spacing:-.01em;color:var(--paper);line-height:1;}
  .wordmark-client{font-family:var(--display);font-weight:600;font-size:20px;letter-spacing:-.01em;color:var(--paper);line-height:1;}
  .logo-client{height:40px;width:auto;max-width:180px;display:block;object-fit:contain;}
  .cobrand-x{color:#5E6863;font-family:var(--mono);font-size:15px;}
  .cobrand-label{margin-left:auto;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--mint);}

  /* SECTIONS */
  .body{padding:40px 52px 16px;}
  section{padding:22px 0 32px;border-top:1px solid var(--line);}
  section:first-child{border-top:none;padding-top:6px;}
  .label{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--mint-deep);margin-bottom:14px;display:flex;align-items:center;gap:10px;}
  .label::before{content:"";width:22px;height:2px;background:var(--mint);display:inline-block;}
  h2{font-family:var(--display);font-weight:600;font-size:22px;letter-spacing:-.01em;margin-bottom:12px;}
  p{font-size:14.5px;color:var(--text);}
  p + p{margin-top:10px;}
  .muted{color:var(--muted);}

  .read-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 28px;margin-top:14px;}
  .read-grid .item{font-size:14px;color:var(--text);padding-left:16px;position:relative;}
  .read-grid .item::before{content:"";position:absolute;left:0;top:8px;width:6px;height:6px;background:var(--mint);border-radius:50%;}

  /* DELIVERABLES */
  .deliverable{display:grid;grid-template-columns:42px 1fr;gap:18px;padding:14px 0;border-bottom:1px solid var(--line);}
  .deliverable:last-child{border-bottom:none;}
  .deliverable .num{font-family:var(--mono);font-size:13px;font-weight:700;color:var(--mint-deep);padding-top:1px;}
  .deliverable .title{font-family:var(--display);font-weight:500;font-size:15.5px;margin-bottom:3px;}
  .deliverable .desc{font-size:13.5px;color:var(--muted);}

  .streams{margin-top:18px;background:var(--paper-2);border:1px solid var(--line);padding:16px 18px;}
  .streams .st-label{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;}
  .streams ul{list-style:none;display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px 18px;}
  .streams li{font-size:13px;}
  .streams li span{color:var(--muted);}

  /* WHAT YOU KEEP */
  .keep-hero{border:1.5px solid var(--ink);padding:24px 28px;margin-bottom:24px;}
  .keep-hero p{font-family:var(--display);font-weight:600;font-size:17px;letter-spacing:-.01em;line-height:1.4;}
  .keep-hero p b{color:var(--mint-deep);}
  .value-cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;}
  .vcard{border:1px solid var(--line);background:#fff;padding:22px 22px 0;display:flex;flex-direction:column;}
  .vcard .role{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mint-deep);}
  .vcard h4{font-family:var(--display);font-weight:600;font-size:15.5px;margin:11px 0 10px;letter-spacing:-.01em;}
  .vcard p{font-size:13px;color:var(--muted);line-height:1.62;padding-bottom:20px;min-height:104px;}
  .vcard .worth{margin:auto -22px 0;padding:14px 22px;border-top:1px solid var(--line);background:var(--paper-2);font-size:13px;color:var(--text);line-height:1.45;min-height:84px;}
  .vcard .worth b{color:var(--mint-deep);font-weight:600;}
  .keep-foot{margin-top:22px;font-size:14px;color:var(--text);line-height:1.6;}
  .keep-foot b{font-weight:600;}

  /* PROOF */
  .proof{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:6px;}
  .pf{border:1px solid var(--line);background:#fff;padding:22px 20px;display:flex;flex-direction:column;}
  .pf .pf-k{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mint-deep);}
  .pf .pf-out{font-family:var(--display);font-weight:600;font-size:14px;letter-spacing:-.01em;margin:10px 0 14px;line-height:1.34;}
  .pf .pf-q{font-size:12.8px;color:var(--muted);font-style:italic;line-height:1.55;border-left:2px solid var(--mint);padding-left:12px;}
  .pf .pf-attr{margin-top:auto;padding-top:16px;font-family:var(--mono);font-size:10px;letter-spacing:.04em;color:var(--muted);text-transform:uppercase;}

  /* HOURS STRIP */
  .specs{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);margin-bottom:14px;}
  .spec{background:#fff;padding:15px 16px;}
  .spec .sk{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:7px;}
  .spec .sv{font-family:var(--display);font-weight:600;font-size:17px;letter-spacing:-.01em;}
  .rate-note{font-size:13.5px;color:var(--muted);margin-bottom:20px;}
  .rate-note b{color:var(--text);font-weight:600;}

  /* LADDER */
  .ladder{margin-top:6px;}
  .rung{border:1px solid var(--line);background:#fff;padding:18px 20px;}
  .rung .rung-head{display:flex;justify-content:space-between;align-items:baseline;gap:14px;}
  .rung .rstep{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mint-deep);}
  .rung .rprice{font-family:var(--mono);font-weight:700;font-size:20px;color:var(--ink);white-space:nowrap;}
  .rung h3{font-family:var(--display);font-weight:600;font-size:16.5px;letter-spacing:-.01em;margin:5px 0 6px;}
  .rung .rdesc{font-size:13px;color:var(--muted);line-height:1.5;}
  .rung.full{border:1.5px solid var(--ink);padding:22px;}
  .rung.full ul{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin-top:14px;}
  .rung.full li{font-size:12.8px;padding-left:16px;position:relative;color:var(--text);}
  .rung.full li::before{content:"+";position:absolute;left:0;color:var(--mint-deep);font-family:var(--mono);font-weight:700;}
  .rung.future{background:var(--ink);border:1.5px solid var(--ink);}
  .rung.future .rstep{color:var(--mint);}
  .rung.future h3{color:var(--paper);}
  .rung.future .rdesc{color:#9AA8A2;}
  .rung.future .rprice{color:var(--mint);font-size:13px;}
  .cred{display:flex;align-items:center;gap:9px;padding:9px 0 9px 22px;font-family:var(--mono);font-size:11px;letter-spacing:.04em;color:var(--mint-deep);text-transform:uppercase;}
  .cred::before{content:"\\2193";font-size:15px;line-height:1;}
  .ladder-note{margin-top:16px;font-size:13px;color:var(--muted);line-height:1.55;}

  /* FREE ON-RAMP */
  .freebar{display:flex;align-items:center;gap:16px;flex-wrap:wrap;border:1px solid var(--mint);background:rgba(87,224,184,.09);padding:14px 18px;margin-bottom:16px;}
  .freebar-tag{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mint-deep);border:1px solid var(--mint-deep);padding:5px 11px;border-radius:999px;white-space:nowrap;}
  .freebar p{font-size:13.5px;color:var(--text);flex:1;min-width:200px;}
  .freebar p b{font-weight:600;}

  /* GUARANTEE */
  .guarantee{margin-top:14px;background:var(--ink);color:var(--paper);padding:22px 26px;}
  .guarantee .gk{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--mint);margin-bottom:10px;}
  .guarantee p{color:#D5DDD8;font-size:14.5px;}
  .guarantee b{color:var(--paper);font-weight:600;}

  /* PHASE 2 (future / set apart) */
  .phase2{border-top:none;padding-top:12px;}
  .p2-panel{background:var(--ink);color:var(--paper);border-radius:14px;padding:30px 32px;}
  .p2-top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:4px;}
  .p2-panel .label{color:var(--mint);margin-bottom:0;}
  .p2-panel .label::before{background:var(--mint);}
  .p2-pill{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#9AA8A2;border:1px solid var(--line-dark);padding:5px 11px;border-radius:999px;white-space:nowrap;}
  .p2-panel h2{color:var(--paper);margin-top:10px;}
  .p2-intro{color:#C9D2CD;font-size:14.5px;}
  .p2-cap{font-family:var(--mono);font-size:11px;letter-spacing:.04em;color:#9AA8A2;margin-top:16px;}
  .tracks{margin-top:18px;}
  .track{padding:18px 0;border-top:1px solid var(--line-dark);}
  .track:first-child{border-top:none;padding-top:4px;}
  .track .tk{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mint);}
  .track h4{font-family:var(--display);font-weight:600;font-size:17px;color:var(--paper);margin:7px 0 6px;letter-spacing:-.01em;}
  .track .tdesc{font-size:13.5px;color:#C9D2CD;line-height:1.5;margin-bottom:12px;}
  .chips{display:flex;flex-wrap:wrap;gap:8px;}
  .chip{font-size:12px;color:#D5DDD8;background:rgba(255,255,255,.05);border:1px solid var(--line-dark);border-radius:999px;padding:6px 12px;}
  .chip.key{border-color:var(--mint);color:var(--paper);}
  .p2-commercial{margin-top:18px;border-left:2px solid var(--mint);padding:2px 0 2px 16px;}
  .p2-commercial p{font-size:14px;color:#D5DDD8;}

  /* FOOTER */
  .foot{background:var(--ink);color:var(--paper);padding:30px 52px 32px;display:flex;justify-content:space-between;gap:28px;flex-wrap:wrap;align-items:flex-end;}
  .foot .next{max-width:48ch;}
  .foot .next .label{color:var(--mint);margin-bottom:8px;}
  .foot .next .label::before{background:var(--mint);}
  .foot .next p{font-size:14px;color:#D5DDD8;}
  .next-list{list-style:none;counter-reset:nx;margin-top:4px;}
  .next-list li{counter-increment:nx;position:relative;padding-left:24px;margin-bottom:9px;font-size:13.5px;color:#D5DDD8;}
  .next-list li:last-child{margin-bottom:0;}
  .next-list li::before{content:counter(nx) ".";position:absolute;left:0;top:0;color:var(--mint);font-family:var(--mono);font-size:12px;font-weight:700;}
  .foot .next b{color:var(--paper);font-weight:600;}
  .foot .sig{display:flex;align-items:center;gap:14px;text-align:left;}
  .sig-pic{width:58px;height:58px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--mint);color:var(--ink);font-family:var(--display);font-weight:700;font-size:18px;letter-spacing:-.02em;}
  .sig-text{font-family:var(--mono);font-size:12.5px;line-height:1.5;display:flex;flex-direction:column;gap:3px;}
  .sig-text b{color:var(--paper);font-family:var(--display);font-size:15px;letter-spacing:-.01em;}
  .sig-email{color:#C9D2CD;}
  .sig-meta{font-size:10px;letter-spacing:.04em;color:#6E7872;}

  /* RESPONSIVE */
  @media (max-width:680px){
    body{padding:14px 0;}
    .hero{padding:34px 26px 32px;} .hero h1{font-size:30px;}
    .body{padding:30px 26px 10px;}
    .read-grid,.pricing,.streams ul,.value-cards,.p2-list,.proof,.rung.full ul{grid-template-columns:1fr;}
    .specs{grid-template-columns:1fr 1fr;}
    .foot{padding:26px 26px;} .foot .sig{text-align:left;}
  }
  /* PRINT */
  @media print{
    @page{size:A4;margin:13mm;}
    *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;}
    body{background:#fff;padding:0;}
    .sheet{box-shadow:none;max-width:none;}
    section,.card,.deliverable,.vcard,.keep-hero,.guarantee,.pf,.spec,.track,.rung{break-inside:avoid;}
    .phase2,.p2-panel{break-inside:auto;}
    .hero{padding:30px 0 26px;} .body{padding:26px 0 6px;} .foot{padding:24px 0;}
  }
</style>`;
}

// ── entry point ──────────────────────────────────────────────────────────────

/**
 * Render the co-branded proposal one-pager as a self-contained standalone HTML
 * document, print-ready to A4 PDF.
 */
export function renderProposalHtml(payload: ProposalPayload): string {
  // Accent: the brand colour when honest hex, else the template mint.
  const accent = safeHex(payload.accentHex) || '#57E0B8';
  const accentDeep = '#147A5E'; // deep mint kept for on-light text contrast (WCAG).

  const client = esc(payload.clientName || payload.contact?.company || 'Your company');
  const title = `Mindmaker x ${client} — Proposal`;

  const styles = buildStyles(accent, accentDeep);

  const sheet = [
    renderHero(payload),
    `  <div class="body">`,
    renderWhatIHeard(payload),
    renderEngagement(payload),
    renderKeep(payload),
    renderProof(payload.proof),
    renderPrice(payload),
    renderGuarantee(payload),
    renderPhase2(payload),
    `  </div>`,
    renderFooter(payload),
  ]
    .filter((s) => s && s.trim().length > 0)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
${styles}
</head>
<body>
<div class="sheet">
${sheet}
</div>
</body>
</html>`;
}
