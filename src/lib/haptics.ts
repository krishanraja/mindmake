// Lightweight haptic feedback for the Diagnosis Room and other touch surfaces.
//
// A thin, SSR-safe wrapper over the Vibration API. Each named pattern maps to a
// distinct tactile "feel". No-ops everywhere `navigator.vibrate` is missing
// (desktop) or silently ignored (iOS Safari), so call sites never need to guard.
//
// This generalizes the single `navigator.vibrate(50)` that previously lived in
// useVoiceInput.ts. Fire these from the *view* on a user gesture, never from
// inside the session state machine.

type VibratePattern = number | number[];

const canVibrate = (): boolean =>
  typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

const fire = (pattern: VibratePattern): void => {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* some browsers throw if called without a user gesture; ignore */
  }
};

export const haptics = {
  /** Light, incidental touch, chip taps, message received. */
  tap: () => fire(10),
  /** A deliberate selection, segmented tab, topic pill commit. */
  select: () => fire([0, 15]),
  /** A firm crossing, drag dismiss threshold, fork choice. */
  impact: () => fire(25),
  /** Something left you, message sent. */
  send: () => fire([0, 12, 30, 12]),
  /** A small win, booking, proposal ready. */
  success: () => fire([0, 20, 40, 30]),
  /** Something went wrong, error turn. */
  warn: () => fire([0, 30, 60, 30]),
} as const;

export type Haptic = keyof typeof haptics;

export default haptics;
