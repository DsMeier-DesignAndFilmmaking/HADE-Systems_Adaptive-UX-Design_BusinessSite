"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FrictionScenario = "config_overload" | "integration_hell" | "feature_blindness";
type Phase = "maze" | "intervention" | "handling" | "value";

const SCENARIOS: Record<FrictionScenario, { 
  label: string, 
  task: string, 
  rescueText: string,
  valueText: string,
  icon: string,
  mobileLabel: string
}> = {
  config_overload: {
    label: "Complex Config",
    mobileLabel: "Config",
    task: "Security Profile (12 fields)",
    rescueText: "This security profile is quite technical. I can handle the setup and organize everything automatically for you.",
    valueText: "Security protocols validated. HADE pre-filled 12 technical endpoints.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
  },
  integration_hell: {
    label: "Data Mapping",
    mobileLabel: "Mapping",
    task: "Header Sync (24 headers)",
    rescueText: "Mapping headers manually is a common friction point. Want me to auto-detect your schema and sync the fields?",
    valueText: "Schema detected. 24 headers mapped with 99.8% confidence.",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
  },
  feature_blindness: {
    label: "Feature Discovery",
    mobileLabel: "Discovery",
    task: "Workflow Activation",
    rescueText: "It looks like you're searching for the Workflow Engine. I can activate your first automated bridge for you now.",
    valueText: "Workflow Engine active. Your first automated bridge is live and running.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z"
  }
};

export default function SaasActivationEngineClient() {
  const [scenario, setScenario] = useState<FrictionScenario>("config_overload");
  const [phase, setPhase] = useState<Phase>("maze");
  const [misClicks, setMisClicks] = useState(0);
  const helpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerIntervention = () => {
    if (phase === "maze") setPhase("intervention");
  };

  const handleAction = () => {
    setMisClicks(prev => {
      const next = prev + 1;
      if (next >= 3) triggerIntervention();
      return next;
    });
  };

  const handleHelpEnter = () => {
    if (phase !== "maze") return;
    helpTimerRef.current = setTimeout(triggerIntervention, 1800);
  };

  const handleHelpLeave = () => {
    if (helpTimerRef.current) clearTimeout(helpTimerRef.current);
  };

  useEffect(() => {
    if (phase !== "handling") return;
    const timer = setTimeout(() => setPhase("value"), 2500);
    return () => clearTimeout(timer);
  }, [phase]);

  const restart = () => {
    setPhase("maze");
    setMisClicks(0);
  };

  return (
    <section className="w-full py-4">
      <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl flex flex-col">
        
        {/* MOBILE-OPTIMIZED SCENARIO TABS */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Friction Model</span>
            <div className="flex gap-1">
               <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
               <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            </div>
          </div>
          
          <div className="flex p-1 bg-slate-200/50 rounded-xl gap-1">
            {(Object.keys(SCENARIOS) as FrictionScenario[]).map((key) => (
              <button
                key={key}
                onClick={() => { setScenario(key); restart(); }}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  scenario === key 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className="hidden sm:inline">{SCENARIOS[key].label}</span>
                <span className="sm:hidden">{SCENARIOS[key].mobileLabel}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === "handling" ? (
              <motion.div key="handling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 p-6 text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="mb-6 h-10 w-10 rounded-full border-4 border-slate-100 border-t-blue-500" />
                <h3 className="text-xl font-bold text-slate-900">Concierge at work...</h3>
                <p className="mt-1 text-slate-500 text-xs">Processing {SCENARIOS[scenario].label} logic.</p>
              </motion.div>
            ) : phase === "value" ? (
              <motion.div key="value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900 p-8 md:p-12 text-white z-10 flex flex-col justify-center">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-pretty">Value Unlocked.</h3>
                <p className="mt-4 text-base md:text-lg text-slate-400 font-light max-w-md leading-relaxed">{SCENARIOS[scenario].valueText}</p>
                <button onClick={restart} className="mt-10 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest text-left">Restart Demo</button>
              </motion.div>
            ) : (
              <motion.div key="maze" className="p-6 md:p-8 h-full flex flex-col">
                <div className="mb-6 flex items-start justify-between">
                  <div className="max-w-[80%]">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600">Simulated Goal</span>
                    <h3 className="mt-1 text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">{SCENARIOS[scenario].task}</h3>
                  </div>
                  <button onMouseEnter={handleHelpEnter} onTouchStart={handleHelpEnter} className="h-8 w-8 shrink-0 rounded-full border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-slate-500 transition-colors">?</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 flex-1">
                  <div className="hidden md:flex flex-col gap-1.5">
                    {["Dashboard", "Analytics", "Team", "Settings", "Advanced"].map(item => (
                      <button key={item} onClick={handleAction} className="w-full text-left px-3 py-2 rounded-lg border border-slate-100 text-[11px] font-medium text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all">{item}</button>
                    ))}
                  </div>
                  
                  <div className="rounded-2xl bg-slate-50/50 p-4 md:p-6 border border-slate-100 flex-1 relative overflow-hidden flex flex-col justify-center min-h-[240px]">
                    <div className="space-y-3 opacity-20 select-none grayscale w-full">
                      <div className="h-6 w-full bg-white rounded-lg border border-slate-200" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-16 bg-white rounded-lg border border-slate-200" />
                        <div className="h-16 bg-white rounded-lg border border-slate-200" />
                      </div>
                      <div className="h-20 bg-white rounded-lg border border-slate-200" />
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <button onClick={handleAction} className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 shadow-sm active:scale-95 transition-all">
                        Tap to simulate manual setup
                      </button>
                      <p className="mt-3 text-[9px] text-slate-300 font-medium">Wait 2s or tap 3x to trigger HADE</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* THE CONCIERGE MODAL (Responsive Scaling) */}
          <AnimatePresence>
            {phase === "intervention" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/10 backdrop-blur-[2px]">
                <motion.div 
                  initial={{ y: 20, scale: 0.95, opacity: 0 }} 
                  animate={{ y: 0, scale: 1, opacity: 1 }} 
                  exit={{ y: 15, scale: 0.95, opacity: 0 }} 
                  className="w-full max-w-[340px] bg-white rounded-[2rem] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 text-center relative"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                       <path d={SCENARIOS[scenario].icon} />
                     </svg>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Want me to take it from here?</h4>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">{SCENARIOS[scenario].rescueText}</p>
                  
                  <div className="mt-8 space-y-2">
                    <button onClick={() => setPhase("handling")} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.97] transition-all">
                      Yes, do it for me
                    </button>
                    <button onClick={() => {setPhase("maze"); setMisClicks(0);}} className="w-full py-2 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors">
                      I&apos;ll do it manually
                    </button>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-center gap-2">
                     <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300">Concierge Active</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}