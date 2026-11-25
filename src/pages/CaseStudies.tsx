import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { Instrument } from "@/components/mindmake/Instrument";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { LeaderCount } from "@/components/mindmake/LeaderCount";
import { LogoRail } from "@/components/mindmake/LogoRail";
import { UseCaseFinder } from "@/components/mindmake/UseCaseFinder";
import { ClientWords } from "@/components/mindmake/ClientWords";
import { storiesInDisplayOrder } from "@/data/useCases";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";
import "@/styles/mindmake-usecases.css";

/** Real records lead the wish index and structured data. Illustrations have their own cards. */
export default function CaseStudies() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "What you can do with it",
    itemListElement: storiesInDisplayOrder.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.heading,
      url: `https://mindmake.co/case-studies#${entry.id.toLowerCase()}`,
    })),
  };

  return (
    <MindmakeShell onStart={openBrief} mainClassName="mm-case-route">
      <SEO
        title="What you can do with it"
        description="Real things leaders now do with their AI brain or AI business, and every result on the record."
        canonical="/case-studies"
        jsonLd={jsonLd}
      />

      <UseCaseFinder onStart={(door) => openBrief(door)} />

      <ClientWords>
        <div className="mm-attendance">
          <h3>
            <Instrument kind="rail" className="mm-head-mark" />
            <LeaderCount />
          </h3>
          <LogoRail />
        </div>
      </ClientWords>

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
