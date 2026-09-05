import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { MobileChapter } from "@/components/mindmake/MobileChapter";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { CountingValue } from "@/components/mindmake/CountingValue";
import { Instrument } from "@/components/mindmake/Instrument";
import { ProofDrum } from "@/components/mindmake/ProofDrum";
import { StoryFigureView } from "@/components/mindmake/StoryFigure";
import { SubscribeBand } from "@/components/mindmake/SubscribeBand";
import { attendeeBrands, clientStories, FIGURE_INSTRUMENT } from "@/data/rebuildProof";
import { publishableTestimonials } from "@/data/testimonials";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

/**
 * The proof archive.
 *
 * It was eight text blocks in a grid on the old page's stylesheet, with no
 * imagery, no data and none of the vocabulary the rest of the site speaks. Now
 * each story carries the one figure its own record holds, drawn as a diagram
 * that resolves as you read down it, and the thirty-three voices sit under them
 * on the same drum the homepage uses.
 *
 * The three families stay apart here as everywhere: an outcome is anonymous by
 * role and sector because that is what those clients agreed to, the drum labels
 * every voice by what it is, and the logos are attendance and say so.
 */
export default function CaseStudies() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mindmake customer outcomes",
    itemListElement: clientStories.map((story, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: story.result,
    })),
  };

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Results"
        description="Eight verified stories about the work Mindmake helped customers change and what happened next."
        canonical="/case-studies"
        jsonLd={jsonLd}
      />

      <section className="mm-hero mm-proof-hero" aria-labelledby="stories-title">
        <div className="mm-container">
          <h1 id="stories-title"><Instrument kind="gauge" className="mm-head-mark" />The decision, and what changed next.</h1>
          <p className="mm-lede">
            Every figure below is from the record of that piece of work. The customers stay
            anonymous, because that is what they agreed to. The work and the results do not.
          </p>
          <dl className="mm-proof-figures">
            <div>
              <dt>Stories on the record</dt>
              <dd><CountingValue value={clientStories.length} from={0} /></dd>
            </div>
            <div>
              <dt>People quoted, in their own words</dt>
              <dd><CountingValue value={publishableTestimonials.length} from={0} /></dd>
            </div>
            <div>
              <dt>Days to the first working system</dt>
              <dd><CountingValue value={30} from={0} /></dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mm-block mm-on-raise" aria-labelledby="archive-title">
        <div className="mm-container">
          <h2 id="archive-title">
            <Instrument kind="recorder" className="mm-head-mark" />
            Eight stories, and the figure from each.
          </h2>
          <MobileChapter
            className="mm-stories-archive"
            shown={3}
            noun="stories"
            items={clientStories.map((story) => (
              <article className="mm-story-full" key={story.id}>
                <div className="mm-story-copy">
                  <h2>
                    <Instrument kind={FIGURE_INSTRUMENT[story.figure.shape]} className="mm-head-mark" />
                    {story.result}
                  </h2>
                  <p className="mm-story-outcome">{story.outcome}</p>
                  <blockquote>
                    {story.quote}
                    <cite>{story.attribution}</cite>
                  </blockquote>
                </div>
                <StoryFigureView figure={story.figure} />
              </article>
            ))}
          />
        </div>
      </section>

      <section className="mm-block" aria-labelledby="voices-title">
        <div className="mm-container">
          <h2 id="voices-title">
            <Instrument kind="drawer" className="mm-head-mark" />
            Everyone on the record.
          </h2>
          <ProofDrum />

          <div className="mm-attendance">
            <h3>
              <Instrument kind="rail" className="mm-head-mark" />
              People from these organisations have joined our sessions
            </h3>
            <div className="mm-logo-rail">
              {attendeeBrands.map((brand) => (
                <div className="mm-logo-cell" key={brand.name}>
                  <img src={brand.logo} alt={brand.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SubscribeBand />

      <CloseBlock
        instrument="levels"
        claim="Find the result worth proving."
        body="Four details, and we do the reading before asking you to explain the problem."
        onStart={openBrief}
      />

      <LeadBrief open={briefOpen} onClose={closeBrief} />
    </MindmakeShell>
  );
}
