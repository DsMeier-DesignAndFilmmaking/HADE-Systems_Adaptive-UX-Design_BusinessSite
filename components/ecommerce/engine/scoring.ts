import type { ProductSignals, RankedProduct, SessionAdjustment, SessionSignals, SignalMap } from "./types";
import {
  CLICK_WEIGHT,
  COMPARE_STACK_BONUS,
  DWELL_WEIGHT,
  IDLE_WEIGHT,
  LONG_PRESS_WEIGHT,
  PRODUCTS,
  RANK_STABILITY_THRESHOLD,
  REVISIT_WEIGHT,
  SCROLL_WEIGHT,
  TAP_WEIGHT,
  TIME_WEIGHT,
} from "./config";

/* ─── Session Adjustment ────────────────────────────────────────────── */

export function calculateSessionAdjustment(sessionSignals: SessionSignals): SessionAdjustment {
  return {
    scrollContribution: Number(((sessionSignals.scrollDepth / 100) * SCROLL_WEIGHT).toFixed(2)),
    timeContribution: Number((Math.min(sessionSignals.timeOnPage / 20, 1.5) * TIME_WEIGHT).toFixed(2)),
    idleContribution: Number((Math.min(sessionSignals.idleTime / 12, 1.5) * IDLE_WEIGHT).toFixed(2)),
    tapContribution: Number((sessionSignals.tapCount * TAP_WEIGHT).toFixed(2)),
    longPressContribution: Number((sessionSignals.longPressCount * LONG_PRESS_WEIGHT).toFixed(2)),
  };
}

/* ─── Product Score ─────────────────────────────────────────────────── */

export function calculateProductScore(
  signal: ProductSignals,
  isCompared: boolean,
  sessionSignals: SessionSignals
): number {
  const sessionAdjustment = calculateSessionAdjustment(sessionSignals);
  const weightedSignal =
    signal.dwellTime * DWELL_WEIGHT +
    signal.clicks * CLICK_WEIGHT +
    signal.revisits * REVISIT_WEIGHT;

  const behaviorMomentum =
    sessionAdjustment.scrollContribution +
    sessionAdjustment.timeContribution +
    sessionAdjustment.tapContribution * 0.35 +
    sessionAdjustment.longPressContribution * 0.6 -
    sessionAdjustment.idleContribution * 0.25;

  return Number((weightedSignal + behaviorMomentum + (isCompared ? COMPARE_STACK_BONUS : 0)).toFixed(2));
}

/* ─── Ranking ───────────────────────────────────────────────────────── */

export function rankProducts(
  signalMap: SignalMap,
  comparedProductIds: string[],
  sessionSignals: SessionSignals
): RankedProduct[] {
  return [...PRODUCTS]
    .map((product) => {
      const signals = signalMap[product.id];
      const isCompared = comparedProductIds.includes(product.id);

      return {
        ...product,
        isCompared,
        signals,
        score: calculateProductScore(signals, isCompared, sessionSignals),
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Apply ranking stability: only accept a rank swap if the score delta
 * between adjacent items exceeds the threshold. This prevents flickering
 * on tiny score differences.
 */
export function applyRankingStability(
  next: RankedProduct[],
  previous: RankedProduct[]
): RankedProduct[] {
  if (previous.length === 0) return next;

  const previousPositions = new Map(previous.map((p, i) => [p.id, i]));
  const stabilized = [...next];

  for (let i = 0; i < stabilized.length - 1; i++) {
    const current = stabilized[i];
    const below = stabilized[i + 1];
    const scoreDelta = current.score - below.score;

    if (scoreDelta < RANK_STABILITY_THRESHOLD) {
      const prevCurrentPos = previousPositions.get(current.id) ?? i;
      const prevBelowPos = previousPositions.get(below.id) ?? i + 1;

      if (prevCurrentPos > prevBelowPos) {
        stabilized[i] = below;
        stabilized[i + 1] = current;
      }
    }
  }

  return stabilized;
}
