import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { BriefRoute } from "@/components/mindmake/leadDelivery";

const START_PARAM = "start";

/**
 * Which door the visitor came through, in the address.
 *
 * `?start=1` is the original and still means "opened without a door", which the
 * dialog answers by asking. `?start=brain` and `?start=gtm` are the two named
 * doors, and they exist here rather than in component state for the reason the
 * open flag does: this address is what the site's primary action produces, so
 * it has to survive a shared link, a reload and the back button.
 */
const ROUTES: Record<string, BriefRoute> = { "1": "home", brain: "brain", gtm: "gtm" };
const PARAM_FOR: Record<BriefRoute, string> = { home: "1", brain: "brain", gtm: "gtm" };

export function useLeadBriefHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const openedBriefHere = useRef(false);
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  /* Closed on the first render, always, then opened if the address asks for it.
     The pages are rendered to HTML at build time from a path with no query
     string, so a visitor arriving at `?start=1` had the server saying the
     dialog is shut and the client's first render saying it is open. React
     compares those and threw the whole page away: production failed hydration
     with error #418 on that address, on every shared start link and on every
     back-button return into the dialog, which is the one route the site's
     primary action produces. It is the same shape as `use-mobile`, and the same
     fix: match the server, then correct after mount. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const asked = searchParams.get(START_PARAM) ?? "";
  const briefOpen = mounted && asked in ROUTES;
  const briefRoute: BriefRoute = ROUTES[asked] ?? "home";

  useEffect(() => {
    if (!briefOpen) openedBriefHere.current = false;
  }, [briefOpen]);

  const setBriefOpen = useCallback((open: boolean, route: BriefRoute = "home") => {
    if (open === briefOpen) return;

    const next = new URLSearchParams(location.search);
    if (open) {
      openedBriefHere.current = true;
      next.set(START_PARAM, PARAM_FOR[route]);
      navigate({
        pathname: location.pathname,
        search: next.toString() ? `?${next.toString()}` : "",
        hash: location.hash,
      });
      return;
    }

    if (openedBriefHere.current) {
      openedBriefHere.current = false;
      navigate(-1);
      return;
    }

    next.delete(START_PARAM);
    navigate({
      pathname: location.pathname,
      search: next.toString() ? `?${next.toString()}` : "",
      hash: location.hash,
    }, { replace: true });
  }, [briefOpen, location.hash, location.pathname, location.search, navigate]);

  return {
    briefOpen,
    /** Which door, so the dialog offers that door's own four pressures. */
    briefRoute,
    openBrief: useCallback((route: BriefRoute = "home") => setBriefOpen(true, route), [setBriefOpen]),
    closeBrief: useCallback(() => setBriefOpen(false), [setBriefOpen]),
  };
}

export default useLeadBriefHistory;
