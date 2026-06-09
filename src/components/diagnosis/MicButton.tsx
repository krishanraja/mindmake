import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  /** Transcribe a recorded blob to text. Throws on failure. */
  onTranscribe: (blob: Blob) => Promise<string>;
  /** Receives the transcript so the parent can drop it into its input. */
  onResult: (text: string) => void;
  disabled?: boolean;
  /** Larger hit area + label, used on the opener / mobile. */
  size?: "sm" | "lg";
  className?: string;
}

type MicState = "idle" | "recording" | "transcribing";

/** True only where the browser can actually record audio. */
const canRecord = (): boolean =>
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices?.getUserMedia &&
  typeof window.MediaRecorder !== "undefined";

/**
 * A self-contained voice-input button. Tap to record, tap again to stop. The
 * recording is sent to the transcribe edge function and the text is handed
 * back to the parent for the visitor to confirm and send.
 *
 * It hides itself entirely when the browser cannot record or permission is
 * denied, so typing always remains the graceful fallback.
 */
export const MicButton = ({
  onTranscribe,
  onResult,
  disabled = false,
  size = "sm",
  className,
}: MicButtonProps) => {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<MicState>("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    setSupported(canRecord());
    return () => {
      mountedRef.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        try {
          recorderRef.current.stop();
        } catch {
          /* already stopped */
        }
      }
    };
  }, []);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const beginRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      // pick a mime the browser actually supports
      const preferred = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg",
      ];
      const mimeType =
        preferred.find((m) => MediaRecorder.isTypeSupported?.(m)) || "";
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stopTracks();
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        chunksRef.current = [];
        if (!blob.size) {
          if (mountedRef.current) setState("idle");
          return;
        }
        if (mountedRef.current) setState("transcribing");
        try {
          const text = await onTranscribe(blob);
          if (text?.trim()) onResult(text.trim());
        } catch {
          /* transcription failed; the user can always type instead */
        } finally {
          if (mountedRef.current) setState("idle");
        }
      };

      recorder.start();
      setState("recording");
    } catch {
      // permission denied or no device: hide the mic, fall back to typing
      stopTracks();
      setSupported(false);
      setState("idle");
    }
  }, [onResult, onTranscribe, stopTracks]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        setState("idle");
        stopTracks();
      }
    }
  }, [stopTracks]);

  const toggle = useCallback(() => {
    if (disabled) return;
    if (state === "recording") stopRecording();
    else if (state === "idle") void beginRecording();
  }, [disabled, state, beginRecording, stopRecording]);

  if (!supported) return null;

  const lg = size === "lg";
  const dimension = lg ? "h-12 w-12" : "h-9 w-9";

  const label =
    state === "recording"
      ? "Stop recording"
      : state === "transcribing"
        ? "Transcribing"
        : "Record your answer";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled || state === "transcribing"}
      aria-label={label}
      aria-pressed={state === "recording"}
      title={label}
      className={cn(
        "relative flex shrink-0 touch-target items-center justify-center rounded-full transition-colors",
        dimension,
        state === "recording"
          ? "bg-red-500/90 text-white"
          : "bg-white/8 text-white/70 hover:bg-white/15 hover:text-white",
        "disabled:opacity-50",
        className,
      )}
    >
      {state === "recording" && (
        <span className="absolute inset-0 animate-ping rounded-full bg-red-500/40" />
      )}
      {state === "transcribing" ? (
        <Loader2 className={cn(lg ? "h-5 w-5" : "h-4 w-4", "animate-spin")} />
      ) : state === "recording" ? (
        <Square className={cn(lg ? "h-4 w-4" : "h-3.5 w-3.5", "relative")} fill="currentColor" />
      ) : (
        <Mic className={cn(lg ? "h-5 w-5" : "h-4 w-4")} />
      )}
    </button>
  );
};

export default MicButton;
