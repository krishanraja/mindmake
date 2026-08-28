import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import filmThreePoster from "@/assets/films/film-03-poster.jpg";
import filmThreePosterWebp from "@/assets/films/film-03-poster.webp";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

export default function AiGtm() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Build your AI GTM"
        description="An AI-native go-to-market model across product, price, positioning and people. One lever, thirty days, priced on the outcome."
        canonical="/ai-gtm"
      />

      <section className="mm-hero" aria-labelledby="gtm-title">
        <div className="mm-container mm-hero-split">
          <div>
            <p className="mm-label">Build your AI GTM</p>
            <h1 className="mm-setup" id="gtm-title">AI moved your market.</h1>
            <p className="mm-claim">Your price has not moved yet.</p>
            <p className="mm-lede">
              An AI-native go-to-market model across product, price, positioning and people.
              One lever, thirty days, priced on the outcome.
            </p>
          </div>
          <FilmPlate
            poster={filmThreePoster}
            posterWebp={filmThreePosterWebp}
            label="A chart room of brass recording pens drawing ink curves onto paper drums. One pen has broken sharply downward and a hand tears the strip away."
            priority
          />
        </div>
      </section>

      <CloseBlock claim="Reprice before you are repriced." onStart={openBrief} />

      <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" />
    </MindmakeShell>
  );
}
