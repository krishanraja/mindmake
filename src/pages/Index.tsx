import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import filmOnePoster from "@/assets/films/film-01-poster.jpg";
import filmOnePosterWebp from "@/assets/films/film-01-poster.webp";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

export default function Index() {
  const { briefOpen, openBrief, closeBrief } = useLeadBriefHistory();

  return (
    <MindmakeShell onStart={openBrief}>
      <SEO
        title="Every AI you buy knows the market. None of them know you."
        description="Mindmake builds systems that hold a leader's judgement: an AI brain, or an AI go-to-market model. Thirty days, and you keep everything."
        canonical="/"
      />

      <section className="mm-hero" aria-labelledby="hero-title">
        <div className="mm-container">
          <div className="mm-hero-stage">
            <div className="mm-hero-plate">
              <FilmPlate
                poster={filmOnePoster}
                posterWebp={filmOnePosterWebp}
                label="An instrument room at first light. A brass mechanism of interlocking wheels turns at different speeds under a single blade of window light."
                className="mm-parallax"
                style={{ height: "100%" }}
                scrim
                priority
              />
            </div>
            <div className="mm-hero-copy">
              <h1 className="mm-setup" id="hero-title">Every AI you buy knows the market.</h1>
              <p className="mm-claim">None of them know you.</p>
            </div>
          </div>
        </div>
      </section>

      <CloseBlock claim="Own the way you decide." onStart={openBrief} />

      <LeadBrief open={briefOpen} onClose={closeBrief} />
    </MindmakeShell>
  );
}
