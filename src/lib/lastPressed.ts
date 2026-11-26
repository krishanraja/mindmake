/**
 * The last control the reader pressed. Safari does not focus a button when it
 * is clicked, so a dialog that opens from a click sees the body as the focused
 * element. Recording presses from the moment the page loads (main.tsx imports
 * this) lets the brief return focus to the button that opened it in every
 * browser, even though the brief itself loads on demand after the click.
 */
let lastPressed: HTMLElement | null = null;

if (typeof document !== "undefined") {
  const remember = (event: Event) => {
    const control = (event.target as Element | null)?.closest?.<HTMLElement>("button, a[href], [role='button']");
    if (control) lastPressed = control;
  };
  document.addEventListener("pointerdown", remember, true);
  document.addEventListener("click", remember, true);
}

export function getLastPressed(): HTMLElement | null {
  return lastPressed?.isConnected ? lastPressed : null;
}
