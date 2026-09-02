import { describe, expect, it } from "vitest";
import { render as serverRender } from "@/entry-server";

/**
 * The words the design was already saying.
 *
 * This gate exists because of a specific reading of the built site, on a phone,
 * on 2 September 2026: the pages were legible, passed every layout and motion
 * gate, and still read as walls. The cause was not any one long paragraph. It
 * was three habits, each of which had crept in one sentence at a time.
 *
 *  - A paragraph that congratulates the copy above it. "That is the whole
 *    idea." sat under a claim on the homepage and told the reader nothing.
 *  - An instruction printed under a control that already looks like itself.
 *    "Drag it, or use the arrows." under a drum with two arrows on it; "Pick
 *    one and this line tells you where you land." under two buttons.
 *  - The same sentence said two and three times on one page. `/ai-brain` ran
 *    "The system, the automations and the record of your standards" as an
 *    answer, then as a second answer, then as the close block's body.
 *
 * All three are cheap to write and invisible in review, so they are checked
 * mechanically here rather than trusted to taste. This reads the server render
 * rather than the source, so a code comment explaining a rule cannot trip it
 * and a string that never reaches a page cannot either.
 */

/* Every indexed route the prerender writes, except the article pages, whose
   body is written prose rather than site copy. */
const ROUTES = ["/", "/ai-brain", "/ai-gtm", "/case-studies", "/faq", "/about", "/contact"];

/** Text a visitor reads, with the markup and the hidden elements taken out. */
function visible(html: string, tags = "p|li|h1|h2|h3|h4|legend|small|blockquote|cite") {
  const body = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, "");
  const out: string[] = [];
  const pattern = new RegExp(`<(${tags})\\b([^>]*)>([\\s\\S]*?)</\\1>`, "g");
  for (const [, , attrs, inner] of body.matchAll(pattern)) {
    if (/mm-visually-hidden|aria-hidden="true"/.test(attrs)) continue;
    const text = inner.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
    if (text) out.push(text);
  }
  return out;
}

/**
 * Copy that only exists to admire the copy above it.
 *
 * Krish named the first of these by hand. The rest are the same move: a short
 * sentence whose whole content is that the previous sentence was correct.
 */
const SELF_CONGRATULATION = [
  /\bthat(?: i|')s the whole idea\b/i,
  /\bthat(?: i|')s (?:exactly )?the point\b/i,
  /\bthat(?: i|')s it,? really\b/i,
  /\bit(?: i|')s (?:really |as )?(?:that|as) simple(?: as that)?\b/i,
  /\bnothing more,? nothing less\b/i,
  /\bno jargon\b/i,
];

/**
 * Copy that narrates a control.
 *
 * If a reader cannot tell what a control does, the control is what is wrong.
 * A sentence underneath it hides the defect and costs a line of the screen.
 */
const NARRATES_A_CONTROL = [
  /\bdrag it\b/i,
  /\bflick through\b/i,
  /\b(?:or )?use the arrows\b/i,
  /\b(?:tap|click|swipe|scroll|hover)(?: on| over)? (?:to|here|any|each|a card)\b/i,
  /\bpick one and\b/i,
  /\bthe answer opens\b/i,
];

/** Words too common to make two sentences the same sentence. */
const NOISE = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "it", "is", "we", "you", "your", "our", "that", "this", "for", "with", "as", "at", "by", "from", "then", "so"]);

const sentences = (text: string) =>
  text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);

const key = (sentence: string) =>
  sentence.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/)
    .filter((w) => w && !NOISE.has(w)).join(" ");

describe("copy restraint", () => {
  const rendered = new Map(ROUTES.map((route) => [route, serverRender(route)]));

  it.each(ROUTES)("says nothing about its own copy on %s", (route) => {
    const offences = visible(rendered.get(route)!)
      .filter((text) => SELF_CONGRATULATION.some((pattern) => pattern.test(text)));
    expect(offences).toEqual([]);
  });

  it.each(ROUTES)("prints no instructions for its own controls on %s", (route) => {
    /* Buttons and links are exempt: a label on the control is the control
       naming itself, which is the thing this rule wants instead. */
    const offences = visible(rendered.get(route)!)
      .filter((text) => NARRATES_A_CONTROL.some((pattern) => pattern.test(text)));
    expect(offences).toEqual([]);
  });

  it.each(ROUTES)("says each sentence once on %s", (route) => {
    /* Quotes are excluded and cite lines with them. The same client sentence
       appears in the story deck and in the voices drum on the homepage, and
       that is two people's evidence rather than our copy said twice. */
    const seen = new Map<string, string>();
    const repeats: string[] = [];
    for (const block of visible(rendered.get(route)!, "p|li|h2|h3|h4|legend")) {
      for (const sentence of sentences(block)) {
        const id = key(sentence);
        /* Six content words. Below that a repeat is a turn of phrase, not a
           paragraph said twice. */
        if (id.split(" ").length < 6) continue;
        if (seen.has(id)) repeats.push(sentence);
        else seen.set(id, sentence);
      }
    }
    expect(repeats).toEqual([]);
  });
});
