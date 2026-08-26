import { Children, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface RouteRailProps {
  children: ReactNode;
  className: string;
  label: string;
}

export function RouteRail({ children, className, label }: RouteRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemCount = Children.count(children);

  const updateActiveItem = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;

    const left = track.scrollLeft;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    if (maxScroll > 0 && maxScroll - left <= 2) {
      setActiveIndex(track.children.length - 1);
      return;
    }
    const trackLeft = track.getBoundingClientRect().left;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    Array.from(track.children).forEach((item, index) => {
      const itemLeft = (item as HTMLElement).getBoundingClientRect().left - trackLeft + left;
      const distance = Math.abs(itemLeft - left);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveIndex(nearestIndex);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(updateActiveItem);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveItem);
    updateActiveItem();

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveItem);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [updateActiveItem]);

  const moveTo = (nextIndex: number) => {
    const track = trackRef.current;
    const item = track?.children.item(nextIndex) as HTMLElement | null;
    if (!track || !item) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetLeft = item.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({
      left: targetLeft,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    setActiveIndex(nextIndex);
  };

  return (
    <div className="mm-route-rail">
      <div
        ref={trackRef}
        className={`${className} mm-route-rail-track`}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      <div className="mm-route-rail-controls">
        <span className="mm-rail-count" aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(itemCount).padStart(2, "0")}</span>
        <div className="mm-rail-dots">
          {Array.from({ length: itemCount }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              className={dotIndex === activeIndex ? "is-active" : ""}
              onClick={() => moveTo(dotIndex)}
              aria-label={`Go to item ${dotIndex + 1} of ${itemCount} in ${label}`}
              aria-current={dotIndex === activeIndex || undefined}
            />
          ))}
        </div>
        <div>
          <button type="button" onClick={() => moveTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label={`Previous item in ${label}`}>
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => moveTo(activeIndex + 1)} disabled={activeIndex === itemCount - 1} aria-label={`Next item in ${label}`}>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
