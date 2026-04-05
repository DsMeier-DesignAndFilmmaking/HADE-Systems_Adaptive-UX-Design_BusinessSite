import { hexToRgba } from "./utils";

type InstrumentationStatus = "blind-spot" | "partial" | "tracked";
type ExecPriority = 1 | 2 | 3;

interface KpiMetric {
  id: string;
  name: string;
  abbrev: string;
  definition: string;
  target: string;
  status: InstrumentationStatus;
  priority: ExecPriority;
}

interface KpiCategory {
  index: string;
  label: string;
  subtitle: string;
  metrics: KpiMetric[];
}

interface FailurePoint {
  signal: string;
  description: string;
  severity: "high" | "medium";
}

interface PriorityRow {
  rank: number;
  metric: string;
  abbrev: string;
  category: string;
  rationale: string;
}

interface EnterpriseMetricsAuditProps {
  accent?: string;
}

const STATUS_CONFIG: Record<InstrumentationStatus, { label: string; dot: string; bg: string; border: string; text: string }> = {
  "blind-spot": { label: "Blind Spot", dot: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.18)", text: "#FCA5A5" },
  partial:      { label: "Partial",    dot: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)", text: "#FCD34D" },
  tracked:      { label: "Tracked",    dot: "#22C55E", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.18)",  text: "#4ADE80" },
};

const PRIORITY_LABEL: Record<ExecPriority, string> = {
  1: "P1",
  2: "P2",
  3: "P3",
};

const KPI_CATEGORIES: KpiCategory[] = [
  {
    index: "01",
    label: "Systems-Level UX Efficiency",
    subtitle: "Traveler's Friction Metrics",
    metrics: [
      {
        id: "ttd",
        name: "Time-to-Decision",
        abbrev: "TTD",
        definition: "Seconds and interactions elapsed from Signal Ingest (voice log or text entry) to an Explicit Tap on a HADE-recommended node.",
        target: "< 8 seconds / ≤ 3 interactions",
        status: "blind-spot",
        priority: 1,
      },
      {
        id: "sar",
        name: "Signal-to-Action Ratio",
        abbrev: "SAR",
        definition: "Percentage of HADE-scored recommendations that result in a navigation or booking event vs. those ignored or dismissed.",
        target: "> 45% of scored recommendations acted on",
        status: "blind-spot",
        priority: 1,
      },
      {
        id: "cli",
        name: "Cognitive Load Index",
        abbrev: "CLI",
        definition: "Frequency of UI mutations per 60-second session window. Threshold between 'UI Flutter' (distracting) and 'Helpful Guidance' (adaptive).",
        target: "< 4 mutations per 60-second window",
        status: "blind-spot",
        priority: 2,
      },
    ],
  },
  {
    index: "02",
    label: "HADE Engine Technical Reliability",
    subtitle: "Trust Metrics",
    metrics: [
      {
        id: "irl",
        name: "Intent Resolution Latency",
        abbrev: "IRL",
        definition: "End-to-end time from raw signal ingestion (voice or text) to UI panel re-ranking. Measures three sub-latencies: edge inference, scoring SLA, and UI re-rank.",
        target: "< 500ms end-to-end · 200ms scoring SLA · < 100ms UI re-rank",
        status: "partial",
        priority: 1,
      },
      {
        id: "cfs",
        name: "Confidence Floor Stability",
        abbrev: "CFS",
        definition: "Variance in HADE scoring for the same user across equivalent Geospatial Velocity states. Measures whether the engine 'flickers' between intent classifications.",
        target: "Variance < 0.05 std dev across equivalent velocity states",
        status: "blind-spot",
        priority: 2,
      },
      {
        id: "ood",
        name: "Offline-to-Online Delta",
        abbrev: "OOD",
        definition: "Accuracy of Deferred Scoring — HADE logic applied to buffered signals captured offline — compared to equivalent live-session baseline on reconnect.",
        target: "Deferred scoring accuracy ≥ 85% vs. live session baseline",
        status: "partial",
        priority: 2,
      },
    ],
  },
  {
    index: "03",
    label: "Business & Executive-Level Outcomes",
    subtitle: "Marketability Metrics",
    metrics: [
      {
        id: "pdl",
        name: "POI Discovery Lift",
        abbrev: "PDL",
        definition: "Uplift in user engagement with Points of Interest in the Adaptive Treatment (HADE-enabled) vs. the Static Control (Field Notes without HADE).",
        target: "≥ 18% engagement uplift · Treatment vs. Control · p < 0.05",
        status: "blind-spot",
        priority: 1,
      },
      {
        id: "sr",
        name: "Session Resilience",
        abbrev: "SR",
        definition: "Percentage of users who successfully complete a defined Travel Task (e.g., finding food during a layover) under low-connectivity or high-velocity conditions.",
        target: "≥ 80% task completion under < 2G connectivity or IN_TRANSIT state",
        status: "blind-spot",
        priority: 2,
      },
      {
        id: "is",
        name: "Integration Scalability",
        abbrev: "IS / API Multiplier",
        definition: "Time-to-Integration for a third-party travel provider to map their data schema into a HADE Adaptive Recommendation Slot via the platform API.",
        target: "< 5 business days Time-to-Integration",
        status: "blind-spot",
        priority: 3,
      },
    ],
  },
];

const FAILURE_POINTS: FailurePoint[] = [
  {
    signal: "Voice NLP",
    description: "High ambient noise in airports and transit hubs degrades the weight-10 signal — the highest-confidence tier becomes least reliable in the highest-intent travel contexts.",
    severity: "high",
  },
  {
    signal: "GPS Precision",
    description: "Within-city coordinate precision is opt-in and not consistently available; Geospatial Velocity classifier degrades to coarse WALKING/IN_TRANSIT inference without a position fix.",
    severity: "high",
  },
  {
    signal: "Offline Scoring",
    description: "Deferred scoring strategy is not finalized; reconnect delta accuracy is structurally unmeasurable until the production HADE endpoint is wired and session buffering is validated.",
    severity: "high",
  },
  {
    signal: "Confidence Floor",
    description: "No live endpoint means Confidence Floor Stability is unmeasurable today. Without a circuit-breaker, the engine may flicker between intent classifications with no correction mechanism.",
    severity: "medium",
  },
  {
    signal: "Panel Telemetry",
    description: "Adaptive panel mutations are not connected to a closed-loop learning pipeline. Signal-to-Action Ratio accumulates no feedback signal, blocking automated threshold recalibration.",
    severity: "medium",
  },
];

const EXEC_PRIORITY_RANKING: PriorityRow[] = [
  { rank: 1, metric: "Time-to-Decision", abbrev: "TTD", category: "UX Efficiency", rationale: "Primary demo metric for any Series A conversation; directly quantifies the product value claim." },
  { rank: 2, metric: "POI Discovery Lift", abbrev: "PDL", category: "Business Outcomes", rationale: "The A/B proof point. LaunchDarkly split is already planned — this formalizes the success criteria." },
  { rank: 3, metric: "Intent Resolution Latency", abbrev: "IRL", category: "Engine Reliability", rationale: "SLA target already exists (200ms). Closest metric to production-ready today." },
  { rank: 4, metric: "Signal-to-Action Ratio", abbrev: "SAR", category: "UX Efficiency", rationale: "Directly tied to recommendation relevance and the HADE vs. static UI competitive claim." },
  { rank: 5, metric: "Confidence Floor Stability", abbrev: "CFS", category: "Engine Reliability", rationale: "Required before enterprise data-sharing agreements. Partners need scoring variance guarantees." },
];

// All 9 KPI metrics flattened for gap analysis
const ALL_METRICS = KPI_CATEGORIES.flatMap((c) => c.metrics);
const UNTRACKED_COUNT = ALL_METRICS.filter((m) => m.status === "blind-spot" || m.status === "partial").length;

export default function EnterpriseMetricsAudit({ accent = "#0891B2" }: EnterpriseMetricsAuditProps) {
  return (
    <div
      className="relative rounded-xl p-6 md:p-8 font-mono"
      style={{
        background: "linear-gradient(160deg, #0B0F18 0%, #0f1520 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Blueprint grid overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Header */}
      <div className="relative mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-[9px] font-black uppercase tracking-[0.25em] px-2 py-0.5 rounded"
            style={{
              background: hexToRgba(accent, 0.15),
              color: hexToRgba(accent, 0.9),
              border: `1px solid ${hexToRgba(accent, 0.25)}`,
            }}
          >
            Enterprise Audit
          </span>
        </div>
        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">
          KPIs &amp; Metrics Framework
        </p>
        <p className="text-xs text-white/35 leading-relaxed max-w-2xl" style={{ fontFamily: "inherit" }}>
          Formal instrumentation specification bridging technical signal processing and business value delivery. Assessed against current build state.
        </p>
      </div>

      {/* ── Categories 01–03 ──────────────────────────────────── */}
      {KPI_CATEGORIES.map((category) => (
        <div key={category.index} className="relative mb-8">
          <p
            className="text-[9px] font-black uppercase tracking-[0.25em] mb-0.5"
            style={{ color: hexToRgba(accent, 0.6) }}
          >
            // {category.index} — {category.label}
          </p>
          <p className="text-[11px] text-white/40 mb-3" style={{ fontFamily: "inherit" }}>
            {category.subtitle}
          </p>
          <div className="grid gap-2">
            {category.metrics.map((metric) => {
              const cfg = STATUS_CONFIG[metric.status];
              return (
                <div
                  key={metric.id}
                  className="rounded-md px-3 py-3"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  {/* Row 1: name + badges */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
                    />
                    <span
                      className="text-[11px] font-black uppercase tracking-[0.1em] flex-1"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      {metric.name}
                      <span className="ml-1.5 font-black" style={{ color: hexToRgba(accent, 0.7) }}>
                        ({metric.abbrev})
                      </span>
                    </span>
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{
                        background: hexToRgba(accent, 0.12),
                        color: hexToRgba(accent, 0.8),
                        border: `1px solid ${hexToRgba(accent, 0.2)}`,
                      }}
                    >
                      {PRIORITY_LABEL[metric.priority]}
                    </span>
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.1em] flex-shrink-0"
                      style={{ color: cfg.text }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  {/* Row 2: definition */}
                  <p
                    className="text-[11px] leading-relaxed mb-2 pl-4"
                    style={{ color: "rgba(255,255,255,0.50)", fontFamily: "inherit" }}
                  >
                    {metric.definition}
                  </p>
                  {/* Row 3: target */}
                  <div className="pl-4">
                    <span
                      className="inline-block text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded"
                      style={{
                        background: hexToRgba(accent, 0.08),
                        color: hexToRgba(accent, 0.65),
                        border: `1px solid ${hexToRgba(accent, 0.15)}`,
                      }}
                    >
                      Target: {metric.target}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── 04 — Analysis Framework ───────────────────────────── */}
      <div className="relative">
        <p
          className="text-[9px] font-black uppercase tracking-[0.25em] mb-4"
          style={{ color: hexToRgba(accent, 0.6) }}
        >
          // 04 — Analysis Framework
        </p>

        {/* Sub-section A: Gap Analysis */}
        <div className="mb-6">
          <p
            className="text-[9px] font-black uppercase tracking-[0.2em] mb-3"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Gap Summary — Blind Spots by Count
          </p>
          <div
            className="rounded-md p-4 mb-3"
            style={{
              background: hexToRgba(accent, 0.07),
              borderLeft: `2px solid ${hexToRgba(accent, 0.5)}`,
            }}
          >
            <p
              className="text-[11px] font-black uppercase tracking-[0.1em] mb-3"
              style={{ color: hexToRgba(accent, 0.8) }}
            >
              {UNTRACKED_COUNT} of {ALL_METRICS.length} KPIs currently untracked or partially instrumented
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {ALL_METRICS.filter((m) => m.status !== "tracked").map((metric) => {
                const cfg = STATUS_CONFIG[metric.status];
                return (
                  <div key={metric.id} className="flex items-center gap-2">
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: cfg.dot }}
                    />
                    <span
                      className="text-[10px] flex-1"
                      style={{ color: "rgba(255,255,255,0.55)", fontFamily: "inherit" }}
                    >
                      {metric.abbrev} — {metric.name}
                    </span>
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.05em] flex-shrink-0"
                      style={{ color: cfg.text }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sub-section B: Critical Failure Points */}
        <div className="mb-6">
          <p
            className="text-[9px] font-black uppercase tracking-[0.2em] mb-3"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Critical Failure Points — Signal Hierarchy Risks
          </p>
          <div className="grid gap-2">
            {FAILURE_POINTS.map((fp) => {
              const isHigh = fp.severity === "high";
              return (
                <div
                  key={fp.signal}
                  className="flex gap-3 rounded-md px-3 py-2.5"
                  style={{
                    background: isHigh ? "rgba(239,68,68,0.06)" : "rgba(245,158,11,0.06)",
                    border: `1px solid ${isHigh ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)"}`,
                  }}
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-[0.1em] flex-shrink-0 mt-0.5"
                    style={{ color: isHigh ? "#FCA5A5" : "#FCD34D" }}
                  >
                    {isHigh ? "HIGH" : "MED"}
                  </span>
                  <div>
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.08em] block mb-0.5"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {fp.signal}
                    </span>
                    <p
                      className="text-[10px] leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.45)", fontFamily: "inherit" }}
                    >
                      {fp.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sub-section C: Executive Priority Ranking */}
        <div>
          <p
            className="text-[9px] font-black uppercase tracking-[0.2em] mb-3"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Executive Priority Ranking — Series A / Enterprise Pitch
          </p>
          <div className="overflow-x-auto">
            <table
              className="w-full text-left"
              style={{ minWidth: "560px", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Rank", "Metric", "Category", "Rationale"].map((col) => (
                    <th
                      key={col}
                      className="pb-2 text-[9px] font-black uppercase tracking-[0.15em]"
                      style={{ color: "rgba(255,255,255,0.30)", paddingRight: "16px" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXEC_PRIORITY_RANKING.map((row, i) => (
                  <tr
                    key={row.rank}
                    style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
                  >
                    <td className="py-2" style={{ paddingRight: "16px" }}>
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-black"
                        style={{
                          background: hexToRgba(accent, 0.15),
                          color: hexToRgba(accent, 0.9),
                          border: `1px solid ${hexToRgba(accent, 0.25)}`,
                        }}
                      >
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-2" style={{ paddingRight: "16px" }}>
                      <span
                        className="text-[10px] font-black uppercase tracking-[0.05em]"
                        style={{ color: "rgba(255,255,255,0.70)" }}
                      >
                        {row.abbrev}
                      </span>
                      <span
                        className="block text-[9px]"
                        style={{ color: "rgba(255,255,255,0.35)", fontFamily: "inherit" }}
                      >
                        {row.metric}
                      </span>
                    </td>
                    <td className="py-2" style={{ paddingRight: "16px" }}>
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
                        style={{
                          background: hexToRgba(accent, 0.1),
                          color: hexToRgba(accent, 0.7),
                          border: `1px solid ${hexToRgba(accent, 0.18)}`,
                        }}
                      >
                        {row.category}
                      </span>
                    </td>
                    <td className="py-2">
                      <p
                        className="text-[10px] leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.45)", fontFamily: "inherit" }}
                      >
                        {row.rationale}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
