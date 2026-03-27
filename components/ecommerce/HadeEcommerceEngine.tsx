"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Types ──────────────────────────────────────────────────────────── */
type StepId = "input" | "processing" | "result";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  material: string;
}

/* ─── Constants ──────────────────────────────────────────────────────── */
const GOLD = "#C4922A";

const PRODUCTS: Product[] = [
  { id: "jacket", name: "Merino Wool Jacket",  category: "Outerwear", price: "$425", material: "100% Merino" },
  { id: "knit",   name: "Cashmere Turtleneck", category: "Knitwear",  price: "$295", material: "Grade-A Cashmere" },
  { id: "boots",  name: "Chelsea Boots",        category: "Footwear",  price: "$510", material: "Full-Grain Leather" },
];

const DEFAULT_DWELL: Record<string, number> = { jacket: 0, knit: 0, boots: 0 };

/* ─── Step 1: Behavioral Capture ─────────────────────────────────────── */
interface CaptureProps {
  dwellTimes: Record<string, number>;
  setDwellTimes: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  comparisonCount: number;
  setComparisonCount: React.Dispatch<React.SetStateAction<number>>;
  hesitationTriggered: boolean;
  setHesitationTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: () => void;
}

function BehavioralCaptureStep({
  dwellTimes,
  setDwellTimes,
  comparisonCount,
  setComparisonCount,
  hesitationTriggered,
  setHesitationTriggered,
  onNext,
}: CaptureProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startDwell = useCallback((id: string) => {
    setHoveredId(id);
    intervalRef.current = setInterval(() => {
      setDwellTimes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    }, 1000);
  }, [setDwellTimes]);

  const stopDwell = useCallback(() => {
    setHoveredId(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const handleClick = (id: string) => {
    setComparisonCount((c) => c + 1);
    setClickedId(id);
    setTimeout(() => setClickedId(null), 400);
  };

  const simulateHesitation = () => {
    setHesitationTriggered(true);
    // Burst jacket dwell by 8s in increments
    let added = 0;
    const burst = setInterval(() => {
      setDwellTimes((prev) => ({ ...prev, jacket: prev.jacket + 1 }));
      added++;
      if (added >= 8) clearInterval(burst);
    }, 80);
  };

  const leadingId = Object.entries(dwellTimes).reduce(
    (best, [id, t]) => (t > best[1] ? [id, t] : best),
    ["none", 0]
  )[0];

  const totalDwell = Object.values(dwellTimes).reduce((a, b) => a + b, 0);
  const hasSignal = totalDwell > 0 || comparisonCount > 0;

  return (
    <div className="relative flex min-h-[580px] flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.10)] md:p-10">

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
          Behavioral Capture
        </span>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight text-ink mb-1">Live Signal Feed</h3>
      <p className="text-sm text-ink/45 mb-8">
        Hover to build dwell time. Click to stack comparisons. Trigger hesitation to simulate a revisit loop.
      </p>

      {/* Main layout */}
      <div className="flex-1 grid md:grid-cols-[1fr_220px] gap-5">

        {/* Product cards */}
        <div className="flex flex-col gap-3">
          {PRODUCTS.map((p) => {
            const isHovered = hoveredId === p.id;
            const isClicked = clickedId === p.id;
            const isLeader = leadingId === p.id && dwellTimes[p.id] > 0;
            return (
              <motion.div
                key={p.id}
                animate={isClicked ? { scale: 0.98 } : { scale: 1 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => startDwell(p.id)}
                onMouseLeave={stopDwell}
                onClick={() => handleClick(p.id)}
                className="cursor-pointer rounded-2xl border bg-white p-4 transition-all duration-200 select-none"
                style={{
                  borderColor: isLeader
                    ? GOLD
                    : isHovered
                    ? "rgba(196,146,42,0.4)"
                    : "rgba(11,13,18,0.08)",
                  boxShadow: isHovered
                    ? `0 8px 24px rgba(196,146,42,0.12)`
                    : "none",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1"
                      style={{ color: GOLD, opacity: 0.7 }}
                    >
                      {p.category}
                    </p>
                    <p className="text-sm font-semibold text-ink leading-snug">{p.name}</p>
                    <p className="text-xs text-ink/40 mt-0.5">{p.material}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-ink">{p.price}</p>
                    {dwellTimes[p.id] > 0 && (
                      <motion.p
                        key={dwellTimes[p.id]}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-mono mt-1"
                        style={{ color: GOLD }}
                      >
                        {dwellTimes[p.id]}s
                      </motion.p>
                    )}
                  </div>
                </div>
                {isHovered && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                    className="mt-3 h-[2px] rounded-full origin-left"
                    style={{ background: GOLD, opacity: 0.5 }}
                  />
                )}
              </motion.div>
            );
          })}

          {/* Hesitation button */}
          <button
            onClick={simulateHesitation}
            disabled={hesitationTriggered}
            className="mt-1 rounded-2xl border px-4 py-3 text-xs font-semibold transition-all text-left"
            style={{
              borderColor: hesitationTriggered ? "rgba(34,197,94,0.3)" : "rgba(11,13,18,0.12)",
              background: hesitationTriggered ? "rgba(34,197,94,0.06)" : "rgba(11,13,18,0.02)",
              color: hesitationTriggered ? "#16a34a" : "rgba(11,13,18,0.5)",
              cursor: hesitationTriggered ? "default" : "pointer",
            }}
          >
            {hesitationTriggered ? "✓ Hesitation signal sent" : "↺ Simulate Hesitation — revisit loop"}
          </button>
        </div>

        {/* Signal feed */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-5"
          style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
        >
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35 mb-3">
              Signal Feed
            </p>

            {/* Dwell times */}
            <div className="space-y-2 mb-4">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-ink/50 truncate">{p.name.split(" ")[0]}</p>
                  <span
                    className="text-[11px] font-mono font-semibold"
                    style={{ color: dwellTimes[p.id] > 0 ? GOLD : "rgba(11,13,18,0.25)" }}
                  >
                    {dwellTimes[p.id] > 0 ? `${dwellTimes[p.id]}s` : "—"}
                  </span>
                </div>
              ))}
            </div>

            {/* Comparison stacks */}
            <div
              className="rounded-xl px-3 py-2.5 mb-3"
              style={{ background: "rgba(11,13,18,0.04)", border: "1px solid rgba(11,13,18,0.07)" }}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink/35 mb-1">
                Comparison Stacks
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: comparisonCount > 0 ? GOLD : "rgba(11,13,18,0.2)" }}
              >
                {comparisonCount}
              </p>
            </div>

            {/* Hesitation signal */}
            <div
              className="rounded-xl px-3 py-2.5"
              style={{ background: "rgba(11,13,18,0.04)", border: "1px solid rgba(11,13,18,0.07)" }}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ink/35 mb-1">
                Hesitation Signal
              </p>
              <p
                className="text-xs font-semibold"
                style={{ color: hesitationTriggered ? "#16a34a" : "rgba(11,13,18,0.2)" }}
              >
                {hesitationTriggered ? "Detected" : "—"}
              </p>
            </div>
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
            background: hasSignal ? GOLD : "rgba(11,13,18,0.15)",
            opacity: hasSignal ? 1 : 0.5,
            cursor: hasSignal ? "pointer" : "not-allowed",
            boxShadow: hasSignal ? `0 10px 24px rgba(196,146,42,0.35)` : "none",
          }}
        >
          Analyse Intent →
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2: Decision Engine ─────────────────────────────────────────── */
function DecisionEngineStep({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3400);
    return () => clearTimeout(t);
  }, [onComplete]);

  const metrics = [
    { label: "Intent Classification", value: 91 },
    { label: "Noise Reduction",       value: 78 },
    { label: "Option Ranking",        value: 86 },
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
          <p className="text-sm text-ink/40 mt-2">Scoring behavioral signals against catalog fit</p>
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
                  style={{
                    background: GOLD,
                    boxShadow: `0 0 8px rgba(196,146,42,0.4)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Adaptive Catalog ────────────────────────────────────────── */
interface ResultProps {
  dwellTimes: Record<string, number>;
  onRestart: () => void;
}

function AdaptiveCatalogStep({ dwellTimes, onRestart }: ResultProps) {
  const leadingEntry = Object.entries(dwellTimes).reduce(
    (best, [id, t]) => (t > best[1] ? [id, t] : best),
    ["jacket", 0]
  );
  const leadingId   = leadingEntry[0];
  const leadingDwell = leadingEntry[1] as number;

  const leader   = PRODUCTS.find((p) => p.id === leadingId) ?? PRODUCTS[0];
  const others   = PRODUCTS.filter((p) => p.id !== leader.id);
  const dwellLabel = leadingDwell > 0 ? `${leadingDwell}s dwell` : "engagement pattern";

  return (
    <div className="flex min-h-[580px] flex-col overflow-hidden rounded-[2.5rem] bg-[#09090b] p-8 text-white shadow-2xl md:p-10">
      <div className="flex-1">
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>

          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Adaptive Output — Restructured View
            </span>
          </div>

          {/* High-Fit card */}
          <div
            className="rounded-2xl p-6 mb-5"
            style={{
              background: "rgba(196,146,42,0.08)",
              border: `1px solid rgba(196,146,42,0.25)`,
            }}
          >
            {/* HADE badge */}
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-5"
              style={{
                background: "rgba(196,146,42,0.14)",
                border: `1px solid rgba(196,146,42,0.35)`,
              }}
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                HADE Recommendation
              </span>
            </div>

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: GOLD, opacity: 0.7 }}>
              {leader.category}
            </p>
            <h4 className="text-3xl font-bold tracking-tight leading-tight text-white mb-1">
              {leader.name}
            </h4>
            <p className="text-sm text-white/40 mb-4">{leader.material}</p>

            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-white">{leader.price}</p>
              <p className="text-xs text-white/35 font-mono">
                based on your {dwellLabel}
              </p>
            </div>
          </div>

          {/* Deprioritized products */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25 mb-3">
              Reduced Visibility
            </p>
            <div className="flex gap-2 flex-wrap">
              {others.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl px-4 py-2.5 opacity-40"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-xs font-medium text-white/60">{p.name}</p>
                  <p className="text-[10px] text-white/35">{p.price}</p>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-6">
        <button
          onClick={onRestart}
          className="text-[11px] font-bold uppercase tracking-widest text-white/25 hover:text-white/60 transition"
        >
          Restart
        </button>
        <span className="text-[9px] font-bold tracking-widest text-white/15 uppercase font-mono">
          Output: Catalog_Restructured
        </span>
      </div>
    </div>
  );
}

/* ─── Controller ──────────────────────────────────────────────────────── */
export default function HadeEcommerceEngine() {
  const [step, setStep]                     = useState<StepId>("input");
  const [dwellTimes, setDwellTimes]         = useState<Record<string, number>>({ ...DEFAULT_DWELL });
  const [comparisonCount, setComparisonCount] = useState(0);
  const [hesitationTriggered, setHesitationTriggered] = useState(false);

  const restart = () => {
    setStep("input");
    setDwellTimes({ ...DEFAULT_DWELL });
    setComparisonCount(0);
    setHesitationTriggered(false);
  };

  return (
    <section className="w-full py-6">

      {/* Dev note */}
      <div className="mb-6 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-ink/5 bg-ink/[0.02] px-5 py-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold text-ink/50">i</div>
          <p className="text-[11px] font-medium tracking-tight text-ink/40">
            <strong>Interactive Prototype:</strong> Simulation only — hover, click, and trigger signals to see HADE respond.
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
            <BehavioralCaptureStep
              dwellTimes={dwellTimes}
              setDwellTimes={setDwellTimes}
              comparisonCount={comparisonCount}
              setComparisonCount={setComparisonCount}
              hesitationTriggered={hesitationTriggered}
              setHesitationTriggered={setHesitationTriggered}
              onNext={() => setStep("processing")}
            />
          )}
          {step === "processing" && (
            <DecisionEngineStep onComplete={() => setStep("result")} />
          )}
          {step === "result" && (
            <AdaptiveCatalogStep dwellTimes={dwellTimes} onRestart={restart} />
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
              background: step === s ? GOLD : "rgba(11,13,18,0.1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
