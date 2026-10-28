import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CookieConsent } from "../components/CookieConsent";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Scrolls past the point at which the notice is allowed to appear.
 *
 * The notice is held back until the visitor leaves the first screen, because as
 * a corner card it would otherwise land on top of the homepage's two doors.
 * Every test that expects to see it has to get there first.
 */
function leaveFirstScreen() {
  act(() => {
    window.scrollY = window.innerHeight;
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollY = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.scrollY = 0;
    document.documentElement.classList.remove("mm-cookie-visible");
    document.documentElement.style.removeProperty("--mm-cookie-reserve");
  });

  it("stays out of the way on the first screen", () => {
    render(<CookieConsent />);
    expect(screen.queryByText("Allow")).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("mm-cookie-visible");
  });

  it("shows banner once the visitor scrolls, when no consent stored", () => {
    render(<CookieConsent />);
    leaveFirstScreen();
    expect(screen.getByText("Allow")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("mm-cookie-visible");
  });

  it("shows banner immediately when the page is already scrolled", () => {
    window.scrollY = window.innerHeight * 2;
    render(<CookieConsent />);
    expect(screen.getByText("Allow")).toBeInTheDocument();
  });

  it("hides banner after allowing analytics", () => {
    render(<CookieConsent />);
    leaveFirstScreen();
    fireEvent.click(screen.getByText("Allow"));
    expect(screen.queryByText("Allow")).not.toBeInTheDocument();
    expect(localStorage.getItem("mindmake_consent")).toBe("analytics");
    expect(document.documentElement).not.toHaveClass("mm-cookie-visible");
    expect(document.documentElement.style.getPropertyValue("--mm-cookie-reserve")).toBe("");
  });

  it("loads Google Analytics only when the visitor allows it", () => {
    const load = vi.fn();
    window.mmLoadGoogleTag = load;
    render(<CookieConsent />);
    leaveFirstScreen();
    expect(load).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Allow"));
    expect(load).toHaveBeenCalledTimes(1);
    delete window.mmLoadGoogleTag;
  });

  it("declining stores the answer and never loads Google Analytics", () => {
    const load = vi.fn();
    window.mmLoadGoogleTag = load;
    render(<CookieConsent />);
    leaveFirstScreen();
    fireEvent.click(screen.getByText("Decline"));
    expect(load).not.toHaveBeenCalled();
    expect(localStorage.getItem("mindmake_consent")).toBe("essential");
    expect(screen.queryByText("Allow")).not.toBeInTheDocument();
    delete window.mmLoadGoogleTag;
  });

  it("drops a held growth tag on Decline and keeps it for Allow", () => {
    const tag = { campaign_source: "growth-podcast", campaign_medium: "referral" as const };
    window.mmVisitTag = tag;
    window.dataLayer = [["set", tag]];
    render(<CookieConsent />);
    leaveFirstScreen();
    fireEvent.click(screen.getByText("Decline"));
    expect(window.mmVisitTag).toBeNull();
    expect(window.dataLayer).toEqual([]);

    localStorage.clear();
    window.mmVisitTag = tag;
    window.dataLayer = [["set", tag]];
    window.mmLoadGoogleTag = vi.fn();
    render(<CookieConsent />);
    leaveFirstScreen();
    fireEvent.click(screen.getByText("Allow"));
    expect(window.mmVisitTag).toBe(tag);
    expect(window.dataLayer).toEqual([["set", tag]]);
    delete window.mmLoadGoogleTag;
    delete window.mmVisitTag;
    delete window.dataLayer;
  });

  it("the head loads Google's script only for a stored yes, never for the old answer", () => {
    const head = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
    const tag = head.slice(head.indexOf("<!-- Google tag"), head.indexOf("</script>", head.indexOf("<!-- Google tag")));
    expect(head.indexOf("<!-- Google tag")).toBe(head.indexOf("<head>") + "<head>\n    ".length);
    expect(tag).not.toMatch(/<script[^>]*\ssrc=/);
    expect(tag).toContain("gtag('consent', 'default', {analytics_storage: 'denied'");
    expect(tag).toContain("localStorage.getItem('mindmake_consent') === 'analytics'");
    expect(tag).not.toContain("'accepted'");
  });

  it("does not show banner when consent already stored", () => {
    localStorage.setItem("mindmake_consent", "accepted");
    render(<CookieConsent />);
    leaveFirstScreen();
    expect(screen.queryByText("Allow")).not.toBeInTheDocument();
  });

  it("still shows the notice when storage cannot be read", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    render(<CookieConsent />);
    leaveFirstScreen();
    expect(screen.getByText("Allow")).toBeInTheDocument();
  });

  it("still closes the notice when storage cannot be written", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    render(<CookieConsent />);
    leaveFirstScreen();
    fireEvent.click(screen.getByText("Allow"));
    expect(screen.queryByText("Allow")).not.toBeInTheDocument();
  });
});

/**
 * The strip's own type and place, which nothing here had ever measured.
 *
 * Photographed on an Android phone on 4 September 2026 it was floating 76px
 * above the bottom of the screen with the page showing underneath, its one
 * sentence over two lines and its button reading GOT / IT. Three causes, all
 * in the stylesheet, all reproducible at every phone width:
 *
 * - `bottom: 76px`, the action bar's height, whether or not the bar was there.
 * - `p { font-size: 16px }` in `src/index.css` reaching the one public surface
 *   rendered outside `.mm-site`. A bare element rule beats inheritance at any
 *   specificity, so a row designed at 10.5px rendered at 16px.
 * - `white-space: nowrap; text-wrap: initial` in one rule, where the second
 *   declaration is the first shorthand's own longhand reset to `wrap`.
 *
 * `npm run qa:chrome` measures the rendered result at eight screen sizes and
 * two text scales. These hold the rules that produce it.
 */
describe("the privacy strip's rules", () => {
  const css = readFileSync(resolve(__dirname, "../styles/mindmake.css"), "utf8");
  const instruments = readFileSync(resolve(__dirname, "../styles/mindmake-instruments.css"), "utf8");
  const block = (selector: string) => {
    const at = css.indexOf(selector);
    expect(at, selector).toBeGreaterThan(-1);
    return css.slice(at, css.indexOf("}", at));
  };

  it("declares its own type, because a bare element rule reaches it", () => {
    /* `font: inherit` in one declaration rather than three that can be
       half-undone, and `src/index.css` is why it has to be there at all. */
    expect(block(".mm-cookie-notice p {")).toContain("font: inherit");
    expect(readFileSync(resolve(__dirname, "../index.css"), "utf8")).toMatch(/^p \{/m);
  });

  it("never carries a declaration that cancels the one above it", () => {
    const paragraph = block(".mm-cookie-notice p {");
    expect(paragraph).not.toContain("text-wrap: initial");
    expect(paragraph.includes("white-space") && paragraph.includes("text-wrap")).toBe(false);
  });

  /** The one media block that makes the strip full width, and nothing after it. */
  const phoneStrip = (() => {
    const at = css.indexOf("@media (max-width: 767px)", css.indexOf(".mm-cookie-notice {"));
    return css.slice(at, css.indexOf("\n}\n", at));
  })();

  it("keeps the label on one line and lets the row wrap instead", () => {
    expect(block(".mm-cookie-notice button {")).toContain("white-space: nowrap");
    /* Only the full-width strip wraps. The corner card's width is
       `max-content`, and a wrapping flex container with that width stacks
       into a tower: 234px tall at 768px wide, measured. */
    expect(phoneStrip).toContain("flex-wrap: wrap");
    expect(block(".mm-cookie-notice {")).not.toContain("flex-wrap");
  });

  it("sits apart from the action bar and never stacks on it", () => {
    /* Ruling (2026-10-24): the bar stacked on the notice made the foot of
       /ai-brain four competing controls. On a phone the notice docks under
       the masthead, so the bottom edge is the bar's alone; on a laptop it is a
       card on the left, in the bar's band, while the button is on the right. */
    expect(phoneStrip).toContain("inset: calc(var(--mm-header-bar, 66px) + var(--mm-safe-top)) 0 auto 0");
    expect(phoneStrip).not.toContain("calc(76px");
    expect(block(".mm-cookie-notice {")).toContain("inset: auto auto calc(14px + var(--mm-safe-bottom)) var(--mm-gutter)");
    /* The bar's rules live in mindmake.css, beside --mm-bar-reserve and the
       .mm-footer rule that reads it, never in the instruments stylesheet that
       only /case-studies imports. It sits on the bottom edge itself and reads
       nothing of the notice's height. */
    const bar = block(".mm-action-bar {");
    expect(bar).toContain("bottom: 0;");
    expect(bar).not.toContain("--mm-cookie-reserve");
    expect(instruments).not.toContain(".mm-action-bar");
    expect(instruments).not.toContain("calc(var(--mm-section) + 76px");
  });

  it("reserves the taller of the two heights at the foot of the page", () => {
    /* They share one band on a laptop and the notice leaves the bottom on a
       phone, so the footer clears the taller, never their sum, and one rule
       sets it so the two can never replace each other. */
    expect(block(".mm-footer {")).toContain("max(var(--mm-cookie-reserve, 0px), var(--mm-bar-reserve, 0px))");
    expect(css).not.toContain(".mm-cookie-visible .mm-footer");
    expect(instruments).not.toContain(".mm-bar-visible .mm-footer");
  });

  it("refuses the browser's guess at what needs enlarging, and keeps the visitor's own", () => {
    expect(block("html {")).toContain("text-size-adjust: 100%");
    expect(css).not.toContain("text-size-adjust: none");
  });
});
