import { useState, useEffect, useCallback, useRef } from 'react';
import { haptics } from '@/lib/haptics';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface UseVoiceInputOptions {
  continuous?: boolean;
  language?: string;
  silenceTimeout?: number;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useVoiceInput = (options: UseVoiceInputOptions = {}): UseVoiceInputReturn => {
  const {
    continuous = true,
    language = 'en-US',
    silenceTimeout = 2000,
    onTranscript,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef(false);

  // Check browser support
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);
  }, []);

  // Initialize recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript('');
        onTranscript?.(finalTranscript, true);
      } else {
        setInterimTranscript(interimText);
        onTranscript?.(interimText, false);
      }

      // Reset silence timer on any speech
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      if (isListeningRef.current && silenceTimeout > 0) {
        silenceTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            recognition.stop();
          }
        }, silenceTimeout);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessage = getErrorMessage(event.error);
      setError(errorMessage);
      onError?.(errorMessage);
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognition.onend = () => {
      setIsListening(false);
      isListeningRef.current = false;
      setInterimTranscript('');
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (recognitionRef.current && isListeningRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [continuous, language, silenceTimeout, onTranscript, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) return;

    setError(null);
    setInterimTranscript('');

    // Trigger haptic feedback on mobile
    haptics.select();

    try {
      recognitionRef.current.start();
    } catch (err) {
      // Recognition might already be started
      console.warn('Speech recognition start error:', err);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListeningRef.current) return;

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    recognitionRef.current.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};

function getErrorMessage(error: string): string {
  switch (error) {
    case 'no-speech':
      return 'No speech detected. Please try again.';
    case 'audio-capture':
      return 'Microphone not available. Please check permissions.';
    case 'not-allowed':
      return 'Microphone access denied. Please enable in browser settings.';
    case 'network':
      return 'Network error. Please check your connection.';
    case 'aborted':
      return 'Speech recognition was stopped.';
    case 'service-not-allowed':
      return 'Speech service not available.';
    default:
      return 'Speech recognition error. Please try again.';
  }
}

export default useVoiceInput;
















