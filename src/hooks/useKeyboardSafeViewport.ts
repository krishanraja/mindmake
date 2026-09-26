import { useEffect, type RefObject } from "react";

/**
 * Keeps a focused field above a phone's software keyboard, inside a dialog.
 *
 * A dialog on this site is fixed to the screen and scrolls itself, so the
 * browser's own "scroll the field into view" has nothing to move: the page
 * behind is locked, and on Android Chrome the keyboard shrinks only the visual
 * viewport, which leaves 100dvh, 100svh and every fixed box the full height of
 * the screen behind it. The field stays exactly where it was, under the
 * keyboard (Krish, 2026-09-25 and 2026-09-26, Android Chrome: "it just
 * obstructs the actual text box I'm trying to type into").
 *
 * So this measures the visual viewport and writes it onto `host` as custom
 * properties, which the dialog's stylesheet sizes and places itself from:
 *
 *   <prefix>-viewport-height, -width, -top, -left  what can actually be seen
 *   <prefix>-keyboard-inset                        how much the keyboard covers
 *   data-keyboard="open"                           a field is being typed into
 *                                                  and the keyboard is up
 *
 * and whenever the visible area changes, or a field takes focus, it scrolls
 * `scroller` just far enough to show the field, its label and its hint or
 * error between any sticky header (`chrome`) and the top of the keyboard,
 * with the button that sends the form as well when there is room.
 *
 * One mechanism for every dialog that asks for text: the lead dialog and the
 * "Start here" decision dialog both use it.
 */

/* How far the visible height has to fall below its resting height, with a
   field being typed into, before the keyboard counts as open. The address bar
   moves about 56px; a keyboard takes 250 or more. */
export const KEYBOARD_OPEN_THRESHOLD_PX = 150;
const REVEAL_GAP_PX = 12;

/* A field that brings up the software keyboard, as opposed to a button, a box
   or a native selector. */
export const isTextEntry = (element: Element | null): element is HTMLInputElement | HTMLTextAreaElement =>
  (element instanceof HTMLInputElement && !["checkbox", "radio", "button", "submit", "hidden", "range", "color", "file", "reset", "image"].includes(element.type))
  || element instanceof HTMLTextAreaElement;

/* What has to be on screen for a field to be usable: its label, the field and
   whatever hint or error it points at. */
export const fieldGroup = (field: HTMLElement): HTMLElement[] => {
  const labels = "labels" in field && field.labels ? Array.from(field.labels as NodeListOf<HTMLElement>) : [];
  const described = (field.getAttribute("aria-describedby") ?? "")
    .split(/\s+/)
    .map((id) => (id ? document.getElementById(id) : null))
    .filter((element): element is HTMLElement => element instanceof HTMLElement && element.getClientRects().length > 0);
  return [...labels, field, ...described];
};

/* The button that sends the field's form, including one outside it that
   names the form with `form`. Shown with the field when both fit. */
export const fieldAction = (field: HTMLElement): HTMLElement[] => {
  const form = "form" in field ? (field.form as HTMLFormElement | null) : null;
  const action = form
    ? Array.from(form.elements).find((element): element is HTMLButtonElement =>
      element instanceof HTMLButtonElement && element.type === "submit" && element.getClientRects().length > 0)
    : undefined;
  return action ? [action] : [];
};

/**
 * Keeps a group of elements between the scroller's sticky header and the
 * bottom of what can actually be seen, by scrolling the scroller alone.
 *
 * It does nothing while the group is already in view, so it can run on every
 * change of the visible viewport without moving anything that is already
 * readable. When it does move, it is instant and it scrolls the scroller
 * rather than calling `scrollIntoView`, which would also scroll the page and
 * the visual viewport the dialog is pinned to.
 */
export const revealWithinScroller = (
  scroller: HTMLElement,
  group: HTMLElement[],
  extra: HTMLElement[] = [],
  chrome = "",
) => {
  if (group.length === 0) return;
  const scrollerRect = scroller.getBoundingClientRect();
  const viewport = window.visualViewport;
  const visibleTop = viewport?.offsetTop ?? 0;
  const visibleBottom = Math.min(scrollerRect.bottom, viewport ? viewport.offsetTop + viewport.height : window.innerHeight);
  const chromeBottom = (chrome ? Array.from(scroller.querySelectorAll<HTMLElement>(chrome)) : [])
    .filter((element) => {
      const style = window.getComputedStyle(element);
      return style.position === "sticky" && style.display !== "none";
    })
    .reduce((edge, element) => Math.max(edge, element.getBoundingClientRect().bottom), Math.max(scrollerRect.top, visibleTop));
  const upper = chromeBottom + REVEAL_GAP_PX;
  const lower = visibleBottom - REVEAL_GAP_PX;
  const span = (elements: HTMLElement[]) => {
    const rects = elements.map((element) => element.getBoundingClientRect());
    return { top: Math.min(...rects.map((rect) => rect.top)), bottom: Math.max(...rects.map((rect) => rect.bottom)) };
  };
  /* The field's own group always; its action as well when the two fit
     between the header and the keyboard together. */
  const withExtra = extra.length ? span([...group, ...extra]) : null;
  const { top, bottom } = withExtra && withExtra.bottom - withExtra.top <= lower - upper ? withExtra : span(group);
  if (top >= upper && bottom <= lower) return;
  /* The label is what says what the field is for, so when the group cannot
     fit the band its top wins. */
  const delta = top < upper || bottom - top > lower - upper ? top - upper : bottom - lower;
  scroller.scrollTop += delta;
};

/** Reveals the focused field, if it is a field inside `scroller`. */
export const revealFocusedField = (scroller: HTMLElement, chrome = "") => {
  const active = document.activeElement;
  const field = active instanceof HTMLElement && scroller.contains(active)
    && (isTextEntry(active) || active instanceof HTMLSelectElement)
    ? active
    : null;
  if (field) revealWithinScroller(scroller, fieldGroup(field), fieldAction(field), chrome);
};

interface KeyboardSafeViewportOptions {
  /** Whether the dialog is showing. Nothing is measured while it is not. */
  open: boolean;
  /** The element the custom properties and data-keyboard are written onto. */
  host: RefObject<HTMLElement>;
  /** The element that scrolls; the host itself when omitted. */
  scroller?: RefObject<HTMLElement>;
  /** The custom-property prefix, such as "--mm-brief". */
  prefix: string;
  /** Sticky header parts inside the scroller that a field must clear. */
  chrome?: string;
}

export function useKeyboardSafeViewport({ open, host, scroller, prefix, chrome = "" }: KeyboardSafeViewportOptions) {
  useEffect(() => {
    const target = host.current;
    if (!open || !target) return;

    const scrollerElement = () => scroller?.current ?? host.current;
    const visualViewport = window.visualViewport;
    let animationFrame = 0;
    let layoutHeight = Math.max(
      window.innerHeight,
      visualViewport ? visualViewport.height + visualViewport.offsetTop : 0,
    );
    /* The tallest the visible viewport has been with nothing being typed into.
       Measuring the keyboard against this, rather than against the layout
       height, still works when the visual viewport is panned and in in-app
       browsers that shrink the whole page for the keyboard. */
    let restingHeight = visualViewport?.height ?? window.innerHeight;
    let restingWidth = visualViewport?.width ?? window.innerWidth;

    const focusedTextField = () => {
      const active = document.activeElement;
      return isTextEntry(active) && scrollerElement()?.contains(active) ? active : null;
    };

    /* Runs after the new size has been written, and moves nothing unless the
       focused field has actually gone out of view. */
    const reveal = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const element = scrollerElement();
        if (element) revealFocusedField(element, chrome);
      });
    };

    const sync = (andReveal: boolean) => {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const width = viewport?.width ?? window.innerWidth;
      const offsetTop = viewport?.offsetTop ?? 0;
      const offsetLeft = viewport?.offsetLeft ?? 0;
      const visibleBottom = height + offsetTop;
      if (Math.abs(width - restingWidth) > 1) {
        restingWidth = width;
        restingHeight = height;
        layoutHeight = Math.max(window.innerHeight, visibleBottom);
      }
      const typing = focusedTextField() !== null;
      if (!typing) restingHeight = Math.max(restingHeight, height);
      layoutHeight = Math.max(layoutHeight, window.innerHeight, visibleBottom);
      const keyboardInset = Math.max(0, layoutHeight - visibleBottom);
      const keyboardOpen = typing && restingHeight - height > KEYBOARD_OPEN_THRESHOLD_PX;

      target.style.setProperty(`${prefix}-viewport-height`, `${Math.round(height)}px`);
      target.style.setProperty(`${prefix}-viewport-width`, `${Math.round(width)}px`);
      target.style.setProperty(`${prefix}-viewport-top`, `${Math.round(offsetTop)}px`);
      target.style.setProperty(`${prefix}-viewport-left`, `${Math.round(offsetLeft)}px`);
      target.style.setProperty(`${prefix}-keyboard-inset`, `${Math.round(keyboardInset)}px`);
      if (keyboardOpen) target.setAttribute("data-keyboard", "open");
      else target.removeAttribute("data-keyboard");

      if (andReveal) reveal();
    };

    const onVisualViewportResize = () => sync(true);
    const onVisualViewportScroll = () => sync(false);
    const onWindowResize = () => sync(true);
    const onFocusIn = () => sync(true);
    const onFocusOut = () => window.requestAnimationFrame(() => sync(false));
    const onOrientationChange = () => {
      const viewport = window.visualViewport;
      layoutHeight = Math.max(
        window.innerHeight,
        viewport ? viewport.height + viewport.offsetTop : 0,
      );
      restingHeight = viewport?.height ?? window.innerHeight;
      restingWidth = viewport?.width ?? window.innerWidth;
      sync(true);
    };

    sync(false);
    visualViewport?.addEventListener("resize", onVisualViewportResize);
    visualViewport?.addEventListener("scroll", onVisualViewportScroll);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("orientationchange", onOrientationChange);
    target.addEventListener("focusin", onFocusIn);
    target.addEventListener("focusout", onFocusOut);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      visualViewport?.removeEventListener("resize", onVisualViewportResize);
      visualViewport?.removeEventListener("scroll", onVisualViewportScroll);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      target.removeEventListener("focusin", onFocusIn);
      target.removeEventListener("focusout", onFocusOut);
      target.removeAttribute("data-keyboard");
    };
  }, [chrome, host, open, prefix, scroller]);
}
