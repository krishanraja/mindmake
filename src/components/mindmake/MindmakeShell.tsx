import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MINDMAKER_LIVE_URL } from "@/lib/publicLinks";
import { track } from "@/lib/analytics";

export const MEDIA_URL = MINDMAKER_LIVE_URL;

interface MindmakeShellProps {
  children: ReactNode;
  onStart: () => void;
  mainClassName?: string;
}

export function MindmakeShell({ children, onStart, mainClassName = "" }: MindmakeShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const location = useLocation();

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
    const focusTimer = window.setTimeout(() => firstControl?.focus(), 20);

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
      window.clearTimeout(focusTimer);
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
    <div className="mm-site">
      <a className="mm-skip" href="#main">Skip to content</a>
      <header className={`mm-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="mm-container mm-nav">
          <Link className="mm-brand" to="/">MIND<span>/</span>MAKE</Link>
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
          <a
            href={MINDMAKER_LIVE_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("substack_click", { source: "menu" })}
          >
            The weekly read
          </a>
          <button type="button" onClick={startFromMenu}>Start here</button>
        </nav>
      </div>

      <main id="main" ref={mainRef} className={mainClassName} tabIndex={-1}>{children}</main>

      <footer className="mm-footer" ref={footerRef}>
        <div className="mm-container mm-footer-grid">
          <Link className="mm-brand" to="/">MIND<span>/</span>MAKE</Link>
          <p>Systems that hold your judgement, and belong to you when we leave.</p>
          <nav aria-label="Footer navigation">
            <Link to="/ai-brain">Build your AI brain</Link>
            <Link to="/ai-gtm">Build your AI GTM</Link>
            <Link to="/case-studies">Results</Link>
            <a href={MINDMAKER_LIVE_URL} target="_blank" rel="noreferrer">The weekly read</a>
            <Link to="/blog">Ideas</Link>
            <Link to="/faq">Answers</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>
          <small>Copyright {new Date().getFullYear()} Mindmake. Built in public, used in private.</small>
        </div>
      </footer>
    </div>
  );
}
