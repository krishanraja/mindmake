import { buildProposalSections, type ProposalContent } from "@/components/mindmake/proposalContent";

/* The branded proposal rendered inside the brief dialog. Same content
   contract as the downloadable document; React escaping keeps parity with
   the artefact's escaping. */
export function MindmakeProposal({ content }: { content: ProposalContent }) {
  const sections = buildProposalSections(content);

  return (
    <article className="mm-proposal" aria-label="Your private brief">
      <header className="mm-proposal-cover">
        <p className="mm-proposal-brand">Mindmake<span aria-hidden="true"> × </span>{sections.company}</p>
        <p className="mm-proposal-meta">{sections.domain}{sections.preparedFor ? ` · prepared for ${sections.preparedFor}` : ""}</p>
      </header>

      <h3 className="mm-proposal-headline">{sections.headline}.</h3>

      <section className="mm-proposal-card">
        <h4>{sections.read.title}</h4>
        <p>{sections.read.body}</p>
        {sections.read.evidence.length > 0 && (
          <ul>{sections.read.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
        )}
      </section>

      <div className="mm-proposal-pair">
        <section className="mm-proposal-card">
          <h4>{sections.carries.title}</h4>
          <p>{sections.carries.body}</p>
        </section>
        <section className="mm-proposal-card">
          <h4>{sections.keeps.title}</h4>
          <p>{sections.keeps.body}</p>
        </section>
      </div>

      <section className="mm-proposal-card is-proof">
        <h4>{sections.proof.title}</h4>
        <strong>{sections.proof.body}</strong>
      </section>

      <section className="mm-proposal-time">
        <h4>{sections.returnedTime.title}</h4>
        <p>{sections.returnedTime.body}</p>
      </section>

      <p className="mm-proposal-honesty">{sections.honesty.cannotKnow}</p>
      <p className="mm-proposal-next"><strong>{sections.nextStep.title}.</strong> {sections.nextStep.body}</p>
      <footer className="mm-proposal-foot">
        <p>{sections.disclaimer}</p>
        <p>{sections.honesty.illustrative}</p>
      </footer>
    </article>
  );
}
