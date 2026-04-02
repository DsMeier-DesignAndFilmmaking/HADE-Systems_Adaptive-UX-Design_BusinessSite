import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

interface SpeechRecognitionEventLike extends Event {
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
  transcript: string;
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

const normalizeSpacing = (value: string): string =>
  value.replace(/\s+/g, " ").trim();

const joinParts = (...parts: string[]): string =>
  normalizeSpacing(parts.filter((part) => part.trim().length > 0).join(" "));

const mapSpeechError = (errorCode: string): string => {
  if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
    return "Microphone permission denied. Enable mic access to use Sense Mode voice input.";
  }
  if (errorCode === "audio-capture") {
    return "No microphone was detected. Connect a microphone and try again.";
  }
  if (errorCode === "no-speech") {
    return "No speech detected. Try speaking a bit louder.";
  }
  return "Voice input is currently unavailable. Please try again.";
};

export function useSpeechToText({
  initialTranscript = "",
  lang = "en-US",
  silenceDelayMs = DEFAULT_SILENCE_MS,
  onTranscriptChange,
}: UseSpeechToTextOptions = {}): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState(normalizeSpacing(initialTranscript));
  const [interimTranscript, setInterimTranscript] = useState("");
  const [transcript, setTranscriptState] = useState(normalizeSpacing(initialTranscript));
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const isListeningRef = useRef(false);
  const transcriptRef = useRef(normalizeSpacing(initialTranscript));
  const finalTranscriptRef = useRef(normalizeSpacing(initialTranscript));
  const interimTranscriptRef = useRef("");
  const baseTranscriptRef = useRef(normalizeSpacing(initialTranscript));
  const sessionCommittedRef = useRef(normalizeSpacing(initialTranscript));
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRafRef = useRef<number | null>(null);

  const updateSegments = useCallback((nextFinal: string, nextInterim: string) => {
    const normalizedFinal = normalizeSpacing(nextFinal);
    const normalizedInterim = normalizeSpacing(nextInterim);
    const combined = joinParts(normalizedFinal, normalizedInterim);

    finalTranscriptRef.current = normalizedFinal;
    interimTranscriptRef.current = normalizedInterim;
    transcriptRef.current = combined;

    setFinalTranscript(normalizedFinal);
    setInterimTranscript(normalizedInterim);
    setTranscriptState(combined);
  }, []);

  const setTranscript = useCallback((value: string) => {
    const normalized = normalizeSpacing(value);
    updateSegments(normalized, "");

    if (!isListeningRef.current) {
      baseTranscriptRef.current = normalized;
      sessionCommittedRef.current = normalized;
    }
  }, [updateSegments]);

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
        // no-op
      }
      audioSourceRef.current = null;
    }

    analyserRef.current = null;

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }

    setAudioLevel(0);
  }, []);

  const startAudioAnalysis = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia) return;

    const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextCtor) return;

    stopAudioAnalysis();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isListeningRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const context = new AudioContextCtor();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);

      audioContextRef.current = context;
      audioStreamRef.current = stream;
      audioSourceRef.current = source;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const sample = () => {
        const activeAnalyser = analyserRef.current;
        if (!activeAnalyser || !isListeningRef.current) {
          setAudioLevel(0);
          return;
        }

        activeAnalyser.getByteFrequencyData(dataArray);
        const total = dataArray.reduce((sum, value) => sum + value, 0);
        const level = total / dataArray.length / 255;
        setAudioLevel(level);
        audioRafRef.current = window.requestAnimationFrame(sample);
      };

      sample();
    } catch (error) {
      const maybeDomError = error as DOMException;
      if (maybeDomError?.name === "NotAllowedError") {
        setError(mapSpeechError("not-allowed"));
      }
      setAudioLevel(0);
    }
  }, [stopAudioAnalysis]);

  const recognitionConstructor = useMemo<SpeechRecognitionConstructor | null>(() => {
    if (typeof window === "undefined") return null;
    return window.webkitSpeechRecognition ?? window.SpeechRecognition ?? null;
  }, []);

  const isSupported = recognitionConstructor !== null;

  useEffect(() => {
    if (!recognitionConstructor) return;

    const recognition = new recognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = lang;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
      resetSilenceTimer();
      void startAudioAnalysis();
    };

    recognition.onresult = (event) => {
      let finalAccumulator = "";
      let interimAccumulator = "";

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const spokenChunk = result[0]?.transcript ?? "";
        if (!spokenChunk.trim()) continue;

        if (result.isFinal) {
          finalAccumulator = `${finalAccumulator} ${spokenChunk}`;
        } else {
          interimAccumulator = `${interimAccumulator} ${spokenChunk}`;
        }
      }

      // Accumulator pattern:
      // base finalized text + finalized chunks + live interim guess.
      const committed = joinParts(baseTranscriptRef.current, finalAccumulator);
      const interim = normalizeSpacing(interimAccumulator);

      sessionCommittedRef.current = committed;
      updateSegments(committed, interim);
      resetSilenceTimer();
    };

    recognition.onerror = (event) => {
      const shouldResetListening =
        event.error === "not-allowed" ||
        event.error === "service-not-allowed" ||
        event.error === "no-speech";

      setError(mapSpeechError(event.error));
      clearSilenceTimer();

      if (shouldResetListening) {
        isListeningRef.current = false;
        setIsListening(false);
        const committedTranscript = sessionCommittedRef.current || finalTranscriptRef.current || transcriptRef.current;
        updateSegments(committedTranscript, "");
      }
      stopAudioAnalysis();
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      clearSilenceTimer();
      stopAudioAnalysis();

      // Commit only final speech chunks at session end (drops stale interim text).
      const committedTranscript = sessionCommittedRef.current || finalTranscriptRef.current || transcriptRef.current;
      updateSegments(committedTranscript, "");
      baseTranscriptRef.current = committedTranscript;
      sessionCommittedRef.current = committedTranscript;
    };

    recognitionRef.current = recognition;

    return () => {
      clearSilenceTimer();
      stopAudioAnalysis();
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.stop();
      } catch {
        // No-op: stop can throw on already-stopped recognizers.
      }

      try {
        recognition.abort();
      } catch {
        // No-op: abort can throw on already-stopped recognizers.
      }

      recognitionRef.current = null;
      isListeningRef.current = false;
    };
  }, [
    recognitionConstructor,
    lang,
    clearSilenceTimer,
    resetSilenceTimer,
    stopAudioAnalysis,
    startAudioAnalysis,
    updateSegments,
  ]);

  useEffect(() => {
    const normalized = normalizeSpacing(initialTranscript);
    if (isListeningRef.current) return;
    if (normalized === transcriptRef.current) return;

    transcriptRef.current = normalized;
    finalTranscriptRef.current = normalized;
    interimTranscriptRef.current = "";
    baseTranscriptRef.current = normalized;
    sessionCommittedRef.current = normalized;
    setFinalTranscript(normalized);
    setInterimTranscript("");
    setTranscriptState(normalized);
  }, [initialTranscript]);

  useEffect(() => {
    if (!onTranscriptChange) return;
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }
    if (isListeningRef.current) return;

    setError(null);
    baseTranscriptRef.current = finalTranscriptRef.current;
    sessionCommittedRef.current = finalTranscriptRef.current;
    updateSegments(finalTranscriptRef.current, "");

    try {
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
    } catch {
      setError("Unable to start voice input right now. Please try again.");
    }
  }, [lang]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (!isListeningRef.current) {
      stopAudioAnalysis();
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch {
      // no-op
    }
    clearSilenceTimer();
    stopAudioAnalysis();
  }, [clearSilenceTimer, stopAudioAnalysis]);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    baseTranscriptRef.current = "";
    sessionCommittedRef.current = "";
  }, [setTranscript]);

  return {
    isSupported,
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
