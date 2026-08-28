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
import filmTwoLoop from "@/assets/films/film-02-loop.mp4";
import filmTwoLoopWebm from "@/assets/films/film-02-loop.webm";
import filmFourPoster from "@/assets/films/film-04-poster.jpg";
import filmFourPosterWebp from "@/assets/films/film-04-poster.webp";
import filmFourLoop from "@/assets/films/film-04-loop.mp4";
import filmFourLoopWebm from "@/assets/films/film-04-loop.webm";
import filmFivePoster from "@/assets/films/film-05-poster.jpg";
import filmFivePosterWebp from "@/assets/films/film-05-poster.webp";
import filmFiveProof from "@/assets/films/film-05-proof.mp4";
import filmFiveProofWebm from "@/assets/films/film-05-proof.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

const BRAIN_OBJECTIONS = [
  {
    id: "cost",
    question: "How much does it cost?",
    answer: "It depends on the result you want, and we agree it privately after the first conversation. There is no retainer and no published price.",
  },
  {
    id: "technical",
    question: "Do I need to be technical?",
    answer: "No. That is rather the point. We handle the technical side, and everything the system shows you is in plain English.",
  },
  {
    id: "duration",
    question: "What happens after the thirty days?",
    answer: "It keeps working. You own the system, the automations and the record of your standards. We can check in from time to time if that helps, and it runs fine without us.",
  },
  {
    id: "data",
    question: "Who sees my data?",
    answer: "Only you. We build it inside your own accounts, and we never publish, share or train anything on your work.",
  },
];

const SPEC_CHIPS = [
  "Ours, two years in the building",
  "Decades of decision research inside",
  "Live data from 2,000+ checked sources",
  "Checks that hold you to your own standards",
];

const PRINCIPLES = [
  {
    title: "We trust the source, not the sales pitch.",
    body: "What a company publishes about its own product counts for less than what it actually shipped.",
  },
  {
    title: "Two sources agree, or we leave it out.",
    body: "One report is a rumour. Two that agree is something you can use.",
  },
  {
    title: "It tells you when it cannot know.",
    body: "If the answer depends on something only you know, it says so rather than guessing.",
  },
];

export default function AiBrain() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Build your AI brain"
        description="An AI that knows how you work: your standards, your context and the decisions you have already made. Built in thirty days, and yours to keep."
        canonical="/ai-brain"
      />

      <section className="mm-hero" aria-labelledby="brain-title">
        <div className="mm-container mm-hero-split">
          <div>
            <h1 className="mm-setup" id="brain-title">Your AI should already know how you work.</h1>
            <p className="mm-claim">In thirty days, yours will.</p>
            <p className="mm-lede">
              An AI brain is a working system that holds your standards, your context and the
              decisions you have already made, then uses them on real work. It starts learning in
              the first week, and you keep it.
            </p>
          </div>
          <FilmPlate
            poster={filmTwoPoster}
            posterWebp={filmTwoPosterWebp}
            src={filmTwoLoop}
            srcWebm={filmTwoLoopWebm}
            label="A wall of walnut specimen drawers. A brass arm files one cream card while a handwritten note waits under a paperweight."
            priority
          />
        </div>
      </section>

      <section className="mm-block mm-on-raise" aria-labelledby="aa-title">
        <div className="mm-container">
          <div className="mm-head-split">
            <h2 id="aa-title">Built around your best work, and the parts you would rather skip.</h2>
            <FilmPlate
              className="mm-impact-film"
              poster={filmFourPoster}
              posterWebp={filmFourPosterWebp}
              src={filmFourLoop}
              srcWebm={filmFourLoopWebm}
              label="A brass rail carrying cream sheets to a small gate, where a hand lifts the top sheet before the rail resumes."
            />
          </div>
          <div className="mm-aa" style={{ marginTop: 18 }}>
            <article className="mm-aa-col is-amplify">
              <h3>More of the work only you can do.</h3>
              <ul>
                <li>Your network, made searchable and usable at the moment it matters</li>
                <li>The calls only you can make, prepared from every angle</li>
                <li>The taste that makes your work recognisably yours, written down and enforced</li>
              </ul>
            </article>
            <article className="mm-aa-col">
              <h3>Less of the work you would rather not do.</h3>
              <ul>
                <li>Copy drafted in your voice, to your standards, before you arrive</li>
                <li>The admin between decisions</li>
                <li>The first pass of everything you currently dread starting</li>
              </ul>
            </article>
          </div>
          <p className="mm-payoff">
            You get hours back every week.{" "}
            <em>Spend them on the work only you can do.</em>
          </p>
        </div>
      </section>

      <section className="mm-block" aria-labelledby="ctrl-title">
        <div className="mm-container">
          <h2 id="ctrl-title">See a decision from every side.</h2>

          {/* The captures are product screenshots with real interface text in
              them. At full container width they rendered 1238px from a 1404px
              source, which is soft on any modern screen. Half the width is
              twice the density and half the height.

              Everything else in the section reads down the left column beside
              them. The lede and the three principles used to be full width rows
              above and below, which left about 260px of empty column next to a
              tall viewer and made the section the longest on the page. */}
          <div className="mm-ctrl-split">
            <div className="mm-ctrl-copy">
              <p className="mm-lede">
                Behind the brain sits CTRL, the decision engine we have spent two years building
                and use on our own work. It lays out a situation in plain English: the trade-offs,
                the arguments against, and what would change your mind. No jargon, and nothing to
                wade through.
              </p>
              <div className="mm-spec-chips">
                {SPEC_CHIPS.map((chip) => <span className="mm-spec-chip" key={chip}>{chip}</span>)}
              </div>
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
            <ProofViewer />
          </div>
        </div>
      </section>

      <section className="mm-block mm-on-raise" aria-labelledby="learn-title">
        <div className="mm-container">
          <h2 id="learn-title">See what it would do for you.</h2>
          <p className="mm-lede" style={{ marginTop: 10 }}>
            Your LinkedIn and two taps, and we will show you what your first week would look like.
            It takes about twenty seconds.
          </p>
          <BrainJourney />
        </div>
      </section>

      <section className="mm-block mm-on-paper">
        <ForkBand />
      </section>

      <section className="mm-block" aria-labelledby="ladder-title">
        <div className="mm-container">
          <h2 id="ladder-title">Thirty days builds it. Using it makes it better.</h2>
          <div className="mm-ladder" style={{ marginTop: 18 }}>
            <article className="mm-level">
              <h3>One. You use AI</h3>
              <p>You ask, it answers, and tomorrow it has forgotten. Useful, and it never adds up.</p>
            </article>
            <article className="mm-level">
              <h3>Two. You direct AI</h3>
              <p>You hand work over, check it and ship it. Good work, and every task starts from nothing.</p>
            </article>
            <article className="mm-level is-hot">
              <h3>Three. It builds on itself</h3>
              <p>It remembers, it learns what good looks like to you, and the hours it saves go back into your best work.</p>
            </article>
          </div>

          <div className="mm-shapes">
            <article className="mm-shape is-hot">
              <h3>The build, thirty days</h3>
              <p className="mm-shape-line">Built once, connected to where you already work.</p>
              <p>We learn your standards from real work, switch on the parts that keep learning, and connect it to the tools your week already runs on.</p>
            </article>
            <article className="mm-shape">
              <h3>The habit, optional</h3>
              <p className="mm-shape-line">It gets better the more you use it.</p>
              <p>Occasional check-ins to build the habits that get you to level three. No monthly retainer. The system keeps working either way.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mm-block mm-on-raise">
        <div className="mm-container">
          <ObjectionChips objections={BRAIN_OBJECTIONS} />
        </div>
      </section>

      {/* A full-bleed film band, and one of the two breaks in the ground rhythm.
          It carries no ground and no seam of its own: the film across the whole
          width is the separator, and losing the block padding costs the page a
          hundred pixels it was spending on nothing. */}
      <section className="mm-film-band" aria-labelledby="film-title">
        <h2 className="mm-visually-hidden" id="film-title">The idea underneath this</h2>
        <FilmPlate
          className="mm-film-band-plate"
          poster={filmFivePoster}
          posterWebp={filmFivePosterWebp}
          src={filmFiveProof}
          srcWebm={filmFiveProofWebm}
          label="A directory room of card cabinets. Three cards lie fanned on a desk, and one hand rests beside them mid-decision."
          clickToPlay
        />
        <div className="mm-container">
          <p className="mm-film-band-note">
            Sixty seconds on the idea underneath all of this: machines do the remembering and
            the searching, and a person still makes the call.
          </p>
        </div>
      </section>

      <CloseBlock
        claim="You keep everything."
        body="The system, the automations and the record of your standards. All of it stays with you when we finish."
        onStart={openBrief}
      />

      <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" />
    </MindmakeShell>
  );
}
