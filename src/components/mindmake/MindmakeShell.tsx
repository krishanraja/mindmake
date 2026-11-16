import { ReactNode, useEffect, useRef, useState } from "react";
import { MindmakeBrand } from "@/components/mindmake/MindmakeBrand";
import { SiteActionBar } from "@/components/mindmake/SiteActionBar";
import { MindmakeFooter } from "@/components/mindmake/MindmakeFooter";
import { Link, NavLink, useLocation } from "react-router-dom";
import { PRIMARY_ROUTES, START_LABEL, SUBSCRIBE_URL } from "@/lib/publicLinks";
import { track } from "@/lib/analytics";

interface MindmakeShellProps {
  children: ReactNode;
  onStart: () => void;
  mainClassName?: string;
  siteClassName?: string;
  showMobileActionBar?: boolean;
  /** What every way in on the page says. /ai-gtm passes START_LABEL_GTM; a prop
      rather than a pathname lookup, so the server and client render agree. */
  startLabel?: string;
}

export function MindmakeShell({
  children,
  onStart,
  mainClassName = "",
  siteClassName = "",
  showMobileActionBar = true,
  startLabel = START_LABEL,
}: MindmakeShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const location = useLocation();

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
      <header className="mm-header">
        <div className="mm-container mm-nav">
          <MindmakeBrand />
          {/* Subscribe beside the menu (the owner, 2026-10-24), as the homepage's
              masthead has it. */}
          <a
            className="mm-nav-subscribe"
            href={SUBSCRIBE_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("substack_click", { source: "masthead" })}
          >
            Subscribe
          </a>
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
          {PRIMARY_ROUTES.map(({ label, href, external, badge, short }) => external ? (
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
            /* The page the reader is on is marked (aria-current), in the
               approved menu's own rule style (audit CRIT-07). */
            <NavLink key={href} to={href} end={href === "/"}>{short && label.startsWith(short) ? <span>{short}<span className="mm-route-tail">{label.slice(short.length)}</span></span> : label}</NavLink>
          ))}
        </nav>
        <button className="mm-menu-start" type="button" onClick={startFromMenu}>
          {startLabel} <span aria-hidden="true">→</span>
        </button>
        <nav className="mm-menu-secondary" aria-label="Additional navigation">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>

      <main id="main" ref={mainRef} className={mainClassName} tabIndex={-1}>{children}</main>

      {/* The one footer, on every page, the homepage's included (owner rulings,
          2026-09-26: "The bottom nav bar is super inconsistent across pages";
          2026-11-16: "make the footer way nicer on desktop and minimalistic on
          mobile"). Its words and its phone rules live in MindmakeFooter. */}
      <MindmakeFooter ref={footerRef} onStart={onStart} startLabel={startLabel} />

      {/* The one way in, pinned to the bottom of the screen once the reader
          has left the first screen, and standing down whenever the page's own
          primary action is on screen. */}
      {showMobileActionBar && <SiteActionBar onStart={onStart} label={startLabel} />}
    </div>
  );
}
