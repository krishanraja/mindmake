// PeakChart adapted to two signed bars. No demo series, time axis or animated totals.
const results = [
  { value: .46, label: "When people were better than the AI at the task: gains (effect size +0.46)" },
  { value: -.54, label: "When the AI was better than the people: losses (effect size -0.54)" },
];

export function PartsEvidenceChart() {
  return <figure className="parts-evidence-chart" aria-label="Results when people worked with AI">
    {results.map(result => <div className="parts-evidence-row" key={result.value}>
      <p>{result.label}</p><div className="parts-evidence-track" aria-hidden="true"><span data-value={result.value} style={{ width: `${Math.abs(result.value) / .54 * 50}%`, left: result.value > 0 ? "50%" : "0" }} /></div>
    </div>)}
    <figcaption className="kit-source">Vaccaro, Almaatouq and Malone, Nature Human Behaviour, 2024.</figcaption>
  </figure>;
}
