import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { Instrument } from "@/components/mindmake/Instrument";
import { JourneyEnd } from "@/components/mindmake/JourneyEnd";
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

  const [params, setParams] = useSearchParams();
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

      <UseCaseFinder wish={params.get("wish")} onWishChange={wish => {
        setParams(previous => {
          const next = new URLSearchParams(previous);
          if (wish === "all") next.delete("wish");
          else next.set("wish", wish);
          return next;
        }, { preventScrollReset: true });
      }} onStart={(door) => openBrief(door)} />

      <ClientWords>
        <div className="mm-attendance">
          <h3>
            <Instrument kind="rail" className="mm-head-mark" />
            <LeaderCount />
          </h3>
          <LogoRail />
        </div>
      </ClientWords>

      <section className="mm-block"><div className="mm-container">
        <h2>Find the result worth proving.</h2>
        <p>Bring a decision you want to make with the same confidence.</p>
        <JourneyEnd page="cases" onStart={openBrief} />
      </div></section>

      <LeadBrief open={briefOpen} onClose={closeBrief} />
    </MindmakeShell>
  );
}
