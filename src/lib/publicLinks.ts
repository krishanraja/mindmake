/**
 * The two outbound links the site uses in more than one place.
 *
 * PUBLICATION_URL is Mindmake's publication, and every "Media" link lands on
 * it: makeyourmindup.ai (Krish, 2026-09-26). The publication runs exactly two
 * channels, The Money of AI and Built with AI. Nothing on the site or in
 * generated copy calls it anything else.
 */
export const PUBLICATION_URL = "https://makeyourmindup.ai";

/**
 * Where every "Subscribe for free" lands: the publication's own site,
 * makeyourmindup.ai, the same place as Media (Krish, 2026-09-26: "Every single
 * subscribe link should go to makeyourmindup.ai").
 *
 * Subscribing is the site's low-commitment way to stay close. It never
 * competes with START_LABEL, which is the way in for a reader who is ready.
 */
export const SUBSCRIBE_URL = PUBLICATION_URL;
export const SUBSCRIBE_LABEL = "Subscribe for free";
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
 * It has to receive mail, which is the whole reason it is this one.
 * `krish@mindmake.co` is the published contact address (Krish, 2026-10-03) and
 * now receives. `krish@themindmaker.ai` still redirects to it, so a visitor who
 * converted earlier and kept the old address still reaches the same inbox.
 *
 * The privacy notice and every contact link read this one constant, so the
 * address stays one line in one file.
 */
export const CONTACT_EMAIL = "krish@mindmake.co";

/**
 * The site's primary routes, in the order and wording the approved R3 homepage
 * menu uses (quality/website-redesign/homepage-handoff.v1.json,
 * `sharedLanguage.selection`). R3's own menu is generated from its prototype,
 * so the shell menu and footer on every other page read this list instead of
 * keeping their own copy. A reader opening the menu from /blog sees exactly
 * what they see from /. src/test/primary-routes-parity.test.ts holds the two
 * together.
 */
export const PRIMARY_ROUTES: ReadonlyArray<{ label: string; href: string; external?: boolean; badge?: string }> = [
  { label: "Home", href: "/" },
  { label: "Build your AI brain", href: "/ai-brain" },
  { label: "Build your AI GTM", href: "/ai-gtm" },
  /* Plainer labels that say what the reader gets (Krish, 2026-09-25). Each
     page's own title matches its label, so the click lands where it said. */
  { label: "Success stories", href: "/case-studies" },
  /* Quick AI tips (/answers) merged into this page on 2026-09-25 (Krish);
     /answers now sends the reader here. */
  { label: "Ideas you can use", href: "/blog" },
  { label: "Questions we get asked", href: "/faq" },
  { label: "About us", href: "/about" },
  /* The label stays the approved "Media"; the badge beside it says what the
     click gets you (Krish, 2026-09-25). */
  { label: "Media", href: PUBLICATION_URL, external: true, badge: SUBSCRIBE_LABEL },
];
