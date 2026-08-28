import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CloseBlock } from "@/components/mindmake/CloseBlock";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import filmTwoPoster from "@/assets/films/film-02-poster.jpg";
import filmTwoPosterWebp from "@/assets/films/film-02-poster.webp";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

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

      <CloseBlock
        claim="You keep everything."
        body="The brain, the automations, the standards file, the habit. All of it stays when we leave."
        onStart={openBrief}
      />

      <LeadBrief open={briefOpen} onClose={closeBrief} route="brain" />
    </MindmakeShell>
  );
}
