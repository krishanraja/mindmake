import { ReactNode, useEffect, useRef, useState } from "react";
import { MindmakeBrand } from "@/components/mindmake/MindmakeBrand";
import { SiteActionBar, type ActionBarDoor } from "@/components/mindmake/SiteActionBar";
import { Link, useLocation } from "react-router-dom";
import { PUBLICATION_URL, START_LABEL } from "@/lib/publicLinks";
import { track } from "@/lib/analytics";

interface MindmakeShellProps {
  children: ReactNode;
  onStart: () => void;
  mainClassName?: string;
  siteClassName?: string;
  showMobileActionBar?: boolean;
  compactFooter?: boolean;
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
  compactFooter = false,
}: MindmakeShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const actionBarDoor = ACTION_BAR_DOORS[location.pathname];

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

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

  return (
    <div className={`mm-site ${siteClassName}`.trim()}>
      <a className="mm-skip" href="#main">Skip to content</a>
      <header className={`mm-header${scrolled ? " is-scrolled" : ""}`}>
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
            {menuOpen ? "Close" : "Menu"}
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
        <nav aria-label="Main navigation">
          <Link to="/ai-brain">Build your AI brain</Link>
          <Link to="/ai-gtm">Build your AI GTM</Link>
          <Link to="/case-studies">Results</Link>
          <Link to="/blog">Ideas</Link>
          <Link to="/new-age-leadership">New-age leadership</Link>
          <a
            href={PUBLICATION_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("substack_click", { source: "menu" })}
          >
            Media
          </a>
          <button type="button" onClick={startFromMenu}>{START_LABEL}</button>
        </nav>
      </div>

      <main id="main" ref={mainRef} className={mainClassName} tabIndex={-1}>{children}</main>

      <footer className={`mm-footer${compactFooter ? " is-compact" : ""}`} ref={footerRef}>
        <div className="mm-container mm-footer-grid">
          <MindmakeBrand compact />
          {!compactFooter && <p>We help leaders keep their edge as AI changes their market, and you keep what it learns.</p>}
          <nav aria-label="Footer navigation">
            {!compactFooter && (
              <>
                <Link to="/ai-brain">Build your AI brain</Link>
                <Link to="/ai-gtm">Build your AI GTM</Link>
                <Link to="/case-studies">Results</Link>
                <a href={PUBLICATION_URL} target="_blank" rel="noreferrer">Media</a>
                <Link to="/blog">Ideas</Link>
                {/* Two surfaces, two labels. `/faq` is the curated corpus the ask
                    bar answers from, and its own heading is "Straight answers";
                    `/answers` is a page per buyer question. One label reading
                    "Answers" for both is what would confuse a reader. */}
                <Link to="/answers">Answers</Link>
                <Link to="/faq">Straight answers</Link>
              </>
            )}
            {compactFooter && <a href={PUBLICATION_URL} target="_blank" rel="noreferrer">Media</a>}
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>
          <small>Copyright {new Date().getFullYear()} Mindmake. Built in public, used in private.</small>
        </div>
      </footer>

      {/* The one way in, pinned to the bottom of the screen once the reader
          has left the first screen, and standing down whenever the page's own
          primary action is on screen. */}
      {showMobileActionBar && <SiteActionBar onStart={onStart} door={actionBarDoor} label={START_LABEL} />}
    </div>
  );
}
