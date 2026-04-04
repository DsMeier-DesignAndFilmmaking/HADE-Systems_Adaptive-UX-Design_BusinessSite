import { hexToRgba } from "@/components/travel/utils";

interface CognitiveLoadArchitectureProps {
  accent?: string;
}

const SIGNAL_CATEGORIES = [
  {
    category: "Input Volatility",
    description:
      "Tracks edit and deletion rate per form field. A user who writes, deletes, and rewrites a value multiple times is not confused about the interface — they are uncertain about the correct answer. This is a direct measurement of decision reversal, not keystroke error.",
    accent: "#2C7B76",
  },
  {
    category: "Context Switching",
    description:
      "Measures app-to-documentation or app-to-external-tab toggle frequency per minute. Each toggle is a knowledge gap event: the user lacks the information required to complete the current field and must exit the application boundary to acquire it. High frequency indicates a systematic instruction failure, not user error.",
    accent: "#6366F1",
  },
  {
    category: "Field Stalling",
    description:
      "Records idle duration on a focused field, normalized against that field's structural complexity (required sub-inputs, validation constraints, character limits). Stalling on a high-complexity field is a capacity signal — the cognitive cost of the field exceeds the user's available working memory. Stalling on a low-complexity field indicates external interruption or distraction.",
    accent: "#8B5CF6",
  },
  {
    category: "Cursor Pathing",
    description:
      "Captures cursor velocity vectors and path deviation from the expected interaction zone. An erratic path — high standard deviation, repeated returns to previously visited UI regions — indicates scan failure. A cursor that accelerates toward exit controls (browser chrome, back button, navigation links) is a precursor signal for imminent abandonment.",
    accent: "#0891B2",
  },
];

const SIGNAL_TABLE = [
  {
    source: "Input Volatility",
    metric: "Edit/deletion rate per field (events/sec)",
    state: "Uncertainty / Decision Reversal",
    weight: 10,
  },
  {
    source: "Field Stalling (High Complexity)",
    metric: "Idle duration on fields with ≥ 3 required constraints",
    state: "Blocked / Capacity Exceeded",
    weight: 9,
  },
  {
    source: "Context Switching",
    metric: "App-to-docs toggle frequency (toggles/min)",
    state: "Knowledge Gap / Self-Interruption",
    weight: 9,
  },
  {
    source: "Cursor Retreat",
    metric: "Cursor velocity vector toward exit / back controls",
    state: "Abandonment Precursor",
    weight: 8,
  },
  {
    source: "Back-Navigation Velocity",
    metric: "Time delta between field focus and back event (ms)",
    state: "Confidence Failure",
    weight: 8,
  },
  {
    source: "Repeat Field Focus",
    metric: "Focus event count per field (threshold: > 3)",
    state: "Ambiguity / Instruction Failure",
    weight: 7,
  },
  {
    source: "Cursor Pathing (Erratic)",
    metric: "σ of cursor path deviation per session segment",
    state: "Disorientation / Scan Failure",
    weight: 7,
  },
  {
    source: "Field Stalling (Low Complexity)",
    metric: "Idle duration on simple fields (name, email, etc.)",
    state: "Distraction / External Interrupt",
    weight: 4,
  },
];

const FRICTION_BANDS = [
  {
    range: "0 – 30",
    state: "Configuring",
    description:
      "Baseline friction consistent with normal onboarding behavior. Signals present but below compounding threshold. No intervention triggered.",
    color: "#22C55E",
  },
  {
    range: "31 – 55",
    state: "Struggling",
    description:
      "Elevated friction across at least two signal categories. System surfaces a contextual micro-assist inline — a field-specific hint, a documentation shortcut, or a pre-fill suggestion — without interrupting session flow.",
    color: "#F59E0B",
  },
  {
    range: "56 – 74",
    state: "Blocked",
    description:
      "High abandonment probability. Triggered when Friction Score exceeds 56 AND at least two of the four primary signals (Input Volatility, Field Stalling, Context Switching, Cursor Retreat) are simultaneously active above their individual thresholds. The AND condition prevents false positives from single-signal noise (e.g., keyboard idle without concurrent context switching). Rescue layer is activated.",
    color: "#EF4444",
  },
  {
    range: "75 – 100",
    state: "Abandonment Imminent",
    description:
      "Session recovery window is closing. All four primary signals are active. HADE escalates to guided mode — a modal walkthrough, pre-configured template, or human handoff trigger — prioritizing session preservation over configuration purity.",
    color: "#7F1D1D",
    textColor: "#FCA5A5",
  },
];

export default function CognitiveLoadArchitecture({
  accent = "#2C7B76",
}: CognitiveLoadArchitectureProps) {
  return (
    <div
      className="rounded-xl p-6 md:p-8 mt-6 mb-2"
      style={{
        background: hexToRgba(accent, 0.03),
        border: "1px solid rgba(11,13,18,0.08)",
      }}
    >
      {/* Header */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-2">
        Cognitive Load Signal Architecture
      </p>
      <p className="text-sm text-ink/55 leading-relaxed mb-8 max-w-2xl">
        A formal specification of the behavioral telemetry layer that makes micro-hesitation a measurable engineering metric — moving beyond page views and clicks into high-fidelity intent detection.
      </p>

      {/* Signal Categories */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
        1 — Signal Stack
      </p>
      <div className="grid gap-3 sm:grid-cols-2 mb-8">
        {SIGNAL_CATEGORIES.map(({ category, description, accent: catAccent }) => (
          <div
            key={category}
            className="rounded-lg p-4"
            style={{
              borderLeft: `3px solid ${hexToRgba(catAccent, 0.5)}`,
              background: hexToRgba(catAccent, 0.04),
            }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-[0.15em] mb-2"
              style={{ color: hexToRgba(catAccent, 0.9) }}
            >
              {category}
            </p>
            <p className="text-xs text-ink/55 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* Signal Table */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
        2 — Telemetry Matrix
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full min-w-[620px] border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(11,13,18,0.08)" }}>
              {[
                "Signal Source",
                "Telemetry Metric",
                "Inferred Cognitive State",
                "Weight",
              ].map((col) => (
                <th
                  key={col}
                  className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/35 pb-2 pr-4"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIGNAL_TABLE.map(({ source, metric, state, weight }) => {
              const isHigh = weight >= 8;
              return (
                <tr
                  key={source}
                  style={{ borderBottom: "1px solid rgba(11,13,18,0.04)" }}
                >
                  <td className="text-sm text-ink/70 py-2.5 pr-4 font-medium">{source}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-ink/50">{metric}</td>
                  <td className="text-xs text-ink/55 py-2.5 pr-4">{state}</td>
                  <td className="py-2.5">
                    <span
                      className="inline-block text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
                      style={
                        isHigh
                          ? {
                              background: hexToRgba(accent, 0.12),
                              color: hexToRgba(accent, 1),
                            }
                          : {
                              background: "rgba(11,13,18,0.05)",
                              color: "rgba(11,13,18,0.45)",
                            }
                      }
                    >
                      {weight} / 10
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Friction Score + Abandonment Threshold */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
        3 — Friction Score Normalization & Abandonment Thresholds
      </p>
      <div
        className="rounded-lg p-4 mb-4 font-mono text-xs"
        style={{
          background: "rgba(11,13,18,0.04)",
          border: "1px solid rgba(11,13,18,0.07)",
        }}
      >
        <p className="text-ink/35 mb-1 text-[10px] uppercase tracking-[0.1em]">Composite Score Formula</p>
        <p className="text-ink/70">
          FrictionScore = ( Σ( normalize(signal<sub>i</sub>) × weight<sub>i</sub> ) / Σ( maxWeight<sub>i</sub> ) ) × 100
        </p>
        <p className="text-ink/40 mt-2 text-[11px] leading-relaxed not-italic" style={{ fontFamily: "inherit" }}>
          Each raw signal value is min-max normalized to a 0–1 float using observed session telemetry bounds.
          Normalization bounds are updated on a rolling 7-day window to account for cohort drift.
          The composite score is recomputed on every qualifying telemetry event — latency target ≤ 200 ms end-to-end.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {FRICTION_BANDS.map(({ range, state, description, color, textColor }) => (
          <div
            key={state}
            className="rounded-lg p-4"
            style={{
              background: `${color}0d`,
              border: `1px solid ${color}33`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-black tabular-nums"
                style={{ color }}
              >
                {range}
              </span>
              <span
                className="text-[10px] font-black uppercase tracking-[0.15em]"
                style={{ color: textColor ?? color }}
              >
                {state}
              </span>
            </div>
            <p className="text-xs text-ink/55 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
