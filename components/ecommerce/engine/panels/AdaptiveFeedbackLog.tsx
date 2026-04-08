import { motion } from "framer-motion";
import type { MicroFeedbackEntry } from "../types";

interface AdaptiveFeedbackLogProps {
  entries: MicroFeedbackEntry[];
}

export default function AdaptiveFeedbackLog({ entries }: AdaptiveFeedbackLogProps) {
  return (
    <div
      className="rounded-2xl border px-4 py-3"
      style={{ background: "rgba(255,255,255,0.72)", borderColor: "rgba(11,13,18,0.08)" }}
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">Adaptive Feedback</p>
      <div className="mt-3 space-y-2">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border px-3 py-2.5"
              style={{
                background:
                  entry.tone === "positive"
                    ? "rgba(34,197,94,0.06)"
                    : entry.tone === "alert"
                    ? "rgba(245,158,11,0.08)"
                    : "rgba(255,255,255,0.68)",
                borderColor:
                  entry.tone === "positive"
                    ? "rgba(34,197,94,0.16)"
                    : entry.tone === "alert"
                    ? "rgba(245,158,11,0.18)"
                    : "rgba(11,13,18,0.08)",
              }}
            >
              <p className="text-[11px] leading-relaxed text-ink/62">{entry.message}</p>
            </motion.div>
          ))
        ) : (
          <div className="rounded-xl border border-ink/6 bg-white/60 px-3 py-2.5">
            <p className="text-[11px] leading-relaxed text-ink/45">
              Micro-feedback will appear as the system interprets new activity and shifts ranking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
