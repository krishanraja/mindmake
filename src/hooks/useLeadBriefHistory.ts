import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const START_PARAM = "start";
const START_VALUE = "1";

export function useLeadBriefHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const openedBriefHere = useRef(false);
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const briefOpen = searchParams.get(START_PARAM) === START_VALUE;

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
