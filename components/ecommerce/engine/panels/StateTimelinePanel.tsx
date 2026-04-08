import { motion } from "framer-motion";
import type { StateTransition } from "../types";

interface StateTimelinePanelProps {
  timeline: StateTransition[];
}

export default function StateTimelinePanel({ timeline }: StateTimelinePanelProps) {
  return (
    <motion.div
      layout
      className="rounded-2xl p-5"
      style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
    >
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">State Transitions</p>
      <div className="space-y-2">
        {timeline.length > 0 ? (
          timeline.map((item) => (
            <div key={`${item.state}-${item.timestamp}`} className="rounded-xl border border-ink/6 bg-white/60 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium text-ink/68">{item.state}</p>
                <span className="text-[10px] font-mono text-ink/38">{item.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-ink/6 bg-white/60 px-3 py-3">
            <p className="text-[11px] text-ink/45">State transitions will appear as the session evolves.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
