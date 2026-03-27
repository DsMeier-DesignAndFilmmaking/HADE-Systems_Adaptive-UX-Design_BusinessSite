"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────────────── */
type StepId = "input" | "processing" | "result";
type UserState = "New" | "Exploring" | "Stuck" | "Active";

interface SignalEntry {
  id: number;
  label: string;
  weight: "low" | "mid" | "high";
}

interface Action {
  id: string;
  label: string;
  sublabel: string;
  signal: string;
  weight: "low" | "mid" | "high";
  stateHint: UserState;
}

/* ─── Constants ──────────────────────────────────────────────────────── */
const TEAL = "#2C7B76";

const ACTIONS: Action[] = [
  {
    id: "dashboard",
    label: "Opened Dashboard",
    sublabel: "First session — scanning the UI",
    signal: "Page view — low depth",
    weight: "low",
    stateHint: "New",
  },
  {
    id: "feature",
    label: "Opened Advanced Settings",
    sublabel: "Navigated beyond onboarding flow",
    signal: "Feature access — breadth signal",
    weight: "mid",
    stateHint: "Exploring",
  },
  {
    id: "return",
    label: "Returned to Onboarding Step 2",
    sublabel: "Same step visited — second time",
    signal: "Revisit — confusion indicator",
    weight: "high",
    stateHint: "Stuck",
  },
];

const WEIGHT_COLOR: Record<SignalEntry["weight"], string> = {
  low:  "rgba(44,123,118,0.35)",
  mid:  "rgba(44,123,118,0.6)",
  high: TEAL,
};

/* ─── Helpers ────────────────────────────────────────────────────────── */
function deriveState(log: SignalEntry[]): UserState {
  if (log.length === 0) return "New";
  const highCount = log.filter((e) => e.weight === "high").length;
  const midCount  = log.filter((e) => e.weight === "mid").length;
  if (highCount >= 2) return "Stuck";
  if (highCount === 1) return "Stuck";
  if (midCount >= 2)   return "Exploring";
  if (log.length >= 3) return "Exploring";
  return "New";
}

const STATE_COPY: Record<UserState, { badge: string; heading: string; guidance: string; nextAction: string }> = {
  New: {
    badge: "State: New",
    heading: "User is orienting",
    guidance: "High intent, fragile habit. Show the single most relevant first action — nothing else.",
    nextAction: "→ Surface: Connect your first data source",
  },
  Exploring: {
    badge: "State: Exploring",
    heading: "User is building patterns",
    guidance: "Engagement is growing. Surface adjacent capabilities as readiness signals appear.",
    nextAction: "→ Surface: Invite a teammate to unlock collaboration features",
  },
  Stuck: {
    badge: "State: Stuck",
    heading: "Confusion detected",
    guidance: "User has stalled at a key step. Inject in-context guidance now — not a tour, a specific next action.",
    nextAction: "→ Surface: 'Looks like you're revisiting this step — here's what to do next'",
  },
  Active: {
    badge: "State: Active",
    heading: "User is reaching value",
    guidance: "Consistent depth confirmed. Open the interface — surface deeper features and expansion context.",
    nextAction: "→ Surface: You're ready for automated workflows",
  },
};

/* ─── Step 1: Session Signal Capture ─────────────────────────────────── */
interface CaptureProps {
  log: SignalEntry[];
  setLog: React.Dispatch<React.SetStateAction<SignalEntry[]>>;
  confusionTriggered: boolean;
  setConfusionTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: () => void;
}

function SessionCaptureStep({
  log,
  setLog,
  confusionTriggered,
  setConfusionTriggered,
  onNext,
}: CaptureProps) {
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  let idCounter = log.length;

  const addSignal = (action: Action) => {
    setLog((prev) => [
      ...prev,
      { id: idCounter++, label: action.signal, weight: action.weight },
    ]);
    setLastClicked(action.id);
    setTimeout(() => setLastClicked(null), 350);
  };

  const simulateConfusion = () => {
    setConfusionTriggered(true);
    const stuck = ACTIONS[2]; // "Returned to Onboarding Step 2"
    let count = 0;
    const burst = setInterval(() => {
      setLog((prev) => [
        ...prev,
        { id: Date.now() + count, label: stuck.signal, weight: stuck.weight },
      ]);
      count++;
      if (count >= 3) clearInterval(burst);
    }, 200);
  };

  const detectedState = deriveState(log);
  const hasSignal = log.length > 0;

  const depthScore  = Math.min(100, log.length * 12);
  const breadth     = log.filter((e) => e.weight === "mid").length;
  const stuckCount  = log.filter((e) => e.weight === "high").length;

  return (
    <div className="relative flex min-h-[580px] flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.10)] md:p-10">

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: TEAL }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
          Session Signal Capture
        </span>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight text-ink mb-1">User Journey Simulator</h3>
      <p className="text-sm text-ink/45 mb-7">
        Click actions to generate signals. Trigger confusion to simulate a stuck loop.
      </p>

      {/* Main layout */}
      <div className="flex-1 grid md:grid-cols-[1fr_200px] gap-5">

        {/* Action cards */}
        <div className="flex flex-col gap-3">
          {ACTIONS.map((action) => {
            const isActive = lastClicked === action.id;
            return (
              <motion.button
                key={action.id}
                animate={isActive ? { scale: 0.97 } : { scale: 1 }}
                transition={{ duration: 0.15 }}
                onClick={() => addSignal(action)}
                className="rounded-2xl border bg-white p-4 text-left transition-all duration-200"
                style={{
                  borderColor: isActive
                    ? TEAL
                    : "rgba(11,13,18,0.08)",
                  boxShadow: isActive
                    ? `0 4px 16px rgba(44,123,118,0.15)`
                    : "none",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink leading-snug">{action.label}</p>
                    <p className="text-xs text-ink/40 mt-0.5">{action.sublabel}</p>
                  </div>
                  <span
                    className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                    style={{
                      background: `rgba(44,123,118,${action.weight === "high" ? 0.12 : action.weight === "mid" ? 0.07 : 0.04})`,
                      color: TEAL,
                    }}
                  >
                    {action.weight === "high" ? "stuck" : action.weight === "mid" ? "exploring" : "new"}
                  </span>
                </div>
              </motion.button>
            );
          })}

          {/* Confusion trigger */}
          <button
            onClick={simulateConfusion}
            disabled={confusionTriggered}
            className="mt-1 rounded-2xl border px-4 py-3 text-xs font-semibold transition-all text-left"
            style={{
              borderColor: confusionTriggered ? "rgba(239,68,68,0.25)" : "rgba(11,13,18,0.12)",
              background:  confusionTriggered ? "rgba(239,68,68,0.04)"  : "rgba(11,13,18,0.02)",
              color: confusionTriggered ? "#dc2626" : "rgba(11,13,18,0.45)",
              cursor: confusionTriggered ? "default" : "pointer",
            }}
          >
            {confusionTriggered ? "✓ Confusion loop registered" : "↺ Simulate Confusion Loop — revisit signal burst"}
          </button>
        </div>

        {/* Signal feed */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-4"
          style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Live Signals</p>

          {/* Live log */}
          <div className="flex-1 space-y-1.5 overflow-hidden">
            {log.length === 0 && (
              <p className="text-[11px] text-ink/25">No signals yet</p>
            )}
            {log.slice(-6).map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: WEIGHT_COLOR[entry.weight] }}
                />
                <p className="text-[10px] text-ink/55 leading-snug">{entry.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Summary counters */}
          <div className="space-y-2 pt-2 border-t border-ink/6">
            {[
              { label: "Session Depth", value: depthScore > 0 ? `${depthScore}%` : "—" },
              { label: "Features Touched", value: breadth > 0 ? breadth : "—" },
              { label: "Stuck Signals", value: stuckCount > 0 ? stuckCount : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <p className="text-[10px] text-ink/40">{label}</p>
                <p
                  className="text-[11px] font-mono font-semibold"
                  style={{ color: value !== "—" ? TEAL : "rgba(11,13,18,0.2)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 flex items-center justify-end border-t border-ink/5 pt-6">
        <button
          onClick={onNext}
          disabled={!hasSignal}
          className="rounded-full px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-lg transition-all"
          style={{
            background: hasSignal ? TEAL : "rgba(11,13,18,0.15)",
            opacity: hasSignal ? 1 : 0.5,
            cursor: hasSignal ? "pointer" : "not-allowed",
            boxShadow: hasSignal ? `0 10px 24px rgba(44,123,118,0.3)` : "none",
          }}
        >
          Classify State →
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2: State Classification ───────────────────────────────────── */
function StateClassificationStep({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3400);
    return () => clearTimeout(t);
  }, [onComplete]);

  const metrics = [
    { label: "Session Depth Analysis",  value: 76 },
    { label: "Feature Breadth Score",   value: 45 },
    { label: "Step Completion Rate",    value: 31 },
  ];

  return (
    <div className="flex min-h-[580px] flex-col items-center justify-center rounded-[2.5rem] bg-white/70 p-12 backdrop-blur-2xl shadow-xl border border-white/40">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mx-auto mb-6 h-9 w-9 rounded-full border-2 border-ink/[0.06] border-t-ink/60"
          />
          <h3 className="text-2xl font-semibold tracking-tight">HADE is classifying...</h3>
          <p className="text-sm text-ink/40 mt-2">Scoring session signals against activation patterns</p>
        </div>
        <div className="space-y-5">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-ink/40">
                <span>{m.label}</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.5 + 0.4 }}
                >
                  {m.value}%
                </motion.span>
              </div>
              <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: "rgba(11,13,18,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 1.6, delay: i * 0.3, ease: "circOut" }}
                  className="h-full rounded-full"
                  style={{ background: TEAL, boxShadow: `0 0 8px rgba(44,123,118,0.4)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Adaptive Output ─────────────────────────────────────────── */
interface OutputProps {
  log: SignalEntry[];
  onRestart: () => void;
}

function AdaptiveOutputStep({ log, onRestart }: OutputProps) {
  const detectedState = deriveState(log);
  const copy = STATE_COPY[detectedState];

  const stateColors: Record<UserState, string> = {
    New:      "rgba(44,123,118,0.8)",
    Exploring:"rgba(44,123,118,1)",
    Stuck:    "#dc2626",
    Active:   "#16a34a",
  };

  return (
    <div className="flex min-h-[580px] flex-col overflow-hidden rounded-[2.5rem] bg-[#09090b] p-8 text-white shadow-2xl md:p-10">
      <div className="flex-1">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>

          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Adaptive Output — Guidance Matched
            </span>
          </div>

          {/* State badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: stateColors[detectedState] }}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
              {copy.badge}
            </span>
          </div>

          {/* Main output card */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background: "rgba(44,123,118,0.1)",
              border: `1px solid rgba(44,123,118,0.25)`,
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: TEAL }}>
              HADE Decision
            </p>
            <h4 className="text-2xl font-bold tracking-tight leading-snug text-white mb-3">
              {copy.heading}
            </h4>
            <p className="text-sm text-white/50 leading-relaxed mb-5">{copy.guidance}</p>
            <div
              className="rounded-xl px-4 py-3"
              style={{ background: "rgba(44,123,118,0.15)", border: "1px solid rgba(44,123,118,0.3)" }}
            >
              <p className="text-xs font-semibold" style={{ color: TEAL }}>
                {copy.nextAction}
              </p>
            </div>
          </div>

          {/* Other states — suppressed */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/20 mb-3">
              Suppressed Responses
            </p>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(STATE_COPY) as UserState[])
                .filter((s) => s !== detectedState)
                .map((s) => (
                  <div
                    key={s}
                    className="rounded-xl px-3 py-2 opacity-30"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <p className="text-[10px] font-medium text-white/50">{STATE_COPY[s].badge}</p>
                  </div>
                ))}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-6">
        <button
          onClick={onRestart}
          className="text-[11px] font-bold uppercase tracking-widest text-white/25 hover:text-white/60 transition"
        >
          Restart
        </button>
        <span className="text-[9px] font-bold tracking-widest text-white/15 uppercase font-mono">
          Output: Guidance_Injected
        </span>
      </div>
    </div>
  );
}

/* ─── Controller ──────────────────────────────────────────────────────── */
export default function HadeSaasEngine() {
  const [step, setStep]                             = useState<StepId>("input");
  const [log, setLog]                               = useState<SignalEntry[]>([]);
  const [confusionTriggered, setConfusionTriggered] = useState(false);

  const restart = () => {
    setStep("input");
    setLog([]);
    setConfusionTriggered(false);
  };

  return (
    <section className="w-full py-6">

      {/* Dev note */}
      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-ink/5 bg-ink/[0.02] px-5 py-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold text-ink/50">
            i
          </div>
          <p className="text-[11px] font-medium tracking-tight text-ink/40">
            <strong>Interactive Prototype:</strong> Simulation only — click actions to build a signal log, then classify state.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
        >
          {step === "input" && (
            <SessionCaptureStep
              log={log}
              setLog={setLog}
              confusionTriggered={confusionTriggered}
              setConfusionTriggered={setConfusionTriggered}
              onNext={() => setStep("processing")}
            />
          )}
          {step === "processing" && (
            <StateClassificationStep onComplete={() => setStep("result")} />
          )}
          {step === "result" && (
            <AdaptiveOutputStep log={log} onRestart={restart} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="mt-8 flex justify-center gap-2">
        {(["input", "processing", "result"] as StepId[]).map((s) => (
          <div
            key={s}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: step === s ? 36 : 8,
              background: step === s ? TEAL : "rgba(11,13,18,0.1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
