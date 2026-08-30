import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const START_PARAM = "start";
const START_VALUE = "1";

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
  const briefOpen = mounted && searchParams.get(START_PARAM) === START_VALUE;

  useEffect(() => {
    if (!briefOpen) openedBriefHere.current = false;
  }, [briefOpen]);

  const setBriefOpen = useCallback((open: boolean) => {
    if (open === briefOpen) return;

    const next = new URLSearchParams(location.search);
    if (open) {
      openedBriefHere.current = true;
      next.set(START_PARAM, START_VALUE);
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
    openBrief: useCallback(() => setBriefOpen(true), [setBriefOpen]),
    closeBrief: useCallback(() => setBriefOpen(false), [setBriefOpen]),
  };
}

export default useLeadBriefHistory;
