import receiverImage from "@/assets/stories/one-way-receiver-r01-800.webp";
import { iconSvg, type IconName } from "@/lib/icons";
import { srcsetFor } from "@/lib/responsiveImages";

/**
 * "An AI chief of staff knows how you think." (Krish, 2026-11-11: moved from
 * the homepage to /ai-brain, in the place of "Private to you, and yours to
 * keep.", which repeated what the page says elsewhere).
 *
 * The words, steps and picture are the homepage section's own, approved on
 * 2026-11-04: one picture and one flow, the three steps on one line with their
 * icons, what the AI carries and what you keep as the caption under them, and
 * the organisation told in full on /new-age-leadership.
 */
const ACTS: ReadonlyArray<{ word: string; line: string; icon: IconName }> = [
  { word: "Notices", line: "It spots what has changed before you ask.", icon: "notice" },
  { word: "Connects", line: "It checks new facts against what you already know.", icon: "connect" },
  { word: "Prepares", line: "It hands you the work, ready for your decision.", icon: "prepare" },
];

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** The panel's inside: copy on the left, the picture beside it. */
export function chiefOfStaffMarkup() {
  const acts = ACTS.map((act) => `<li>${iconSvg(act.icon, "mm-icon mm-icon-big")}<b>${act.word}</b><span>${act.line}</span></li>`).join("");
  const srcset = srcsetFor(receiverImage, 800);
  const image = `<img class="cos-img" src="${esc(receiverImage)}"${srcset ? ` srcset="${esc(srcset)}" sizes="(max-width: 960px) 92vw, 40vw"` : ""} alt="" width="800" height="450" loading="lazy" decoding="async" />`;
  return `<div class="chapter-copy"><h2 id="how-title">An AI chief of staff knows <span data-hs-mark="underline">how you think</span>.</h2><p>Your AI brain is a private memory for your AI tools, so they get smarter instead of forgetting. It holds your goals, taste and standards, so you can trust its answers.</p><ol class="cos-flow" aria-label="What the AI carries, in three steps">${acts}</ol><p class="cos-carries"><span><b>AI carries</b> gather, connect, compare, monitor, prepare</span> <span><b>You keep</b> taste, judgement, relationships, the decision</span></p><p class="cos-link"><a href="/new-age-leadership">How the hybrid organisation works</a></p></div><figure class="cos-figure">${image}</figure>`;
}
