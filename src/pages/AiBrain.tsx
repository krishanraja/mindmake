import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { ProofViewer } from "@/components/mindmake/ProofViewer";
import { ForkBand } from "@/components/mindmake/ForkBand";
import { BrainJourney } from "@/components/mindmake/journeys/BrainJourney";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import filmTwoPoster from "@/assets/films/film-02-poster.jpg";
import filmTwoPosterWebp from "@/assets/films/film-02-poster.webp";
import filmFourPoster from "@/assets/films/film-04-poster.jpg";
import filmFourPosterWebp from "@/assets/films/film-04-poster.webp";
import filmFivePoster from "@/assets/films/film-05-poster.jpg";
import filmFivePosterWebp from "@/assets/films/film-05-poster.webp";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

const BRAIN_OBJECTIONS = [
  {
    id: "cost",
    question: "How much does it cost?",
    answer: "Priced on the outcome. Your exact terms arrive in your results email after the first conversation, and there is no retainer.",
  },
  {
    id: "technical",
    question: "Do I need to be technical?",
    answer: "No technical skill needed. That is the point. We connect the technical to the practical, and everything the system tells you is in plain English.",
  },
  {
    id: "duration",
    question: "What happens after the thirty days?",
    answer: "It keeps working. You own the brain, the automations and the standards file. Optional check-ins if you want them, no dependency if you do not.",
  },
  {
    id: "data",
    question: "Who sees my data?",
    answer: "You do. The system is built in your accounts, on your side. We never publish, share or train on anything of yours.",
  },
];

const SPEC_CHIPS = [
  "Proprietary · two years in the build",
  "Decades of decision science inside",
  "Live data · 2,000+ verified sources",
  "Gates that hold your standards",
];

const PRINCIPLES = [
  {
    title: "Primary sources outrank marketing.",
    body: "A lab's release notes beat a vendor's claims about itself, every time.",
  },
  {
    title: "Two independent sources, or we do not show it.",
    body: "One story is a rumour. Two that agree is information.",
  },
  {
    title: "When only you could know it, it says so.",
    body: "If the answer depends on things only you know, it tells you that instead of guessing.",
  },
];

export default function AiBrain() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Build your AI brain"
        description="Your taste, standards and judgement, running as a system. Built in thirty days, learning from the first week, yours forever."
        canonical="/ai-brain"
      />

      <section className="mm-hero" aria-labelledby="brain-title">
        <div className="mm-container mm-hero-split">
          <div>
            <p className="mm-label">Build your AI brain</p>
            <h1 className="mm-setup" id="brain-title">Taste. Standards. Judgement.</h1>
            <p className="mm-claim">Yours, running as a system.</p>
            <p className="mm-lede">
              An AI brain is a working system that holds how you decide and uses it on real work.
              Built in thirty days. Learning from the first week. Yours forever.
            </p>
          </div>
          <FilmPlate
            poster={filmTwoPoster}
            posterWebp={filmTwoPosterWebp}
            label="A wall of walnut specimen drawers. A brass arm files one cream card while a handwritten note waits under a paperweight."
            priority
          />
        </div>
      </section>

      <section className="mm-block" aria-labelledby="aa-title">
        <div className="mm-container">
          <p className="mm-label">What it does all day</p>
          <h2 id="aa-title">Built around what you are best at, and what you hate.</h2>
          <div className="mm-aa" style={{ marginTop: 18 }}>
            <article className="mm-aa-col is-amplify">
              <span className="mm-label">Amplify</span>
              <h3>The parts only you can do, done more.</h3>
              <ul>
                <li>Your network, made searchable and usable at the moment it matters</li>
                <li>The calls only you can make, prepared from every angle</li>
                <li>The taste that makes your work recognisably yours, written down and enforced</li>
              </ul>
            </article>
            <article className="mm-aa-col">
              <span className="mm-label">Absorb</span>
              <h3>The parts you hate, done without you.</h3>
              <ul>
                <li>Copy drafted in your voice, to your standards, before you arrive</li>
                <li>The admin between decisions</li>
                <li>The first pass of everything you currently dread starting</li>
              </ul>
            </article>
          </div>
          <p className="mm-payoff">
            Low-value hours come back. You reinvest them where they compound:{" "}
            <em>into the work, or into the brain itself.</em>
          </p>
          <FilmPlate
            poster={filmFourPoster}
            posterWebp={filmFourPosterWebp}
            label="A brass rail carrying cream sheets to a small gate, where a hand lifts the top sheet before the rail resumes."
            style={{ marginTop: 20, height: "clamp(120px, 18vw, 190px)" }}
          />
        </div>
      </section>

      <section className="mm-block" aria-labelledby="ctrl-title">
        <div className="mm-container">
          <p className="mm-label">The decision instrument</p>
          <h2 id="ctrl-title">Every decision, from all angles.</h2>
          <p className="mm-lede" style={{ marginTop: 10, marginBottom: 16 }}>
            Behind the brain sits CTRL, our own decision engine, two years in the build. It reads
            the whole situation in plain English: the trade-offs, the counterpoints, and what would
            change your mind. No overwhelm. No techie stuff.
          </p>

          <div className="mm-spec-chips">
            {SPEC_CHIPS.map((chip) => <span className="mm-spec-chip" key={chip}>{chip}</span>)}
          </div>

          <ProofViewer />

          <div className="mm-proof-line">
            <span className="mm-claim">We built this for ourselves. In thirty days, we build yours.</span>
            <small>CTRL, our own engine. Live today.</small>
          </div>

          <div className="mm-principles">
            {PRINCIPLES.map((principle) => (
              <article className="mm-principle" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mm-block" aria-labelledby="learn-title">
        <div className="mm-container">
          <p className="mm-label">Try it on yourself</p>
          <h2 id="learn-title">See it learn you.</h2>
          <p className="mm-lede" style={{ marginTop: 10 }}>
            Your LinkedIn and two taps. Watch it read who you are, then see what your brain would
            do for you in week one.
          </p>
          <BrainJourney />
        </div>
      </section>

      <section className="mm-block">
        <div className="mm-container">
          <ForkBand />
        </div>
      </section>

      <section className="mm-block" aria-labelledby="ladder-title">
        <div className="mm-container">
          <p className="mm-label">Where it goes</p>
          <h2 id="ladder-title">Thirty days builds it. The habit compounds it.</h2>
          <div className="mm-ladder" style={{ marginTop: 18 }}>
            <article className="mm-level">
              <span className="mm-label">Level 1</span>
              <h3>You use AI</h3>
              <p>Prompts and one-offs. Useful moments. Nothing remembers.</p>
            </article>
            <article className="mm-level">
              <span className="mm-label">Level 2</span>
              <h3>You direct AI</h3>
              <p>Work is delegated, reviewed, shipped, forgotten. Every task starts from zero.</p>
            </article>
            <article className="mm-level is-hot">
              <span className="mm-label">Level 3</span>
              <h3>It compounds</h3>
              <p>The system remembers, learns your standards, and hands back hours that return as judgement.</p>
            </article>
          </div>

          <div className="mm-shapes">
            <article className="mm-shape is-hot">
              <span className="mm-label">The build · 30 days</span>
              <h3>Brain built once, wired to where you work.</h3>
              <p>Your standards captured from real work, the self-learning loops switched on, and the automations connected to the places your week already happens.</p>
            </article>
            <article className="mm-shape">
              <span className="mm-label">The practice · optional</span>
              <h3>Quality climbs while it runs.</h3>
              <p>Periodic check-ins that build the habits taking you to level three. No monthly retainer, no dependency. The system keeps working either way.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mm-block" aria-labelledby="brain-objections">
        <div className="mm-container">
          <h2 className="mm-visually-hidden" id="brain-objections">Common questions</h2>
          <ObjectionChips objections={BRAIN_OBJECTIONS} />
        </div>
      </section>

      <section className="mm-block" aria-labelledby="film-title">
        <div className="mm-container">
          <p className="mm-label">The proof film</p>
          <h2 className="mm-visually-hidden" id="film-title">The proof film</h2>
          <FilmPlate
            poster={filmFivePoster}
            posterWebp={filmFivePosterWebp}
            label="A directory room of card cabinets. Three cards lie fanned on a desk, and one hand rests beside them mid-decision."
            style={{ height: "clamp(180px, 30vw, 320px)" }}
            clickToPlay
          />
          <p className="mm-lede" style={{ marginTop: 12, fontSize: 14 }}>
            Sixty seconds. A room built from years of real relationships, searched by machines,
            decided by a hand.
          </p>
        </div>
      </section>

      <CloseBlock
        claim="You keep everything."
        body="The brain, the automations, the standards file, the habit. All of it stays when we leave."
        onStart={openBrief}
      />

      <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" />
    </MindmakeShell>
  );
}
