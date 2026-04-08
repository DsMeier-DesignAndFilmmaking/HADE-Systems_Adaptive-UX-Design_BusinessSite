"use client";

import { useEffect, useRef, useState } from "react";

interface LiveNarrativeProps {
  stateKey: string;
  dynamicNarrative: string;
  causeEffectMessage: string;
}

export default function LiveNarrative({
  stateKey,
  dynamicNarrative,
  causeEffectMessage,
}: LiveNarrativeProps) {
  // Track the last stateKey that triggered a reveal animation
  const prevKeyRef = useRef(stateKey);

  // Display values — what is actually rendered
  const [displayNarrative, setDisplayNarrative] = useState(dynamicNarrative);
  const [displayCause, setDisplayCause] = useState(causeEffectMessage);
  const [isVisible, setIsVisible] = useState(true);

  const pendingNarrative = useRef(dynamicNarrative);
  const pendingCause = useRef(causeEffectMessage);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    pendingNarrative.current = dynamicNarrative;
    pendingCause.current = causeEffectMessage;

    const keyChanged = stateKey !== prevKeyRef.current;
    const textChanged =
      dynamicNarrative !== displayNarrative ||
      causeEffectMessage !== displayCause;

    if (!keyChanged && !textChanged) return;

    // Clear any in-flight timer
    if (fadeTimer.current) clearTimeout(fadeTimer.current);

    // Fade out
    setIsVisible(false);

    // After fade-out completes, swap text and fade back in
    fadeTimer.current = setTimeout(() => {
      prevKeyRef.current = stateKey;
      setDisplayNarrative(pendingNarrative.current);
      setDisplayCause(pendingCause.current);
      setIsVisible(true);
    }, 200);

    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey, dynamicNarrative, causeEffectMessage]);

  return (
    <div
      className="mb-6 min-h-[108px] w-full rounded-2xl border px-4 py-3"
      style={{
        background: "rgba(255,255,255,0.72)",
        borderColor: "rgba(11,13,18,0.08)",
      }}
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">
        Live Narrative
      </p>
      <div
        className={`transition-all duration-300 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[2px]"
        }`}
      >
        <p className="mt-1 text-sm font-medium text-ink/62">{displayNarrative}</p>
        <p className="mt-2 text-[11px] leading-relaxed text-ink/50">{displayCause}</p>
      </div>
    </div>
  );
}
