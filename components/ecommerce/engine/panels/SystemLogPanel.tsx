import { motion } from "framer-motion";
import type { PipelineLogEntry } from "../types";

interface SystemLogPanelProps {
  logs: PipelineLogEntry[];
}

export default function SystemLogPanel({ logs }: SystemLogPanelProps) {
  return (
    <motion.div
      layout
      className="rounded-2xl p-5"
      style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
    >
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">System Log</p>
      <div className="space-y-2">
        {logs.map((entry) => (
          <div key={entry.stage} className="rounded-xl border border-ink/6 bg-white/60 px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">{entry.stage}</p>
              <span className="text-[10px] font-mono text-ink/35">live</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-ink/72">{entry.summary}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink/45">{entry.detail}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
