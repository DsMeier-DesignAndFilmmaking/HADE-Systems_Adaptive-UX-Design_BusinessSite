import { motion } from "framer-motion";
import type { StateAssessment } from "../types";
import { GOLD } from "../config";

interface DetectedStatePanelProps {
  assessment: StateAssessment;
}

export default function DetectedStatePanel({ assessment }: DetectedStatePanelProps) {
  return (
    <motion.div
      layout
      className="rounded-2xl p-5"
      style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.07)" }}
    >
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-ink/35">Detected State</p>

      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(11,13,18,0.06)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD, opacity: 0.7 }}>
              Behavioral Classification
            </p>
            <h4 className="text-lg font-bold tracking-tight text-ink">{assessment.state}</h4>
            <p className="mt-1 text-xs text-ink/45">{assessment.rationale}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-ink/40">confidence</p>
            <p className="text-base font-bold" style={{ color: GOLD }}>
              {assessment.confidence}%
            </p>
          </div>
        </div>

        <div className="mt-4 h-[4px] w-full overflow-hidden rounded-full bg-ink/[0.06]">
          <motion.div
            animate={{ width: `${assessment.confidence}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: GOLD }}
          />
        </div>

        <p className="mt-3 text-[11px] font-medium text-ink/55">
          {assessment.state} detected - {assessment.confidence}% confidence
        </p>
        {assessment.lowConfidence && (
          <p className="mt-2 rounded-lg bg-red-500/8 px-2.5 py-2 text-[11px] font-medium text-red-700">
            Low confidence state. The model is still reconciling competing behavioral evidence.
          </p>
        )}
        {assessment.conflictSignals.length > 0 && (
          <div className="mt-2 space-y-2">
            {assessment.conflictSignals.map((conflict) => (
              <p
                key={conflict}
                className="rounded-lg bg-amber-500/10 px-2.5 py-2 text-[11px] font-medium text-amber-800"
              >
                Conflicting signals: {conflict}
              </p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
