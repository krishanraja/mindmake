import { useEffect, useMemo, useRef } from "react";
import { leadershipStories } from "@/components/leadership-chapters/leadershipChapters";
import { mountStoryFinder, storyFinderMarkup } from "@/components/leadership-chapters/storyFinder";
import { track } from "@/lib/analytics";
import "@/styles/new-age-leadership-r5.css";

/**
 * The one story library (proposal for Krish, 2026-11-04: "success stories"
 * and "what you can do with an AI brain" are the same thing for two
 * products). One card, one sheet, one finder; a product page shows only its
 * own stories, and /case-studies shows both behind the choice of product.
 */
export function StoryLibrary({ door, onStart, id = "stories", intro }: { door: "brain" | "gtm" | "library"; onStart: (door: "brain" | "gtm") => void; id?: string; intro?: { title: string; lede: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const startRef = useRef(onStart);
  startRef.current = onStart;
  const markup = useMemo(() => storyFinderMarkup(leadershipStories, { kicker: false, door, intro }), [door, intro?.title, intro?.lede]);
  useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return mountStoryFinder(ref.current, {
      reduced,
      onStart: (to) => {
        track("scoping_request", { source: "story_finder", route: to });
        startRef.current(to);
      },
    });
  }, [markup]);
  return <div ref={ref} id={id} className="nal-page brain-finder mm-story-library" dangerouslySetInnerHTML={{ __html: markup }} />;
}
