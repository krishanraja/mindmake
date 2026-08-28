import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { ProofRail, type RailMechanic } from "@/components/mindmake/ProofRail";
import { FounderNote, type FounderTreatment } from "@/components/mindmake/FounderNote";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";

/**
 * The proof lab.
 *
 * Three ways to move thirty-three quotes and two ways to introduce the founder,
 * each on the real content, so the choice is made by looking rather than by
 * reading a description of it. Never linked, never in the sitemap, and deleted
 * once the choice is made.
 */
const RAILS: Record<RailMechanic, { title: string; note: string }> = {
  columns: {
    title: "A. Three columns, drifting up",
    note: "Always moving, means nothing, stops under the pointer. Tallest of the three at 520px, and the one that reads most like a wall of people.",
  },
  ticker: {
    title: "B. Three rows, alternating",
    note: "The same cards running sideways, middle row against the other two. About a third of the height, and denser at a glance.",
  },
  scrub: {
    title: "C. Scrubbed columns",
    note: "Nothing autoplays. The columns offset by how far you have scrolled, so the movement is yours and reverses when you go back up. This is the motion model already chosen for the rest of the site.",
  },
};

const FOUNDER_LABEL: Record<FounderTreatment, { title: string; note: string }> = {
  stage: {
    title: "1. The wide shot",
    note: "The room as it was. Most context, and the venue's orange is the loudest colour anywhere on the site.",
  },
  standing: {
    title: "2. The same frame, cropped to him",
    note: "Same photograph, most of the room gone. Keeps the sense of a real event and loses most of the orange.",
  },
  portrait: {
    title: "3. The headshot",
    note: "Head and shoulders, masked to a circle. The supplied file carried a cyan ring that belongs to no palette here, so the mask replaces it. Warmest of the three and the least context.",
  },
};

export function ProofLab({ mechanic, treatment }: { mechanic?: RailMechanic; treatment?: FounderTreatment }) {
  const rails = mechanic ? [mechanic] : (Object.keys(RAILS) as RailMechanic[]);
  const treatments: FounderTreatment[] = treatment ? [treatment] : ["stage", "standing", "portrait"];

  return (
    <MindmakeShell onStart={() => undefined}>
      <section className="mm-block">
        <div className="mm-container">
          <h2>Proof lab</h2>
          <p className="mm-lede" style={{ marginTop: 10 }}>
            The same thirty-three voices under three mechanics, then two ways to introduce the
            founder. Every card carries a one-line extract of exactly what the person wrote, and
            opens to the whole quote. Not linked from anywhere, and removed once chosen.
          </p>
        </div>
      </section>

      {rails.map((key) => (
        <ProofRail key={key} mechanic={key} title={RAILS[key].title} lede={RAILS[key].note} />
      ))}

      {treatments.map((key) => (
        <div key={key}>
          <section className="mm-block">
            <div className="mm-container">
              <h2>{FOUNDER_LABEL[key].title}</h2>
              <p className="mm-lede" style={{ marginTop: 10 }}>{FOUNDER_LABEL[key].note}</p>
            </div>
          </section>
          <FounderNote treatment={key} />
        </div>
      ))}
    </MindmakeShell>
  );
}
