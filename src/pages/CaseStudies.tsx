import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { Instrument } from "@/components/mindmake/Instrument";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { ProofDrum } from "@/components/mindmake/ProofDrum";
import { SubscribeBand } from "@/components/mindmake/SubscribeBand";
import { CaseProofField } from "@/components/mindmake/locked/CaseProofField";
import { attendeeBrands, clientStories } from "@/data/rebuildProof";
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
    <MindmakeShell onStart={openBrief} mainClassName="mm-case-route">
      <SEO
        title="Results"
        description="Eight verified stories about the work Mindmake helped customers change and what happened next."
        canonical="/case-studies"
        jsonLd={jsonLd}
      />

      <CaseProofField stories={clientStories} />

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
