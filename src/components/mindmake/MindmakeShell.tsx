import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MindmakeBrand } from "@/components/mindmake/MindmakeBrand";

export const MEDIA_URL = "https://mindmakerlive.substack.com";

interface MindmakeShellProps {
  children: ReactNode;
  onStart: () => void;
  darkHeader?: boolean;
  headerMode?: "overlay" | "paper";
  showStartAction?: boolean;
  helpHash?: string;
  mainClassName?: string;
}

export function MindmakeShell({
  children,
  onStart,
  darkHeader = true,
  headerMode = "overlay",
  showStartAction = true,
  helpHash = "#work",
  mainClassName = "",
}: MindmakeShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
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
    const mobileNav = mobileNavRef.current as (HTMLElement & { inert: boolean }) | null;
    if (main) main.inert = menuOpen;
    if (footer) footer.inert = menuOpen;
    if (mobileNav) mobileNav.inert = !menuOpen;
    document.body.classList.toggle("mm-menu-open", menuOpen);

    if (!menuOpen) return () => {
      document.body.classList.remove("mm-menu-open");
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      if (mobileNav) mobileNav.inert = true;
    };

    const firstLink = mobileNavRef.current?.querySelector<HTMLElement>("a, button");
    const focusTimer = window.setTimeout(() => firstLink?.focus(), 20);
    const handleMenuKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus(), 20);
        return;
      }

      if (event.key !== "Tab") return;

      const navControls = Array.from(
        mobileNavRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );
      const focusableControls = [menuButtonRef.current, ...navControls].filter(
        (control): control is HTMLElement => control !== null,
      );
      const firstControl = focusableControls[0];
      const lastControl = focusableControls.at(-1);

      if (event.shiftKey && document.activeElement === firstControl) {
        event.preventDefault();
        lastControl?.focus();
      } else if (!event.shiftKey && document.activeElement === lastControl) {
        event.preventDefault();
        firstControl?.focus();
      }
    };
    const closeAtDesktop = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    document.addEventListener("keydown", handleMenuKeyDown);
    window.addEventListener("resize", closeAtDesktop);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleMenuKeyDown);
      window.removeEventListener("resize", closeAtDesktop);
      document.body.classList.remove("mm-menu-open");
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      if (mobileNav) mobileNav.inert = true;
    };
  }, [menuOpen]);

  const homeHref = (hash: string) => (location.pathname === "/" ? hash : `/${hash}`);
  const paperHeader = headerMode === "paper";
  const headerLight = !paperHeader && !scrolled && darkHeader;
  const openBriefFromMobileMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
    onStart();
  };

  return (
    <div className="mm-site">
      <a className="mm-skip" href="#main">Skip to content</a>
      <header className={`mm-header${scrolled ? " is-scrolled" : ""}${headerLight ? " is-light" : ""}${paperHeader ? " is-paper" : ""}`}>
        <div className="mm-container mm-nav">
          <MindmakeBrand light={headerLight} />
          <nav className="mm-nav-links" aria-label="Main navigation">
            <a href={homeHref(helpHash)}>How I help</a>
            <Link to="/case-studies">Results</Link>
            <a href={MEDIA_URL} target="_blank" rel="noreferrer">Media</a>
            {showStartAction && (
              <button className="mm-button mm-button-small" type="button" onClick={onStart}>
                Start here <span aria-hidden="true">→</span>
              </button>
            )}
          </nav>
          <button
            ref={menuButtonRef}
            className="mm-menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mindmake-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      <nav
        ref={mobileNavRef}
        className={`mm-mobile-nav${menuOpen ? " is-open" : ""}`}
        id="mindmake-mobile-menu"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <a href={homeHref(helpHash)} onClick={() => setMenuOpen(false)}>How I help</a>
        <Link to="/case-studies" onClick={() => setMenuOpen(false)}>Results</Link>
        <a href={MEDIA_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Media</a>
        {showStartAction && (
          <button className="mm-button" type="button" onClick={openBriefFromMobileMenu}>Start here</button>
        )}
      </nav>
      <main id="main" ref={mainRef} className={mainClassName} tabIndex={-1}>{children}</main>
      <footer className="mm-footer" ref={footerRef}>
        <div className="mm-container mm-footer-grid">
          <MindmakeBrand />
          <p>Put your best judgement to work with AI.</p>
          <nav aria-label="Footer navigation">
            <Link to="/ai-brain">Build Your AI Brain</Link>
            <Link to="/ai-gtm">Build Your AI GTM</Link>
            <Link to="/case-studies">Results</Link>
            <Link to="/#about">About</Link>
            <a href={MEDIA_URL} target="_blank" rel="noreferrer">Media</a>
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
