"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Layers,
  Zap,
  RefreshCw,
  Search,
  GitBranch,
  Package,
  TrendingUp,
  Map,
  Layout,
  BarChart2,
  Play,
  Check,
} from "lucide-react";
import { processSteps } from "@/lib/site-data";

/* ─── THEME ──────────────────────────────────────────────────────── */
const THEME = {
  fonts: {
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
    serif: "'tiempos-headline-regular', serif",
  },
  colors: {
    dark: "#0a0a0b",
    card: "#0d0d0e",
    hade: "#2C7B76",
    indigo: "#6366F1",
    amber: "#F59E0B",
    border: "rgba(255,255,255,0.08)",
  },
};

/* ─── SCENARIO DATA ──────────────────────────────────────────────── */
const SCENARIOS = [
  {
    label: "Signup Hesitation",
    nodes: [
      { callout: "12s pause + repeated focus on pricing field", color: "teal" as const },
      { callout: "Evaluator intent → social proof routing", color: "teal" as const },
      { callout: "Testimonial card + ROI prompt injected", color: "indigo" as const },
      { callout: "Variant logged — conversion signal pending", color: "amber" as const },
    ],
  },
  {
    label: "Power User Skip",
    nodes: [
      { callout: "3 rapid skips + high scroll velocity", color: "teal" as const },
      { callout: "Operator intent → advanced path routing", color: "teal" as const },
      { callout: "Onboarding collapsed, config module surfaced", color: "indigo" as const },
      { callout: "Fast-track variant logged, adoption tracked", color: "amber" as const },
    ],
  },
  {
    label: "7-Day Re-entry",
    nodes: [
      { callout: "7-day gap + last session ended at step 3", color: "teal" as const },
      { callout: "Re-activation → context restore routing", color: "teal" as const },
      { callout: '"Continue where you left off" surfaced', color: "indigo" as const },
      { callout: "Re-engagement event logged, model updated", color: "amber" as const },
    ],
  },
];

/* ─── CALLOUT STYLES ─────────────────────────────────────────────── */
// Active = bright; idle = dimmed but always visible
const calloutActive = {
  teal:   "text-teal-400 bg-teal-500/10 border-teal-500/25",
  indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
  amber:  "text-amber-400 bg-amber-500/10 border-amber-500/25",
};
const calloutIdle = {
  teal:   "text-teal-700/80 bg-teal-500/4 border-teal-500/10",
  indigo: "text-indigo-700/80 bg-indigo-500/4 border-indigo-500/10",
  amber:  "text-amber-700/80 bg-amber-500/4 border-amber-500/10",
};

/* ─── HORIZONTAL PARTICLE CONNECTOR ─────────────────────────────── */
const HConnector = ({
  delay = 0,
  color = "teal",
  isBurst = false,
  burstKey = 0,
}: {
  delay?: number;
  color?: "teal" | "indigo" | "amber";
  isBurst?: boolean;
  burstKey?: number;
}) => {
  const particleColor =
    color === "teal" ? "bg-teal-500" : color === "indigo" ? "bg-indigo-500" : "bg-amber-500";
  const burstColor =
    color === "teal" ? "bg-teal-400" : color === "indigo" ? "bg-indigo-400" : "bg-amber-400";

  return (
    <div className="relative hidden h-px flex-1 bg-white/10 md:block">
      {/* Ambient loop particle */}
      <motion.div
        initial={{ left: 0, opacity: 0 }}
        animate={{ left: "100%", opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay, repeat: Infinity, ease: "linear" }}
        className={`absolute top-1/2 -translate-y-1/2 w-3 h-1.5 blur-[2px] rounded-full ${particleColor}`}
      />
      {/* Burst particle on signal pass */}
      {isBurst && (
        <motion.div
          key={`burst-${burstKey}`}
          initial={{ left: "0%", opacity: 1 }}
          animate={{ left: "105%", opacity: [1, 1, 0] }}
          transition={{ duration: 0.45, ease: "easeIn" }}
          className={`absolute top-1/2 -translate-y-1/2 w-8 h-2.5 blur-[3px] rounded-full ${burstColor}`}
        />
      )}
    </div>
  );
};

/* ─── MOBILE: STEP PROGRESS BAR ─────────────────────────────────── */
const StepProgressBar = ({
  activeNode,
  doneNodes,
  runCount,
}: {
  activeNode: number | null;
  doneNodes: Set<number>;
  runCount: number;
}) => (
  <div className="flex items-center gap-0 mb-4">
    {[0, 1, 2, 3].map((i) => (
      <React.Fragment key={i}>
        {/* Step dot */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <motion.div
            animate={{
              borderColor: activeNode === i
                ? "rgba(94,234,212,0.9)"
                : doneNodes.has(i)
                ? "rgba(44,123,118,0.5)"
                : "rgba(255,255,255,0.12)",
              backgroundColor: activeNode === i
                ? "rgba(44,123,118,0.2)"
                : doneNodes.has(i)
                ? "rgba(44,123,118,0.1)"
                : "transparent",
              boxShadow: activeNode === i
                ? "0 0 10px rgba(44,123,118,0.4)"
                : "none",
            }}
            transition={{ duration: 0.3 }}
            className="w-7 h-7 rounded-full border flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {doneNodes.has(i) && activeNode !== i ? (
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
                  className={`text-[9px] transition-colors duration-300 ${activeNode === i ? "text-teal-300" : "text-slate-500"}`}
                  style={{ fontFamily: THEME.fonts.mono }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Connector line between dots */}
        {i < 3 && (
          <div className="flex-1 h-px bg-white/10 relative mx-1 overflow-hidden">
            <motion.div
              key={`line-${i}-${runCount}`}
              initial={{ width: "0%" }}
              animate={{ width: doneNodes.has(i) ? "100%" : "0%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-teal-500/50"
            />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ─── MOBILE: COMPACT 2×2 GRID NODE ─────────────────────────────── */
const MobileArchNode = ({
  nodeIndex,
  level,
  title,
  icon,
  focal = false,
  isActive,
  isDone,
  callout,
  calloutColor,
  runCount,
}: {
  nodeIndex: number;
  level: string;
  title: string;
  icon: React.ReactNode;
  focal?: boolean;
  isActive: boolean;
  isDone: boolean;
  callout: string;
  calloutColor: "teal" | "indigo" | "amber";
  runCount: number;
}) => (
  <motion.div
    className="relative rounded-xl p-3 overflow-hidden transition-all duration-300"
    style={{
      background: isActive
        ? focal ? "#101a19" : "#0f1a19"
        : isDone ? "#0e1110"
        : focal ? THEME.colors.card : "#111113",
      border: isActive
        ? "1px solid rgba(44,123,118,0.65)"
        : isDone
        ? "1px solid rgba(44,123,118,0.28)"
        : focal
        ? "1px solid rgba(44,123,118,0.35)"
        : `1px solid ${THEME.colors.border}`,
      boxShadow: isActive ? "0 0 18px rgba(44,123,118,0.2)" : "none",
    }}
  >
    {/* Focal glow layer */}
    {focal && (
      <div
        className={`absolute -inset-0.5 bg-gradient-to-br from-teal-500/20 to-indigo-500/20 rounded-xl blur-md -z-10 transition-opacity duration-500 ${
          isActive ? "opacity-100" : isDone ? "opacity-60" : "opacity-30"
        }`}
      />
    )}

    {/* Done indicator */}
    <AnimatePresence>
      {isDone && !isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-2 right-2 w-4 h-4 rounded-full bg-teal-500/15 border border-teal-500/35 flex items-center justify-center"
        >
          <Check className="w-2 h-2 text-teal-400" />
        </motion.div>
      )}
    </AnimatePresence>

    {/* Level + icon row */}
    <div className="flex items-center gap-1.5 mb-1.5">
      <span
        className="text-[8px] uppercase tracking-widest text-teal-500/60"
        style={{ fontFamily: THEME.fonts.mono }}
      >
        {level}
      </span>
      <span className={`transition-colors duration-300 ${isActive ? "text-teal-400" : isDone ? "text-teal-600" : "text-slate-500"}`}>
        {icon}
      </span>
    </div>

    {/* Title */}
    <h5 className={`text-[12px] font-semibold leading-tight mb-2 transition-colors duration-300 ${isActive ? "text-white" : "text-slate-300"}`}>
      {title}
    </h5>

    {/* Callout — always visible, fades when scenario changes */}
    <motion.p
      key={callout}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-[9px] leading-relaxed rounded-md border px-2 py-1 inline-block tracking-wide transition-all duration-300 ${
        isActive ? calloutActive[calloutColor] : calloutIdle[calloutColor]
      }`}
      style={{ fontFamily: THEME.fonts.mono }}
    >
      ↳ {callout}
    </motion.p>

    {/* Progress bar (focal L2 only) */}
    {focal && (
      <div className="mt-2 h-0.5 w-full rounded-full overflow-hidden bg-white/5">
        <motion.div
          key={`mp-${runCount}-${isActive}`}
          initial={{ width: "0%" }}
          animate={{ width: isActive ? "100%" : isDone ? "100%" : "92%" }}
          transition={{ duration: isActive ? 2.2 : 2.5 }}
          className={`h-full ${isActive ? "bg-teal-400" : "bg-teal-500"}`}
        />
      </div>
    )}
  </motion.div>
);

/* ─── ARCHITECTURE NODE ──────────────────────────────────────────── */
type ArchNodeProps = {
  level: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  delay: number;
  focal?: boolean;
  isActive?: boolean;
  isDone?: boolean;
  callout?: string;
  calloutColor?: "teal" | "indigo" | "amber";
  runCount?: number;
};

const ArchNode = ({
  level, title, subtitle, icon, delay,
  focal = false,
  isActive = false,
  isDone = false,
  callout,
  calloutColor = "teal",
  runCount = 0,
}: ArchNodeProps) => {

  if (focal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay }}
        className="relative z-10 w-full max-w-[220px] shrink-0 group"
      >
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-teal-500/25 to-indigo-500/25 rounded-2xl blur-lg transition-opacity duration-500 ${
            isActive ? "opacity-100" : isDone ? "opacity-70" : "opacity-50 group-hover:opacity-80"
          }`}
        />
        <div
          className="relative rounded-2xl p-5 shadow-2xl transition-all duration-300"
          style={{
            background: isActive ? "#101a19" : THEME.colors.card,
            border: isActive
              ? "1px solid rgba(44,123,118,0.7)"
              : isDone
              ? "1px solid rgba(44,123,118,0.4)"
              : "1px solid rgba(44,123,118,0.35)",
            boxShadow: isActive ? "0 0 28px rgba(44,123,118,0.25)" : undefined,
          }}
        >
          {/* Done indicator */}
          <AnimatePresence>
            {isDone && !isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center"
              >
                <Check className="w-2.5 h-2.5 text-teal-400" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-teal-500 mb-1" style={{ fontFamily: THEME.fonts.mono }}>
                {level}
              </p>
              <h4 className="text-base font-semibold text-white">{title}</h4>
            </div>
            <div className="text-teal-500">{icon}</div>
          </div>

          <p className="text-[10px] text-slate-400 uppercase tracking-[0.18em] mb-2" style={{ fontFamily: THEME.fonts.mono }}>
            {subtitle}
          </p>

          <div className="h-1 w-full rounded-full overflow-hidden bg-white/5">
            <motion.div
              key={`progress-${runCount}-${isActive}`}
              initial={{ width: "0%" }}
              animate={{ width: isActive ? "100%" : isDone ? "100%" : "92%" }}
              transition={{ duration: isActive ? 2.2 : 2.5, delay: isActive ? 0 : delay + 0.8 }}
              className={`h-full transition-colors duration-300 ${isActive ? "bg-teal-400" : "bg-teal-500"}`}
            />
          </div>

          {/* Callout — always visible, crossfades when scenario changes */}
          {callout && (
            <div className="mt-3">
              <motion.p
                key={callout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`inline-block rounded-md border px-2.5 py-1 text-[9px] leading-relaxed tracking-wide transition-all duration-300 ${
                  isActive ? calloutActive[calloutColor] : calloutIdle[calloutColor]
                }`}
                style={{ fontFamily: THEME.fonts.mono }}
              >
                ↳ {callout}
              </motion.p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  /* Non-focal node */
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative w-full max-w-[180px] shrink-0 rounded-xl p-4 transition-all duration-300"
      style={{
        background: isActive ? "#0f1a19" : isDone ? "#0e1110" : "#111113",
        border: isActive
          ? "1px solid rgba(44,123,118,0.55)"
          : isDone
          ? "1px solid rgba(44,123,118,0.22)"
          : `1px solid ${THEME.colors.border}`,
        boxShadow: isActive ? "0 0 20px rgba(44,123,118,0.15)" : "none",
      }}
    >
      {/* Done indicator */}
      <AnimatePresence>
        {isDone && !isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-teal-500/15 border border-teal-500/35 flex items-center justify-center"
          >
            <Check className="w-2 h-2 text-teal-400" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-2">
        <p className="text-[8px] uppercase tracking-widest text-slate-500" style={{ fontFamily: THEME.fonts.mono }}>
          {level}
        </p>
        <span className={`transition-colors duration-300 ${isActive ? "text-teal-400" : isDone ? "text-teal-600" : "text-slate-400"}`}>
          {icon}
        </span>
      </div>
      <h5 className={`text-sm font-semibold mb-1 transition-colors duration-300 ${isActive ? "text-white" : isDone ? "text-slate-300" : "text-slate-200"}`}>
        {title}
      </h5>
      <p className="text-[11px] leading-relaxed text-slate-500">{subtitle}</p>

      {/* Callout — always visible, crossfades when scenario changes */}
      {callout && (
        <div className="mt-2.5">
          <motion.p
            key={callout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`inline-block rounded-md border px-2 py-1 text-[9px] leading-relaxed tracking-wide transition-all duration-300 ${
              isActive ? calloutActive[calloutColor] : calloutIdle[calloutColor]
            }`}
            style={{ fontFamily: THEME.fonts.mono }}
          >
            ↳ {callout}
          </motion.p>
        </div>
      )}
    </motion.div>
  );
};

/* ─── SECTION 1: SYSTEM ARCHITECTURE (INTERACTIVE) ──────────────── */

// step -1 = idle, 0–6 = signal in progress, 7 = complete
// even steps = node active, odd steps = connector bursting
function deriveState(step: number) {
  const activeNode   = step === 0 ? 0 : step === 2 ? 1 : step === 4 ? 2 : step === 6 ? 3 : null;
  const activeConn   = step === 1 ? 0 : step === 3 ? 1 : step === 5 ? 2 : null;
  const doneNodes    = new Set<number>([
    ...(step >= 2 ? [0] : []),
    ...(step >= 4 ? [1] : []),
    ...(step >= 6 ? [2] : []),
    ...(step >= 8 ? [3] : []),
  ]);
  return { activeNode, activeConn, doneNodes };
}

const SystemArchitecture = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [step, setStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [runCount, setRunCount] = useState(0);

  const scenario = SCENARIOS[scenarioIdx];
  const { activeNode, activeConn, doneNodes } = deriveState(step);
  const isComplete = step === 7;

  // Staged delays (ms) — nodes dwell long enough to read the callout,
  // connectors are brief transitions. L2 (HADE Core) dwells longest
  // as it's doing the routing decision work.
  //
  // step: 0     1     2     3     4     5     6     7
  //       L1  conn   L2  conn   L3  conn   L4  done
  const STEP_DELAYS = [0, 1800, 2400, 4900, 5500, 7300, 7900, 9900];

  const runSignal = () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunCount((c) => c + 1);

    STEP_DELAYS.forEach((delay, i) => {
      setTimeout(() => {
        setStep(i);
        if (i === 7) {
          setTimeout(() => {
            setStep(-1);
            setIsRunning(false);
          }, 2200);
        }
      }, delay);
    });
  };

  return (
    <div
      className="rounded-2xl px-6 py-10 md:px-10"
      style={{ background: THEME.colors.dark, border: `1px solid ${THEME.colors.border}` }}
    >
      {/* Header */}
      <div className="flex flex-col gap-5 mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.28em] text-teal-500 mb-1"
            style={{ fontFamily: THEME.fonts.mono }}
          >
            Signal Simulator · Interactive Demo
          </p>
          <h3 className="text-lg font-semibold text-white">
            How HADE processes context in real time
          </h3>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 items-start md:items-end shrink-0 w-full md:w-auto">
          {/* Scenario chips */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.label}
                onClick={() => { if (!isRunning) setScenarioIdx(i); }}
                disabled={isRunning}
                className="rounded-full border px-3 py-2 md:py-1 text-[10px] font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed min-h-[36px] md:min-h-0"
                style={{
                  fontFamily: THEME.fonts.mono,
                  background: scenarioIdx === i ? "rgba(44,123,118,0.15)" : "transparent",
                  borderColor: scenarioIdx === i ? "rgba(44,123,118,0.6)" : "rgba(255,255,255,0.12)",
                  color: scenarioIdx === i ? "#5eead4" : "rgba(148,163,184,0.8)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Run Signal button */}
          <button
            onClick={runSignal}
            disabled={isRunning}
            className="flex items-center justify-center gap-2 w-full md:w-auto rounded-full border px-4 py-2.5 md:py-1.5 text-[11px] font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] md:min-h-0"
            style={{
              fontFamily: THEME.fonts.mono,
              background: isRunning ? "rgba(44,123,118,0.08)" : "rgba(44,123,118,0.12)",
              borderColor: "rgba(44,123,118,0.45)",
              color: "#5eead4",
              boxShadow: isRunning ? "none" : "0 0 14px rgba(44,123,118,0.15)",
            }}
          >
            {isRunning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-3 h-3" />
                </motion.div>
                Processing…
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-teal-400" />
                Run Signal
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop: horizontal flow */}
      <div className="hidden md:flex items-center gap-2">
        <ArchNode
          level="L1" title="Signal Sensing" subtitle="Live behavior & intent telemetry"
          icon={<Activity className="w-4 h-4" />} delay={0.1}
          isActive={activeNode === 0} isDone={doneNodes.has(0)}
          callout={scenario.nodes[0].callout} calloutColor={scenario.nodes[0].color}
          runCount={runCount}
        />
        <HConnector delay={0.3} color="teal" isBurst={activeConn === 0} burstKey={runCount} />
        <ArchNode
          level="L2 · HADE Core" title="Adaptive Engine" subtitle="Context-aware decision system"
          icon={<Layers className="w-4 h-4" />} delay={0.4} focal
          isActive={activeNode === 1} isDone={doneNodes.has(1)}
          callout={scenario.nodes[1].callout} calloutColor={scenario.nodes[1].color}
          runCount={runCount}
        />
        <HConnector delay={0.7} color="indigo" isBurst={activeConn === 1} burstKey={runCount} />
        <ArchNode
          level="L3" title="Experience Delivery" subtitle="Personalized UI rendered in context"
          icon={<Zap className="w-4 h-4 text-indigo-400" />} delay={0.8}
          isActive={activeNode === 2} isDone={doneNodes.has(2)}
          callout={scenario.nodes[2].callout} calloutColor={scenario.nodes[2].color}
          runCount={runCount}
        />
        <HConnector delay={1.1} color="amber" isBurst={activeConn === 2} burstKey={runCount} />
        <ArchNode
          level="L4" title="Experiment Loop" subtitle="Feedback adapts system reasoning"
          icon={
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
              <RefreshCw className="w-4 h-4 text-amber-500" />
            </motion.div>
          }
          delay={1.2}
          isActive={activeNode === 3} isDone={doneNodes.has(3)}
          callout={scenario.nodes[3].callout} calloutColor={scenario.nodes[3].color}
          runCount={runCount}
        />
      </div>

      {/* Mobile: step progress bar + 2×2 grid — all 4 nodes visible in viewport */}
      <div className="md:hidden">
        <StepProgressBar activeNode={activeNode} doneNodes={doneNodes} runCount={runCount} />
        <div className="grid grid-cols-2 gap-2.5">
          <MobileArchNode
            nodeIndex={0} level="L1" title="Signal Sensing"
            icon={<Activity className="w-3.5 h-3.5" />}
            isActive={activeNode === 0} isDone={doneNodes.has(0)}
            callout={scenario.nodes[0].callout} calloutColor={scenario.nodes[0].color}
            runCount={runCount}
          />
          <MobileArchNode
            nodeIndex={1} level="L2 · Core" title="Adaptive Engine"
            icon={<Layers className="w-3.5 h-3.5" />} focal
            isActive={activeNode === 1} isDone={doneNodes.has(1)}
            callout={scenario.nodes[1].callout} calloutColor={scenario.nodes[1].color}
            runCount={runCount}
          />
          <MobileArchNode
            nodeIndex={2} level="L3" title="Experience Delivery"
            icon={<Zap className="w-3.5 h-3.5 text-indigo-400" />}
            isActive={activeNode === 2} isDone={doneNodes.has(2)}
            callout={scenario.nodes[2].callout} calloutColor={scenario.nodes[2].color}
            runCount={runCount}
          />
          <MobileArchNode
            nodeIndex={3} level="L4" title="Experiment Loop"
            icon={
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
              </motion.div>
            }
            isActive={activeNode === 3} isDone={doneNodes.has(3)}
            callout={scenario.nodes[3].callout} calloutColor={scenario.nodes[3].color}
            runCount={runCount}
          />
        </div>
      </div>

      {/* Completion status */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex items-center gap-2.5 rounded-xl border border-teal-500/20 bg-teal-500/8 px-4 py-2.5"
          >
            <div className="w-4 h-4 rounded-full bg-teal-500/25 border border-teal-500/50 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-teal-400" />
            </div>
            <p className="text-[10px] text-teal-400 tracking-wide" style={{ fontFamily: THEME.fonts.mono }}>
              Signal processed — adaptive route selected and experiment loop updated
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── SECTION 2: PROCESS TIMELINE ───────────────────────────────── */
const stepIcons = [
  <Search key="s" className="w-5 h-5 text-accent" />,
  <GitBranch key="g" className="w-5 h-5 text-teal-500" />,
  <Package key="p" className="w-5 h-5 text-indigo-400" />,
  <TrendingUp key="t" className="w-5 h-5 text-amber-500" />,
];

const stepAccents = [
  "text-accent border-accent/30 bg-accentSoft",
  "text-teal-600 border-teal-500/30 bg-teal-50",
  "text-indigo-600 border-indigo-500/30 bg-indigo-50",
  "text-amber-600 border-amber-500/30 bg-amber-50",
];

const ProcessTimeline = () => (
  <div className="relative">
    <div className="absolute left-6 top-0 bottom-0 w-px bg-line hidden md:block" />
    <motion.div
      className="absolute left-6 -translate-x-1/2 w-1.5 h-6 blur-[2px] rounded-full bg-accent/50 hidden md:block"
      initial={{ top: 0, opacity: 0 }}
      animate={{ top: "100%", opacity: [0, 1, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
    />
    <div className="space-y-6">
      {processSteps.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          className="flex gap-6 items-start md:pl-16"
        >
          <div className="absolute left-[18px] -translate-x-1/2 w-5 h-5 rounded-full bg-surface border-2 border-line hidden md:flex items-center justify-center" style={{ top: `calc(${i * 6}rem + 1.25rem)` }} />
          <div className="panel flex flex-col gap-3 p-6 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${stepAccents[i]}`}>
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
              </div>
              <div className="shrink-0 mt-0.5">{stepIcons[i]}</div>
            </div>
            <p className="text-sm leading-relaxed text-ink/65">{step.detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ─── SECTION 3: DELIVERABLES DARK GRID ─────────────────────────── */
const deliverables = [
  {
    icon: <Map className="w-5 h-5 text-teal-500" />,
    title: "Signal Map",
    body: "Where real user behavior diverges from intended UX — annotated friction points and intent signals.",
  },
  {
    icon: <GitBranch className="w-5 h-5 text-indigo-400" />,
    title: "Adaptive Logic Blueprint",
    body: "State definitions, routing rules, and decision triggers for real-time personalization.",
  },
  {
    icon: <Layout className="w-5 h-5 text-accent" />,
    title: "Component UX Specs",
    body: "Implementation-ready designs and experiment plan — no ambiguity for design or engineering.",
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-amber-500" />,
    title: "Metrics Dashboard",
    body: "KPI framework and dashboard recommendations to track and prove conversion impact.",
  },
];

const DeliverablesGrid = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {deliverables.map((d, i) => (
      <motion.div
        key={d.title}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className="group relative rounded-2xl p-6 overflow-hidden"
        style={{ background: THEME.colors.card, border: `1px solid ${THEME.colors.border}` }}
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-teal-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
        <div className="relative">
          <div className="mb-3">{d.icon}</div>
          <h3 className="text-sm font-semibold text-white mb-2">{d.title}</h3>
          <p className="text-xs leading-relaxed text-slate-400">{d.body}</p>
        </div>
      </motion.div>
    ))}
  </div>
);

/* ─── MAIN EXPORT ────────────────────────────────────────────────── */
export function HowItWorksVisual() {
  return (
    <div className="space-y-16">
      <section>
        <SystemArchitecture />
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.22em] text-accent mb-1" style={{ fontFamily: THEME.fonts.mono }}>
          Delivery Flow
        </p>
        <h2 className="text-2xl font-semibold text-ink mb-8">
          A focused path from friction discovery to rollout
        </h2>
        <ProcessTimeline />
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-[0.22em] text-accent mb-1" style={{ fontFamily: THEME.fonts.mono }}>
          What your team receives
        </p>
        <h2 className="text-2xl font-semibold text-ink mb-2">
          Implementation-ready assets at every phase
        </h2>
        <p className="text-sm text-ink/60 mb-8 max-w-2xl">
          Each phase creates clear, actionable output so design, product, and engineering can move without ambiguity.
        </p>
        <DeliverablesGrid />
      </section>
    </div>
  );
}
