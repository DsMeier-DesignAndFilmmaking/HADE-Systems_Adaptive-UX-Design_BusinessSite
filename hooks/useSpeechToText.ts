"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* --- 1. Type Definitions for Web Speech API --- */
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    webkitAudioContext?: typeof AudioContext;
  }
}

interface UseSpeechToTextOptions {
  initialTranscript?: string;
  lang?: string;
  silenceDelayMs?: number;
  onTranscriptChange?: (text: string) => void;
}

interface UseSpeechToTextReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string; // The combined "Live" value
  finalTranscript: string;
  interimTranscript: string;
  audioLevel: number;
  setTranscript: (value: string) => void;
  clearTranscript: () => void;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
}

const DEFAULT_SILENCE_MS = 2600;

/* --- 2. Helper Utilities --- */
const normalizeSpacing = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

const mapSpeechError = (errorCode: string): string => {
  const errors: Record<string, string> = {
    "not-allowed": "Microphone permission denied. Enable mic access to use Sense Mode.",
    "service-not-allowed": "Microphone permission denied. Enable mic access to use Sense Mode.",
    "audio-capture": "No microphone detected. Connect a mic and try again.",
    "no-speech": "No speech detected. Try speaking a bit louder.",
  };
  return errors[errorCode] || "Voice input is currently unavailable. Please try again.";
};

/* --- 3. The Hook --- */
export function useSpeechToText({
  initialTranscript = "",
  lang = "en-US",
  silenceDelayMs = DEFAULT_SILENCE_MS,
  onTranscriptChange,
}: UseSpeechToTextOptions = {}): UseSpeechToTextReturn {
  
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState(normalizeSpacing(initialTranscript));
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /* --- REFS (Consolidated & Fixed) --- */
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const isListeningRef = useRef(false);
  const silenceTimerRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef(normalizeSpacing(initialTranscript));

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null); 
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRafRef = useRef<number | null>(null);

  // Calculate the "Live" transcript shown in the UI
  const transcript = useMemo(() => {
    const combined = `${finalTranscript} ${interimTranscript}`.trim();
    return normalizeSpacing(combined);
  }, [finalTranscript, interimTranscript]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    if (!isListeningRef.current) return;
    silenceTimerRef.current = window.setTimeout(() => {
      recognitionRef.current?.stop();
    }, silenceDelayMs);
  }, [clearSilenceTimer, silenceDelayMs]);

  const stopAudioAnalysis = useCallback(() => {
    if (audioRafRef.current !== null) {
      window.cancelAnimationFrame(audioRafRef.current);
      audioRafRef.current = null;
    }

    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.disconnect();
      } catch {
        // Already disconnected
      }
      audioSourceRef.current = null;
    }

    analyserRef.current = null;

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }

    // FIXED: Guard against closing an already closed context to prevent InvalidStateError
    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      if (ctx.state !== "closed") {
        void ctx.close().catch(() => {
          console.warn("AudioContext already closing or closed.");
        });
      }
      audioContextRef.current = null;
    }

    setAudioLevel(0);
  }, []);

  const startAudioAnalysis = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
    const Ctor = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctor) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isListeningRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      const context = new Ctor();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioStreamRef.current = stream;
      audioContextRef.current = context;
      audioSourceRef.current = source;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const sample = () => {
        if (!isListeningRef.current || !analyserRef.current) {
          setAudioLevel(0);
          return;
        }
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length / 255;
        setAudioLevel(avg);
        audioRafRef.current = requestAnimationFrame(sample);
      };
      sample();
    } catch {
      setAudioLevel(0);
    }
  }, []);

  useEffect(() => {
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      setError("Speech recognition not supported.");
      return;
    }

    const recognition = new Ctor() as SpeechRecognitionLike;
    recognition.continuous = true;
    recognition.interimResults = true; 
    recognition.lang = lang;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
      setInterimTranscript("");
      resetSilenceTimer();
      void startAudioAnalysis();
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let newlyFinalized = "";
      let currentInterim = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          newlyFinalized += result[0].transcript;
        } else {
          currentInterim += result[0].transcript;
        }
      }

      if (newlyFinalized) {
        const updatedFinal = normalizeSpacing(finalTranscriptRef.current + " " + newlyFinalized);
        finalTranscriptRef.current = updatedFinal;
        setFinalTranscript(updatedFinal);
        if (onTranscriptChange) onTranscriptChange(updatedFinal);
      }

      setInterimTranscript(currentInterim);
      resetSilenceTimer();
    };

    recognition.onerror = (e: SpeechRecognitionErrorEventLike) => {
      setError(mapSpeechError(e.error));
      if (["not-allowed", "no-speech"].includes(e.error)) {
        setIsListening(false);
        isListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      setInterimTranscript("");
      stopAudioAnalysis();
    };

    recognitionRef.current = recognition;
    return () => {
      clearSilenceTimer();
      stopAudioAnalysis();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
    };
  }, [lang, onTranscriptChange, resetSilenceTimer, startAudioAnalysis, stopAudioAnalysis, clearSilenceTimer]);

  const setTranscript = useCallback((value: string) => {
    const clean = normalizeSpacing(value);
    finalTranscriptRef.current = clean;
    setFinalTranscript(clean);
    setInterimTranscript("");
  }, []);

  const clearTranscript = useCallback(() => setTranscript(""), [setTranscript]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) return;
    try {
      recognitionRef.current.start();
    } catch {
      setError("Unable to start voice input.");
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    stopAudioAnalysis();
  }, [stopAudioAnalysis]);

  const toggleListening = useCallback(() => {
    isListeningRef.current ? stopListening() : startListening();
  }, [startListening, stopListening]);

  return {
    isSupported: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
    isListening,
    transcript,
    finalTranscript,
    interimTranscript,
    audioLevel,
    setTranscript,
    clearTranscript,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}