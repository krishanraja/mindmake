/**
 * Which currency prices are shown in, held globally so the choice survives
 * navigation and reloads.
 *
 * There is no conversion here and there must never be. Every price is an
 * explicit per-market literal in src/lib/offers.ts; this context only picks
 * which of them to read.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_CURRENCY,
  displayPrice,
  parseCurrency,
  type Currency,
  type Offer,
} from "@/lib/offers";

const COOKIE_NAME = "mm_currency";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const URL_PARAM = "currency";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(value: Currency): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

/**
 * Precedence, resolved synchronously:
 *   1. ?currency=gbp   explicit and shareable, so it wins
 *   2. mm_currency     cookie, survives reloads and route changes
 *   3. DEFAULT_CURRENCY
 *
 * Deliberately never consulted: navigator.language, Intl timeZone,
 * Accept-Language, IP geolocation, Vercel geo headers. Auto-detection guesses
 * wrong constantly, and guessing wrong about someone's money is worse than
 * showing the default. It also takes the choice away from the buyer. The
 * currency changes when a human clicks, and at no other time.
 */
export function resolveInitialCurrency(): Currency {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  return (
    parseCurrency(new URLSearchParams(window.location.search).get(URL_PARAM)) ??
    parseCurrency(readCookie(COOKIE_NAME)) ??
    DEFAULT_CURRENCY
  );
}

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (next: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy initialiser, so the choice is resolved during the FIRST render.
  // Resolving in an effect instead would paint USD and then repaint GBP.
  // Do not move this into useEffect.
  const [currency, setCurrencyState] = useState<Currency>(resolveInitialCurrency);

  const setCurrency = useCallback((next: Currency) => setCurrencyState(next), []);

  // Persist on every change, including the initial one. That initial write is
  // what promotes a ?currency= choice into the cookie: React Router links do
  // not carry query params, so without it the choice would die on the first
  // internal navigation.
  useEffect(() => {
    writeCookie(currency);
    document.documentElement.setAttribute("data-currency", currency.toLowerCase());
  }, [currency]);

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextValue => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
};

/** Pages read a price through this rather than doing tier lookup themselves. */
export const useOfferPrice = (offer: Offer, tierId?: string): string => {
  const { currency } = useCurrency();
  return displayPrice(offer, currency, tierId);
};
