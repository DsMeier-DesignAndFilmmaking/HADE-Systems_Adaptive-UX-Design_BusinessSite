"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  material: string;
}

interface ProductSignals {
  dwellTime: number;
  clicks: number;
  revisits: number;
  lastLeftAt: number | null;
}

interface SessionSignals {
  scrollDepth: number;
  timeOnPage: number;
  idleTime: number;
  tapCount: number;
  longPressCount: number;
}

interface PersistedSession {
  signalMap: SignalMap;
  comparedProductIds: string[];
  sessionSignals: SessionSignals;
  stateTimeline: StateTransition[];
}

type SignalMap = Record<string, ProductSignals>;
type RankDeltaMap = Record<string, number>;
type BehaviorState = "Browsing" | "Evaluating" | "Hesitating" | "Deciding";

interface RankedProduct extends Product {
  score: number;
  signals: ProductSignals;
  isCompared: boolean;
}

interface LeaderChangeSummary {
  id: string;
  headline: string;
  detail: string;
}

interface StateTransition {
  state: BehaviorState;
  timestamp: string;
}

interface StateAssessment {
  state: BehaviorState;
  confidence: number;
  rationale: string;
  lowConfidence: boolean;
  conflictSignals: string[];
  topSignals: Array<{
    label: string;
    value: string;
    weight: string;
    contribution: number;
  }>;
}

interface ModelMetric {
  label: string;
  value: string;
  detail: string;
}

interface PipelineLogEntry {
  stage: string;
  summary: string;
  detail: string;
}

interface MicroFeedbackEntry {
  id: string;
  message: string;
  tone: "neutral" | "positive" | "alert";
}

interface PseudoModelOutput {
  assessment: StateAssessment;
  metrics: ModelMetric[];
  logs: PipelineLogEntry[];
}

const GOLD = "#C4922A";
const STORAGE_KEY = "hade-ecommerce-session-v1";
const DWELL_WEIGHT = 0.5;
const CLICK_WEIGHT = 0.3;
const REVISIT_WEIGHT = 0.2;
const COMPARE_STACK_BONUS = 0.35;
const SCROLL_WEIGHT = 0.18;
const TIME_WEIGHT = 0.14;
const IDLE_WEIGHT = 0.16;
const TAP_WEIGHT = 0.12;
const LONG_PRESS_WEIGHT = 0.18;
const DWELL_INCREMENT = 0.2;
const DWELL_INTERVAL_MS = 200;
const RANKING_THROTTLE_MS = 700;
const LONG_PRESS_DELAY_MS = 350;

const PRODUCTS: Product[] = [
  { id: "jacket", name: "Merino Wool Jacket", category: "Outerwear", price: "$425", material: "100% Merino" },
  { id: "knit", name: "Cashmere Turtleneck", category: "Knitwear", price: "$295", material: "Grade-A Cashmere" },
  { id: "boots", name: "Chelsea Boots", category: "Footwear", price: "$510", material: "Full-Grain Leather" },
];

function createInitialSignalMap(): SignalMap {
  return PRODUCTS.reduce<SignalMap>((acc, product) => {
    acc[product.id] = {
      dwellTime: 0,
      clicks: 0,
      revisits: 0,
      lastLeftAt: null,
    };
    return acc;
  }, {});
}

function createInitialSessionSignals(): SessionSignals {
  return {
    scrollDepth: 0,
    timeOnPage: 0,
    idleTime: 0,
    tapCount: 0,
    longPressCount: 0,
  };
}

function sanitizeSignalMap(signalMap: unknown): SignalMap {
  const initial = createInitialSignalMap();
  if (!signalMap || typeof signalMap !== "object") return initial;

  for (const product of PRODUCTS) {
    const value = (signalMap as Record<string, Partial<ProductSignals>>)[product.id];
    if (!value) continue;

    initial[product.id] = {
      dwellTime: typeof value.dwellTime === "number" ? value.dwellTime : 0,
      clicks: typeof value.clicks === "number" ? value.clicks : 0,
      revisits: typeof value.revisits === "number" ? value.revisits : 0,
      lastLeftAt: typeof value.lastLeftAt === "number" ? value.lastLeftAt : null,
    };
  }

  return initial;
}

function sanitizeSessionSignals(sessionSignals: unknown): SessionSignals {
  const initial = createInitialSessionSignals();
  if (!sessionSignals || typeof sessionSignals !== "object") return initial;

  const value = sessionSignals as Partial<SessionSignals>;
  return {
    scrollDepth: typeof value.scrollDepth === "number" ? value.scrollDepth : 0,
    timeOnPage: typeof value.timeOnPage === "number" ? value.timeOnPage : 0,
    idleTime: typeof value.idleTime === "number" ? value.idleTime : 0,
    tapCount: typeof value.tapCount === "number" ? value.tapCount : 0,
    longPressCount: typeof value.longPressCount === "number" ? value.longPressCount : 0,
  };
}

function calculateSessionAdjustment(sessionSignals: SessionSignals) {
  return {
    scrollContribution: Number(((sessionSignals.scrollDepth / 100) * SCROLL_WEIGHT).toFixed(2)),
    timeContribution: Number((Math.min(sessionSignals.timeOnPage / 20, 1.5) * TIME_WEIGHT).toFixed(2)),
    idleContribution: Number((Math.min(sessionSignals.idleTime / 12, 1.5) * IDLE_WEIGHT).toFixed(2)),
    tapContribution: Number((sessionSignals.tapCount * TAP_WEIGHT).toFixed(2)),
    longPressContribution: Number((sessionSignals.longPressCount * LONG_PRESS_WEIGHT).toFixed(2)),
  };
}

function calculateProductScore(signal: ProductSignals, isCompared: boolean, sessionSignals: SessionSignals) {
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

function rankProducts(signalMap: SignalMap, comparedProductIds: string[], sessionSignals: SessionSignals): RankedProduct[] {
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

function formatSeconds(value: number) {
  return `${value.toFixed(1)}s`;
}

function buildLeaderChangeSummary(product: RankedProduct, sessionSignals: SessionSignals): LeaderChangeSummary {
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

function buildPseudoModelOutput(
  rankedProducts: RankedProduct[],
  comparedProductIds: string[],
  sessionSignals: SessionSignals
): PseudoModelOutput {
  const leader = rankedProducts[0];
  const totalDwell = rankedProducts.reduce((sum, product) => sum + product.signals.dwellTime, 0);
  const totalClicks = rankedProducts.reduce((sum, product) => sum + product.signals.clicks, 0);
  const totalRevisits = rankedProducts.reduce((sum, product) => sum + product.signals.revisits, 0);
  const comparisonDepth = comparedProductIds.length;
  const sessionAdjustment = calculateSessionAdjustment(sessionSignals);

  const dwellContribution = totalDwell * DWELL_WEIGHT;
  const clickContribution = totalClicks * CLICK_WEIGHT;
  const revisitContribution = totalRevisits * REVISIT_WEIGHT;
  const compareContribution = comparisonDepth > 0 ? comparisonDepth * COMPARE_STACK_BONUS : 0;

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
        sessionAdjustment.idleContribution * 1.2,
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

  const sortedStates = [...candidateStates].sort((a, b) => b.score - a.score);
  const bestState = sortedStates[0];
  const runnerUp = sortedStates[1];
  const totalStateScore = candidateStates.reduce((sum, candidate) => sum + candidate.score, 0);
  const confidenceBase = totalStateScore > 0 ? bestState.score / totalStateScore : 0;
  const separation = Math.max(0, bestState.score - runnerUp.score);
  const confidence = Math.min(96, Math.max(34, Math.round(confidenceBase * 100 + separation * 18)));
  const lowConfidence = confidence < 64;
  const conflictSignals = [
    totalClicks > 0 && totalRevisits > 0 && bestState.state === "Deciding"
      ? "Clicks imply commitment while revisits still indicate unresolved hesitation."
      : null,
    sessionSignals.idleTime > 6 && totalDwell > 2
      ? "Long idle periods are offsetting otherwise strong attention signals."
      : null,
    comparisonDepth > 1 && leader.score - runnerUp.score < 0.35
      ? "Top-ranked products remain tightly clustered, so ranking certainty is still low."
      : null,
  ].filter(Boolean) as string[];

  const topSignals = [
    {
      label: "Dwell Time",
      value: formatSeconds(totalDwell),
      weight: "0.5",
      contribution: dwellContribution,
    },
    {
      label: "Clicks",
      value: `${totalClicks}`,
      weight: "0.3",
      contribution: clickContribution,
    },
    {
      label: "Revisits",
      value: `${totalRevisits}`,
      weight: "0.2",
      contribution: revisitContribution,
    },
    {
      label: "Comparison Stack",
      value: `${comparisonDepth}`,
      weight: "+0.35",
      contribution: compareContribution,
    },
    {
      label: "Scroll Depth",
      value: `${Math.round(sessionSignals.scrollDepth)}%`,
      weight: "0.18",
      contribution: sessionAdjustment.scrollContribution,
    },
    {
      label: "Time on Page",
      value: formatSeconds(sessionSignals.timeOnPage),
      weight: "0.14",
      contribution: sessionAdjustment.timeContribution,
    },
    {
      label: "Idle Time",
      value: formatSeconds(sessionSignals.idleTime),
      weight: "0.16",
      contribution: sessionAdjustment.idleContribution,
    },
    {
      label: "Tap Frequency",
      value: `${sessionSignals.tapCount}`,
      weight: "0.12",
      contribution: sessionAdjustment.tapContribution,
    },
    {
      label: "Long Press",
      value: `${sessionSignals.longPressCount}`,
      weight: "0.18",
      contribution: sessionAdjustment.longPressContribution,
    },
  ]
    .sort((a, b) => b.contribution - a.contribution)
    .filter((signal) => signal.contribution > 0)
    .slice(0, 4);

  const signalVolume = totalDwell + totalClicks + totalRevisits + comparisonDepth + sessionSignals.tapCount + sessionSignals.longPressCount;
  const rankingSpread = Math.max(0, leader.score - runnerUp.score);
  const featureCoverage = topSignals.length;
  const pipelineLatency = Math.round(
    24 +
      topSignals.length * 7 +
      signalVolume * 4 +
      Math.max(0, sessionSignals.scrollDepth / 25) +
      Math.max(0, sessionSignals.idleTime / 2)
  );

  const metrics: ModelMetric[] = [
    {
      label: "Signal Volume",
      value: signalVolume.toFixed(1),
      detail: "Total interaction evidence ingested into the active ranking window.",
    },
    {
      label: "Ranking Spread",
      value: rankingSpread.toFixed(2),
      detail: "Gap between the top-ranked option and the runner-up after scoring.",
    },
    {
      label: "Feature Coverage",
      value: `${featureCoverage}/4`,
      detail: "How many distinct features are materially contributing right now.",
    },
    {
      label: "Inference Latency",
      value: `${pipelineLatency}ms`,
      detail: "Computed pseudo-inference time based on active feature volume and session complexity.",
    },
  ];

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
        ? topSignals.map((signal) => `${signal.label}:${signal.contribution.toFixed(2)}`).join(" / ")
        : "No feature exceeded the active threshold yet.",
    },
    {
      stage: "State Inference",
      summary: `${bestState.state} @ ${confidence}% confidence`,
      detail: lowConfidence
        ? "Low-confidence inference; competing states remain close in the model output."
        : `Runner-up state is ${runnerUp.state} with a ${separation.toFixed(2)} score gap.`,
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
    },
    metrics,
    logs,
  };
}

function formatTransitionTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildDynamicNarrative(
  assessment: StateAssessment,
  comparedProductIds: string[],
  sessionSignals: SessionSignals
) {
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

function getBehaviorShiftStep(state: BehaviorState) {
  if (state === "Browsing") return 0;
  if (state === "Evaluating" || state === "Hesitating") return 1;
  return 2;
}

function buildCauseEffectMessage(
  assessment: StateAssessment,
  leader: RankedProduct,
  leaderChangeSummary: LeaderChangeSummary
) {
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

export default function HadeEcommerceEngine() {
  const [signalMap, setSignalMap] = useState<SignalMap>(createInitialSignalMap);
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [sessionSignals, setSessionSignals] = useState<SessionSignals>(createInitialSessionSignals);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [displayedRankedProducts, setDisplayedRankedProducts] = useState<RankedProduct[]>(() =>
    rankProducts(createInitialSignalMap(), [], createInitialSessionSignals())
  );
  const [rankChangeIds, setRankChangeIds] = useState<string[]>([]);
  const [rankDeltaMap, setRankDeltaMap] = useState<RankDeltaMap>({});
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false);
  const [stateTimeline, setStateTimeline] = useState<StateTransition[]>([]);
  const [leaderChangeSummary, setLeaderChangeSummary] = useState<LeaderChangeSummary>(() =>
    buildLeaderChangeSummary(rankProducts(createInitialSignalMap(), [], createInitialSessionSignals())[0], createInitialSessionSignals())
  );
  const [microFeedback, setMicroFeedback] = useState<MicroFeedbackEntry[]>([]);

  const dwellIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rankingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rankHighlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeHoverIdRef = useRef<string | null>(null);
  const isLongPressActiveRef = useRef(false);
  const shouldIgnoreClickRef = useRef(false);
  const hasHydratedRef = useRef(false);
  const lastActivityAtRef = useRef(Date.now());
  const stateRef = useRef<BehaviorState>("Browsing");
  const confidenceRef = useRef(34);
  const comparedCountRef = useRef(0);
  const leaderIdRef = useRef<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const liveRankedProducts = rankProducts(signalMap, comparedProductIds, sessionSignals);
  const totalRevisits = Object.values(signalMap).reduce((sum, signal) => sum + signal.revisits, 0);
  const totalSignalScore = liveRankedProducts.reduce((sum, product) => sum + product.score, 0);
  const leader = displayedRankedProducts[0];
  const modelOutput = buildPseudoModelOutput(liveRankedProducts, comparedProductIds, sessionSignals);
  const liveStateAssessment = modelOutput.assessment;
  const dynamicNarrative = buildDynamicNarrative(liveStateAssessment, comparedProductIds, sessionSignals);
  const causeEffectMessage = buildCauseEffectMessage(liveStateAssessment, leader, leaderChangeSummary);
  const behaviorShiftLabels = ["Exploration", "Comparison", "Decision"];

  const pushMicroFeedback = (message: string, tone: MicroFeedbackEntry["tone"] = "neutral") => {
    setMicroFeedback((prev) => [{ id: `${Date.now()}-${message}`, message, tone }, ...prev].slice(0, 4));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        hasHydratedRef.current = true;
        return;
      }

      const persisted = JSON.parse(raw) as Partial<PersistedSession>;
      const nextSignalMap = sanitizeSignalMap(persisted.signalMap);
      const nextCompared = Array.isArray(persisted.comparedProductIds)
        ? persisted.comparedProductIds.filter((id): id is string => typeof id === "string")
        : [];
      const nextSessionSignals = sanitizeSessionSignals(persisted.sessionSignals);
      const nextRankedProducts = rankProducts(nextSignalMap, nextCompared, nextSessionSignals);

      setSignalMap(nextSignalMap);
      setComparedProductIds(nextCompared);
      setSessionSignals(nextSessionSignals);
      setDisplayedRankedProducts(nextRankedProducts);
      setLeaderChangeSummary(buildLeaderChangeSummary(nextRankedProducts[0], nextSessionSignals));
      leaderIdRef.current = nextRankedProducts[0]?.id ?? null;

      if (Array.isArray(persisted.stateTimeline)) {
        setStateTimeline(
          persisted.stateTimeline.filter(
            (item): item is StateTransition =>
              !!item &&
              typeof item === "object" &&
              typeof item.state === "string" &&
              typeof item.timestamp === "string"
          )
        );
      }
    } catch {
      setSignalMap(createInitialSignalMap());
      setComparedProductIds([]);
      setSessionSignals(createInitialSessionSignals());
    } finally {
      hasHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current || typeof window === "undefined") return;

    const payload: PersistedSession = {
      signalMap,
      comparedProductIds,
      sessionSignals,
      stateTimeline,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [signalMap, comparedProductIds, sessionSignals, stateTimeline]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      const now = Date.now();
      const idleSeconds = Math.max(0, (now - lastActivityAtRef.current) / 1000);

      setSessionSignals((prev) => ({
        ...prev,
        timeOnPage: Number((prev.timeOnPage + 1).toFixed(1)),
        idleTime: Number(idleSeconds.toFixed(1)),
      }));
    }, 1000);

    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const markActivity = () => {
      lastActivityAtRef.current = Date.now();
    };

    const updateScrollDepth = () => {
      const scrollHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollDepth = Math.min(100, (window.scrollY / scrollHeight) * 100);

      setSessionSignals((prev) => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, Number(scrollDepth.toFixed(1))),
      }));
    };

    const handleScroll = () => {
      markActivity();
      updateScrollDepth();
    };

    const handleActivity = () => {
      markActivity();
      setSessionSignals((prev) => ({
        ...prev,
        idleTime: 0,
      }));
    };

    updateScrollDepth();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, []);

  useEffect(() => {
    if (rankingTimeoutRef.current) {
      clearTimeout(rankingTimeoutRef.current);
    }

    if (totalSignalScore <= 0) {
      setDisplayedRankedProducts(liveRankedProducts);
      setIsProcessingUpdate(false);
      return;
    }

    setIsProcessingUpdate(true);

    rankingTimeoutRef.current = setTimeout(() => {
      setDisplayedRankedProducts((previous) => {
        const previousPositions = new Map(previous.map((product, index) => [product.id, index]));
        const changedIds = liveRankedProducts
          .filter((product, index) => previousPositions.get(product.id) !== index)
          .map((product) => product.id);
        const nextRankDeltaMap = liveRankedProducts.reduce<RankDeltaMap>((acc, product, index) => {
          const previousIndex = previousPositions.get(product.id);
          acc[product.id] = previousIndex === undefined ? 0 : previousIndex - index;
          return acc;
        }, {});

        setRankChangeIds(changedIds);
        setRankDeltaMap(nextRankDeltaMap);
        setLeaderChangeSummary(buildLeaderChangeSummary(liveRankedProducts[0], sessionSignals));

        const nextLeader = liveRankedProducts[0];
        if (leaderIdRef.current && leaderIdRef.current !== nextLeader.id) {
          pushMicroFeedback(`${nextLeader.name} moved into rank #1 after the latest signal update.`, "positive");
        } else if (changedIds.length > 0) {
          pushMicroFeedback("Ranking updated to reflect the latest behavioral evidence.", "neutral");
        }
        leaderIdRef.current = nextLeader.id;

        if (rankHighlightTimeoutRef.current) {
          clearTimeout(rankHighlightTimeoutRef.current);
        }

        rankHighlightTimeoutRef.current = setTimeout(() => {
          setRankChangeIds([]);
        }, 1100);

        return liveRankedProducts;
      });

      setIsProcessingUpdate(false);
    }, RANKING_THROTTLE_MS);

    return () => {
      if (rankingTimeoutRef.current) {
        clearTimeout(rankingTimeoutRef.current);
      }
    };
  }, [liveRankedProducts, sessionSignals, totalSignalScore]);

  useEffect(() => {
    if (stateRef.current === liveStateAssessment.state) return;

    const previousState = stateRef.current;
    stateRef.current = liveStateAssessment.state;
    setStateTimeline((prev) => {
      const next = [
        ...prev,
        {
          state: liveStateAssessment.state,
          timestamp: formatTransitionTime(new Date()),
        },
      ];
      return next.slice(-4);
    });
    pushMicroFeedback(`Behavior shifted from ${previousState} to ${liveStateAssessment.state}.`, "positive");
  }, [liveStateAssessment.state]);

  useEffect(() => {
    const confidenceDelta = liveStateAssessment.confidence - confidenceRef.current;

    if (Math.abs(confidenceDelta) >= 6) {
      pushMicroFeedback(
        confidenceDelta > 0
          ? `Model confidence increased to ${liveStateAssessment.confidence}% as signals became more consistent.`
          : `Model confidence eased to ${liveStateAssessment.confidence}% as competing signals entered the session.`,
        confidenceDelta > 0 ? "positive" : "alert"
      );
    }

    confidenceRef.current = liveStateAssessment.confidence;
  }, [liveStateAssessment.confidence]);

  useEffect(() => {
    if (comparedProductIds.length > comparedCountRef.current) {
      pushMicroFeedback(
        `Comparison stack expanded to ${comparedProductIds.length} item${comparedProductIds.length === 1 ? "" : "s"}, deepening evaluation.`,
        "neutral"
      );
    }

    comparedCountRef.current = comparedProductIds.length;
  }, [comparedProductIds]);

  useEffect(() => {
    return () => {
      if (dwellIntervalRef.current) clearInterval(dwellIntervalRef.current);
      if (rankingTimeoutRef.current) clearTimeout(rankingTimeoutRef.current);
      if (rankHighlightTimeoutRef.current) clearTimeout(rankHighlightTimeoutRef.current);
      if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    };
  }, []);

  const startDwell = (id: string) => {
    if (dwellIntervalRef.current) {
      clearInterval(dwellIntervalRef.current);
      dwellIntervalRef.current = null;
    }

    activeHoverIdRef.current = id;
    setHoveredId(id);

    setSignalMap((prev) => {
      const next = { ...prev };
      const current = next[id];
      next[id] = {
        ...current,
        revisits: current.lastLeftAt !== null ? current.revisits + 1 : current.revisits,
      };
      return next;
    });

    dwellIntervalRef.current = setInterval(() => {
      setSignalMap((prev) => {
        const next = { ...prev };
        next[id] = {
          ...next[id],
          dwellTime: Number((next[id].dwellTime + DWELL_INCREMENT).toFixed(1)),
        };
        return next;
      });
    }, DWELL_INTERVAL_MS);
  };

  const stopDwell = (id: string) => {
    if (activeHoverIdRef.current === id) {
      activeHoverIdRef.current = null;
    }

    setHoveredId((prev) => (prev === id ? null : prev));

    if (dwellIntervalRef.current) {
      clearInterval(dwellIntervalRef.current);
      dwellIntervalRef.current = null;
    }

    setSignalMap((prev) => {
      const next = { ...prev };
      next[id] = {
        ...next[id],
        lastLeftAt: Date.now(),
      };
      return next;
    });
  };

  const handleClick = (id: string) => {
    if (shouldIgnoreClickRef.current) {
      shouldIgnoreClickRef.current = false;
      return;
    }

    lastActivityAtRef.current = Date.now();
    setClickedId(id);

    setSignalMap((prev) => {
      const next = { ...prev };
      next[id] = {
        ...next[id],
        clicks: next[id].clicks + 1,
      };
      return next;
    });

    setComparedProductIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setTimeout(() => setClickedId(null), 300);
  };

  const handleTouchStart = (id: string) => {
    lastActivityAtRef.current = Date.now();
    setSessionSignals((prev) => ({
      ...prev,
      tapCount: prev.tapCount + 1,
      idleTime: 0,
    }));

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    isLongPressActiveRef.current = false;
    longPressTimeoutRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      shouldIgnoreClickRef.current = true;
      setSessionSignals((prev) => ({
        ...prev,
        longPressCount: prev.longPressCount + 1,
      }));
      startDwell(id);
    }, LONG_PRESS_DELAY_MS);
  };

  const handleTouchEnd = (id: string) => {
    lastActivityAtRef.current = Date.now();

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    if (isLongPressActiveRef.current) {
      stopDwell(id);
      isLongPressActiveRef.current = false;
      return;
    }

    handleClick(id);
  };

  const restart = () => {
    if (dwellIntervalRef.current) clearInterval(dwellIntervalRef.current);
    if (rankingTimeoutRef.current) clearTimeout(rankingTimeoutRef.current);
    if (rankHighlightTimeoutRef.current) clearTimeout(rankHighlightTimeoutRef.current);
    if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);

    const initialSignalMap = createInitialSignalMap();
    const initialSessionSignals = createInitialSessionSignals();
    const initialRankedProducts = rankProducts(initialSignalMap, [], initialSessionSignals);

    setSignalMap(initialSignalMap);
    setComparedProductIds([]);
    setSessionSignals(initialSessionSignals);
    setHoveredId(null);
    setClickedId(null);
    setRankChangeIds([]);
    setRankDeltaMap({});
    setStateTimeline([]);
    setIsProcessingUpdate(false);
    setDisplayedRankedProducts(initialRankedProducts);
    setLeaderChangeSummary(buildLeaderChangeSummary(initialRankedProducts[0], initialSessionSignals));
    setMicroFeedback([]);
    stateRef.current = "Browsing";
    confidenceRef.current = 34;
    comparedCountRef.current = 0;
    leaderIdRef.current = initialRankedProducts[0]?.id ?? null;
    lastActivityAtRef.current = Date.now();

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const stateTone = {
    Browsing: "rgba(59,130,246,0.14)",
    Evaluating: "rgba(245,158,11,0.14)",
    Hesitating: "rgba(239,68,68,0.14)",
    Deciding: "rgba(34,197,94,0.14)",
  }[liveStateAssessment.state];

  return (
    <section ref={sectionRef} className="w-full py-6">
      <div className="mb-4 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-green-700">
            System Active - Monitoring Behavioral Signals
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-ink/5 bg-ink/[0.02] px-5 py-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold text-ink/50">i</div>
          <p className="text-[11px] font-medium tracking-tight text-ink/40">
            <strong>Live Behavioral Model (Persistent Signals)</strong> / Real-Time Signal Processing Layer
          </p>
        </div>
      </div>

      <motion.div
        layout
        className="relative flex min-h-[620px] flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.10)] md:p-10"
        animate={{ boxShadow: `0 32px 64px -16px ${stateTone}` }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
                Continuous Adaptation
              </span>
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-ink">Live Signal Feed</h3>
            <p className="mt-1 text-sm text-ink/45">
              Hover builds dwell, long press simulates mobile dwell, taps track touch frequency, and session telemetry persists across reloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: isProcessingUpdate ? GOLD : "#16a34a" }} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                {isProcessingUpdate ? "Updating Ranked Output" : "Adaptive Ranking Stable"}
              </p>
            </div>

            <button
              onClick={restart}
              className="rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/55 transition hover:border-ink/20 hover:text-ink/75"
            >
              Restart Signals
            </button>
          </div>
        </div>

        <motion.div
          key={`${liveStateAssessment.state}-${comparedProductIds.length}-${Math.floor(sessionSignals.idleTime)}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mb-6 rounded-2xl border px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.72)",
            borderColor: "rgba(11,13,18,0.08)",
          }}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">Live Narrative</p>
          <p className="mt-1 text-sm font-medium text-ink/62">{dynamicNarrative}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-ink/50">{causeEffectMessage}</p>
        </motion.div>

        <div className="mb-6 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <div
            className="rounded-2xl border px-4 py-3"
            style={{ background: "rgba(255,255,255,0.72)", borderColor: "rgba(11,13,18,0.08)" }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">Behavioral Shift</p>
            <div className="mt-3 flex items-center gap-2">
              {behaviorShiftLabels.map((label, index) => {
                const currentStep = getBehaviorShiftStep(liveStateAssessment.state);
                const isActive = index === currentStep;
                const isComplete = index < currentStep;

                return (
                  <div key={label} className="flex flex-1 items-center gap-2">
                    <div
                      className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em]"
                      style={{
                        borderColor: isActive || isComplete ? "rgba(196,146,42,0.35)" : "rgba(11,13,18,0.08)",
                        background: isActive ? "rgba(196,146,42,0.10)" : isComplete ? "rgba(196,146,42,0.05)" : "rgba(255,255,255,0.7)",
                        color: isActive || isComplete ? "rgba(120,86,20,0.92)" : "rgba(11,13,18,0.46)",
                      }}
                    >
                      {label}
                    </div>
                    {index < behaviorShiftLabels.length - 1 && <span className="text-[10px] text-ink/28">→</span>}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink/50">
              The session is currently in <span className="font-semibold text-ink/70">{liveStateAssessment.state}</span>, so the model is emphasizing{" "}
              {liveStateAssessment.state === "Browsing"
                ? "broad exploration signals."
                : liveStateAssessment.state === "Evaluating"
                ? "comparisons and repeated attention."
                : liveStateAssessment.state === "Hesitating"
                ? "friction and revisit behavior."
                : "commitment-focused signals and a widening score gap."}
            </p>
          </div>

          <div
            className="rounded-2xl border px-4 py-3"
            style={{ background: "rgba(255,255,255,0.72)", borderColor: "rgba(11,13,18,0.08)" }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">Adaptive Feedback</p>
            <div className="mt-3 space-y-2">
              {microFeedback.length > 0 ? (
                microFeedback.map((entry) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border px-3 py-2.5"
                    style={{
                      background:
                        entry.tone === "positive"
                          ? "rgba(34,197,94,0.06)"
                          : entry.tone === "alert"
                          ? "rgba(245,158,11,0.08)"
                          : "rgba(255,255,255,0.68)",
                      borderColor:
                        entry.tone === "positive"
                          ? "rgba(34,197,94,0.16)"
                          : entry.tone === "alert"
                          ? "rgba(245,158,11,0.18)"
                          : "rgba(11,13,18,0.08)",
                    }}
                  >
                    <p className="text-[11px] leading-relaxed text-ink/62">{entry.message}</p>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-xl border border-ink/6 bg-white/60 px-3 py-2.5">
                  <p className="text-[11px] leading-relaxed text-ink/45">
                    Micro-feedback will appear as the system interprets new activity and shifts ranking.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 grid gap-5 md:grid-cols-[1fr_300px]">
          <motion.div layout className="flex flex-col gap-3">
            {displayedRankedProducts.map((product, index) => {
              const isHovered = hoveredId === product.id;
              const isClicked = clickedId === product.id;
              const isCompared = product.isCompared;
              const isLeader = index === 0 && product.score > 0;
              const rankChanged = rankChangeIds.includes(product.id);
              const isRising = (rankDeltaMap[product.id] ?? 0) > 0;
              const isTrending =
                product.score > 0.55 || product.signals.clicks > 0 || product.signals.revisits > 0 || sessionSignals.tapCount > 0;

              return (
                <motion.div
                  key={product.id}
                  layout
                  animate={isClicked ? { scale: 0.985 } : { scale: 1 }}
                  transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }, duration: 0.18 }}
                  onMouseEnter={() => startDwell(product.id)}
                  onMouseLeave={() => stopDwell(product.id)}
                  onTouchStart={() => handleTouchStart(product.id)}
                  onTouchEnd={() => handleTouchEnd(product.id)}
                  onTouchCancel={() => handleTouchEnd(product.id)}
                  onClick={() => handleClick(product.id)}
                  className="relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-4 transition-colors select-none touch-manipulation"
                  style={{
                    borderColor: isLeader
                      ? GOLD
                      : rankChanged
                      ? "rgba(196,146,42,0.45)"
                      : isCompared
                      ? "rgba(196,146,42,0.28)"
                      : isHovered
                      ? "rgba(196,146,42,0.32)"
                      : "rgba(11,13,18,0.08)",
                    boxShadow: rankChanged
                      ? "0 14px 30px rgba(196,146,42,0.18)"
                      : isHovered
                      ? "0 8px 24px rgba(196,146,42,0.10)"
                      : "none",
                    background: isLeader
                      ? "rgba(196,146,42,0.05)"
                      : isCompared
                      ? "rgba(196,146,42,0.03)"
                      : "rgba(255,255,255,0.92)",
                  }}
                >
                  <AnimatePresence>
                    {rankChanged && (
                      <motion.div
                        initial={{ opacity: 0.45 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="pointer-events-none absolute inset-0"
                        style={{ background: "rgba(196,146,42,0.14)" }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
                          style={{
                            background: isLeader ? "rgba(196,146,42,0.12)" : "rgba(11,13,18,0.04)",
                            color: isLeader ? GOLD : "rgba(11,13,18,0.5)",
                          }}
                        >
                          Rank {index + 1}
                        </span>
                        {isRising && (
                          <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-green-700">
                            Rising
                          </span>
                        )}
                        {isTrending && !isLeader && (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-700">
                            Trending
                          </span>
                        )}
                        {isLeader && (
                          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-700">
                            Based on your behavior
                          </span>
                        )}
                        {rankChanged && (
                          <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-green-700">
                            Ranking Shift
                          </span>
                        )}
                      </div>
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD, opacity: 0.7 }}>
                        {product.category}
                      </p>
                      <p className="text-sm font-semibold leading-snug text-ink">{product.name}</p>
                      <p className="mt-0.5 text-xs text-ink/40">{product.material}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-ink/8 bg-ink/[0.03] px-2.5 py-1 text-[10px] font-mono text-ink/55">
                          dwell {formatSeconds(product.signals.dwellTime)}
                        </span>
                        <span className="rounded-full border border-ink/8 bg-ink/[0.03] px-2.5 py-1 text-[10px] font-mono text-ink/55">
                          clicks {product.signals.clicks}
                        </span>
                        <span className="rounded-full border border-ink/8 bg-ink/[0.03] px-2.5 py-1 text-[10px] font-mono text-ink/55">
                          revisits {product.signals.revisits}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-base font-bold text-ink">{product.price}</p>
                      <motion.p
                        key={`${product.id}-${product.score}`}
                        initial={{ opacity: 0.35 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-[10px] font-mono"
                        style={{ color: product.score > 0 ? GOLD : "rgba(11,13,18,0.25)" }}
                      >
                        score {product.score.toFixed(2)}
                      </motion.p>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                          className="h-full rounded-full origin-left"
                          style={{ background: GOLD, opacity: 0.5 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="flex flex-col gap-4">
            <motion.div
              layout
              className="rounded-2xl p-5"
              style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
            >
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Detected State</p>

              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(11,13,18,0.06)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD, opacity: 0.7 }}>
                      Behavioral Classification
                    </p>
                    <h4 className="text-lg font-bold tracking-tight text-ink">{liveStateAssessment.state}</h4>
                    <p className="mt-1 text-xs text-ink/45">{liveStateAssessment.rationale}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-ink/40">confidence</p>
                    <p className="text-base font-bold" style={{ color: GOLD }}>
                      {liveStateAssessment.confidence}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-[4px] w-full overflow-hidden rounded-full bg-ink/[0.06]">
                  <motion.div
                    animate={{ width: `${liveStateAssessment.confidence}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: GOLD }}
                  />
                </div>

                  <p className="mt-3 text-[11px] font-medium text-ink/55">
                    {liveStateAssessment.state} detected - {liveStateAssessment.confidence}% confidence
                  </p>
                  {liveStateAssessment.lowConfidence && (
                    <p className="mt-2 rounded-lg bg-red-500/8 px-2.5 py-2 text-[11px] font-medium text-red-700">
                      Low confidence state. The model is still reconciling competing behavioral evidence.
                    </p>
                  )}
                  {liveStateAssessment.conflictSignals.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {liveStateAssessment.conflictSignals.map((conflict) => (
                        <p
                          key={conflict}
                          className="rounded-lg bg-amber-500/10 px-2.5 py-2 text-[11px] font-medium text-amber-800"
                        >
                          Conflicting signals: {conflict}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                layout
              className="rounded-2xl p-5"
              style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
            >
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">State Transitions</p>
              <div className="space-y-2">
                {stateTimeline.length > 0 ? (
                  stateTimeline.map((item) => (
                    <div key={`${item.state}-${item.timestamp}`} className="rounded-xl border border-ink/6 bg-white/60 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-medium text-ink/68">{item.state}</p>
                        <span className="text-[10px] font-mono text-ink/38">{item.timestamp}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-ink/6 bg-white/60 px-3 py-3">
                    <p className="text-[11px] text-ink/45">State transitions will appear as the session evolves.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              layout
              className="rounded-2xl p-5"
              style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
            >
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Model Metrics</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {modelOutput.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-ink/6 bg-white/60 px-3 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/35">{metric.label}</p>
                    <p className="mt-1 text-sm font-semibold text-ink/75">{metric.value}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-ink/45">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              layout
              className="rounded-2xl p-5"
              style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
            >
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">System Log</p>
              <div className="space-y-2">
                {modelOutput.logs.map((entry) => (
                  <div key={entry.stage} className="rounded-xl border border-ink/6 bg-white/60 px-3 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">{entry.stage}</p>
                      <span className="text-[10px] font-mono text-ink/35">live</span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-ink/72">{entry.summary}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-ink/45">{entry.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              layout
              className="rounded-2xl p-5"
              style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
            >
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Reasoning Trace</p>

              <div className="space-y-2">
                {liveStateAssessment.topSignals.map((signal) => (
                  <div key={signal.label} className="rounded-xl border border-ink/6 bg-white/60 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-medium text-ink/68">{signal.label}</p>
                      <span className="text-[11px] font-mono font-semibold" style={{ color: GOLD }}>
                        {signal.contribution.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-mono text-ink/42">
                      {signal.value} x weight {signal.weight}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              layout
              className="rounded-2xl p-5"
              style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
            >
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Adaptive Output</p>

              <motion.div
                key={leader.id}
                layout
                initial={{ opacity: 0.75, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl p-4"
                style={{ background: "rgba(196,146,42,0.08)", border: "1px solid rgba(196,146,42,0.20)" }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD, opacity: 0.7 }}>
                    {leader.category}
                  </p>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-700">
                    Based on your behavior
                  </span>
                  {rankChangeIds.includes(leader.id) && (
                    <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-green-700">
                      Rising
                    </span>
                  )}
                </div>
                <h4 className="text-xl font-bold tracking-tight text-ink">{leader.name}</h4>
                <p className="mt-1 text-xs text-ink/45">{leader.material}</p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <p className="text-lg font-bold text-ink">{leader.price}</p>
                  <p className="text-[10px] font-mono text-ink/40">{leader.score.toFixed(2)} weighted score</p>
                </div>
                <div className="mt-4 rounded-xl border border-ink/6 bg-white/72 px-3 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">
                    {leaderChangeSummary.headline}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-ink/58">{leaderChangeSummary.detail}</p>
                </div>
              </motion.div>
            </motion.div>

            <div className="rounded-2xl p-5" style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}>
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Session State</p>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/32">Continuous Tracking</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
                      scroll {Math.round(sessionSignals.scrollDepth)}%
                    </span>
                    <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
                      page {formatSeconds(sessionSignals.timeOnPage)}
                    </span>
                    <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
                      idle {formatSeconds(sessionSignals.idleTime)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/32">Touch Interactions</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
                      taps {sessionSignals.tapCount}
                    </span>
                    <span className="rounded-full border border-ink/8 bg-white/75 px-2.5 py-1 text-[10px] font-mono text-ink/55">
                      long press {sessionSignals.longPressCount}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/32">Persistence</p>
                  <p className="text-sm font-semibold text-ink/55">Signals are stored locally and restored on reload.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
