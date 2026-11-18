import sample from "../../content/parts-sample.json";

export function PartsSampleOutput() {
  return <figure className="parts-sample" aria-labelledby="parts-sample-title">
    <figcaption><p className="kit-label">FROM A SAMPLE BOARD UPDATE</p><h2 id="parts-sample-title">{sample.headline}</h2><p>{sample.summary}</p></figcaption>
    <dl>{sample.rows.map(row => <div key={row.claim}><dt>{row.status}</dt><dd><p>{row.claim}</p><p className="parts-sample-evidence">{row.evidence}</p></dd></div>)}</dl>
    <p className="parts-sample-note">A real report excerpt from Fact-check my board update, run on the included example files.</p>
    <p className="parts-sample-note">{sample.limitation}</p>
  </figure>;
}
