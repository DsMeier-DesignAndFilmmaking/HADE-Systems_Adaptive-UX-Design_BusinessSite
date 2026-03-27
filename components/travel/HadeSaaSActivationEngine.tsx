"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type StepId = "input" | "processing" | "result";
type UsageAction = "explore" | "analytics" | "idle";
type ActivationState = "new" | "exploring" | "stuck" | "active";

type ActivationSignal = {
  action: UsageAction | null;
  path: string[];
};

const DEFAULT_SIGNAL: ActivationSignal = {
  action: null,
  path: [],
};

const ACTION_LABELS: Record<UsageAction, string> = {
  explore: "Explore Features",
  analytics: "View Analytics",
  idle: "Idle (Stall)",
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function classifyState(signal: ActivationSignal): ActivationState {
  if (!signal.action) return "new";
  if (signal.action === "idle") return "stuck";
  if (signal.action === "analytics") return "active";
  return "exploring";
}

function getContextMetrics(signal: ActivationSignal) {
  const state = classifyState(signal);

  if (state === "active") {
    return [
      { label: "User Proficiency Score", value: 89 },
      { label: "Friction Detection", value: 24 },
      { label: "Guidance Mapping", value: 92 },
    ];
  }

  if (state === "stuck") {
    return [
      { label: "User Proficiency Score", value: 38 },
      { label: "Friction Detection", value: 91 },
      { label: "Guidance Mapping", value: 86 },
    ];
  }

  return [
    { label: "User Proficiency Score", value: 61 },
    { label: "Friction Detection", value: 54 },
    { label: "Guidance Mapping", value: 72 },
  ];
}

function UsageSignalCaptureStep({
  accent,
  signal,
  setSignal,
  onNext,
}: {
  accent: string;
  signal: ActivationSignal;
  setSignal: React.Dispatch<React.SetStateAction<ActivationSignal>>;
  onNext: () => void;
}) {
  const state = classifyState(signal);

  const handleAction = (action: UsageAction) => {
    setSignal((prev) => ({ action, path: [...prev.path.slice(-3), ACTION_LABELS[action]] }));
  };

  return (
    <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] md:p-12">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl" style={{ background: hexToRgba(accent, 0.2) }} />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">Usage Signal Capture</span>
        </div>

        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-ink">Dashboard Wireframe Input</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/50 md:max-w-2xl">
          Track user movement in-product. Each interaction updates the Activation State Engine.
        </p>

        <div className="mt-10 rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_20px_48px_-24px_rgba(79,70,229,0.45)]">
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-ink/10 bg-ink/[0.02] px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">Dashboard Shell</span>
            <span className="text-[11px] font-medium text-ink/40">State: {state}</span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {([
              "explore",
              "analytics",
              "idle",
            ] as UsageAction[]).map((action) => {
              const active = signal.action === action;
              return (
                <button
                  key={action}
                  onClick={() => handleAction(action)}
                  className="rounded-2xl border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: active ? hexToRgba(accent, 0.5) : "rgba(11,13,18,0.12)",
                    background: active ? hexToRgba(accent, 0.08) : "rgba(11,13,18,0.02)",
                    boxShadow: active ? `0 12px 24px ${hexToRgba(accent, 0.2)}` : "none",
                  }}
                >
                  <p className="text-base font-semibold tracking-tight text-ink">{ACTION_LABELS[action]}</p>
                  <p className="mt-1 text-xs text-ink/45">Feed signal to Activation State Engine</p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-ink/10 bg-ink/[0.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/45">Recent Movement</p>
            <p className="mt-2 text-sm text-ink/65">
              {signal.path.length ? signal.path.join(" -> ") : "No usage actions captured yet."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end border-t border-ink/5 pt-8">
        <button
          onClick={onNext}
          disabled={!signal.action}
          className="rounded-full px-10 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-xl transition-all hover:scale-[1.03] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45"
          style={{ background: accent, boxShadow: `0 12px 28px ${hexToRgba(accent, 0.4)}` }}
        >
          Run Activation Logic →
        </button>
      </div>
    </div>
  );
}

function ContextualLogicStep({
  accent,
  signal,
  onComplete,
}: {
  accent: string;
  signal: ActivationSignal;
  onComplete: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const metrics = getContextMetrics(signal);

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center rounded-[2.5rem] bg-white/70 p-12 backdrop-blur-2xl shadow-xl">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-ink/10 border-t-ink"
          />
          <h3 className="text-2xl font-semibold tracking-tight text-ink">Contextual Logic</h3>
          <p className="mt-2 text-sm text-ink/45">Evaluating activation context in real time</p>
        </div>

        <div className="space-y-5">
          {metrics.map((metric, i) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-ink/45">
                <span>{metric.label}</span>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.25 }}>
                  {metric.value}%
                </motion.span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1.2, delay: i * 0.2, ease: "circOut" }}
                  className="h-full"
                  style={{ background: accent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdaptiveUIResultStep({
  accent,
  signal,
  onRestart,
}: {
  accent: string;
  signal: ActivationSignal;
  onRestart: () => void;
}) {
  const state = classifyState(signal);
  const showStuck = state === "stuck";
  const showActive = state === "active";

  return (
    <div className="flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] bg-ink p-8 text-white shadow-2xl md:p-12">
      <div className="flex-1">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}>
          <div className="mb-8 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Adaptive UI</span>
          </div>

          <h4 className="text-4xl font-bold tracking-tight leading-tight">Simplified Dashboard</h4>
          <p className="mt-4 text-lg text-white/65">
            The interface has evolved based on behavior. Irrelevant complexity is suppressed and the next layer is revealed progressively.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Core Area</p>
              <p className="mt-2 text-sm text-white/80">Guided Task Panel</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Insights</p>
              <p className="mt-2 text-sm text-white/80">Focused Progress Snapshot</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Navigation</p>
              <p className="mt-2 text-sm text-white/80">Only Relevant Modules Visible</p>
            </div>
          </div>

          {showStuck && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-cyan-300/35 bg-cyan-300/10 p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">Next Best Action</p>
              <p className="mt-2 text-base font-semibold tracking-tight text-white">Complete Team Setup in Workspace Settings</p>
              <p className="mt-1 text-sm text-white/70">Detected stall point: user revisited setup and stopped. Guided action has been surfaced in-line.</p>
            </motion.div>
          )}

          {showActive && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-indigo-300/35 bg-indigo-300/10 p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-100">Advanced Power Tools</p>
              <p className="mt-2 text-base font-semibold tracking-tight text-white">Unlocked: Custom Segments, Rule Builder, and Automation Triggers</p>
              <p className="mt-1 text-sm text-white/70">High proficiency detected. The interface now exposes advanced controls for faster execution.</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-8">
        <button onClick={onRestart} className="text-[11px] font-bold uppercase tracking-widest text-white/35 transition hover:text-white">
          Restart Simulation
        </button>
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/25">Output: adaptive_dashboard_v1</span>
      </div>
    </div>
  );
}

export default function HadeSaaSActivationEngine({ accent = "#4F46E5" }: { accent?: string }) {
  const [step, setStep] = useState<StepId>("input");
  const [signal, setSignal] = useState<ActivationSignal>(DEFAULT_SIGNAL);

  const state = useMemo(() => classifyState(signal), [signal]);

  return (
    <section className="w-full py-12 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-ink/5 bg-ink/[0.02] px-5 py-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold">i</div>
            <p className="text-[11px] font-medium tracking-tight text-ink/40">
              <strong>Adaptive Activation Prototype:</strong> Progressive disclosure demo for dashboard guidance orchestration.
            </p>
          </div>
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${state}`}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
              className="w-full"
            >
              {step === "input" && (
                <UsageSignalCaptureStep
                  accent={accent}
                  signal={signal}
                  setSignal={setSignal}
                  onNext={() => setStep("processing")}
                />
              )}

              {step === "processing" && (
                <ContextualLogicStep
                  accent={accent}
                  signal={signal}
                  onComplete={() => setStep("result")}
                />
              )}

              {step === "result" && (
                <AdaptiveUIResultStep
                  accent={accent}
                  signal={signal}
                  onRestart={() => {
                    setStep("input");
                    setSignal(DEFAULT_SIGNAL);
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-center gap-2">
            {(["input", "processing", "result"] as StepId[]).map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-500 ${step === s ? "w-10" : "w-2 bg-ink/10"}`}
                style={{ backgroundColor: step === s ? accent : undefined }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
