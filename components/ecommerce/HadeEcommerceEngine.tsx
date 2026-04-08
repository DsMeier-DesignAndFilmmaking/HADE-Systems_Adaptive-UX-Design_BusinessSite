"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Engine Modules ────────────────────────────────────────────────── */
import type {
  BehaviorState,
  LeaderChangeSummary,
  MicroFeedbackEntry,
  PersistedSession,
  RankDeltaMap,
  RankedProduct,
  SessionSignals,
  SignalMap,
  StateTransition,
} from "./engine/types";
import {
  DWELL_INCREMENT,
  DWELL_INTERVAL_MS,
  GOLD,
  LONG_PRESS_DELAY_MS,
  RANKING_THROTTLE_MS,
  STORAGE_KEY,
} from "./engine/config";
import { rankProducts, applyRankingStability } from "./engine/scoring";
import { buildPseudoModelOutput } from "./engine/state-classifier";
import {
  applySignalDecay,
  createInitialSessionSignals,
  createInitialSignalMap,
  sanitizeSessionSignals,
  sanitizeSignalMap,
} from "./engine/signals";
import {
  buildCauseEffectMessage,
  buildDynamicNarrative,
  buildLeaderChangeSummary,
  formatTransitionTime,
} from "./engine/narrative";

/* ─── UI Panels ─────────────────────────────────────────────────────── */
import ProductCard from "./engine/panels/ProductCard";
import DetectedStatePanel from "./engine/panels/DetectedStatePanel";
import LiveNarrative from "./engine/panels/LiveNarrative";
import BehaviorShiftTracker from "./engine/panels/BehaviorShiftTracker";
import AdaptiveFeedbackLog from "./engine/panels/AdaptiveFeedbackLog";
import StateTimelinePanel from "./engine/panels/StateTimelinePanel";
import ModelMetricsPanel from "./engine/panels/ModelMetricsPanel";
import SystemLogPanel from "./engine/panels/SystemLogPanel";
import ReasoningTracePanel from "./engine/panels/ReasoningTracePanel";
import AdaptiveOutputPanel from "./engine/panels/AdaptiveOutputPanel";
import SessionStatePanel from "./engine/panels/SessionStatePanel";

/* ─── Orchestrator ──────────────────────────────────────────────────── */

export default function HadeEcommerceEngine() {
  /* ── State ────────────────────────────────────────────────────────── */
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
  // Delayed visible status prevents rapid text flicker on the status tag
  const [visibleStatus, setVisibleStatus] = useState(false);
  const statusDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stateTimeline, setStateTimeline] = useState<StateTransition[]>([]);
  const [leaderChangeSummary, setLeaderChangeSummary] = useState<LeaderChangeSummary>(() =>
    buildLeaderChangeSummary(
      rankProducts(createInitialSignalMap(), [], createInitialSessionSignals())[0],
      createInitialSessionSignals()
    )
  );
  const [microFeedback, setMicroFeedback] = useState<MicroFeedbackEntry[]>([]);
  // "—" on SSR/hydration; replaced with a real measurement client-side via useEffect
  const [inferenceLatencyDisplay, setInferenceLatencyDisplay] = useState("—");

  // ── Human-in-the-loop approval gate ─────────────────────────────────
  const [approvedData, setApprovedData] = useState(() => {
    const r = rankProducts(createInitialSignalMap(), [], createInitialSessionSignals());
    const a = buildPseudoModelOutput(r, [], createInitialSessionSignals()).assessment;
    const lcs = buildLeaderChangeSummary(r[0], createInitialSessionSignals());
    return {
      stateKey: `${a.state}-0`,
      narrative: buildDynamicNarrative(a, [], createInitialSessionSignals()),
      causeEffect: buildCauseEffectMessage(a, r[0], lcs),
    };
  });
  const [pendingData, setPendingData] = useState<{
    stateKey: string;
    narrative: string;
    causeEffect: string;
  } | null>(null);
  const [hasPendingInsight, setHasPendingInsight] = useState(false);

  /* ── Refs ──────────────────────────────────────────────────────────── */
  const dwellIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rankingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rankHighlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeHoverIdRef = useRef<string | null>(null);
  const isLongPressActiveRef = useRef(false);
  const shouldIgnoreClickRef = useRef(false);
  const hasHydratedRef = useRef(false);
  const lastActivityAtRef = useRef(Date.now());
  const lastDecayAtRef = useRef(Date.now());
  const stateRef = useRef<BehaviorState>("Browsing");
  const confidenceRef = useRef(34);
  const comparedCountRef = useRef(0);
  const leaderIdRef = useRef<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const approvedStateKeyRef = useRef("Browsing-0");

  /* ── Derived Values ───────────────────────────────────────────────── */
  const leader = displayedRankedProducts[0];
  const modelOutput = buildPseudoModelOutput(displayedRankedProducts, comparedProductIds, sessionSignals);
  const liveStateAssessment = modelOutput.assessment;
  const dynamicNarrative = buildDynamicNarrative(liveStateAssessment, comparedProductIds, sessionSignals);
  const causeEffectMessage = buildCauseEffectMessage(liveStateAssessment, leader, leaderChangeSummary);

  /* ── Effect: Measure inference latency client-side only ──────────── */
  // performance.now() during render causes an SSR/hydration mismatch.
  // Instead, time a dry call here (post-mount, client-only) and display it.
  useEffect(() => {
    const t0 = performance.now();
    buildPseudoModelOutput(displayedRankedProducts, comparedProductIds, sessionSignals);
    const elapsed = performance.now() - t0;
    setInferenceLatencyDisplay(`${Math.round(elapsed * 100) / 100}ms`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedRankedProducts, comparedProductIds, sessionSignals]);

  /* ── Effect: Delayed status tag to prevent rapid flicker ─────────── */
  useEffect(() => {
    if (statusDelayRef.current) clearTimeout(statusDelayRef.current);
    statusDelayRef.current = setTimeout(() => {
      setVisibleStatus(isProcessingUpdate);
    }, 300);
    return () => {
      if (statusDelayRef.current) clearTimeout(statusDelayRef.current);
    };
  }, [isProcessingUpdate]);

  /* ── Effect: Queue pending insight on behavioral state change ────── */
  useEffect(() => {
    const liveStateKey = `${liveStateAssessment.state}-${comparedProductIds.length}`;
    if (liveStateKey === approvedStateKeyRef.current) return;

    setPendingData({
      stateKey: liveStateKey,
      narrative: dynamicNarrative,
      causeEffect: causeEffectMessage,
    });
    setHasPendingInsight(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveStateAssessment.state, comparedProductIds.length]);

  /* ── Helpers ──────────────────────────────────────────────────────── */
  const pushMicroFeedback = (message: string, tone: MicroFeedbackEntry["tone"] = "neutral") => {
    setMicroFeedback((prev) => [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, message, tone }, ...prev].slice(0, 4));
  };

  const handleApplyInsight = () => {
    if (!pendingData) return;
    setApprovedData(pendingData);
    approvedStateKeyRef.current = pendingData.stateKey;
    setPendingData(null);
    setHasPendingInsight(false);
  };

  /* ── Effect: Hydrate from localStorage ────────────────────────────── */
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
          persisted.stateTimeline
            .filter(
              (item): item is StateTransition =>
                !!item &&
                typeof item === "object" &&
                typeof item.state === "string" &&
                typeof item.timestamp === "string"
            )
            .map((item, i) => ({
              ...item,
              // Backfill id for entries persisted before the id field was added
              id: item.id ?? `hydrated-${i}-${item.state}-${item.timestamp}`,
            }))
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

  /* ── Effect: Persist to localStorage ──────────────────────────────── */
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

  /* ── Effect: 1-second tick (time, idle, signal decay) ─────────────── */
  useEffect(() => {
    const tick = window.setInterval(() => {
      const now = Date.now();
      const idleSeconds = Math.max(0, (now - lastActivityAtRef.current) / 1000);

      setSessionSignals((prev) => ({
        ...prev,
        timeOnPage: Number((prev.timeOnPage + 1).toFixed(1)),
        idleTime: Number(idleSeconds.toFixed(1)),
        maxIdleStreak: Math.max(prev.maxIdleStreak, Number(idleSeconds.toFixed(1))),
      }));

      // Apply signal decay — dwell loses relevance over time
      const decayDelta = (now - lastDecayAtRef.current) / 1000;
      lastDecayAtRef.current = now;

      if (activeHoverIdRef.current === null) {
        setSignalMap((prev) => applySignalDecay(prev, decayDelta));
      }
    }, 1000);

    return () => window.clearInterval(tick);
  }, []);

  /* ── Effect: Scroll & activity listeners ──────────────────────────── */
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

  /* ── Effect: Throttled ranking update with stability ──────────────── */
  useEffect(() => {
    if (rankingTimeoutRef.current) {
      clearTimeout(rankingTimeoutRef.current);
    }

    const freshRanked = rankProducts(signalMap, comparedProductIds, sessionSignals);
    const totalScore = freshRanked.reduce((sum, p) => sum + p.score, 0);

    if (totalScore <= 0) {
      setDisplayedRankedProducts(freshRanked);
      setIsProcessingUpdate(false);
      return;
    }

    setIsProcessingUpdate(true);

    rankingTimeoutRef.current = setTimeout(() => {
      setDisplayedRankedProducts((previous) => {
        const stabilized = applyRankingStability(freshRanked, previous);
        const previousPositions = new Map(previous.map((p, i) => [p.id, i]));
        const changedIds = stabilized
          .filter((p, i) => previousPositions.get(p.id) !== i)
          .map((p) => p.id);
        const nextRankDeltaMap = stabilized.reduce<RankDeltaMap>((acc, p, i) => {
          const prevIdx = previousPositions.get(p.id);
          acc[p.id] = prevIdx === undefined ? 0 : prevIdx - i;
          return acc;
        }, {});

        setRankChangeIds(changedIds);
        setRankDeltaMap(nextRankDeltaMap);
        setLeaderChangeSummary(buildLeaderChangeSummary(stabilized[0], sessionSignals));

        const nextLeader = stabilized[0];
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

        return stabilized;
      });

      setIsProcessingUpdate(false);
    }, RANKING_THROTTLE_MS);

    return () => {
      if (rankingTimeoutRef.current) {
        clearTimeout(rankingTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signalMap, comparedProductIds, sessionSignals]);

  /* ── Effect: State transition detection ───────────────────────────── */
  useEffect(() => {
    if (stateRef.current === liveStateAssessment.state) return;

    const previousState = stateRef.current;
    stateRef.current = liveStateAssessment.state;
    setStateTimeline((prev) => {
      const next = [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          state: liveStateAssessment.state,
          timestamp: formatTransitionTime(new Date()),
        },
      ];
      return next.slice(-4);
    });
    pushMicroFeedback(`Behavior shifted from ${previousState} to ${liveStateAssessment.state}.`, "positive");
  }, [liveStateAssessment.state]);

  /* ── Effect: Confidence change feedback ───────────────────────────── */
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

  /* ── Effect: Comparison stack feedback ─────────────────────────────── */
  useEffect(() => {
    if (comparedProductIds.length > comparedCountRef.current) {
      pushMicroFeedback(
        `Comparison stack expanded to ${comparedProductIds.length} item${comparedProductIds.length === 1 ? "" : "s"}, deepening evaluation.`,
        "neutral"
      );
    }

    comparedCountRef.current = comparedProductIds.length;
  }, [comparedProductIds]);

  /* ── Effect: Cleanup ──────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (dwellIntervalRef.current) clearInterval(dwellIntervalRef.current);
      if (rankingTimeoutRef.current) clearTimeout(rankingTimeoutRef.current);
      if (rankHighlightTimeoutRef.current) clearTimeout(rankHighlightTimeoutRef.current);
      if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    };
  }, []);

  /* ── Signal Handlers ──────────────────────────────────────────────── */

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

    setSessionSignals((prev) => ({
      ...prev,
      totalInteractions: prev.totalInteractions + 1,
    }));

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

    setSessionSignals((prev) => ({
      ...prev,
      totalInteractions: prev.totalInteractions + 1,
    }));

    setComparedProductIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setTimeout(() => setClickedId(null), 300);
  };

  const handleTouchStart = (id: string) => {
    lastActivityAtRef.current = Date.now();
    setSessionSignals((prev) => ({
      ...prev,
      tapCount: prev.tapCount + 1,
      idleTime: 0,
      totalInteractions: prev.totalInteractions + 1,
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
    lastDecayAtRef.current = Date.now();

    const initialAssessment = buildPseudoModelOutput(initialRankedProducts, [], initialSessionSignals).assessment;
    const initialLcs = buildLeaderChangeSummary(initialRankedProducts[0], initialSessionSignals);
    const resetApproved = {
      stateKey: `${initialAssessment.state}-0`,
      narrative: buildDynamicNarrative(initialAssessment, [], initialSessionSignals),
      causeEffect: buildCauseEffectMessage(initialAssessment, initialRankedProducts[0], initialLcs),
    };
    setApprovedData(resetApproved);
    approvedStateKeyRef.current = resetApproved.stateKey;
    setPendingData(null);
    setHasPendingInsight(false);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  /* ── Render ───────────────────────────────────────────────────────── */

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
        {/* ── Header ──────────────────────────────────────────────────── */}
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
            <div className="inline-flex min-w-[220px] items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3.5 py-2 transition-colors duration-300">
              <span
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full animate-pulse transition-colors duration-300"
                style={{
                  background: hasPendingInsight ? GOLD : visibleStatus ? GOLD : "#16a34a",
                }}
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45 transition-opacity duration-300">
                {hasPendingInsight
                  ? "Insight Ready"
                  : visibleStatus
                  ? "Updating Ranked Output"
                  : "Adaptive Ranking Stable"}
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

        {/* ── Live Narrative — displays approved data only ─────────────── */}
        <LiveNarrative
          stateKey={approvedData.stateKey}
          dynamicNarrative={approvedData.narrative}
          causeEffectMessage={approvedData.causeEffect}
        />

        {/* ── Human-in-the-loop CTA ────────────────────────────────────── */}
        <AnimatePresence>
          {hasPendingInsight && (
            <motion.div
              key="insight-cta"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3"
              style={{
                background: "rgba(196,146,42,0.06)",
                borderColor: "rgba(196,146,42,0.22)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full animate-pulse"
                  style={{ background: GOLD }}
                />
                <p className="text-[11px] font-medium" style={{ color: "rgba(196,146,42,0.88)" }}>
                  New behavioral insight detected — model updated its state assessment
                </p>
              </div>
              <button
                onClick={handleApplyInsight}
                className="flex-shrink-0 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-85"
                style={{ background: GOLD }}
              >
                Apply Insight
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Behavioral Shift + Adaptive Feedback ────────────────────── */}
        <div className="mb-6 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <BehaviorShiftTracker assessment={liveStateAssessment} />
          <AdaptiveFeedbackLog entries={microFeedback} />
        </div>

        {/* ── Product Cards + Right Sidebar ────────────────────────────── */}
        <div className="flex-1 grid gap-5 md:grid-cols-[1fr_300px]">
          <motion.div layout className="flex flex-col gap-3">
            {displayedRankedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isHovered={hoveredId === product.id}
                isClicked={clickedId === product.id}
                rankChanged={rankChangeIds.includes(product.id)}
                rankDeltaMap={rankDeltaMap}
                sessionSignals={sessionSignals}
                onStartDwell={startDwell}
                onStopDwell={stopDwell}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={handleClick}
              />
            ))}
          </motion.div>

          <div className="flex flex-col gap-4">
            <DetectedStatePanel assessment={liveStateAssessment} />
            <StateTimelinePanel timeline={stateTimeline} />
            <ModelMetricsPanel metrics={modelOutput.metrics.map((m) =>
              m.label === "Inference Latency" ? { ...m, value: inferenceLatencyDisplay } : m
            )} />
            <SystemLogPanel logs={modelOutput.logs} />
            <ReasoningTracePanel topSignals={liveStateAssessment.topSignals} />
            <AdaptiveOutputPanel
              leader={leader}
              leaderChangeSummary={leaderChangeSummary}
              rankChangeIds={rankChangeIds}
            />
            <SessionStatePanel sessionSignals={sessionSignals} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
