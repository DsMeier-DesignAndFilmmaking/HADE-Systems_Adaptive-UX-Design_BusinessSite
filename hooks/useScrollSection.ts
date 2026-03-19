"use client";

import { useEffect, useState } from "react";

export type CTAState = "awareness" | "trust" | "conversion";

const SECTION_MAP: { id: string; state: CTAState }[] = [
  { id: "services", state: "conversion" },
  { id: "sprint-cta", state: "conversion" },
  { id: "process", state: "conversion" },
  { id: "visual-proof", state: "trust" },
  { id: "hade-system", state: "trust" },
  { id: "how-hade-works", state: "trust" },
  { id: "shift", state: "awareness" },
  { id: "problem", state: "awareness" },
  { id: "hero", state: "awareness" },
];

function getActiveState(): CTAState {
  const midpoint = window.innerHeight * 0.5;
  for (const { id, state } of SECTION_MAP) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= midpoint) return state;
  }
  return "awareness";
}

export function useScrollSection(): CTAState {
  const [ctaState, setCtaState] = useState<CTAState>("awareness");

  useEffect(() => {
    function onScroll() {
      setCtaState(getActiveState());
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return ctaState;
}
