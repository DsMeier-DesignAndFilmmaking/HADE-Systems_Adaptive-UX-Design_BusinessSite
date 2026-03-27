"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* --- 1. Types & State --- */
type StepId = "input" | "processing" | "result";

interface SignalState {
  combinedSignal: string;
  moduleContext: string;
  location: string;
}

const DEFAULT_SIGNAL: SignalState = {
  combinedSignal: "",
  moduleContext: "arrival-intelligence",
  location: "Lower Manhattan, NY",
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* --- 2. Step Components --- */

function UnifiedInputStep({ accent, signal, setSignal, onNext }: any) {
  return (
    <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] md:p-12">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Intelligence Input</span>
        </div>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-ink">Listen & Anchor</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/50 md:max-w-2xl">
          Describe your vibe and verify your city coordinates.
        </p>

        <div className="mt-10 space-y-6">
          <textarea
            value={signal.combinedSignal}
            onChange={(e) => setSignal((p: any) => ({ ...p, combinedSignal: e.target.value }))}
            rows={4}
            placeholder="e.g. 'I'm exhausted and need a quiet coffee near the station'..."
            className="w-full resize-none rounded-[1.5rem] border-none bg-ink/[0.03] p-6 text-lg tracking-tight text-ink placeholder:text-ink/20 outline-none transition-all focus:bg-ink/[0.05]"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-ink/5 bg-white p-4">
              <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/30">System Module</label>
              <select value={signal.moduleContext} onChange={(e) => setSignal((p: any) => ({ ...p, moduleContext: e.target.value }))} className="mt-1 w-full bg-transparent text-sm font-medium outline-none cursor-pointer">
                <option value="arrival-intelligence">Arrival Intelligence</option>
                <option value="live-city-pulse">Live City Pulse</option>
              </select>
            </div>
            <div className="rounded-2xl border border-ink/5 bg-white p-4">
              <label className="block text-[9px] font-bold uppercase tracking-widest text-ink/30">GPS Anchor</label>
              <input value={signal.location} onChange={(e) => setSignal((p: any) => ({ ...p, location: e.target.value }))} className="mt-1 w-full bg-transparent text-sm font-medium outline-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end border-t border-ink/5 pt-8">
        <button
          onClick={onNext}
          className="rounded-full px-10 py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
          style={{ background: accent, boxShadow: `0 12px 28px ${hexToRgba(accent, 0.4)}` }}
        >
          Score City Scenarios →
        </button>
      </div>
    </div>
  );
}

function ProcessingStep({ accent, onComplete }: any) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const metrics = [
    { label: "Transit Friction", value: 88 },
    { label: "Atmospheric Match", value: 94 },
    { label: "Crowd Density", value: 42 }
  ];

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center rounded-[2.5rem] bg-white/70 p-12 backdrop-blur-2xl shadow-xl">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-ink/5 border-t-ink" />
          <h3 className="text-2xl font-semibold">HADE is deciding...</h3>
          <p className="text-sm text-ink/40 mt-2">Weighting 400+ live data points</p>
        </div>
        <div className="space-y-4">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-ink/40">
                <span>{m.label}</span>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}>{m.value}%</motion.span>
              </div>
              <div className="h-1 w-full bg-ink/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 1.5, delay: i * 0.3, ease: "circOut" }} className="h-full" style={{ background: accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultStep({ accent, onRestart }: any) {
  return (
    <div className="flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] bg-ink p-8 text-white shadow-2xl md:p-12">
      <div className="flex-1">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-8">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Verified Context</span>
          </div>
          <h4 className="text-4xl font-bold tracking-tight leading-tight">The Loft @ North Station</h4>
          <p className="mt-6 text-xl text-white/60 leading-relaxed font-light">
            Found a hidden lounge 3 minutes away. It currently has <span className="text-white font-medium">high seating availability</span> and ambient noise under 50dB.
          </p>
          <div className="mt-10 flex gap-3">
            <div className="rounded-2xl bg-white/10 px-6 py-3 text-[11px] font-bold uppercase tracking-widest">3min Walk</div>
            <div className="rounded-2xl bg-white/10 px-6 py-3 text-[11px] font-bold uppercase tracking-widest">Quiet Zone</div>
          </div>
        </motion.div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-8 flex justify-between items-center">
        <button onClick={onRestart} className="text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition">
          Restart Journey
        </button>
        <span className="text-[9px] font-bold tracking-widest text-white/20 uppercase">Output: Slot_01_Adaptive</span>
      </div>
    </div>
  );
}

/* --- 3. Main Controller with Development Note --- */

export default function HadeEngineSystemsDiagram({ accent = "#000000" }: { accent?: string }) {
  const [step, setStep] = useState<StepId>("input");
  const [signal, setSignal] = useState<SignalState>(DEFAULT_SIGNAL);

  return (
    <section className="w-full py-12 md:py-24">
      <div className="mx-auto max-w-7xl w-full">
        
        {/* Development Status Note */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-ink/5 bg-ink/[0.02] px-5 py-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold">i</div>
            <p className="text-[11px] font-medium tracking-tight text-ink/40">
              <strong>Interactive Prototype Concept:</strong> Simulation only. Real-time HADE API integration for this study is currently in progress.
            </p>
          </div>
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="w-full"
            >
              {step === "input" && (
                <UnifiedInputStep 
                  accent={accent} 
                  signal={signal} 
                  setSignal={setSignal} 
                  onNext={() => setStep("processing")} 
                />
              )}
              {step === "processing" && (
                <ProcessingStep 
                  accent={accent} 
                  onComplete={() => setStep("result")} 
                />
              )}
              {step === "result" && (
                <ResultStep 
                  accent={accent} 
                  onRestart={() => { setStep("input"); setSignal(DEFAULT_SIGNAL); }} 
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Indicators */}
          <div className="mt-10 flex justify-center gap-2">
            {(["input", "processing", "result"] as StepId[]).map((s) => (
              <div 
                key={s} 
                className={`h-1 rounded-full transition-all duration-500 ${step === s ? 'w-10' : 'w-2 bg-ink/10'}`} 
                style={{ backgroundColor: step === s ? accent : undefined }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}