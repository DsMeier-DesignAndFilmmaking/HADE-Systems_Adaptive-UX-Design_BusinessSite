"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Layers, Zap, RefreshCw } from "lucide-react";

const THEME = {
  fonts: {
    serif: "'tiempos-headline-regular', serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  },
  colors: {
    dark: "#0a0a0b",
    hade: "#2C7B76",
    indigo: "#6366F1",
    border: "rgba(255,255,255,0.08)"
  }
};

export const HadeAdaptiveHero = () => {
  return (
    <div className="relative w-full py-12 flex flex-col items-center">
      {/* L1: BEHAVIORAL MAPPING */}
      <BusinessNode 
        level="L1"
        title="Behavioral Mapping"
        subtitle="Live intent & signal telemetry"
        icon={<Activity className="w-4 h-4 text-slate-900" />}
        delay={0.1}
      />

      <Connector active delay={0.2} />

      {/* L2: THE ADAPTIVE LAYER (HADE CORE) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 w-full max-w-sm group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-1000" />
        <div className="relative bg-[#0d0d0e] border border-teal-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-mono tracking-[0.3em] text-teal-500 uppercase">L2 • Adaptive Layer</p>
              <h4 className="text-xl text-white mt-1" style={{ fontFamily: THEME.fonts.serif }}>Real-Time Routing</h4>
            </div>
            <Layers className="w-5 h-5 text-teal-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
              <span>Context-Aware Decision System</span>
              <span className="text-teal-500">99.2%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 2, delay: 1 }}
                className="h-full bg-teal-500" 
              />
            </div>
          </div>
        </div>
      </motion.div>

      <Connector active delay={0.6} color="indigo" />

      {/* L3: PRODUCT DELIVERY - DARKER TEXT APPLIED HERE */}
      <BusinessNode 
        level="L3"
        title="Optimized Experience"
        subtitle="Context-aware delivery to end users (interface)"
        icon={<Zap className="w-4 h-4 text-indigo-500" />}
        delay={0.7}
        highlight
      />

      {/* L4: EXPERIMENT CYCLE */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 flex items-center gap-3 px-5 py-2.5 rounded-full border border-teal-500/20 bg-teal-500/5 backdrop-blur-md"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-4 h-4 text-teal-500" />
        </motion.div>
        <span className="text-[10px] font-mono text-slate-800 uppercase tracking-[0.2em]">
          L4 • Experiment cycle optimization - Feedback adapts reasoning over time
        </span>
      </motion.div>
    </div>
  );
};

/* --- SHARED SUB-COMPONENTS --- */

const BusinessNode = ({ level, title, subtitle, icon, delay, highlight = false }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`w-full max-w-sm p-5 rounded-xl border backdrop-blur-sm ${
      highlight 
        ? 'bg-indigo-100 border-indigo-500 shadow-xl' // Brightened background to support dark text
        : 'bg-[#111113] border-white/5'
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className={`text-[9px] font-mono tracking-widest uppercase ${highlight ? 'text-indigo-900/60' : 'text-slate-500'}`}>
        {level}
      </span>
      {icon}
    </div>
    
    {/* TITLE: Using slate-900 (Deep Black/Gray) when highlighted */}
    <h5 className={`text-sm font-semibold mb-1 ${highlight ? 'text-slate-900' : 'text-slate-200'}`}>
      {title}
    </h5>
    
    {/* SUBTITLE: Using slate-700 (Dark Gray) when highlighted */}
    <p className={`text-xs leading-relaxed ${highlight ? 'text-slate-700' : 'text-slate-500'}`}>
      {subtitle}
    </p>
  </motion.div>
);

const Connector = ({ active, delay, color = "teal" }: any) => (
  <div className="h-10 w-px bg-white/10 relative">
    {active && (
      <motion.div 
        initial={{ top: 0, opacity: 0 }}
        animate={{ top: "100%", opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay, repeat: Infinity, ease: "linear" }}
        className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-3 blur-[2px] rounded-full ${color === 'teal' ? 'bg-teal-500' : 'bg-indigo-500'}`}
      />
    )}
  </div>
);