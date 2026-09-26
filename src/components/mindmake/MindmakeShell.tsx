import { type MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { MindmakeBrand } from "@/components/mindmake/MindmakeBrand";
import { SiteActionBar, type ActionBarDoor } from "@/components/mindmake/SiteActionBar";
import { Link, useLocation } from "react-router-dom";
import { PRIMARY_ROUTES, START_LABEL, SUBSCRIBE_LABEL, SUBSCRIBE_URL } from "@/lib/publicLinks";
import { track } from "@/lib/analytics";

interface MindmakeShellProps {
  children: ReactNode;
  onStart: () => void;
  mainClassName?: string;
  siteClassName?: string;
  showMobileActionBar?: boolean;
}

/**
 * The door the action bar offers: the offer route the reader is not already on.
 *
 * Two entries and no default. On an editorial page neither route is more
 * relevant than the other, and offering both would put three controls in a bar
 * that is allowed two. The bar is where a reader acts, not where they browse;
 * the menu and the footer carry the whole site.
 */
const ACTION_BAR_DOORS: Record<string, ActionBarDoor> = {
  "/ai-brain": { to: "/ai-gtm", label: "Build your AI GTM" },
  "/ai-gtm": { to: "/ai-brain", label: "Build your AI brain" },
};

export function MindmakeShell({
  children,
  onStart,
  mainClassName = "",
  siteClassName = "",
  showMobileActionBar = true,
}: MindmakeShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  /* Keyed on the route without its trailing slash, because both spellings
     reach the same page and the door has to be the same on each.

     The first version of this read location.pathname directly, and the release
     smoke caught it on every engine: the prerendered document for /ai-brain is
     rendered from "/ai-brain", the reader arrives at "/ai-brain/", the lookup
     missed, and React hydrated a bar with no door onto markup that had one.
     That is React error #418 and it takes the whole route down to client
     rendering, losing the server heading with it. Vercel resolves either
     spelling, so this was a real visitor's page, not only a gate's. */
  const actionBarDoor = ACTION_BAR_DOORS[location.pathname.replace(/\/+$/, "") || "/"];

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash, location.search]);

  useEffect(() => {
    const main = mainRef.current as (HTMLElement & { inert: boolean }) | null;
    const footer = footerRef.current as (HTMLElement & { inert: boolean }) | null;
    const menu = menuRef.current as (HTMLDivElement & { inert: boolean }) | null;
    if (main) main.inert = menuOpen;
    if (footer) footer.inert = menuOpen;
    if (menu) menu.inert = !menuOpen;
    document.body.classList.toggle("mm-menu-open", menuOpen);

    const release = () => {
      document.body.classList.remove("mm-menu-open");
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      if (menu) menu.inert = true;
    };

    if (!menuOpen) return release;

    const firstControl = menuRef.current?.querySelector<HTMLElement>("a, button");
    // The menu has already rendered and had `inert` removed when this effect
    // runs. Focus immediately, on the next frame, and once after the visibility
    // transition has settled. WebKit and Firefox can reject both earlier focus
    // calls when reduced motion collapses that transition to a single tick.
    firstControl?.focus({ preventScroll: true });
    const focusFrame = window.requestAnimationFrame(() => firstControl?.focus({ preventScroll: true }));
    let focusAttempts = 0;
    const focusTimer = window.setInterval(() => {
      const active = document.activeElement;
      if (active === document.body || active === menuButtonRef.current) {
        firstControl?.focus({ preventScroll: true });
      }
      focusAttempts += 1;
      if (document.activeElement?.closest("#mindmake-menu") || focusAttempts >= 12) {
        window.clearInterval(focusTimer);
      }
    }, 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus(), 20);
        return;
      }
      if (event.key !== "Tab") return;

      const controls = [
        menuButtonRef.current,
        ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []),
      ].filter((control): control is HTMLElement => control !== null);
      const first = controls[0];
      const last = controls.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.clearInterval(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      release();
    };
  }, [menuOpen]);

  const startFromMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
    track("scoping_request", { source: "menu" });
    onStart();
  };

  const startFromFooter = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    track("scoping_request", { source: "footer" });
    onStart();
  };

  return (
    <div className={`mm-site ${siteClassName}`.trim()}>
      <a className="mm-skip" href="#main">Skip to content</a>
      <header className="mm-header">
        <div className="mm-container mm-nav">
          <MindmakeBrand />
          <button
            ref={menuButtonRef}
            className="mm-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mindmake-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <b>{menuOpen ? "Close" : "Menu"}</b>
            <span className="mm-burger" aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        className={`mm-menu${menuOpen ? " is-open" : ""}`}
        id="mindmake-menu"
        aria-hidden={!menuOpen}
      >
        {/* The same menu the homepage opens: the R3 routes, then the one way
            in, then the legal pair. The start action stays a button because
            off the homepage it opens the brief dialog in place. */}
        <nav className="mm-menu-routes" aria-label="Main navigation">
          {PRIMARY_ROUTES.map(({ label, href, external, badge }) => external ? (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={badge ? "mm-route-badged" : undefined}
              data-badge={badge}
              onClick={() => track("substack_click", { source: "menu" })}
            >
              {label}
            </a>
          ) : (
            <Link key={href} to={href}>{label}</Link>
          ))}
        </nav>
        <button className="mm-menu-start" type="button" onClick={startFromMenu}>
          {START_LABEL} <span aria-hidden="true">→</span>
        </button>
        <nav className="mm-menu-secondary" aria-label="Additional navigation">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>

      <main id="main" ref={mainRef} className={mainClassName} tabIndex={-1}>{children}</main>

      {/* The homepage's footer, on every page (owner ruling, 2026-09-26: "The bottom
          nav bar is super inconsistent across pages"). The same words in the
          same order as R3's: the brand, the statement, Subscribe, the route
          rail, the legal pair, the copyright. The rail is not shown on a phone
          (owner ruling, 2026-09-25: the menu is a tap away). Contact is not in it,
          as it is not on the homepage: the address is on /about, /privacy and
          /terms, and the brief is the way in. */}
      <footer className="mm-footer" ref={footerRef}>
        <div className="mm-footer-grid">
          <div className="mm-footer-brand">
            <MindmakeBrand compact />
            <p className="mm-footer-statement">Keep your edge as AI<br />changes the market.</p>
            {/* The footer's one quiet way to stay close. The brief stays the
                way in; this is for the reader not ready yet. */}
            <a
              className="mm-subscribe-cta"
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("substack_click", { source: "footer" })}
            >
              {SUBSCRIBE_LABEL} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <nav className="mm-footer-routes" aria-label="Footer navigation">
            {PRIMARY_ROUTES.map(({ label, href, external }) => external
              ? <a key={href} href={href} target="_blank" rel="noreferrer" onClick={() => track("substack_click", { source: "footer" })}>{label}</a>
              : <Link key={href} to={href}>{label}</Link>)}
            {/* R3 links /start. Here it opens the brief in place, as the
                menu's start action does; without script it follows the link. */}
            <a href="/start" onClick={startFromFooter}>{START_LABEL}</a>
          </nav>
          <nav className="mm-footer-legal" aria-label="Legal navigation">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>
          <small>© {new Date().getFullYear()} Mindmake.</small>
        </div>
      </footer>

      {/* The one way in, pinned to the bottom of the screen once the reader
          has left the first screen, and standing down whenever the page's own
          primary action is on screen. */}
      {showMobileActionBar && <SiteActionBar onStart={onStart} door={actionBarDoor} label={START_LABEL} />}
    </div>
  );
}
