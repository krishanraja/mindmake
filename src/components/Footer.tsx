import { ExternalLink } from "lucide-react";
import { SubstackSubscribeForm } from "@/components/SubstackSubscribeForm";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-border/50 pt-16 sm:pt-20 pb-24 sm:pb-32 z-20">
      <div className="container-width">
        <div className="flex flex-col gap-16">
          {/* Newsletter strip */}
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-center pb-12 border-b border-border/50">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="text-base font-bold tracking-tight text-foreground">MINDMAKER</span>
                <span className="h-1 w-1 rounded-full bg-mint" aria-hidden="true" />
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-mint to-emerald-400 text-ink text-[10px] font-extrabold tracking-[0.18em]">
                  LIVE
                </span>
              </div>
              <p className="text-base font-semibold text-foreground mb-1">
                Weekly signal in your inbox.
              </p>
              <p className="text-sm text-muted-foreground">
                Headlines, resources, perspectives. No pitch decks. Unsubscribe anytime.
              </p>
            </div>
            <SubstackSubscribeForm tone="light" size="compact" source="footer" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20">
            {/* Copyright Section */}
            <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                &copy; 2026 Mindmaker LLC. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Turning AI chaos into calm, clear, executable direction.
              </p>
            </div>

            {/* Work with me */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Work with me
              </h4>
              <nav className="flex flex-col gap-3">
                <a
                  href="/cohort"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  The AI Decision Cohort
                </a>
                <a
                  href="/enterprise#signal-session"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  The Signal Session
                </a>
                <a
                  href="/enterprise#revenue-architecture"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  The Revenue Architecture
                </a>
                <a
                  href="/immersion"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  The AI Immersion
                </a>
              </nav>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Resources
              </h4>
              <nav className="flex flex-col gap-3">
                <a
                  href="/#mindmaker-live"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4 inline-flex items-center gap-1.5"
                >
                  MindMaker Live (Newsletter)
                  <span className="inline-flex items-center px-1 py-0.5 rounded-full bg-gradient-to-r from-mint to-emerald-400 text-ink text-[8px] font-extrabold tracking-[0.14em] leading-none">
                    LIVE
                  </span>
                </a>
                <a
                  href="/signal"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Live Intel
                </a>
                <a
                  href="/operator"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  How I operate
                </a>
                <a
                  href="https://www.thebuildereconomy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  The Builder Economy (Podcast)
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="/new-age-leadership"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  New Age Leadership
                </a>
                <a
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Blog
                </a>
                <a
                  href="https://live.themindmaker.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  Live Learnings
                  <ExternalLink className="h-3 w-3" />
                </a>
              </nav>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Company
              </h4>
              <nav className="flex flex-col gap-3">
                <a
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  FAQ
                </a>
                <a
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Contact
                </a>
                <a
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Terms
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
