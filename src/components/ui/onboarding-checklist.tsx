import { useState } from "react";
import { Check } from "lucide-react";

const steps = ["Download your part", "Open it, and Claude adds it in one click", "Run it on one of your own files", "Read the result and make the call"];

// Adapted from onboarding-01. Completion is self-reported and kept in page memory.
export function OnboardingChecklist() {
  const [completed, setCompleted] = useState<string[]>([]);
  return <section className="parts-onboarding" aria-labelledby="parts-onboarding-title">
    <h2 id="parts-onboarding-title">Your first five minutes</h2>
    <p className="kit-label" role="status">{completed.length} of {steps.length} complete</p>
    <ol>{steps.map(step => <li key={step}><label>
      <input type="checkbox" checked={completed.includes(step)} onChange={event => setCompleted(current => event.target.checked ? [...current, step] : current.filter(item => item !== step))} />
      <span className="parts-tick" aria-hidden="true"><Check size={16} /></span><span>{step}</span>
    </label></li>)}</ol>
    <p className="kit-refund">Tick each step as you go. Your ticks stay on this page.</p>
  </section>;
}
