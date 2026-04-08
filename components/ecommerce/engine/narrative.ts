import type {
  BehaviorState,
  LeaderChangeSummary,
  RankedProduct,
  SessionSignals,
  StateAssessment,
} from "./types";

function formatSeconds(value: number) {
  return `${value.toFixed(1)}s`;
}

export function formatTransitionTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function buildLeaderChangeSummary(
  product: RankedProduct,
  sessionSignals: SessionSignals
): LeaderChangeSummary {
  const reasons = [
    product.signals.dwellTime > 0 ? `${formatSeconds(product.signals.dwellTime)} dwell at 0.5 weight` : null,
    product.signals.clicks > 0 ? `${product.signals.clicks} click${product.signals.clicks === 1 ? "" : "s"} at 0.3 weight` : null,
    product.signals.revisits > 0 ? `${product.signals.revisits} revisit${product.signals.revisits === 1 ? "" : "s"} at 0.2 weight` : null,
    product.isCompared ? "comparison stack bonus applied" : null,
    sessionSignals.longPressCount > 0 ? `${sessionSignals.longPressCount} long press${sessionSignals.longPressCount === 1 ? "" : "es"} increasing dwell confidence` : null,
    sessionSignals.scrollDepth > 30 ? `${Math.round(sessionSignals.scrollDepth)}% page depth signaling sustained browse` : null,
  ].filter(Boolean) as string[];

  return {
    id: product.id,
    headline: "Based on your behavior",
    detail: reasons.length > 0 ? reasons.slice(0, 2).join(" + ") : "initial ranking baseline remains active",
  };
}

export function buildDynamicNarrative(
  assessment: StateAssessment,
  comparedProductIds: string[],
  sessionSignals: SessionSignals
): string {
  if (assessment.state === "Browsing") {
    return "You are currently browsing broadly. Keep scanning and the model will start narrowing options as stronger signals arrive.";
  }

  if (assessment.state === "Evaluating") {
    return comparedProductIds.length > 1
      ? "You are currently evaluating multiple options. Comparison depth is actively reshaping rank order."
      : "You are currently evaluating a focused set of options. Additional comparisons will sharpen model confidence.";
  }

  if (assessment.state === "Hesitating") {
    return sessionSignals.idleTime > 4
      ? "You appear to be hesitating. Revisits and idle time are increasing uncertainty in the decision path."
      : "You appear to be hesitating. Revisit loops are signaling unresolved friction before commitment.";
  }

  return "You are currently deciding. The system sees a dominant option and is prioritizing commitment-focused ranking.";
}

export function getBehaviorShiftStep(state: BehaviorState): number {
  if (state === "Browsing") return 0;
  if (state === "Evaluating" || state === "Hesitating") return 1;
  return 2;
}

export function buildCauseEffectMessage(
  assessment: StateAssessment,
  leader: RankedProduct,
  leaderChangeSummary: LeaderChangeSummary
): string {
  const normalizedReason = leaderChangeSummary.detail.replace(" + ", " and ");

  if (assessment.state === "Browsing") {
    return "Based on your activity, the ranking remains broad while the model waits for stronger intent evidence.";
  }

  if (assessment.state === "Evaluating") {
    return `Based on your activity, we adjusted ranking toward ${leader.name} as comparison and attention signals intensified. ${normalizedReason}.`;
  }

  if (assessment.state === "Hesitating") {
    return `Based on your activity, the model widened its caution because revisit and idle patterns suggest unresolved friction. ${normalizedReason}.`;
  }

  return `Based on your activity, we elevated ${leader.name} as the leading option because the session is narrowing toward decision. ${normalizedReason}.`;
}
