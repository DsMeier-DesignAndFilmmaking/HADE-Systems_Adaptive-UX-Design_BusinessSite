import type {
  BehaviorState,
  ModelMetric,
  PipelineLogEntry,
  PseudoModelOutput,
  RankedProduct,
  SessionSignals,
  SignalContribution,
} from "./types";
import {
  CLICK_WEIGHT,
  COMPARE_STACK_BONUS,
  DWELL_WEIGHT,
  REVISIT_WEIGHT,
} from "./config";
import { calculateSessionAdjustment } from "./scoring";

function formatSeconds(value: number) {
  return `${value.toFixed(1)}s`;
}

/**
 * Classify behavioral state and produce the full model output.
 * Inference latency is NOT measured here — doing so inside the render
 * path causes SSR/hydration mismatches because performance.now() returns
 * different values on server vs client. Instead, callers that need the
 * measured latency should time this function externally in a useEffect.
 */
export function buildPseudoModelOutput(
  rankedProducts: RankedProduct[],
  comparedProductIds: string[],
  sessionSignals: SessionSignals
): PseudoModelOutput {

  const leader = rankedProducts[0];
  const runnerUp = rankedProducts[1];
  const totalDwell = rankedProducts.reduce((sum, p) => sum + p.signals.dwellTime, 0);
  const totalClicks = rankedProducts.reduce((sum, p) => sum + p.signals.clicks, 0);
  const totalRevisits = rankedProducts.reduce((sum, p) => sum + p.signals.revisits, 0);
  const comparisonDepth = comparedProductIds.length;
  const sessionAdjustment = calculateSessionAdjustment(sessionSignals);

  const dwellContribution = totalDwell * DWELL_WEIGHT;
  const clickContribution = totalClicks * CLICK_WEIGHT;
  const revisitContribution = totalRevisits * REVISIT_WEIGHT;
  const compareContribution = comparisonDepth > 0 ? comparisonDepth * COMPARE_STACK_BONUS : 0;

  /* ── Candidate State Scoring ──────────────────────────────────────── */

  const candidateStates: Array<{ state: BehaviorState; score: number; rationale: string }> = [
    {
      state: "Browsing",
      score:
        Math.max(0, 0.45 + totalDwell * 0.08 + sessionAdjustment.scrollContribution * 0.9) -
        totalClicks * 0.12 -
        totalRevisits * 0.1,
      rationale: "Breadth signals like page depth and light dwell suggest broad scanning behavior.",
    },
    {
      state: "Evaluating",
      score:
        dwellContribution * 0.7 +
        clickContribution * 1.15 +
        compareContribution * 0.95 +
        sessionAdjustment.tapContribution * 0.75 +
        sessionAdjustment.longPressContribution * 0.55,
      rationale: "Sustained attention, taps, and stacked comparisons indicate active option evaluation.",
    },
    {
      state: "Hesitating",
      score:
        revisitContribution * 1.45 +
        dwellContribution * 0.45 +
        compareContribution * 0.35 +
        sessionAdjustment.idleContribution * 1.2 +
        Math.min(sessionSignals.maxIdleStreak / 10, 0.8) * 0.6,
      rationale: "Return loops and growing idle time indicate intent is present but friction remains.",
    },
    {
      state: "Deciding",
      score:
        leader.score * 1.15 +
        clickContribution * 0.9 +
        sessionAdjustment.longPressContribution * 0.65 -
        revisitContribution * 0.35,
      rationale: "A dominant top-ranked option with continued interaction suggests narrowing toward decision.",
    },
  ];

  /* ── Confidence & Conflict Detection ──────────────────────────────── */

  const sortedStates = [...candidateStates].sort((a, b) => b.score - a.score);
  const bestState = sortedStates[0];
  const runnerUpState = sortedStates[1];
  const totalStateScore = candidateStates.reduce((sum, c) => sum + c.score, 0);
  const confidenceBase = totalStateScore > 0 ? bestState.score / totalStateScore : 0;
  const separation = Math.max(0, bestState.score - runnerUpState.score);
  const confidence = Math.min(96, Math.max(34, Math.round(confidenceBase * 100 + separation * 18)));
  const lowConfidence = confidence < 64;

  const conflictSignals = [
    totalClicks > 0 && totalRevisits > 0 && bestState.state === "Deciding"
      ? "Clicks imply commitment while revisits still indicate unresolved hesitation."
      : null,
    sessionSignals.maxIdleStreak > 6 && totalDwell > 2
      ? "Long idle periods are offsetting otherwise strong attention signals."
      : null,
    comparisonDepth > 1 && leader.score - runnerUp.score < 0.35
      ? "Top-ranked products remain tightly clustered, so ranking certainty is still low."
      : null,
  ].filter(Boolean) as string[];

  /* ── Top Signal Contributors ──────────────────────────────────────── */

  const topSignals: SignalContribution[] = [
    { label: "Dwell Time", value: formatSeconds(totalDwell), weight: "0.5", contribution: dwellContribution },
    { label: "Clicks", value: `${totalClicks}`, weight: "0.3", contribution: clickContribution },
    { label: "Revisits", value: `${totalRevisits}`, weight: "0.2", contribution: revisitContribution },
    { label: "Comparison Stack", value: `${comparisonDepth}`, weight: "+0.35", contribution: compareContribution },
    { label: "Scroll Depth", value: `${Math.round(sessionSignals.scrollDepth)}%`, weight: "0.18", contribution: sessionAdjustment.scrollContribution },
    { label: "Time on Page", value: formatSeconds(sessionSignals.timeOnPage), weight: "0.14", contribution: sessionAdjustment.timeContribution },
    { label: "Idle Time", value: formatSeconds(sessionSignals.idleTime), weight: "0.16", contribution: sessionAdjustment.idleContribution },
    { label: "Tap Frequency", value: `${sessionSignals.tapCount}`, weight: "0.12", contribution: sessionAdjustment.tapContribution },
    { label: "Long Press", value: `${sessionSignals.longPressCount}`, weight: "0.18", contribution: sessionAdjustment.longPressContribution },
  ]
    .sort((a, b) => b.contribution - a.contribution)
    .filter((s) => s.contribution > 0)
    .slice(0, 4);

  /* ── Metrics ──────────────────────────────────────────────────────── */

  const signalVolume = totalDwell + totalClicks + totalRevisits + comparisonDepth + sessionSignals.tapCount + sessionSignals.longPressCount;
  const rankingSpread = Math.max(0, leader.score - runnerUp.score);
  const featureCoverage = topSignals.length;

  const metrics: ModelMetric[] = [
    { label: "Signal Volume", value: signalVolume.toFixed(1), detail: "Total interaction evidence ingested into the active ranking window." },
    { label: "Ranking Spread", value: rankingSpread.toFixed(2), detail: "Gap between the top-ranked option and the runner-up after scoring." },
    { label: "Feature Coverage", value: `${featureCoverage}/4`, detail: "How many distinct features are materially contributing right now." },
    // Inference Latency value is intentionally left as a placeholder ("—").
    // The real measured value is injected by the orchestrator via useEffect
    // to avoid an SSR/hydration mismatch from performance.now() in render.
    { label: "Inference Latency", value: "—", detail: "Measured execution time for state classification and ranking computation." },
  ];

  /* ── Pipeline Log ─────────────────────────────────────────────────── */

  const logs: PipelineLogEntry[] = [
    {
      stage: "Signal Ingest",
      summary: `${signalVolume.toFixed(1)} active behavioral units`,
      detail: `dwell=${formatSeconds(totalDwell)}, clicks=${totalClicks}, revisits=${totalRevisits}, scroll=${Math.round(sessionSignals.scrollDepth)}%, taps=${sessionSignals.tapCount}`,
    },
    {
      stage: "Feature Vector",
      summary: `${featureCoverage} weighted features above threshold`,
      detail: topSignals.length > 0
        ? topSignals.map((s) => `${s.label}:${s.contribution.toFixed(2)}`).join(" / ")
        : "No feature exceeded the active threshold yet.",
    },
    {
      stage: "State Inference",
      summary: `${bestState.state} @ ${confidence}% confidence`,
      detail: lowConfidence
        ? "Low-confidence inference; competing states remain close in the model output."
        : `Runner-up state is ${runnerUpState.state} with a ${separation.toFixed(2)} score gap.`,
    },
    {
      stage: "Ranking Output",
      summary: `${leader.name} moved to rank #1`,
      detail: `Top score ${leader.score.toFixed(2)} vs runner-up ${runnerUp.score.toFixed(2)}.`,
    },
  ];

  return {
    assessment: {
      state: bestState.state,
      confidence,
      rationale: bestState.rationale,
      lowConfidence,
      conflictSignals,
      topSignals,
      inferenceLatencyMs: 0,
    },
    metrics,
    logs,
  };
}
