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

/**
 * Tracks the current CTA state based on which page section is in the viewport.
 *
 * @param paused — When true, the scroll listener is detached and
 *   getBoundingClientRect() calls stop entirely. The last known state is
 *   returned. Use this when the menu overlay is open and the page is
 *   scroll-locked — there is no reason to measure layout while the user
 *   cannot scroll, and doing so would force synchronous layout recalculation
 *   on the main thread during the animation window.
 */
export function useScrollSection(paused = false): CTAState {
  const [ctaState, setCtaState] = useState<CTAState>("awareness");

  useEffect(() => {
    if (paused) return; // No listener, no layout reads — main thread is free.

    function onScroll() {
      setCtaState(getActiveState());
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [paused]);

  return ctaState;
}
