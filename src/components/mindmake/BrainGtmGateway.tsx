import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "@/styles/mindmake-gateway.css";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - (2 * value));

export function BrainGtmGateway() {
  const runwayRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateGateway = () => {
      frame = 0;

      if (reduceMotion.matches) {
        runway.style.setProperty("--mm-gateway-door-open", "0px");
        runway.style.setProperty("--mm-gateway-door-open-mobile", "0px");
        runway.style.setProperty("--mm-gateway-seam-opacity", ".48");
        return;
      }

      const stage = runway.firstElementChild as HTMLElement | null;
      const stickyTop = stage ? Number.parseFloat(getComputedStyle(stage).top) || 0 : 0;
      const rect = runway.getBoundingClientRect();
      const visibleHeight = Math.max(1, window.innerHeight - stickyTop);
      const travel = Math.max(1, runway.offsetHeight - visibleHeight);
      const raw = clamp((stickyTop - rect.top) / Math.max(1, travel * .58));
      const progress = smooth(raw);
      const desktopDistance = Math.min(28, window.innerWidth * .02) * progress;
      const mobileDistance = Math.min(16, window.innerHeight * .022) * progress;

      runway.style.setProperty("--mm-gateway-door-open", `${desktopDistance.toFixed(2)}px`);
      runway.style.setProperty("--mm-gateway-door-open-mobile", `${mobileDistance.toFixed(2)}px`);
      runway.style.setProperty("--mm-gateway-seam-opacity", String((.32 + progress * .5).toFixed(3)));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateGateway);
    };

    updateGateway();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    reduceMotion.addEventListener?.("change", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reduceMotion.removeEventListener?.("change", requestUpdate);
    };
  }, []);

  return (
    <section className="mm-gateway-runway" id="paths" ref={runwayRef} aria-labelledby="gateway-title">
      <div className="mm-gateway-stage">
        <div className="mm-gateway-inner">
          <p className="mm-gateway-start-label">Pick your starting point</p>

          <h2 className="mm-gateway-title" id="gateway-title">
            <span>Encode Your Vision</span>{" "}
            <span className="is-accent">Define How You Sell</span>
          </h2>

          <nav className="mm-gateway-doors" aria-label="Ways to begin with Mindmake">
            <Link className="mm-gateway-door" to="/ai-brain" data-door-number="01">
              <span className="mm-gateway-door-copy">
                <h3>Build Your AI Brain</h3>
                <p>Decide faster. Lead with confidence.</p>
              </span>
              <span className="mm-gateway-door-arrow" aria-hidden="true">→</span>
            </Link>

            <Link className="mm-gateway-door" to="/ai-gtm" data-door-number="02">
              <span className="mm-gateway-door-copy">
                <h3>Build Your AI GTM</h3>
                <p>Product, price, message or team.</p>
              </span>
              <span className="mm-gateway-door-arrow" aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
