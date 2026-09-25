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

/* Every indexed route the prerender writes, except the article pages and the
   answer pages, whose bodies are written prose rather than site copy. The
   answer index is site copy and is read here. */
const ROUTES = ["/", "/ai-brain", "/ai-gtm", "/case-studies", "/faq", "/answers", "/about", "/contact", "/new-age-leadership"];

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

/** Both accepted device compositions live in the SSR DOM; only one is shown.
 * Check each independently, so an actual repeat within either still fails. */
/* A page may carry one composition per device when a phone needs a different
   instrument, such as the R3 variants or any block marked data-device-variant.
   Only one is ever displayed, so each is read alone. */
function responsiveCopies(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  if (!document.querySelector(".r3-variant, [data-device-variant]")) return [{device: "shared", html}];
  return ["desktop", "mobile"].map(device => {
    const copy = document.body.cloneNode(true) as HTMLElement;
    const hidden = device === "desktop" ? "mobile" : "desktop";
    copy.querySelectorAll(`.r3-variant.preview-${hidden}, .r3-variant.device-${hidden}, [data-device-variant="${hidden}"]`).forEach(node => node.remove());
    return {device, html: copy.innerHTML};
  });
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

/**
 * Copy previously used to rescue a proof surface after the interface had
 * already made the same point. The visual and information architecture must
 * carry this meaning without a second voice narrating them.
 */
const BACKUP_SINGER_COPY = [
  "Open any result. Move its mechanism. Return without losing your place.",
  "Form shows the kind of change, never its size.",
  "Illustrative machinery films · never client footage.",
  "Fourteen tools running",
  "Three kept, eleven stopped",
  "The drawing shows the kind of recorded change, not its size.",
  "Eight pieces of work. Eight recorded changes.",
  "Eleven tools stopped. One useful system went live.",
];

/**
 * Internal strategy notes that were once exposed as interface choices.
 *
 * A short label is not clear merely because the team that wrote it knows the
 * hidden object. These stay explicit so a later visual compression cannot
 * quietly put the shorthand back.
 */
const UNEXPLAINED_SHORTHAND = [
  "Keep the seat",
  "Meter the work",
  "Price the result",
  "Keep website-first",
  "Syndicate the catalogue",
  "Build for agent buying",
  "Keep the spec gate",
  "Prototype before commitment",
  "Prototype against evidence",
  "Protect the page",
  "License the evidence",
  "Build the intelligence product",
  "Lead with features",
  "Name the completed job",
  "Prove the operating model",
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

  it.each(ROUTES)("uses no backup-singer proof copy on %s", (route) => {
    const pageText = visible(rendered.get(route)!, "p|li|h1|h2|h3|h4|legend|small|blockquote|cite|span").join(" ").toLowerCase();
    const offences = BACKUP_SINGER_COPY.filter((phrase) => pageText.includes(phrase.toLowerCase()));
    expect(offences).toEqual([]);
  });

  it.each(ROUTES)("uses no unexplained strategy shorthand on %s", (route) => {
    const pageText = visible(rendered.get(route)!, "p|li|h1|h2|h3|h4|legend|small|blockquote|cite|button|a").join(" ").toLowerCase();
    const offences = UNEXPLAINED_SHORTHAND.filter((phrase) => pageText.includes(phrase.toLowerCase()));
    expect(offences).toEqual([]);
  });

  it("keeps the stated intake count identical to the details it names", () => {
    const faq = visible(rendered.get("/faq")!).join(" ");
    expect(faq).toContain("four details: your first name, your last name, your work email and the part of the business you work in");
  });

  it("states the contact handoff without an orphan-prone location fragment", () => {
    const contact = visible(rendered.get("/contact")!).join(" ");
    expect(contact).toContain("Your email app will open. Nothing is sent until you press Send.");
    expect(contact).not.toContain("Send there");
  });

  it.each(ROUTES)("says each sentence once on %s", (route) => {
    /* Quotes are excluded and cite lines with them. The same client sentence
       appears in the story deck and in the voices drum on the homepage, and
       that is two people's evidence rather than our copy said twice. */
    for (const composition of responsiveCopies(rendered.get(route)!)) {
      const seen = new Map<string, string>();
      const repeats: string[] = [];
      for (const block of visible(composition.html, "p|li|h2|h3|h4|legend")) {
      for (const sentence of sentences(block)) {
        const id = key(sentence);
        /* Six content words. Below that a repeat is a turn of phrase, not a
           paragraph said twice. */
        if (id.split(" ").length < 6) continue;
        if (seen.has(id)) repeats.push(sentence);
        else seen.set(id, sentence);
      }
    }
      expect(repeats, `${route}: ${composition.device}`).toEqual([]);
    }
  });
});
