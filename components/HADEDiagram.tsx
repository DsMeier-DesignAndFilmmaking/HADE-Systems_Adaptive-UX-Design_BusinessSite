"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Layers,
  Database,
  GitBranch,
  Zap,
  RefreshCw,
  Play,
  RotateCcw,
  Check,
} from "lucide-react";

/* ─── THEME ──────────────────────────────────────────────────────────── */
const THEME = {
  fonts: {
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  },
  colors: {
    dark:   "#0a0a0b",
    card:   "#0d0d0e",
    hade:   "#2C7B76",
    indigo: "#6366F1",
    amber:  "#F59E0B",
    border: "rgba(255,255,255,0.05)",
  },
};

/* ─── STACK DATA ─────────────────────────────────────────────────────── */
// stepIdx: which simulation step activates this layer
// connIdx: index of the outgoing connector (undefined for L5)
const HADE_STACK_DATA = [
  {
    id: "INFRA",
    level: "L1",
    label: "Infrastructure",
    spec: "Foundational Compute",
    tech: "GPU Clusters · Scalable Inference · VectorDB",
    icon: <Activity className="w-3.5 h-3.5" />,
    stepIdx: 0,
    scenarioNode: 0,
    focal: false,
    color: THEME.colors.hade,
  },
  {
    id: "MODEL",
    level: "L2",
    label: "Model",
    spec: "Cognitive Processing",
    tech: "Context-Aware LLMs · Specialised Agents",
    icon: <Layers className="w-3.5 h-3.5" />,
    stepIdx: 2,
    scenarioNode: 1,
    focal: false,
    color: THEME.colors.hade,
  },
  {
    id: "DATA",
    level: "L3",
    label: "Data",
    spec: "Contextual Inputs",
    tech: "User Behavior · Real-time Events",
    icon: <Database className="w-3.5 h-3.5" />,
    stepIdx: 0,
    scenarioNode: 0,
    focal: false,
    color: THEME.colors.hade,
  },
  {
    id: "ORCHESTRATE",
    level: "L4",
    label: "Orchestration",
    spec: "Adaptive Logic Layer",
    tech: "Prompt Engineering · Decision Engine",
    icon: <GitBranch className="w-3.5 h-3.5" />,
    stepIdx: 2,
    scenarioNode: 1,
    focal: true,
    color: THEME.colors.hade,
  },
  {
    id: "APP",
    level: "L5",
    label: "App Interface",
    spec: "Intent-Aware Experience",
    tech: "SDK Injection · Dynamic UI",
    icon: <Zap className="w-3.5 h-3.5" />,
    stepIdx: 4,
    scenarioNode: 2,
    focal: false,
    color: THEME.colors.indigo,
  },
] as const;

/* ─── SCENARIO DATA ──────────────────────────────────────────────────── */
const SCENARIOS = [
  {
    label: "Signup Hesitation",
    nodes: [
      { callout: "12s pause + repeated focus on pricing field",    color: "teal"   as const },
      { callout: "Evaluator intent → social proof routing",        color: "teal"   as const },
      { callout: "Testimonial card + ROI prompt injected",         color: "indigo" as const },
      { callout: "Decision Logged — Closing the Feedback Loop",    color: "amber"  as const },
    ],
  },
  {
    label: "Power User Skip",
    nodes: [
      { callout: "3 rapid skips + high scroll velocity",           color: "teal"   as const },
      { callout: "Operator intent → advanced path routing",        color: "teal"   as const },
      { callout: "Onboarding collapsed, config module surfaced",   color: "indigo" as const },
      { callout: "Fast-track variant logged, adoption tracked",    color: "amber"  as const },
    ],
  },
  {
    label: "7-Day Re-entry",
    nodes: [
      { callout: "7-day gap + last session ended at step 3",       color: "teal"   as const },
      { callout: "Re-activation → context restore routing",        color: "teal"   as const },
      { callout: '"Continue where you left off" surfaced',         color: "indigo" as const },
      { callout: "Re-engagement event logged, model updated",      color: "amber"  as const },
    ],
  },
];

/* ─── CALLOUT STYLES ─────────────────────────────────────────────────── */
const calloutActive = {
  teal:   "text-teal-300   bg-teal-500/10   border-teal-500/30",
  indigo: "text-indigo-300 bg-indigo-500/10 border-indigo-500/30",
  amber:  "text-amber-300  bg-amber-500/10  border-amber-500/30",
};
const calloutIdle = {
  teal:   "text-teal-700/70   bg-teal-500/4  border-teal-500/12",
  indigo: "text-indigo-700/70 bg-indigo-500/4 border-indigo-500/12",
  amber:  "text-amber-700/70  bg-amber-500/4  border-amber-500/12",
};

/* ─── STATE DERIVATION ───────────────────────────────────────────────── */
// step -1 = idle
// step 0  = L1 + L3 active (Signal Sensing)
// step 1  = connectors 0 + 2 burst forward
// step 2  = L2 + L4 active (Adaptive Engine)
// step 3  = connector 3 bursts forward
// step 4  = L5 active (Experience Delivery)
// step 5  = connectors 3 + 2 burst REVERSE (Experiment Loop)
// step 6  = complete
//
// Connector indices: 0=L1→L2, 1=L2→L3, 2=L3→L4, 3=L4→L5
const STEP_DELAYS = [0, 1800, 2500, 4800, 5600, 7400, 9400]; // ms per step 0-6

function deriveState(step: number) {
  const activeNodes: number[] =
    step === 0 ? [0, 2] :
    step === 2 ? [1, 3] :
    step === 4 ? [4]    : [];

  const activeConns: number[] =
    step === 1 ? [0, 2] :
    step === 3 ? [3]    :
    step === 5 ? [3, 2] : [];

  const isReverse = step === 5;

  const doneNodes = new Set<number>([
    ...(step >= 2 ? [0, 2] : []),
    ...(step >= 4 ? [1, 3] : []),
    ...(step >= 6 ? [4]    : []),
  ]);

  // Which scenario node index drives the current callout
  const scenarioNodeIdx =
    step <= 1 ? 0 :
    step <= 3 ? 1 :
    step === 4 ? 2 : 3;

  return { activeNodes, activeConns, isReverse, doneNodes, scenarioNodeIdx };
}

/* ─── HCONNECTOR ─────────────────────────────────────────────────────── */
const HConnector = ({
  connIdx,
  activeConns,
  isReverse,
  burstKey,
}: {
  connIdx: number;
  activeConns: number[];
  isReverse: boolean;
  burstKey: number;
}) => {
  const isBurst = activeConns.includes(connIdx);

  // Ambient color: connectors 0-2 are teal, connector 3 is indigo
  const ambientColor  = connIdx < 3 ? "bg-teal-500"  : "bg-indigo-500";
  const burstColor    = isReverse   ? "bg-amber-400"  :
                        connIdx < 3 ? "bg-teal-400"   : "bg-indigo-400";

  return (
    <div className="relative hidden h-px flex-1 bg-white/8 md:flex items-center self-center mt-8">
      {/* Ambient loop particle */}
      <motion.div
        initial={{ left: 0, opacity: 0 }}
        animate={{ left: "100%", opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, delay: connIdx * 0.4, repeat: Infinity, ease: "linear" }}
        className={`absolute top-1/2 -translate-y-1/2 w-3 h-1.5 blur-[2px] rounded-full ${ambientColor} opacity-40`}
      />
      {/* Burst particle */}
      {isBurst && (
        <motion.div
          key={`burst-${burstKey}-${connIdx}-${isReverse}`}
          initial={{ left: isReverse ? "105%" : "0%", opacity: 1 }}
          animate={{ left: isReverse ? "-5%"  : "105%", opacity: [1, 1, 0] }}
          transition={{ duration: isReverse ? 0.6 : 0.45, ease: "easeIn" }}
          className={`absolute top-1/2 -translate-y-1/2 w-8 h-2.5 blur-[3px] rounded-full ${burstColor}`}
        />
      )}
    </div>
  );
};

/* ─── MOBILE STEP PROGRESS BAR ───────────────────────────────────────── */
const MOBILE_STEP_LABELS = ["Signal", "Engine", "Delivery", "Loop"];

const StepProgressBar = ({
  step,
  runCount,
}: {
  step: number;
  runCount: number;
}) => {
  // Map simulation step to the 4 mobile progress dots
  const mobileStep =
    step <= 1 ? 0 :
    step <= 3 ? 1 :
    step === 4 ? 2 :
    step >= 5 ? 3 : -1;

  const doneSteps = new Set<number>([
    ...(step >= 2 ? [0] : []),
    ...(step >= 4 ? [1] : []),
    ...(step >= 6 ? [2, 3] : []),
  ]);

  return (
    <div className="flex items-center gap-0 mb-5">
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <motion.div
              animate={{
                borderColor: mobileStep === i
                  ? "rgba(94,234,212,0.9)"
                  : doneSteps.has(i)
                  ? "rgba(44,123,118,0.5)"
                  : "rgba(255,255,255,0.12)",
                backgroundColor: mobileStep === i
                  ? "rgba(44,123,118,0.2)"
                  : doneSteps.has(i)
                  ? "rgba(44,123,118,0.1)"
                  : "transparent",
                boxShadow: mobileStep === i ? "0 0 10px rgba(44,123,118,0.4)" : "none",
              }}
              transition={{ duration: 0.3 }}
              className="w-7 h-7 rounded-full border flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {doneSteps.has(i) && mobileStep !== i ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-3 h-3 text-teal-500" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="num"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-[9px] transition-colors duration-300 ${
                      mobileStep === i ? "text-teal-300" : "text-slate-500"
                    }`}
                    style={{ fontFamily: THEME.fonts.mono }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <span
              className={`text-[8px] transition-colors duration-300 ${
                mobileStep === i ? "text-teal-400" : "text-slate-600"
              }`}
              style={{ fontFamily: THEME.fonts.mono }}
            >
              {MOBILE_STEP_LABELS[i]}
            </span>
          </div>
          {i < 3 && (
            <div className="flex-1 h-px bg-white/10 relative mx-1 overflow-hidden mb-4">
              <motion.div
                key={`line-${i}-${runCount}`}
                initial={{ width: "0%" }}
                animate={{ width: doneSteps.has(i) ? "100%" : "0%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-teal-500/50"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── STACK LAYER CARD ───────────────────────────────────────────────── */
type StackLayerData = (typeof HADE_STACK_DATA)[number];

const StackLayer = ({
  data,
  isActive,
  isDone,
  isFeedback,
  callout,
  calloutColor,
  runCount,
}: {
  data: StackLayerData;
  isActive: boolean;
  isDone: boolean;
  isFeedback: boolean;  // step 5: L4 re-glows amber
  callout: string;
  calloutColor: "teal" | "indigo" | "amber";
  runCount: number;
}) => {
  const isAmber = isFeedback && data.focal;

  // Border color resolves: amber (feedback) > teal (active/done/focal) > default
  const borderStyle = isAmber
    ? "rgba(245,158,11,0.55)"
    : isActive
    ? "rgba(44,123,118,0.70)"
    : isDone
    ? "rgba(44,123,118,0.28)"
    : data.focal
    ? "rgba(44,123,118,0.30)"
    : data.id === "APP"
    ? "rgba(99,102,241,0.25)"
    : "rgba(255,255,255,0.05)";

  const bgStyle = isAmber
    ? "#151108"
    : isActive
    ? "#101a19"
    : isDone
    ? "#0e1110"
    : data.focal
    ? "#0d0f0e"
    : THEME.colors.card;

  const glowStyle = isAmber
    ? "0 0 24px rgba(245,158,11,0.18)"
    : isActive
    ? data.focal
      ? "0 0 32px rgba(44,123,118,0.28)"
      : "0 0 20px rgba(44,123,118,0.15)"
    : "none";

  return (
    <div className="relative flex-1 flex flex-col min-w-0 pt-10">
      {/* Floating callout — anchored above the card */}
      <AnimatePresence>
        {(isActive || isDone || isFeedback) && (
          <motion.div
            key={`${callout}-${runCount}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28 }}
            className={`absolute top-0 left-0 right-0 z-20 rounded-md border px-2 py-1 text-[8px] leading-relaxed tracking-wide ${
              isActive || isFeedback ? calloutActive[calloutColor] : calloutIdle[calloutColor]
            }`}
            style={{ fontFamily: THEME.fonts.mono }}
          >
            ↳ {callout}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card body */}
      <motion.div
        className="relative rounded-xl p-4 flex flex-col h-full overflow-hidden transition-all duration-300"
        style={{
          background: bgStyle,
          border: `1px solid ${borderStyle}`,
          boxShadow: glowStyle,
        }}
      >
        {/* Focal gradient halo */}
        {data.focal && (
          <div
            className={`absolute -inset-0.5 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 rounded-xl blur-md -z-10 transition-opacity duration-500 ${
              isAmber    ? "opacity-0"  :
              isActive   ? "opacity-100" :
              isDone     ? "opacity-60"  : "opacity-25"
            }`}
          />
        )}

        {/* Done check */}
        <AnimatePresence>
          {isDone && !isActive && !isFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center"
            >
              <Check className="w-2 h-2 text-teal-400" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level eyebrow */}
        <div className="flex items-center justify-between mb-2.5">
          <span
            className="text-[9px] uppercase tracking-[0.22em] font-bold"
            style={{
              fontFamily: THEME.fonts.mono,
              color: isAmber
                ? "rgba(245,158,11,0.7)"
                : data.focal
                ? (isActive ? "#5eead4" : "rgba(94,234,212,0.45)")
                : data.id === "APP"
                ? (isActive ? "#a5b4fc" : "rgba(165,180,252,0.4)")
                : isActive
                ? "#5eead4"
                : "rgba(100,116,139,0.7)",
            }}
          >
            {data.level} // {data.label}
          </span>

          {/* Focal pulse dot or icon */}
          {data.focal ? (
            <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              isAmber ? "bg-amber-400 animate-pulse" :
              isActive ? "bg-teal-400 animate-pulse" :
              "bg-teal-600"
            }`} />
          ) : (
            <span className={`transition-colors duration-300 ${
              isActive  ? (data.id === "APP" ? "text-indigo-400" : "text-teal-400") :
              isDone    ? (data.id === "APP" ? "text-indigo-600" : "text-teal-600") :
              "text-slate-600"
            }`}>
              {data.icon}
            </span>
          )}
        </div>

        {/* Spec title */}
        <h4
          className={`text-sm font-semibold tracking-tight leading-snug mb-1.5 transition-colors duration-300 ${
            isActive ? "text-white" : isDone ? "text-slate-200" : "text-slate-300"
          }`}
        >
          {data.spec}
        </h4>

        {/* Tech metadata */}
        <p
          className="text-[9px] text-slate-500 leading-relaxed tracking-tight mt-auto pt-3"
          style={{ fontFamily: THEME.fonts.mono }}
        >
          {data.tech}
        </p>

        {/* Focal progress bar */}
        {data.focal && (
          <div className="mt-3 h-0.5 w-full rounded-full overflow-hidden bg-white/5">
            <motion.div
              key={`prog-${runCount}-${isActive}-${isAmber}`}
              initial={{ width: "0%" }}
              animate={{
                width: isActive || isDone || isAmber ? "100%" : "88%",
              }}
              transition={{
                duration: isActive ? 2.2 : isAmber ? 0.6 : 2.5,
              }}
              className={`h-full transition-colors duration-300 ${
                isAmber ? "bg-amber-400" : isActive ? "bg-teal-400" : "bg-teal-600/50"
              }`}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* ─── MAIN EXPORT ────────────────────────────────────────────────────── */
export function HADESystemsDiagram() {
  const [scenarioIdx, setScenarioIdx]   = useState(0);
  const [step,        setStep]          = useState(-1);
  const [isRunning,   setIsRunning]     = useState(false);
  const [runCount,    setRunCount]      = useState(0);

  const scenario = SCENARIOS[scenarioIdx];
  const { activeNodes, activeConns, isReverse, doneNodes, scenarioNodeIdx } = deriveState(step);
  const isComplete = step >= 6;

  /* Timer engine */
  useEffect(() => {
    if (!isRunning) return;
    const timers = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => {
        setStep(i);
        if (i === STEP_DELAYS.length - 1) {
          setIsRunning(false);
        }
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [isRunning, runCount]);

  function handleRun() {
    setStep(-1);
    setRunCount((c) => c + 1);
    setIsRunning(true);
  }

  function handleReset() {
    setIsRunning(false);
    setStep(-1);
    setRunCount((c) => c + 1);
  }

  /* Per-layer callout resolution */
  function getLayerCallout(layerIdx: number): { callout: string; color: "teal" | "indigo" | "amber" } {
    const layer = HADE_STACK_DATA[layerIdx];
    // L4 in feedback step shows the experiment loop callout (nodes[3])
    if (layer.focal && step === 5) {
      return { callout: scenario.nodes[3].callout, color: "amber" };
    }
    const nodeIdx = layer.scenarioNode as 0 | 1 | 2;
    return { callout: scenario.nodes[nodeIdx].callout, color: scenario.nodes[nodeIdx].color };
  }

  return (
    <section
      className="reveal mt-24 mb-32 rounded-2xl overflow-hidden"
      style={{ background: THEME.colors.dark, border: `1px solid ${THEME.colors.border}` }}
    >
      {/* ── Header ── */}
      <div className="px-6 py-8 md:px-10 border-b border-white/5 bg-white/[0.015]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-teal-500 mb-1.5 font-bold"
              style={{ fontFamily: THEME.fonts.mono }}
            >
              HADE // Architectural Simulator
            </p>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white leading-tight">
              From raw signal to adaptive experience.
            </h2>
          </div>

          <div className="flex flex-col gap-3 items-start md:items-end shrink-0">
            {/* Scenario chips */}
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setScenarioIdx(i);
                    if (!isRunning) setStep(-1);
                  }}
                  disabled={isRunning}
                  className="rounded-full border px-3 py-1.5 text-[10px] font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: THEME.fonts.mono,
                    background:   scenarioIdx === i ? "rgba(44,123,118,0.15)" : "transparent",
                    borderColor:  scenarioIdx === i ? "rgba(44,123,118,0.60)" : "rgba(255,255,255,0.12)",
                    color:        scenarioIdx === i ? "#5eead4" : "rgba(148,163,184,0.75)",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Run / Reset button */}
            <button
              onClick={isComplete || step >= 0 ? handleReset : handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily:  THEME.fonts.mono,
                background:  isComplete ? "rgba(44,123,118,0.12)" : "rgba(44,123,118,0.18)",
                borderColor: isComplete ? "rgba(44,123,118,0.35)" : "rgba(44,123,118,0.55)",
                color:       "#5eead4",
              }}
            >
              {isComplete || step >= 0 ? (
                <><RotateCcw className="w-3 h-3" /> Reset</>
              ) : (
                <><Play className="w-3 h-3" /> Run Simulation</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Flow Area ── */}
      <div className="p-6 md:p-10 relative">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize:  "24px 24px",
          }}
        />

        {/* ── Desktop: horizontal flow ── */}
        <div className="relative z-10 hidden md:flex items-stretch gap-0">
          {HADE_STACK_DATA.map((layer, i) => {
            const { callout, color } = getLayerCallout(i);
            return (
              <React.Fragment key={layer.id}>
                <StackLayer
                  data={layer}
                  isActive={activeNodes.includes(i)}
                  isDone={doneNodes.has(i)}
                  isFeedback={step === 5 && layer.focal}
                  callout={callout}
                  calloutColor={color}
                  runCount={runCount}
                />
                {i < HADE_STACK_DATA.length - 1 && (
                  <div className="shrink-0 w-8 flex items-center justify-center mt-8 self-center">
                    <HConnector
                      connIdx={i}
                      activeConns={activeConns}
                      isReverse={isReverse}
                      burstKey={runCount}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Mobile: vertical stack ── */}
        <div className="relative z-10 md:hidden">
          <StepProgressBar step={step} runCount={runCount} />
          <div className="flex flex-col gap-2.5">
            {HADE_STACK_DATA.map((layer, i) => {
              const { callout, color } = getLayerCallout(i);
              return (
                <React.Fragment key={layer.id}>
                  {/* Simplified mobile card — no floating callout, just inline */}
                  <motion.div
                    className="relative rounded-xl p-3 overflow-hidden transition-all duration-300"
                    style={{
                      background:
                        activeNodes.includes(i) ? (layer.focal ? "#101a19" : "#0f1a19") :
                        doneNodes.has(i)         ? "#0e1110" :
                        layer.focal              ? "#0d0f0e" : "#111113",
                      border: `1px solid ${
                        activeNodes.includes(i) ? "rgba(44,123,118,0.65)" :
                        doneNodes.has(i)         ? "rgba(44,123,118,0.28)" :
                        layer.focal              ? "rgba(44,123,118,0.30)" :
                        "rgba(255,255,255,0.07)"
                      }`,
                      boxShadow: activeNodes.includes(i) ? "0 0 16px rgba(44,123,118,0.18)" : "none",
                    }}
                  >
                    {/* Focal glow */}
                    {layer.focal && (
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 rounded-xl blur-md -z-10 transition-opacity duration-500 ${
                          activeNodes.includes(i) ? "opacity-100" : doneNodes.has(i) ? "opacity-50" : "opacity-20"
                        }`}
                      />
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span
                          className="block text-[8px] uppercase tracking-[0.2em] mb-1"
                          style={{
                            fontFamily: THEME.fonts.mono,
                            color: activeNodes.includes(i) ? "#5eead4" : "rgba(100,116,139,0.65)",
                          }}
                        >
                          {layer.level} // {layer.label}
                        </span>
                        <h5
                          className={`text-[12px] font-semibold leading-tight mb-2 transition-colors duration-300 ${
                            activeNodes.includes(i) ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {layer.spec}
                        </h5>
                        <motion.p
                          key={`${callout}-${runCount}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`text-[9px] leading-relaxed rounded-md border px-2 py-1 inline-block tracking-wide transition-all duration-300 ${
                            activeNodes.includes(i) ? calloutActive[color] : calloutIdle[color]
                          }`}
                          style={{ fontFamily: THEME.fonts.mono }}
                        >
                          ↳ {callout}
                        </motion.p>
                      </div>
                      <span
                        className={`mt-0.5 shrink-0 transition-colors duration-300 ${
                          activeNodes.includes(i) ? "text-teal-400" :
                          doneNodes.has(i)         ? "text-teal-600" : "text-slate-600"
                        }`}
                      >
                        {layer.icon}
                      </span>
                    </div>

                    {/* Mobile focal progress bar */}
                    {layer.focal && (
                      <div className="mt-2.5 h-0.5 w-full rounded-full overflow-hidden bg-white/5">
                        <motion.div
                          key={`mp-${runCount}-${activeNodes.includes(i)}`}
                          initial={{ width: "0%" }}
                          animate={{ width: activeNodes.includes(i) || doneNodes.has(i) ? "100%" : "85%" }}
                          transition={{ duration: activeNodes.includes(i) ? 2.2 : 2.5 }}
                          className={`h-full ${activeNodes.includes(i) ? "bg-teal-400" : "bg-teal-600/50"}`}
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Vertical divider between layers */}
                  {i < HADE_STACK_DATA.length - 1 && (
                    <div className="flex items-center justify-center h-4 opacity-25">
                      <span className="text-white font-mono text-xs">↓</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Completion Banner ── */}
      <div className="px-6 pb-6 md:px-10">
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 rounded-xl border border-teal-500/20 bg-teal-500/[0.07] px-4 py-2.5"
            >
              <div className="w-4 h-4 rounded-full bg-teal-500/25 border border-teal-500/50 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-teal-400" />
              </div>
              <p
                className="text-[10px] text-teal-400 tracking-wide"
                style={{ fontFamily: THEME.fonts.mono }}
              >
                Signal processed — adaptive route selected and experiment loop updated
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Technical Footer ── */}
      <div className="px-6 py-5 md:px-10 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
        <p
          className="text-[9px] text-slate-600 tracking-[0.25em] uppercase"
          style={{ fontFamily: THEME.fonts.mono }}
        >
          Architecture Protocol v3.0 // Autonomous Orchestration
        </p>
        <div className="flex gap-3">
          <div className="h-1 w-8 rounded-full bg-teal-500/20" />
          <div className="h-1 w-8 rounded-full bg-white/5" />
        </div>
      </div>
    </section>
  );
}
