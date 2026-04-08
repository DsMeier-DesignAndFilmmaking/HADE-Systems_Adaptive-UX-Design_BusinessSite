import { motion } from "framer-motion";
import type { ModelMetric } from "../types";

interface ModelMetricsPanelProps {
  metrics: ModelMetric[];
}

export default function ModelMetricsPanel({ metrics }: ModelMetricsPanelProps) {
  return (
    <motion.div
      layout
      className="rounded-2xl p-5"
      style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
    >
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Model Metrics</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-ink/6 bg-white/60 px-3 py-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/35">{metric.label}</p>
            <p className="mt-1 text-sm font-semibold text-ink/75" suppressHydrationWarning>{metric.value}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink/45">{metric.detail}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
