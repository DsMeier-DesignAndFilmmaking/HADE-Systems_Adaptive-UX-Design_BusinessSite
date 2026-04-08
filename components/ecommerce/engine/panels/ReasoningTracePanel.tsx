import { motion } from "framer-motion";
import type { SignalContribution } from "../types";
import { GOLD } from "../config";

interface ReasoningTracePanelProps {
  topSignals: SignalContribution[];
}

export default function ReasoningTracePanel({ topSignals }: ReasoningTracePanelProps) {
  return (
    <motion.div
      layout
      className="rounded-2xl p-5"
      style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
    >
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Reasoning Trace</p>

      <div className="space-y-2">
        {topSignals.map((signal) => (
          <div key={signal.label} className="rounded-xl border border-ink/6 bg-white/60 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium text-ink/68">{signal.label}</p>
              <span className="text-[11px] font-mono font-semibold" style={{ color: GOLD }}>
                {signal.contribution.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[10px] font-mono text-ink/42">
              {signal.value} x weight {signal.weight}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
