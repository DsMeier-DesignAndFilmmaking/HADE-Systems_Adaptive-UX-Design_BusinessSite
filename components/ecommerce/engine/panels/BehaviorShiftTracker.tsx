import type { StateAssessment } from "../types";
import { getBehaviorShiftStep } from "../narrative";

const SHIFT_LABELS = ["Exploration", "Comparison", "Decision"];

interface BehaviorShiftTrackerProps {
  assessment: StateAssessment;
}

export default function BehaviorShiftTracker({ assessment }: BehaviorShiftTrackerProps) {
  const currentStep = getBehaviorShiftStep(assessment.state);

  return (
    <div
      className="rounded-2xl border px-4 py-3"
      style={{ background: "rgba(255,255,255,0.72)", borderColor: "rgba(11,13,18,0.08)" }}
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink/38">Behavioral Shift</p>
      <div className="mt-3 flex items-center gap-2">
        {SHIFT_LABELS.map((label, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className="inline-flex min-w-0 flex-1 items-center justify-center rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  borderColor: isActive || isComplete ? "rgba(196,146,42,0.35)" : "rgba(11,13,18,0.08)",
                  background: isActive ? "rgba(196,146,42,0.10)" : isComplete ? "rgba(196,146,42,0.05)" : "rgba(255,255,255,0.7)",
                  color: isActive || isComplete ? "rgba(120,86,20,0.92)" : "rgba(11,13,18,0.46)",
                }}
              >
                {label}
              </div>
              {index < SHIFT_LABELS.length - 1 && <span className="text-[10px] text-ink/28">&rarr;</span>}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-ink/50">
        The session is currently in <span className="font-semibold text-ink/70">{assessment.state}</span>, so the model is emphasizing{" "}
        {assessment.state === "Browsing"
          ? "broad exploration signals."
          : assessment.state === "Evaluating"
          ? "comparisons and repeated attention."
          : assessment.state === "Hesitating"
          ? "friction and revisit behavior."
          : "commitment-focused signals and a widening score gap."}
      </p>
    </div>
  );
}
