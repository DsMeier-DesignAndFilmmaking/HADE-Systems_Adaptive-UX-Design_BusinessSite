"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Square, AlertTriangle, X } from "lucide-react";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface SenseVoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  silenceDelayMs?: number;
}

function ListeningBars({ active }: { active: boolean }) {
  const bars = [0.42, 0.92, 0.58];
  return (
    <div className="flex h-5 items-end gap-1.5" aria-hidden>
      {bars.map((bar, index) => (
        <motion.span
          key={`sense-bar-${index}`}
          className="w-[3px] origin-bottom rounded-full bg-white/85"
          animate={active ? { scaleY: [0.25, bar, 0.38, 1, 0.3] } : { scaleY: 0.25 }}
          transition={{
            repeat: active ? Infinity : 0,
            duration: 0.92 + index * 0.08,
            ease: "easeInOut",
            delay: index * 0.06,
          }}
        />
      ))}
    </div>
  );
}

export default function SenseVoiceInput({
  value,
  onChange,
  placeholder = "Describe the vibe you want to feel...",
  silenceDelayMs = 2600,
}: SenseVoiceInputProps) {
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    audioLevel,
    setTranscript,
    clearTranscript,
    error,
    toggleListening,
  } = useSpeechToText({
    initialTranscript: value,
    onTranscriptChange: onChange,
    silenceDelayMs,
    lang: "en-US",
  });

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const isPermissionError = error?.toLowerCase().includes("permission denied");
  const micScale = isListening ? 1 + Math.min(audioLevel, 1) * 0.35 : 1;

  React.useEffect(() => {
    if (!isListening) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorAtEnd = () => {
      const end = textarea.value.length;
      textarea.setSelectionRange(end, end);
    };

    const raf = window.requestAnimationFrame(cursorAtEnd);
    return () => window.cancelAnimationFrame(raf);
  }, [transcript, isListening]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0F131B] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/55">
          Sense Mode Voice
        </p>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/38">
          <ListeningBars active={isListening} />
          <span>{isListening ? "Listening" : "Standby"}</span>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <motion.button
          type="button"
          onClick={toggleListening}
          disabled={!isSupported}
          className={`relative mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition
            ${
              isListening
                ? "animate-pulse border-white/30 bg-white text-[#0F131B]"
                : "border-white/20 bg-white/[0.06] text-white/80 hover:border-white/40 hover:bg-white/[0.12]"
            }
            ${!isSupported ? "cursor-not-allowed opacity-45" : ""}`}
          animate={{ scale: micScale }}
          transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.55 }}
          aria-label={isListening ? "Stop voice capture" : "Start voice capture"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isListening ? (
              <motion.span
                key="stop-icon"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                <Square size={14} />
              </motion.span>
            ) : (
              <motion.span
                key="mic-icon"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                <Mic size={16} />
              </motion.span>
            )}
          </AnimatePresence>
          {isListening && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border border-white/60"
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.35 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.button>

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            rows={3}
            placeholder={placeholder}
            className="w-full resize-none rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] leading-relaxed text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-white/[0.07]"
          />

          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40">
              {isListening ? "Listening in real-time" : "Auto-stops after a short pause"}
            </p>
            {transcript.length > 0 && (
              <button
                type="button"
                onClick={clearTranscript}
                className="flex items-center gap-1 rounded-full border border-white/12 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/50 transition hover:border-white/30 hover:text-white/75"
              >
                <X size={10} />
                Clear
              </button>
            )}
          </div>
          <AnimatePresence>
            {isListening && interimTranscript && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.18 }}
                className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50"
              >
                Processing: {interimTranscript}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!isSupported && (
        <p className="mt-3 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-amber-200/90">
          Voice input is not supported in this browser.
        </p>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em]
              ${isPermissionError ? "border border-rose-300/30 bg-rose-300/10 text-rose-200/95" : "border border-amber-300/30 bg-amber-300/10 text-amber-200/95"}`}
          >
            <AlertTriangle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
