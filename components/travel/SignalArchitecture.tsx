import { hexToRgba } from "./utils";

interface SignalArchitectureProps {
  accent?: string;
}

const SIGNAL_TIERS = [
  {
    tier: "Active",
    description:
      "User-initiated, high-fidelity inputs. Carry the highest confidence weighting because they represent explicit intent declarations.",
    examples: ["Voice log (NLP)", "Free-text journal entry", "Explicit tap selection"],
    color: "#0891B2",
  },
  {
    tier: "Passive",
    description:
      "Sensor and telemetry streams generated automatically by device state. Intent is inferred, not declared — confidence is attenuated accordingly.",
    examples: ["GPS position fix", "Geospatial velocity Δ", "Dwell time", "Device orientation", "Ambient noise level"],
    color: "#6366F1",
  },
  {
    tier: "Environmental",
    description:
      "Third-party API payloads providing contextual ground truth. Latency is higher; signals are used to modulate, not drive, intent resolution.",
    examples: ["Weather API (OWM)", "Local event feed (Eventbrite)"],
    color: "#8B5CF6",
  },
];

const SIGNAL_TABLE_ROWS = [
  { source: "Voice Log (NLP)", dataType: "Text / Phoneme stream", latency: "Real-time ≤ 100 ms", weight: 10, tier: "Active" },
  { source: "Free-text Journal Entry", dataType: "Tokenized string", latency: "Near-real-time ≤ 500 ms", weight: 9, tier: "Active" },
  { source: "Explicit Tap Selection", dataType: "Discrete event", latency: "Real-time ≤ 50 ms", weight: 8, tier: "Active" },
  { source: "GPS Position Fix", dataType: "Geospatial coordinate", latency: "Real-time ≤ 200 ms", weight: 7, tier: "Passive" },
  { source: "Geospatial Velocity Δ", dataType: "Derived float (m/s)", latency: "Near-real-time ≤ 1 s", weight: 6, tier: "Passive" },
  { source: "Dwell Time (session)", dataType: "Duration integer (ms)", latency: "Batch ≤ 5 s", weight: 5, tier: "Passive" },
  { source: "Weather API (OWM)", dataType: "JSON payload", latency: "Async ≤ 10 s", weight: 5, tier: "Environmental" },
  { source: "Device Orientation", dataType: "IMU quaternion", latency: "Real-time ≤ 100 ms", weight: 4, tier: "Passive" },
  { source: "Local Event Feed (Eventbrite)", dataType: "Structured JSON", latency: "Async ≤ 30 s", weight: 4, tier: "Environmental" },
  { source: "Ambient Noise Level", dataType: "Audio RMS float", latency: "Real-time ≤ 200 ms", weight: 3, tier: "Passive" },
];

const PIPELINE_STAGES = [
  {
    index: "01",
    label: "Signal Ingestion",
    detail:
      "Raw streams from all three tiers enter the HADE signal bus concurrently. Each stream is tagged with a source ID, timestamp, and tier classification before downstream processing.",
  },
  {
    index: "02",
    label: "Tokenization & Intent Extraction",
    detail:
      "The NLP layer tokenizes voice and free-text inputs into a normalized token sequence. A fine-tuned intent classifier assigns a primary intent label (e.g., FOOD_SEEK, TRANSIT, EXPLORE) alongside a scalar confidence score.",
  },
  {
    index: "03",
    label: "Signal Normalization",
    detail:
      "Heterogeneous inputs — GPS coordinates, audio RMS values, dwell durations — are each mapped to a normalized 0–1 float. The normalized value is then multiplied by the source's confidence weight to produce a weighted signal unit.",
  },
  {
    index: "04",
    label: "Geospatial Velocity Analysis",
    detail:
      "A derived movement vector is computed from sequential GPS fixes. Velocity thresholds classify the device state as STATIONARY, WALKING, or IN_TRANSIT. This classification modulates the urgency score of co-occurring intent signals.",
  },
  {
    index: "05",
    label: "Decision Emission",
    detail:
      "The highest-confidence composite intent — assembled by summing weighted signal units across the active window — is serialized and dispatched to the Spontaneity Engine v4.2, which triggers the corresponding UI mutation.",
  },
];

const TIER_COLORS: Record<string, string> = {
  Active: "#0891B2",
  Passive: "#6366F1",
  Environmental: "#8B5CF6",
};

export default function SignalArchitecture({ accent = "#0891B2" }: SignalArchitectureProps) {
  return (
    <div
      className="rounded-xl p-6 md:p-8 mb-10"
      style={{
        background: hexToRgba(accent, 0.03),
        border: "1px solid rgba(11,13,18,0.08)",
      }}
    >
      {/* Header */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-2">
        Signal Architecture
      </p>
      <p className="text-sm text-ink/55 leading-relaxed mb-8 max-w-2xl">
        A formal specification of how the HADE Engine ingests, classifies, and weights heterogeneous input streams before resolving them into a single high-confidence intent dispatch.
      </p>

      {/* Signal Hierarchy */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
        1 — Signal Hierarchy
      </p>
      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {SIGNAL_TIERS.map(({ tier, description, examples, color }) => (
          <div
            key={tier}
            className="rounded-lg p-4"
            style={{
              borderLeft: `3px solid ${hexToRgba(color, 0.5)}`,
              background: hexToRgba(color, 0.04),
            }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-[0.15em] mb-2"
              style={{ color: hexToRgba(color, 0.9) }}
            >
              {tier}
            </p>
            <p className="text-xs text-ink/60 leading-relaxed mb-3">{description}</p>
            <ul className="space-y-1">
              {examples.map((ex) => (
                <li key={ex} className="text-[11px] text-ink/45 flex items-center gap-1.5">
                  <span
                    className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: hexToRgba(color, 0.6) }}
                  />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Signal Table */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
        2 — Signal Weighting Matrix
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(11,13,18,0.08)" }}>
              {["Signal Source", "Data Type", "Latency Requirement", "Weight"].map((col) => (
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
            {SIGNAL_TABLE_ROWS.map(({ source, dataType, latency, weight, tier }) => {
              const tierColor = TIER_COLORS[tier] ?? accent;
              const isHighConfidence = weight >= 8;
              return (
                <tr
                  key={source}
                  style={{ borderBottom: "1px solid rgba(11,13,18,0.04)" }}
                >
                  <td className="text-sm text-ink/70 py-2.5 pr-4 font-medium">{source}</td>
                  <td className="text-sm text-ink/50 py-2.5 pr-4 font-mono text-xs">{dataType}</td>
                  <td className="text-sm text-ink/50 py-2.5 pr-4 font-mono text-xs">{latency}</td>
                  <td className="py-2.5">
                    <span
                      className="inline-block text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
                      style={
                        isHighConfidence
                          ? {
                              background: hexToRgba(tierColor, 0.12),
                              color: hexToRgba(tierColor, 1),
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

      {/* Processing Pipeline */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
        3 — Processing Pipeline
      </p>
      <div className="space-y-0">
        {PIPELINE_STAGES.map(({ index, label, detail }, i) => (
          <div key={index} className="flex gap-4 group">
            {/* Connector */}
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black"
                style={{
                  background: hexToRgba(accent, 0.1),
                  color: hexToRgba(accent, 0.9),
                }}
              >
                {index}
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div
                  className="w-px flex-1 mt-1"
                  style={{ background: hexToRgba(accent, 0.15), minHeight: "24px" }}
                />
              )}
            </div>
            {/* Content */}
            <div className="pb-5">
              <p className="text-sm font-semibold text-ink/80 leading-snug mb-1">{label}</p>
              <p className="text-xs text-ink/50 leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
