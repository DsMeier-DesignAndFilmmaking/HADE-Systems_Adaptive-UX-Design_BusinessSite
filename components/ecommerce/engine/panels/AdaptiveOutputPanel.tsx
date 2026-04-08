import { motion } from "framer-motion";
import type { LeaderChangeSummary, RankedProduct } from "../types";
import { GOLD } from "../config";

interface AdaptiveOutputPanelProps {
  leader: RankedProduct;
  leaderChangeSummary: LeaderChangeSummary;
  rankChangeIds: string[];
}

export default function AdaptiveOutputPanel({ leader, leaderChangeSummary, rankChangeIds }: AdaptiveOutputPanelProps) {
  return (
    <motion.div
      layout
      className="rounded-2xl p-5"
      style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
    >
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Adaptive Output</p>

      <motion.div
        key={leader.id}
        layout
        initial={{ opacity: 0.75, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl p-4"
        style={{ background: "rgba(196,146,42,0.08)", border: "1px solid rgba(196,146,42,0.20)" }}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD, opacity: 0.7 }}>
            {leader.category}
          </p>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-700">
            Based on your behavior
          </span>
          {rankChangeIds.includes(leader.id) && (
            <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-green-700">
              Rising
            </span>
          )}
        </div>
        <h4 className="text-xl font-bold tracking-tight text-ink">{leader.name}</h4>
        <p className="mt-1 text-xs text-ink/45">{leader.material}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-lg font-bold text-ink">{leader.price}</p>
          <p className="text-[10px] font-mono text-ink/40">{leader.score.toFixed(2)} weighted score</p>
        </div>
        <div className="mt-4 rounded-xl border border-ink/6 bg-white/72 px-3 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">
            {leaderChangeSummary.headline}
          </p>
          <p className="mt-1 text-[11px] font-medium text-ink/58">{leaderChangeSummary.detail}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
