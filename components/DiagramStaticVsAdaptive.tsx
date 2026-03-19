"use client";

import { motion } from "framer-motion";

type NodeProps = {
  label: string;
};

function Node({ label }: NodeProps) {
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium text-ink/80 shadow-sm">{label}</div>
  );
}

export function DiagramStaticVsAdaptive() {
  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5 }}
    >
      <div className="panel p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Static Flow</p>
        <div className="mt-4 flex items-center gap-2 overflow-auto pb-1">
          <Node label="Landing" />
          <span className="text-ink/35">→</span>
          <Node label="Signup" />
          <span className="text-ink/35">→</span>
          <Node label="Onboarding" />
          <span className="text-ink/35">→</span>
          <Node label="Drop-off" />
        </div>
        <p className="mt-4 text-sm text-ink/70">Every user receives the same sequence, even when intent and readiness are different.</p>
      </div>

      <div className="panel p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Adaptive System</p>
        <div className="mt-4 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Node label="Landing" />
            <span className="text-ink/35">→</span>
            <Node label="Signal Read" />
            <span className="text-ink/35">→</span>
            <Node label="Route" />
          </div>
          <div className="grid grid-cols-2 gap-2 pl-12">
            <Node label="Evaluator Path" />
            <Node label="Operator Path" />
            <Node label="Fast Value Prompt" />
            <Node label="Guided Setup Prompt" />
          </div>
        </div>
        <p className="mt-4 text-sm text-ink/70">The interface adapts messaging, path, and assistance based on live behavior signals.</p>
      </div>
    </motion.div>
  );
}
