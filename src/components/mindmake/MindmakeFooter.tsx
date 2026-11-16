import { forwardRef, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import PrismSilkFooter, { type PrismSilkColumn, type PrismSilkLink } from "@/components/ui/prism-silk-footer";
import { MindmakeBrand } from "@/components/mindmake/MindmakeBrand";
import { PRIMARY_ROUTES, START_LABEL, SUBSCRIBE_LABEL, SUBSCRIBE_URL } from "@/lib/publicLinks";
import { track } from "@/lib/analytics";

interface MindmakeFooterProps {
  /** Opens the brief in place. Without script the link follows /start. */
  onStart: () => void;
  /** What the way in says: START_LABEL, or START_LABEL_GTM on /ai-gtm. */
  startLabel?: string;
  /** The analytics source for the footer's links: "footer" in the shell, "homepage_footer" on /. */
  source?: string;
  id?: string;
  /** Extra classes: the homepage adds mm-footer-home for R3's masthead edge. */
  className?: string;
}

/**
 * The one footer, on every page (Krish, 2026-11-16: "make the footer way nicer
 * on desktop and minimalistic on mobile"). It is the Prism Silk footer from
 * src/components/ui/prism-silk-footer.tsx in Mindmake's own ground: deep ink
 * green silk, lit at its folds, under the same words the footer has carried
 * since R3: the brand, "Keep your edge as AI changes the market.", Subscribe,
 * the routes, Privacy and Terms, and the copyright with the registered
 * companies. The homepage renders it after its generated markup and every
 * other page through MindmakeShell, so the two can never drift (owner ruling,
 * 2026-09-26: "the bottom nav bar is super inconsistent across pages").
 *
 * On a desktop the routes stand in three columns of three. On a phone there
 * are no columns (owner ruling, 2026-09-25: the menu is a tap away), no
 * back-to-top button and a short band of silk: the brand, the statement,
 * Subscribe, the copyright and the legal pair. Nothing is new except the
 * three column names, which group the routes the rail already listed.
 */
export const MindmakeFooter = forwardRef<HTMLElement, MindmakeFooterProps>(function MindmakeFooter(
  { onStart, startLabel = START_LABEL, source = "footer", id, className = "" },
  ref,
) {
  const route = (href: string): PrismSilkLink => {
    const found = PRIMARY_ROUTES.find((item) => item.href === href);
    if (!found) throw new Error(`MindmakeFooter: no primary route for ${href}`);
    return found.external
      ? { label: found.label, href: found.href, external: true, onClick: () => track("substack_click", { source }) }
      : { label: found.label, href: found.href };
  };

  const start: PrismSilkLink = {
    label: startLabel,
    href: "/start",
    emphasis: true,
    onClick: (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      track("scoping_request", { source });
      onStart();
    },
  };

  /* Nine routes, the rail's own, in three even columns. */
  const columns: PrismSilkColumn[] = [
    { title: "Build", links: [route("/ai-brain"), route("/ai-gtm"), start] },
    { title: "Explore", links: [route("/case-studies"), route("/blog"), route("/faq")] },
    { title: "Mindmake", links: [route("/"), route("/about"), route(SUBSCRIBE_URL)] },
  ];

  /* Router links for the site's own pages, so a click is a client-side
     navigation; plain anchors for /start (it opens the brief, or follows the
     link without script) and for the publication. */
  const renderLink = (link: PrismSilkLink, anchor: { className: string; children: React.ReactNode }) => {
    if (link.external || !link.href || link.href === "/start") return null;
    return <Link className={anchor.className} to={link.href}>{anchor.children}</Link>;
  };

  return (
    <PrismSilkFooter
      ref={ref}
      id={id}
      className={`mm-footer ${className}`.trim()}
      brand={<MindmakeBrand compact />}
      tagline={<>Keep your edge as AI<br />changes the market.</>}
      brandAction={
        /* The footer's one quiet way to stay close. The brief stays the way
           in; this is for the reader not ready yet. */
        <a
          className="mm-subscribe-cta"
          href={SUBSCRIBE_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("substack_click", { source })}
        >
          {SUBSCRIBE_LABEL} <span aria-hidden="true">↗</span>
        </a>
      }
      columns={columns}
      navLabel="Footer navigation"
      socials={[]}
      credit={null}
      legal={[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }]}
      legalLabel="Legal navigation"
      renderLink={renderLink}
      /* The registered companies, named once beside the copyright (owner
         ruling, 2026-10-19). Each sentence holds together, so a narrow screen
         breaks between them and never inside one. */
      copyright={
        <small>© {new Date().getFullYear()} Mindmake.{" "}
          <span className="mm-entity-note"><span>Mindmake is a Mindmaker LLC company.</span> <span>Mindmaker Ltd in the UK.</span></span>
        </small>
      }
      phoneLinks={false}
      preset="nocturne"
      palette={{
        paperTop: "#06110d",
        paperLow: "#0a1b14",
        glow: "#12291f",
        ink: "#e6ede8",
        muted: "#aebcb3",
        line: "rgba(157, 240, 200, 0.16)",
        chip: "rgba(157, 240, 200, 0.05)",
        heart: "#7fe3b4",
        /* Ink greens, lifted only where light catches a fold. Mint is the
           answer and amber what moved, so neither is spent on decoration. */
        silk: ["#1f5a45", "#2f6f51", "#163d30", "#3e8e68", "#245242"],
        dark: true,
      }}
      seed={7}
      speed={0.7}
      grain={0.4}
      fontFamily='"Archivo Variable", "Archivo Fallback", "Archivo Fallback Arial", "Helvetica Neue", Arial, sans-serif'
      maxWidth="none"
      height="0px"
      stageMinHeight="clamp(180px, 16vw, 260px)"
      stagePhoneMinHeight="88px"
    />
  );
});
