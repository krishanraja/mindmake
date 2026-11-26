import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, X } from "lucide-react";
import "@/styles/lead-exit.css";

/* The two ways in (Krish, 2026-11-19): the free judgement audit and the $59 brain modules.
   One card each, used on the toolkit page and in every "before you go" sheet. */
export const AUDIT_PATH = "/measure-your-ai-judgement";
export const MODULES_PATH = "/brain-modules";
export type Offer = "audit" | "modules";

const CARDS: Record<Offer, { href: string; tag: string; title: string; line: string; cta: string }> = {
  audit: { href: AUDIT_PATH, tag: "Free · 6 questions", title: "Measure your AI judgement", line: "One decision you made with AI. Where your judgement held.", cta: "Start" },
  modules: { href: MODULES_PATH, tag: "Software · one-off", title: "Brain modules", line: "Software that checks the next decision before you make it.", cta: "Choose one" },
};

/** Six points of a judgement profile, or a stack of modules: each card's own mark. */
function Mark({ offer }: { offer: Offer }) {
  if (offer === "audit") {
    const point = (axis: number, r: number) => { const a = -Math.PI / 2 + axis * Math.PI / 3; return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`; };
    const ring = (r: number) => [0, 1, 2, 3, 4, 5].map(axis => point(axis, r)).join(" ");
    return <svg className="lx-mark" viewBox="0 0 100 100" aria-hidden="true">
      {[14, 28, 42].map(r => <polygon key={r} points={ring(r)} className="lx-ring" />)}
      <polygon points={[38, 30, 40, 22, 34, 26].map((r, axis) => point(axis, r)).join(" ")} className="lx-shape" />
    </svg>;
  }
  return <svg className="lx-mark" viewBox="0 0 100 100" aria-hidden="true">
    {[0, 1, 2].map(i => <rect key={i} x={18 + i * 8} y={58 - i * 18} width="52" height="22" rx="6" className={i === 2 ? "lx-shape" : "lx-ring"} />)}
  </svg>;
}

export function LeadCard({ offer, onGo }: { offer: Offer; onGo?: () => void }) {
  const card = CARDS[offer];
  return <a className={`lx-card lx-${offer}`} href={card.href} onClick={onGo}>
    <Mark offer={offer} />
    <span className="lx-tag">{card.tag}</span>
    <strong className="lx-title">{card.title}</strong>
    <span className="lx-line">{card.line}</span>
    <span className="lx-cta">{card.cta} <ArrowRight aria-hidden="true" /></span>
  </a>;
}

const SEEN = "mindmake-exit-seen";
const seen = () => { try { return sessionStorage.getItem(SEEN) === "1"; } catch { return false; } };
const remember = () => { try { sessionStorage.setItem(SEEN, "1"); } catch { /* private mode: the page still works */ } };

/** Fires once per visit, across the whole site: when the pointer leaves the top of the window on a
    desktop, or the reader turns back sharply after reading half a page on a phone. */
export function useExitIntent(enabled = true) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!enabled || seen() || new URLSearchParams(window.location.search).has("checkout")) return;
    let armed = false, depth = 0, lastY = window.scrollY, lastT = performance.now();
    const arm = window.setTimeout(() => { armed = true; }, 8000);
    const show = () => { if (!armed || seen()) return; remember(); setOpen(true); };
    const leave = (event: MouseEvent) => { if (!event.relatedTarget && event.clientY <= 0) show(); };
    const scroll = () => {
      const now = performance.now(), y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) depth = Math.max(depth, y / max);
      if (depth > 0.5 && lastY - y > 600 && now - lastT < 500) show();
      if (now - lastT > 500) { lastY = y; lastT = now; }
    };
    document.addEventListener("mouseout", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.clearTimeout(arm); document.removeEventListener("mouseout", leave); window.removeEventListener("scroll", scroll); };
  }, [enabled]);
  return [open, setOpen] as const;
}

/** "Before you go": a centred dialog on a desktop, a sheet from the bottom on a phone. */
export function LeadExit({ offers, enabled = true }: { offers: Offer[]; enabled?: boolean }) {
  const [open, setOpen] = useExitIntent(enabled);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal><Dialog.Overlay className="lx-overlay" /><Dialog.Content className="lx-sheet" aria-describedby={undefined} onOpenAutoFocus={event => { event.preventDefault(); (event.currentTarget as HTMLElement).focus(); }}>
      <span className="lx-handle" aria-hidden="true" />
      <Dialog.Title className="lx-heading">Before you go</Dialog.Title>
      <Dialog.Close className="lx-close" aria-label="Close"><X aria-hidden="true" /></Dialog.Close>
      <div className={`lx-cards lx-count-${offers.length}`}>{offers.map(offer => <LeadCard key={offer} offer={offer} onGo={() => setOpen(false)} />)}</div>
      <Dialog.Close className="lx-dismiss">No thanks</Dialog.Close>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}

/* Pages that ask their own question on the way out, or must stay quiet: the brain modules ask
   "What's stopping you?", the audit offers the modules, and the receipt, feedback and alumni
   pages carry no offer. */
const OWN_EXIT = /^\/(?:brain-modules|measure-your-ai-judgement|2-minute-ai-upgrade-toolkit|kits|parts|feedback|alumni|optout|l)(?:\/|$)/;
export function SiteExit({ pathname }: { pathname: string }) {
  return <LeadExit key={pathname} offers={["audit", "modules"]} enabled={!OWN_EXIT.test(pathname)} />;
}
