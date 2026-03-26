"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hexToRgba } from "./utils";

interface HadeEngineSystemsDiagramProps {
  accent?: string;
}

type StepId = 1 | 2 | 3 | 4;
type ModuleContext = "arrival-intelligence" | "live-city-pulse";

type SignalState = {
  textSignal: string;
  voiceSignal: string;
  moduleContext: ModuleContext;
  location: string;
};

type Candidate = {
  id: string;
  title: string;
  detail: string;
  score: number;
};

const STEP_COPY: Record<StepId, string> = {
  1: "Input your context signals",
  2: "HADE examines module & location context",
  3: "Decision Engine scores recommendation candidates",
  4: "Adaptive Panel surfaces live recommendation",
};

const DEFAULT_SIGNAL: SignalState = {
  textSignal: "",
  voiceSignal: "",
  moduleContext: "arrival-intelligence",
  location: "",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function buildDecisionMetrics(signal: SignalState) {
  const textLen = signal.textSignal.trim().length;
  const voiceLen = signal.voiceSignal.trim().length;
  const hasLocation = signal.location.trim().length > 3;

  const combined = `${signal.textSignal} ${signal.voiceSignal}`.toLowerCase();
  const intentKeywordCount = ["food", "indoor", "station", "transit", "park", "crowd"].filter((token) =>
    combined.includes(token)
  ).length;

  const contextFreshness = clamp((hasLocation ? 0.7 : 0.46) + textLen * 0.002, 0.38, 0.94);
  const intentStrength = clamp(0.42 + textLen * 0.003 + voiceLen * 0.002 + intentKeywordCount * 0.06, 0.35, 0.95);
  const moduleFit = clamp(signal.moduleContext === "arrival-intelligence" ? 0.84 : 0.76, 0.52, 0.95);

  const baseCandidates = [
    {
      id: "c1",
      title: "Low-crowd food near transit",
      detail: "Optimized for short walking distance and low queue risk.",
      base: 0.58,
    },
    {
      id: "c2",
      title: "Indoor activity with short transfer",
      detail: "Weather-safe recommendation tuned for reduced travel friction.",
      base: 0.56,
    },
    {
      id: "c3",
      title: "Local community activity",
      detail: "High-serendipity option surfaced from local behavioral signals.",
      base: 0.52,
    },
  ];

  const candidates: Candidate[] = baseCandidates
    .map((item, index) => {
      const moduleBonus =
        signal.moduleContext === "arrival-intelligence" ? (index === 0 ? 0.08 : index === 1 ? 0.06 : 0.02) : index === 2 ? 0.08 : 0.04;
      const score = clamp(
        item.base + contextFreshness * 0.22 + intentStrength * 0.26 + moduleFit * 0.18 + moduleBonus,
        0,
        0.99
      );
      return {
        id: item.id,
        title: item.title,
        detail: item.detail,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return { contextFreshness, intentStrength, moduleFit, candidates };
}

type StepShellProps = {
  accent: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

function StepShell({ accent, eyebrow, title, description, children }: StepShellProps) {
  return (
    <div
      className="rounded-3xl p-5 md:p-7"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(249,250,252,0.95))",
        border: "1px solid rgba(11,13,18,0.08)",
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
        {eyebrow}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink/60">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

type SignalInputStepProps = {
  accent: string;
  signal: SignalState;
  setSignal: React.Dispatch<React.SetStateAction<SignalState>>;
  onNext: () => void;
};

export function SignalInputStep({ accent, signal, setSignal, onNext }: SignalInputStepProps) {
  return (
    <StepShell
      accent={accent}
      eyebrow="Step 1"
      title="User Signal Input Layer"
      description="Provide user-generated context from text and voice in one unified input panel."
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">Text signal</label>
          <textarea
            value={signal.textSignal}
            onChange={(event) => setSignal((prev) => ({ ...prev, textSignal: event.target.value }))}
            rows={3}
            placeholder="Looking for low-crowd food spots near the station."
            className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink/30"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">Voice signal placeholder</label>
          <textarea
            value={signal.voiceSignal}
            onChange={(event) => setSignal((prev) => ({ ...prev, voiceSignal: event.target.value }))}
            rows={3}
            placeholder="Find nearby indoor activity with short transit time."
            className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-ink/30"
          />
        </div>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: accent }}
        >
          Submit Signal →
        </button>
      </div>
    </StepShell>
  );
}

type BehindTheHoodStepProps = {
  accent: string;
  signal: SignalState;
  setSignal: React.Dispatch<React.SetStateAction<SignalState>>;
  onNext: () => void;
};

export function BehindTheHoodStep({ accent, signal, setSignal, onNext }: BehindTheHoodStepProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <StepShell
      accent={accent}
      eyebrow="Step 2"
      title="Behind the Hood / Module + Location"
      description="Reveal context controls that HADE uses before decision scoring."
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setIsExpanded((state) => !state)}
          className="inline-flex items-center rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/60 hover:text-ink"
        >
          Behind the Hood
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl border border-line bg-white p-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">Module selector</label>
                  <select
                    value={signal.moduleContext}
                    onChange={(event) =>
                      setSignal((prev) => ({
                        ...prev,
                        moduleContext: event.target.value as ModuleContext,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-ink/30"
                  >
                    <option value="arrival-intelligence">Arrival Intelligence</option>
                    <option value="live-city-pulse">Live City Pulse</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/55">
                    Location / GPS context
                  </label>
                  <input
                    value={signal.location}
                    onChange={(event) => setSignal((prev) => ({ ...prev, location: event.target.value }))}
                    placeholder="37.7858,-122.4064 or neighborhood slug"
                    className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-ink/30"
                  />
                </div>
              </div>
              <p className="mt-4 text-sm text-ink/60">Signals weighted by trust and intent.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: accent }}
        >
          Run HADE →
        </button>
      </div>
    </StepShell>
  );
}

type DecisionEngineStepProps = {
  accent: string;
  signal: SignalState;
  runToken: number;
  onNext: () => void;
};

export function DecisionEngineStep({ accent, signal, runToken, onNext }: DecisionEngineStepProps) {
  const { contextFreshness, intentStrength, moduleFit, candidates } = useMemo(
    () => buildDecisionMetrics(signal),
    [signal, runToken]
  );

  const metrics = [
    { label: "Context freshness", value: contextFreshness },
    { label: "Intent strength", value: intentStrength },
    { label: "Module fit", value: moduleFit },
  ];

  return (
    <StepShell
      accent={accent}
      eyebrow="Step 3"
      title="HADE Decision Engine"
      description="Candidate recommendations are scored from context freshness, intent strength, and module fit."
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50 mb-3">Scoring model (mock)</p>
          <div className="space-y-3">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-ink/55">
                  <span>{metric.label}</span>
                  <span>{percent(metric.value)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-ink/10">
                  <motion.div
                    key={`${metric.label}-${runToken}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value * 100}%` }}
                    transition={{ duration: 0.38, ease: "easeOut" }}
                    className="h-1.5 rounded-full"
                    style={{ background: accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50 mb-3">Ranked candidates</p>
          <div className="space-y-2">
            {candidates.map((candidate, index) => (
              <motion.div
                key={`${candidate.id}-${runToken}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.24 }}
                className="rounded-xl border border-line/80 bg-white px-3 py-2.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{candidate.title}</p>
                  <span className="text-xs text-ink/55">{percent(candidate.score)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: accent }}
        >
          View Adaptive Panel →
        </button>
      </div>
    </StepShell>
  );
}

type AdaptivePanelStepProps = {
  accent: string;
  signal: SignalState;
  runToken: number;
  onRestart: () => void;
};

export function AdaptivePanelStep({ accent, signal, runToken, onRestart }: AdaptivePanelStepProps) {
  const topCandidate = useMemo(() => buildDecisionMetrics(signal).candidates[0], [signal, runToken]);

  return (
    <StepShell
      accent={accent}
      eyebrow="Step 4"
      title="Adaptive Recommendation Slot"
      description="Final recommendation panel updates dynamically from the submitted signal context."
    >
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${topCandidate.id}-${runToken}`}
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.24 }}
            className="rounded-2xl border border-line bg-white p-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45 mb-2">
              Field Notes Adaptive Slot
            </p>
            <h4 className="text-sm font-semibold text-ink">{topCandidate.title}</h4>
            <p className="mt-1 text-sm text-ink/60">{topCandidate.detail}</p>
            <div
              className="mt-3 rounded-xl px-3 py-2.5"
              style={{
                background: hexToRgba(accent, 0.06),
                border: `1px solid ${hexToRgba(accent, 0.2)}`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] mb-1" style={{ color: accent }}>
                Mock user-generated recommendation
              </p>
              <p className="text-sm text-ink/75">Local volleyball game near the park. Visitors welcome to join!</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-sm text-ink/60">
          This panel adapts based on submitted text/voice signals, selected module, and location context.
        </p>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: accent }}
        >
          Restart Flow
        </button>
      </div>
    </StepShell>
  );
}

type StepControllerProps = {
  accent: string;
};

export function StepController({ accent }: StepControllerProps) {
  const [activeStep, setActiveStep] = useState<StepId>(1);
  const [runToken, setRunToken] = useState(1);
  const [signal, setSignal] = useState<SignalState>(DEFAULT_SIGNAL);

  const stepTitle = STEP_COPY[activeStep];

  return (
    <div
      className="rounded-3xl p-5 md:p-6"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(247,249,252,0.92))",
        border: "1px solid rgba(11,13,18,0.08)",
      }}
    >
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
          Run Mock Cycle / Signal Flow
        </p>
        <p className="mt-1 text-sm text-ink/60">{stepTitle}</p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {([1, 2, 3, 4] as StepId[]).map((step) => {
            const isActive = step === activeStep;
            const isComplete = step < activeStep;
            return (
              <div
                key={step}
                className="rounded-full px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  background: isActive
                    ? hexToRgba(accent, 0.14)
                    : isComplete
                      ? "rgba(11,13,18,0.08)"
                      : "rgba(11,13,18,0.04)",
                  border: `1px solid ${isActive ? hexToRgba(accent, 0.35) : "rgba(11,13,18,0.1)"}`,
                  color: isActive ? accent : "rgba(11,13,18,0.52)",
                }}
              >
                Step {step}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 18, scale: 0.992 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -14, scale: 0.992 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          {activeStep === 1 && (
            <SignalInputStep
              accent={accent}
              signal={signal}
              setSignal={setSignal}
              onNext={() => setActiveStep(2)}
            />
          )}
          {activeStep === 2 && (
            <BehindTheHoodStep
              accent={accent}
              signal={signal}
              setSignal={setSignal}
              onNext={() => {
                setRunToken((value) => value + 1);
                setActiveStep(3);
              }}
            />
          )}
          {activeStep === 3 && (
            <DecisionEngineStep
              accent={accent}
              signal={signal}
              runToken={runToken}
              onNext={() => setActiveStep(4)}
            />
          )}
          {activeStep === 4 && (
            <AdaptivePanelStep
              accent={accent}
              signal={signal}
              runToken={runToken}
              onRestart={() => {
                setSignal(DEFAULT_SIGNAL);
                setRunToken((value) => value + 1);
                setActiveStep(1);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HadeEngineSystemsDiagram({ accent = "#0891B2" }: HadeEngineSystemsDiagramProps) {
  return <StepController accent={accent} />;
}

