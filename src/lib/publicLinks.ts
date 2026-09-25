/**
 * The two outbound links the site uses in more than one place.
 *
 * PUBLICATION_URL is Mindmake's publication. The substack.com address is a
 * legacy hosting identifier, not a name: the publication is Mindmake's, and it
 * runs exactly two channels, The Money of AI and Built with AI. Nothing on the
 * site or in generated copy calls it anything else.
 */
export const PUBLICATION_URL = "https://mindmakerlive.substack.com";
export const START_PATH = "/?start=1";

/**
 * What every way in says, in one place so every surface agrees.
 *
 * It names what the reader actually gets, which is the only thing that holds at
 * the moment of the click: they answer the brief's questions, they keep the
 * brief it produces, and we get in touch afterwards. "Start here" named the act
 * of clicking rather than the reward for it, and said nothing about either the
 * document or the cost.
 *
 * Ruling (Krish, 2026-09-24): the click should promise something really good,
 * really quickly, for free — the wizard, the capture, the output, then a free
 * consultation and audit.
 *
 * It carries no duration. The site states no public price or timescale, and the
 * number of minutes this takes is not measured anywhere, so it is not claimed.
 * The consultation is named as what follows rather than as what the button
 * books, because nothing in the flow books a session.
 */
export const START_LABEL = "Get your free AI brief";
export const START_SUBLABEL = "Answer a few questions, keep the brief, then a free consultation.";

/**
 * The address a visitor can actually reach a human on.
 *
 * It has to receive mail, which is the whole reason it is this one. `mindmake.co`
 * has no MX record, so `hello@mindmake.co` and `privacy@mindmake.co` bounce
 * today; `themindmaker.ai` runs Google Workspace and this mailbox is already the
 * Reply-To on every email the lead pipeline sends, so a visitor who has
 * converted has it in their inbox regardless.
 *
 * The privacy notice points here too, and a data-subject request that bounces is
 * worse than an address on the older domain, so correctness wins until the
 * branded aliases exist.
 *
 * To switch: create `hello@mindmake.co` and `privacy@mindmake.co`, add the MX
 * record, then change this one constant. Nothing else needs to move.
 */
export const CONTACT_EMAIL = "krish@themindmaker.ai";

/**
 * The site's primary routes, in the order and wording the approved R3 homepage
 * menu uses (quality/website-redesign/homepage-handoff.v1.json,
 * `sharedLanguage.selection`). R3's own menu is generated from its prototype,
 * so the shell menu and footer on every other page read this list instead of
 * keeping their own copy. A reader opening the menu from /blog sees exactly
 * what they see from /. src/test/primary-routes-parity.test.ts holds the two
 * together.
 */
export const PRIMARY_ROUTES: ReadonlyArray<{ label: string; href: string; external?: boolean }> = [
  { label: "Build your AI brain", href: "/ai-brain" },
  { label: "Build your AI GTM", href: "/ai-gtm" },
  { label: "Results", href: "/case-studies" },
  { label: "Thinking", href: "/blog" },
  { label: "Questions leaders ask", href: "/answers" },
  { label: "Before you start", href: "/faq" },
  { label: "Media", href: PUBLICATION_URL, external: true },
];
