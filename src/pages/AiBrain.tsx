import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { MobileChapter } from "@/components/mindmake/MobileChapter";
import { Arrive } from "@/components/mindmake/Arrive";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { SubscribeBand } from "@/components/mindmake/SubscribeBand";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { Instrument } from "@/components/mindmake/Instrument";
import { Build } from "@/components/mindmake/Build";
import { ScrubText } from "@/components/mindmake/ScrubText";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { ProofViewer } from "@/components/mindmake/ProofViewer";
import { ProcessTrack } from "@/components/mindmake/ProcessTrack";
import { DoorStories } from "@/components/mindmake/DoorStories";
import { BrainJourney } from "@/components/mindmake/journeys/BrainJourney";
import { BRAIN_STEPS } from "@/content/journeySteps";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { useScrollDriver } from "@/hooks/useScrollDriver";
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
import filmOnePoster from "@/assets/films/film-01-poster.jpg";
import filmOnePosterWebp from "@/assets/films/film-01-poster.webp";
import filmOneLoop from "@/assets/films/film-01-loop.mp4";
import filmOneLoopWebm from "@/assets/films/film-01-loop.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

/* Two, not four. "Live data from 2,000+ checked sources" and "Checks that hold
   you to your own standards" were the second and third principle cards below
   them, said again as badges. */
const SPEC_CHIPS = [
  "Ours, two years in the building",
  "Decades of decision research inside",
];

const PRINCIPLES = [
  {
    instrument: "recorder" as const,
    title: "We trust the source, not the sales pitch.",
    body: "What a company publishes about its own product counts for less than what it actually shipped.",
  },
  {
    instrument: "gauge" as const,
    title: "Two sources agree, or we leave it out.",
    body: "One report is a rumour. Two that agree is something you can use.",
  },
  {
    instrument: "flap" as const,
    title: "It tells you when it cannot know.",
    body: "If the answer depends on something only you know, it says so rather than guessing.",
  },
];


export default function AiBrain() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();
  const plateRef = useScrollDriver<HTMLDivElement>();

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Build your AI brain"
        description="An AI that knows how you work: your standards, your context and the decisions you have already made. Built with you in private, and yours to keep."
        canonical="/ai-brain"
      />

      <section className="mm-hero" aria-labelledby="brain-title">
        <div className="mm-container mm-hero-split">
          {/* The film drifts against the copy as the hero leaves, which is what
              the homepage hero has always done and these two never did. The
              copy column is the entrance's first beat: see index.html. */}
          <div className="mm-first">
            <h1 className="mm-setup" id="brain-title">Your AI should already know how you work.</h1>
            <p className="mm-claim">Build one that does, and keep the edge.</p>
            <p className="mm-lede">
              An AI brain is a working system that holds your standards, your context and the
              decisions you have already made, then uses them on real work. Built with you in
              private, inside your own accounts.
            </p>
          </div>
          <div className="mm-hero-film mm-parallax" ref={plateRef}>
            <FilmPlate
              className="mm-parallax-plate"
              poster={filmTwoPoster}
              posterWebp={filmTwoPosterWebp}
              src={filmTwoLoop}
              srcWebm={filmTwoLoopWebm}
              label="A wall of walnut specimen drawers. A brass arm files one cream card while a handwritten note waits under a paperweight."
              priority
            />
          </div>
        </div>
      </section>

      <section className="mm-block mm-on-raise" aria-labelledby="aa-title">
        <div className="mm-container">
          <div className="mm-head-split">
            <h2 id="aa-title"><Instrument kind="rail" className="mm-head-mark" />What it does on a Monday.</h2>
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
                <li>The board paper, argued from every side before you walk in</li>
                <li>Your network, searchable at the moment a name matters</li>
                <li>The taste that makes your work yours, written down and applied</li>
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
          <ScrubText className="mm-payoff" text="Hours back every week, and better calls made with them." />
        </div>
      </section>

      {/* How it learns you. The method, described and never named, per the
          canon: the site said "it learns how you decide" and nothing about
          how, which left the one thing nobody else can say unsaid. Three
          steps as a group that builds with scroll. The wording is proposed
          for the owner to confirm before it ships. */}
      <section className="mm-block" aria-labelledby="method-title">
        <div className="mm-container">
          <h2 id="method-title"><Instrument kind="drawer" className="mm-head-mark" />How it learns you.</h2>
          <Build className="mm-three" style={{ marginTop: 20 }}>
            <article className="mm-enemy">
              <h3>Two pieces of your own work, side by side</h3>
              <p>You say which is the better one, and why. Real work, never a questionnaire.</p>
            </article>
            <article className="mm-enemy">
              <h3>It writes down the rule you used</h3>
              <p>In your words, with the two examples kept beside it as the evidence.</p>
            </article>
            <article className="mm-enemy is-answer">
              <h3>The next piece tests the rule</h3>
              <p>What holds is kept. What does not is rewritten, by you, and the record shows when.</p>
            </article>
          </Build>
        </div>
      </section>

      {/* How it decides, then what it holds: two claims, and two sections
          because together they run 1.8 screens on a laptop and the gate says
          one idea a screen. The first is the engine's rules; the second is
          the captures, at half width because a 1404px source rendered full
          width is soft and `qa:images` says so. */}
      <section className="mm-block mm-on-raise" aria-labelledby="ctrl-title">
        <div className="mm-container">
          <h2 id="ctrl-title"><Instrument kind="gauge" className="mm-head-mark" />How it decides.</h2>
          <div className="mm-ctrl-split">
            <div className="mm-ctrl-copy">
              <p className="mm-lede">
                Behind the brain sits CTRL, our own decision engine. It lays out a situation in
                plain English: the trade-offs, the arguments against, and what would change your
                mind.
              </p>
              <div className="mm-spec-chips">
                {SPEC_CHIPS.map((chip) => <span className="mm-spec-chip" key={chip}>{chip}</span>)}
              </div>
              <div className="mm-proof-line">
                <ScrubText className="mm-claim" text="We built this for ourselves first. Then we build yours." />
              </div>
              {/* Three mono cards in a column, after the longest section on the
                  page, is the text wall the phone reader complained about. */}
              <MobileChapter
                className="mm-principles"
                shown={1}
                noun="rules"
                /* Wrapped one by one rather than in a staggered group,
                   because MobileChapter counts and slices this array and a
                   fragment around it would leave it holding one child. */
                items={PRINCIPLES.map((principle, at) => (
                  <Arrive as="article" className="mm-principle" from={at} key={principle.title}>
                    <Instrument kind={principle.instrument} />
                    <h3>{principle.title}</h3>
                    <p>{principle.body}</p>
                  </Arrive>
                ))}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mm-block" aria-labelledby="ctrl-see-title">
        <div className="mm-container">
          <h2 id="ctrl-see-title" className="mm-try-title">
            <span>What it holds.</span>
          </h2>
          <ProofViewer />
        </div>
      </section>

      {/* Two leaders, and what they kept. The first client proof on this
          page: until 5 September 2026 a reader met the mechanism, then the
          form, and the evidence was two pages away. Both stories are about
          ownership, which is what this door sells: a content system the
          founder runs herself, and a business rebuilt and handed back. */}
      <section className="mm-block mm-on-raise" aria-labelledby="built-title">
        <div className="mm-container">
          <h2 id="built-title"><Instrument kind="drawer" className="mm-head-mark" />Two leaders, and what they kept.</h2>
          <div style={{ marginTop: 20 }}>
            <DoorStories ids={["own-system", "hand-back"]} />
          </div>
        </div>
      </section>

      <section className="mm-block" aria-labelledby="learn-title">
        <div className="mm-container">
          {/* The film belongs beside this heading for the same reason it does
              beside the one above: this is the only section on the page that
              carries no imagery, and it is the section the page exists to get
              somebody into. Measured on a phone it read a whole-screen change
              of 0.016 with one of sixty-four cells moving, across 1.66 screens
              of form. A plate runs its light sweep whether or not the loop
              plays, so this is the picture and the ambient layer at once. */}
          <div className="mm-head-split">
            <h2 id="learn-title"><Instrument kind="recorder" className="mm-head-mark" />See what it would do for you.</h2>
            <FilmPlate
              className="mm-impact-film"
              poster={filmOnePoster}
              posterWebp={filmOnePosterWebp}
              src={filmOneLoop}
              srcWebm={filmOneLoopWebm}
              label="An instrument room at first light, where a brass mechanism of interlocking wheels turns at different speeds under a single blade of window light."
            />
          </div>

          {/* What happens, before what we need, in the same three rows the GTM
              door uses. Without them this screen was a heading and a film and
              nothing else, which is a section that says the reader should keep
              scrolling. */}
          <div className="mm-journey-steps">
            {BRAIN_STEPS.map((step) => (
              <article className="mm-journey-step" key={step.number}>
                <b>{step.number}</b>
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The form on its own screen. It asks three questions rather than one,
          which is what makes the read personal rather than about the company,
          and three chip sets cannot share a screen with a heading and a film.
          Splitting is the honest answer; asking less is not. */}
      <section className="mm-block mm-on-raise mm-try mm-seam-above" id="try-it" aria-labelledby="try-title">
        <div className="mm-container">
          {/* The one screen on each door page the aliveness gate has called
              still since 1 September. A form is finished the moment it is
              drawn, so nothing on it moves at rest; what it can do is build
              under the reader as they arrive, which is the gate's other half
              and the thing this site has been asked for repeatedly. */}
          <Build className="mm-try-panel">
            <Instrument kind="recorder" />
            <h2 id="try-title" className="mm-try-title">Four details and two taps.</h2>
            <p className="mm-lede">
              We read your company from the outside, then what that means for your own week rather
              than for the business.
            </p>
            <BrainJourney />
          </Build>
        </div>
      </section>

      {/* The fork band and the climb stood here until 5 September 2026. Both
          made the argument that what you teach AI should compound on your
          side, which the homepage makes in three beats and the argument page
          makes properly; on this page they were the same idea a third and a
          fourth time, between the form and the process. Paper here, so the
          page keeps a light passage after the form. */}
      <section className="mm-block mm-on-paper" aria-labelledby="shape-title">
        <div className="mm-container">
          <h2 id="shape-title"><Instrument kind="levels" className="mm-head-mark" />One piece of work, and the second half is optional.</h2>
          <ProcessTrack
            first={{
              instrument: "recorder",
              title: "The build",
              line: "Built once, connected to where you already work.",
              body: "We learn your standards from real work, switch on the parts that keep learning, and leave when it is running.",
            }}
            second={{
              instrument: "levels",
              title: "The habit, optional",
              line: "It gets better the more you use it.",
              body: "Occasional check-ins to build the habits that keep it improving. No monthly retainer.",
            }}
          />
        </div>
      </section>

      <section className="mm-block">
        <div className="mm-container">
          <ObjectionChips ask={["private", "technical", "how-we-work", "keep", "data", "charging", "risk", "tried-it", "why-not-myself"]} />
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

      <SubscribeBand />

      <CloseBlock
        instrument="drawer"
        claim="You keep everything."
        body="The system, the automations and the record of your standards."
        onStart={openBrief}
      />

      <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" />
    </MindmakeShell>
  );
}
