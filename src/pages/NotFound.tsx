import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import "@/styles/mindmake.css";

/**
 * The 404 wears the site's own chrome.
 *
 * It used to be a standalone centred card with a text-only wordmark floating
 * above it, which made it the one page where the mark was neither in a top bar
 * nor on the page's left edge, and the one page a lost visitor could not
 * navigate out of except through two links. The shell gives it the real
 * wordmark, the real menu and the real footer, so the page a visitor is most
 * likely to hit by accident is the one that offers them the most ways on.
 */
const NotFound = () => {
  const location = useLocation();
  const [briefOpen, setBriefOpen] = useState(false);

  if (process.env.NODE_ENV === "development") {
    console.warn("404 Error: Route not found:", location.pathname);
  }

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title="Page not found"
        description="This Mindmake page could not be found."
        canonical={location.pathname}
        noindex
      />
      <section className="mm-not-found" aria-labelledby="not-found-title">
        <div className="mm-container">
          <p className="mm-error-code">404</p>
          <h1 id="not-found-title">There is nothing here.</h1>
          <p>The page may have moved. Start again, or read one of the useful ideas.</p>
          <div className="mm-not-found-actions">
            <Link className="mm-button" to="/">Go to the home page <ArrowRight aria-hidden="true" /></Link>
            <Link className="mm-text-link" to="/blog">See all ideas</Link>
          </div>
        </div>
      </section>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
};

export default NotFound;
