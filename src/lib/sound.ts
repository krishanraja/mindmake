// Synthesized UI sound for the Diagnosis Room.
//
// Soft, sub-100ms cues generated on the fly with the Web Audio API, no asset
// files, no network, no autoplay. The AudioContext is created lazily on the
// first user-gesture-driven `play()` so it never trips browser autoplay policy.
//
// Muted by DEFAULT. The preference persists in localStorage so a visitor who
// turns sound on once keeps it. `play()` early-returns while muted, so call
// sites can fire freely.

export type SoundName = "tick" | "send" | "receive" | "chime" | "swoosh";

const STORAGE_KEY = "mindmaker.sound";

type AudioCtor = typeof AudioContext;

const getAudioCtor = (): AudioCtor | null => {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext ||
    null
  );
};

let ctx: AudioContext | null = null;
let muted = true;
let initialized = false;

// Read the persisted preference once, on first access (client-only).
const ensureInit = () => {
  if (initialized) return;
  initialized = true;
  if (typeof window === "undefined") return;
  try {
    muted = window.localStorage.getItem(STORAGE_KEY) !== "on";
  } catch {
    muted = true;
  }
};

const ensureCtx = (): AudioContext | null => {
  const Ctor = getAudioCtor();
  if (!Ctor) return null;
  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  // Resume if the browser parked it (common after a gesture gap).
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
};

// A single enveloped tone. Soft attack, quick decay, low peak gain.
const tone = (
  ac: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  peak: number,
  type: OscillatorType = "sine",
) => {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
};

// A short filtered-noise burst for the "swoosh" (drag dismiss).
const noiseSwoosh = (ac: AudioContext, startAt: number) => {
  const dur = 0.18;
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    // fade the noise out so it reads as a soft exhale, not static
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, startAt);
  filter.frequency.exponentialRampToValueAtTime(300, startAt + dur);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.05, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(startAt);
  src.stop(startAt + dur);
};

const render = (ac: AudioContext, name: SoundName) => {
  const t = ac.currentTime;
  switch (name) {
    case "tick":
      tone(ac, 1180, t, 0.035, 0.035, "sine");
      break;
    case "send":
      tone(ac, 520, t, 0.05, 0.04, "triangle");
      tone(ac, 880, t + 0.04, 0.06, 0.03, "sine");
      break;
    case "receive":
      tone(ac, 660, t, 0.06, 0.035, "sine");
      break;
    case "chime":
      // a small mint arpeggio, the reward
      tone(ac, 784, t, 0.12, 0.04, "sine"); // G5
      tone(ac, 1047, t + 0.07, 0.14, 0.035, "sine"); // C6
      tone(ac, 1319, t + 0.15, 0.18, 0.03, "sine"); // E6
      break;
    case "swoosh":
      noiseSwoosh(ac, t);
      break;
  }
};

export const sound = {
  play(name: SoundName): void {
    ensureInit();
    if (muted) return;
    const ac = ensureCtx();
    if (!ac) return;
    try {
      render(ac, name);
    } catch {
      /* audio is a nicety; never let it throw into the UI */
    }
  },
  isMuted(): boolean {
    ensureInit();
    return muted;
  },
  setMuted(v: boolean): void {
    ensureInit();
    muted = v;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, v ? "off" : "on");
      } catch {
        /* private mode / storage disabled: keep the in-memory value */
      }
    }
    // Warm up the context on un-mute so the first cue isn't swallowed.
    if (!v) ensureCtx();
  },
  /** Flip mute and return the new muted state. */
  toggleMuted(): boolean {
    ensureInit();
    this.setMuted(!muted);
    return muted;
  },
} as const;

export default sound;
