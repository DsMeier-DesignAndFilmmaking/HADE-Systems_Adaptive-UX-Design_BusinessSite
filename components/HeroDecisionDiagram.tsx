"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCcw, Activity, Zap, ShieldCheck } from "lucide-react";

/**
 * HadeHeroDiagram - A high-fidelity, right-side architectural visualization.
 * References the L1-L4 logical stack of the HADE Engine.
 */

const THEME = {
  fonts: {
    serif: "'tiempos-headline-regular', serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  },
  colors: {
    dark: "#0a0a0b",
    card: "#111113",
    border: "#1d1d20",
    teal: "#2C7B76",
    amber: "#F59E0B",
    indigo: "#6366F1",
  }
};

export function HadeHeroDiagram() {
  return (
    <div className="relative w-full h-full min-h-[600px] flex items-center justify-center p-4 lg:p-12 overflow-hidden bg-[#0a0a0b]">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative w-full max-w-xl flex flex-col items-center">
        
        {/* L1: LIVE INPUTS */}
        <Node 
          level="L1" 
          title="Environmental Signals" 
          icon={<Activity className="w-3 h-3 text-slate-400" />}
          items={["Geospatial", "Weather", "Telemetry"]}
          delay={0.1}
        />

        <Connector active delay={0.2} />

        {/* L2: THE ENGINE (Core) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-20 w-full group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-b from-amber-500/20 to-transparent rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000" />
          <div className="relative bg-[#0d0d0e] border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-amber-500 uppercase">L2 • HADE Engine</span>
                <h4 className="text-xl text-white mt-1" style={{ fontFamily: THEME.fonts.serif }}>Adaptive Decision Logic</h4>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <RefreshCcw className="w-4 h-4 text-amber-500 animate-[spin_4s_linear_infinity]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2 bg-white/5 border border-white/5 rounded-md text-[10px] text-slate-400 font-mono">CATDS_RECOGNITION</div>
              <div className="px-3 py-2 bg-white/5 border border-white/5 rounded-md text-[10px] text-slate-400 font-mono">TRUST_CALIBRATION</div>
            </div>
          </div>
          
          {/* Floating UGC Signals */}
          <FloatingSignal text="Jazz Show Started" x="-15%" y="20%" color="indigo" />
          <FloatingSignal text="Local Volley Match" x="95%" y="60%" color="teal" />
        </motion.div>

        <Connector active delay={0.5} />

        {/* L3: THE OUTPUT */}
        <Node 
          level="L3" 
          title="Confident Discovery" 
          icon={<Zap className="w-3 h-3 text-indigo-400" />}
          items={["Context-Aware", "Spontaneous Action"]}
          variant="highlight"
          delay={0.6}
        />

        {/* L4: FEEDBACK LOOP */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center gap-3 px-4 py-2 border border-white/5 rounded-full bg-white/[0.02]"
        >
          <div className="flex -space-x-1">
            {[1, 2].map(i => <div key={i} className="w-4 h-4 rounded-full border border-[#0a0a0b] bg-slate-700" />)}
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Feedback Adapting L2</span>
        </motion.div>

      </div>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function Node({ level, title, items, icon, delay, variant = "default" }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`w-full max-w-sm p-5 rounded-2xl border backdrop-blur-md transition-all ${
        variant === "highlight" 
          ? "bg-indigo-500/5 border-indigo-500/20 shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)]" 
          : "bg-[#111113] border-[#1d1d20]"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[9px] font-mono tracking-widest uppercase ${variant === "highlight" ? "text-indigo-400" : "text-slate-500"}`}>
          {level}
        </span>
        {icon}
      </div>
      <h5 className="text-sm font-medium text-white mb-3">{title}</h5>
      <div className="flex gap-2">
        {items.map((item: string) => (
          <span key={item} className="text-[9px] px-2 py-1 bg-white/[0.03] border border-white/5 rounded-md text-slate-400 font-mono italic">
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function Connector({ active, delay }: { active?: boolean, delay: number }) {
  return (
    <div className="h-10 w-px bg-gradient-to-b from-slate-800 to-transparent relative">
      {active && (
        <motion.div 
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: "100%", opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 -translate-x-1/2 w-1 h-3 bg-indigo-500 blur-[2px]"
        />
      )}
    </div>
  );
}

function FloatingSignal({ text, x, y, color }: any) {
  const colors: any = { indigo: "bg-indigo-500", teal: "bg-teal-500" };
  return (
    <motion.div
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111113] border border-white/5 shadow-2xl whitespace-nowrap z-30"
    >
      <div className={`w-1 h-1 rounded-full ${colors[color] || "bg-white"} animate-pulse`} />
      <span className="text-[10px] font-mono text-slate-300 tracking-tight">{text}</span>
    </motion.div>
  );
}