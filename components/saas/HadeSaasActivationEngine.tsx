"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OnboardingState = "start" | "browsing" | "stuck" | "intervention" | "success";

export default function HadeSaaSOnboardingFriction() {
  const [state, setState] = useState<OnboardingState>("start");
  const [wrongClicks, setWrongClicks] = useState(0);
  const [isHoveringHelp, setIsHoveringHelp] = useState(false);

  // HADE Logic: If user clicks the "wrong" things 3 times or hovers help while stuck
  useEffect(() => {
    if (wrongClicks >= 3 || (wrongClicks >= 1 && isHoveringHelp)) {
      const timer = setTimeout(() => setState("intervention"), 600);
      return () => clearTimeout(timer);
    }
  }, [wrongClicks, isHoveringHelp]);

  return (
    <div className="w-full max-w-5xl mx-auto my-12 font-sans select-none">
      {/* HADE Telemetry HUD */}
      <div className="mb-6 flex items-center justify-between px-6">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Config Friction</span>
            <span className="text-sm font-mono font-bold text-slate-900">{wrongClicks} Hesitation Events</span>
          </div>
          <div className="flex flex-col border-l border-slate-200 pl-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">User Intent</span>
            <span className="text-sm font-bold text-blue-600">
              {state === "intervention" ? "Blocked" : "Configuring..."}
            </span>
          </div>
        </div>
        <div className="h-8 w-8 rounded-full border-2 border-slate-100 flex items-center justify-center">
            <div className={`h-2 w-2 rounded-full ${state === 'intervention' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
        </div>
      </div>

      <div className="relative min-h-[600px] rounded-[2.5rem] border border-slate-200 bg-white shadow-3xl overflow-hidden flex flex-col">
        
        {/* Wireframe Navigation */}
        <nav className="h-16 border-b border-slate-50 flex items-center px-8 justify-between bg-slate-50/30">
          <div className="h-4 w-24 bg-slate-200 rounded-full" />
          <div className="flex gap-6">
            <div onClick={() => setWrongClicks(q => q + 1)} className="h-2 w-12 bg-slate-200 rounded-full cursor-pointer hover:bg-slate-300" />
            <div onClick={() => setWrongClicks(q => q + 1)} className="h-2 w-12 bg-slate-200 rounded-full cursor-pointer hover:bg-slate-300" />
            <div className="h-6 w-6 rounded-full bg-blue-100 border border-blue-200" />
          </div>
        </nav>

        <div className="flex flex-1 relative">
          {/* Main Workspace */}
          <main className="flex-1 p-12 relative">
            <AnimatePresence mode="wait">
              
              {/* PHASE 1: The Instruction */}
              {state === "start" && (
                <motion.div key="start" className="max-w-md mx-auto text-center mt-20">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 text-pretty">Task: Connect Your Data Source</h3>
                  <p className="text-slate-500 mb-8">
                    Try to complete your API integration in this setup flow.
                    This is where 60% of users abandon.
                  </p>
                  <button
                    onClick={() => setState("browsing")}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:scale-105 transition-transform"
                  >
                    Begin Setup
                  </button>
                </motion.div>
              )}

              {/* PHASE 2: The Friction (Interactive Wireframe) */}
              {(state === "browsing" || state === "stuck") && (
                <motion.div key="browsing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                  <div className="grid grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none mb-10">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl border border-slate-200 border-dashed" />)}
                  </div>
                  
                  <div className="max-w-lg mx-auto p-10 rounded-[2rem] border-2 border-slate-100 bg-white shadow-sm space-y-6">
                    <div className="flex justify-between">
                      <div className="h-6 w-32 bg-slate-200 rounded" />
                      <div 
                        onMouseEnter={() => setIsHoveringHelp(true)}
                        onMouseLeave={() => setIsHoveringHelp(false)}
                        className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold cursor-help hover:bg-blue-100 transition-colors"
                      >
                        ?
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-10 w-full bg-slate-50 rounded-xl border border-slate-100" />
                      <div className="h-24 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                         <span className="text-[10px] font-bold text-slate-300 uppercase">API Key + Schema Mapping (Required)</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setWrongClicks(q => q + 1)} className="flex-1 py-3 bg-slate-100 rounded-xl text-[10px] font-bold uppercase text-slate-400">Cancel</button>
                        <button onClick={() => setWrongClicks(q => q + 1)} className="flex-1 py-3 bg-slate-900 rounded-xl text-[10px] font-bold uppercase text-white">Save Source</button>
                    </div>
                  </div>
                  
                  {wrongClicks > 0 && (
                    <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mt-10 text-xs font-bold text-red-400">
                      Hesitation signals accumulating...
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* PHASE 3: HADE Intervention (The Rescue) */}
              {state === "intervention" && (
                <motion.div 
                  key="intervention" 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-50 flex items-center justify-center p-12 bg-white/60 backdrop-blur-md"
                >
                  <div className="max-w-md bg-white border border-blue-100 rounded-[3rem] p-10 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.25)] text-center relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      HADE Rescue Active
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-4">Stuck on the API setup?</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                      You've been on this config screen for 45 seconds and opened the docs twice.
                      HADE can auto-connect your data source — skipping the manual mapping entirely.
                    </p>
                    <button
                      onClick={() => setState("success")}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
                    >
                      Yes, Auto-Connect for me
                    </button>
                    <button onClick={() => setState("browsing")} className="mt-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">I'll complete it manually</button>
                  </div>
                </motion.div>
              )}

              {/* PHASE 4: SUCCESS */}
              {state === "success" && (
                <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-20">
                  <div className="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-2xl shadow-emerald-100">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">Connected — First Value Reached</h3>
                  <p className="text-slate-500 mt-2">HADE replaced a 15-minute manual configuration with a 2-second automated connection.</p>
                  <button onClick={() => {setState("start"); setWrongClicks(0); setIsHoveringHelp(false);}} className="mt-12 text-xs font-bold text-blue-600 uppercase tracking-widest">Simulate Another User</button>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}