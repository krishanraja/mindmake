import { readFileSync } from "node:fs";

/**
 * One captured board response, for every gate that loads a page carrying it.
 *
 * `useBoardData` fetches `get-ai-news` from Supabase, which a QA session cannot
 * reach, so without a stub `/ai-gtm` and the homepage both render "The read is
 * rebuilding" and a gate measures an empty frame. Three gates stubbed it and
 * only one of them worked: `aliveness-check` served this fixture, while
 * `screen-matrix-check` and `dead-css-check` served `{"items":[]}`, which
 * matches neither of the function's two response shapes. The client treats an
 * unrecognised payload as a failed read, so both of those gates were measuring
 * the collapsed board under a comment claiming they measured the real one.
 *
 * The fixture was also the wrong shape until 2 September 2026. It held the
 * legacy `headlines[]` list, which carries no category, no age and no point of
 * view, so every card rendered without its tag, its timestamp and its mint
 * line, and every lane count read zero. **No gate had ever seen a production
 * card.** It is the board view now, captured from the live function.
 */
export const BOARD_FIXTURE = JSON.parse(
  readFileSync(new URL("../fixtures/get-ai-news.json", import.meta.url), "utf8"),
);

/** Serve it on any page this gate opens. */
export const serveBoard = (page) =>
  page.route("**/get-ai-news**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: { "access-control-allow-origin": "*" },
    body: JSON.stringify(BOARD_FIXTURE),
  }));
