import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";

const onward = {
  brain: ["/#ways", "See what people built"],
  gtm: ["/#ways", "Explore work that stayed yours"],
  cases: ["/ai-brain", "Inside an AI brain"],
  leadership: ["/ai-brain", "Build your AI brain"],
  toolkit: ["/ai-brain", "Explore your AI brain"],
  faq: ["/#ways", "See the work"],
  about: ["/new-age-leadership", "Explore hybrid leadership"],
  blog: ["/2-minute-ai-upgrade-toolkit", "Try the toolkit"],
} as const;

export function JourneyEnd({ page, onStart }: { page: keyof typeof onward; onStart: () => void }) {
  const [href, label] = onward[page];
  return <div className="journey-end">
    <button className="mm-button" type="button" data-mm-primary onClick={() => {
      track("scoping_request", { source: "section_close", route: page });
      onStart();
    }}>Start your brief</button>
    <Link to={href}>{label} <span aria-hidden="true">→</span></Link>
  </div>;
}
