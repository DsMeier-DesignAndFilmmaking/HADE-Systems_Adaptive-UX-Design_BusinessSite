import { hexToRgba } from "@/components/travel/utils";

interface SystemsAuditMetricsProps {
  accent?: string;
}

interface AuditMetric {
  name: string;
  definition: string;
  detail: string;
  target?: string;
  note?: string;
}

interface AuditCategory {
  number: string;
  sectionLabel: string;
  metrics: AuditMetric[];
}

interface StackRankItem {
  rank: number;
  metric: string;
  rationale: string;
}

const AUDIT_CATEGORIES: AuditCategory[] = [
  {
    number: "1",
    sectionLabel: "1 — Accuracy Metrics — Engine Precision",
    metrics: [
      {
        name: "State Transition Recall",
        definition:
          "% of users flagged as \"Evaluating\" who subsequently Return-to-Search within the same session — the False Positive rate for state classification.",
        detail:
          "Evaluating-flag timestamp compared against the next Return-to-Search event in the session event log. Measured per cohort, reported as FP% and F1 score against ground-truth conversion labels.",
        target: "≤8% FP rate | F1 ≥ 0.90",
        note: "Behavioral Precision",
      },
      {
        name: "Signal Decay Rate",
        definition:
          "The point at which a Mid-Intent Signal (e.g., Dwell Time) loses predictive power within a session — defines the rolling recalculation window for Intent Score.",
        detail:
          "Exponential decay model: λ = 0.023/sec, half-life ~30s. Intent Score recalculated on each new signal event within the active window. Signals outside the window are zero-weighted.",
        target: "90-second rolling decay window",
        note: "Signal Modeling",
      },
      {
        name: "Intent Resolution Lag",
        definition:
          "Time (ms) from Back-Navigation signal emit to catalog re-ordering at the Edge. Measures end-to-end latency across the full signal-to-render pipeline.",
        detail:
          "Component breakdown: SDK emit ~5ms + HTTP/2 ingestion ~20ms + scoring model ~70ms + KV write ~10ms + Edge Middleware intercept ~8ms = ~113ms typical path.",
        target: "<200ms P99 — zero visible reflow",
        note: "Infrastructure SLA",
      },
    ],
  },
  {
    number: "2",
    sectionLabel: "2 — Friction Metrics — Decision Path Quality",
    metrics: [
      {
        name: "Choice-Set Narrowing Efficiency",
        definition:
          "Average reduction in Product Impressions before a Cart Add event in the HADE treatment group vs. the Control. Fewer impressions before cart add = more efficient path to decision.",
        detail:
          "Formula: (Control impressions − HADE impressions) / Control impressions × 100. Measured per session from first PDP view to cart add event. Excludes sessions with no cart add.",
        target: "≥25% impression reduction",
        note: "Decision Efficiency",
      },
      {
        name: "Comparison-Phase Compression",
        definition:
          "Median session time in the \"Evaluating\" state — from the first Evaluating classification to Cart Add (or session exit). Validates that HADE shortens the decision cycle, not just rearranges the UI.",
        detail:
          "Session-level timestamp delta between Evaluating-state entry and Cart Add event. Median reported across cohort to reduce skew from outlier sessions. Compared against Control cohort median.",
        target: "−20% vs. Control median",
        note: "Session Efficiency",
      },
      {
        name: "Hesitation-to-Guidance Conversion",
        definition:
          "CTR on HADE-generated recommendation or rationale cards triggered specifically during detected hesitation loops — not all HADE surfaces, only hesitation-triggered ones.",
        detail:
          "Formula: clicks on hesitation-triggered rationale / total hesitation-state triggers. Requires event tagging at the trigger-type level in the analytics schema.",
        target: "≥35% CTR",
        note: "Intervention Effectiveness",
      },
    ],
  },
  {
    number: "3",
    sectionLabel: "3 — Executive Metrics — GMV Impact",
    metrics: [
      {
        name: "Incremental Conversion Lift (ICL) — MDE",
        definition:
          "The Minimum Detectable Effect for the designed A/B test: 4,200 sessions/cohort, α = 0.05 (two-tailed), 80% power (β = 0.20), at a 3.5% baseline conversion rate.",
        detail:
          "MDE = 2 × √(p(1−p)/n) × Z_α/2 ≈ 0.57% absolute lift. This detects a relative effect ≥16% at 80% power — within the projected +12–18% range. Confirms the test is adequately powered to validate the headline projection.",
        target: "MDE 0.57% absolute | relative ≥16%",
        note: "A/B Test Design",
      },
      {
        name: "Return-to-Search (RTS) Reduction",
        definition:
          "Decrease in redundant Search API calls per session following a HADE re-ranking event. A key proxy for search debt and ranking failure rate.",
        detail:
          "Search event count per session in HADE vs. Control cohorts, normalized by session duration. Each RTS event = 1 additional query execution + filter state reconstruction + full ranking compute cycle.",
        target: "−30% RTS frequency",
        note: "Search Debt Proxy",
      },
      {
        name: "Session RPM (Revenue Per Mille)",
        definition:
          "Total revenue generated per 1,000 sessions where HADE was active vs. 1,000 baseline sessions. The direct, single-number executive signal for session monetization delta.",
        detail:
          "Formula: (Cohort Revenue / Cohort Sessions) × 1,000. Illustrative model: 3.5% CVR × $120 AOV = $4,200 RPM baseline → $4,830 RPM at +15% lift (+$630 per mille).",
        target: "+$630/mille at +15% lift",
        note: "Revenue Signal",
      },
    ],
  },
];

const TECH_PAYLOAD_ASSESSMENT: AuditMetric = {
  name: "Technical Credibility: 4KB Payload Assessment",
  definition:
    "Claim from Roadmap Step 03: product arrays field-projected to ≤4KB before serialization to prevent TTFB degradation.",
  detail:
    "Typical product JSON (id, name, slug, price, 1 image URL, rating, availability, badge) = 350–480 bytes/SKU. At 4KB, this supports ~8–12 field-projected SKUs. Assessment: valid for the HADE decision-set payload (top-ranked candidates). The full catalog remains server-side. The 4KB payload is the re-ranked delta, not the complete listing response. Implementation specs should make this distinction explicit to prevent integration misalignment with headless commerce API consumers.",
  target: "Valid — with delta/full catalog distinction required in spec",
};

const INFRA_RISK_SPOF: AuditMetric = {
  name: "Infrastructure Risk: Signal Ingestion SPOF",
  definition:
    "Identified single points of failure in the Signal Ingestion pipeline that could prevent behavioral signals from reaching the HADE scoring endpoint.",
  detail:
    "Primary SPOF: Segment/RudderStack SDK initialization failure or network timeout → zero signals reach scoring endpoint → session silently serves Control catalog (graceful degradation, A/B integrity intact). Secondary SPOF: Edge KV store unavailability (Vercel KV / Cloudflare KV) → Edge Middleware cannot retrieve scored payload → unranked catalog served. Mitigation architecture: (1) LaunchDarkly flag forces Control path on scoring timeout; (2) stale KV payload used as TTL-bounded fallback before full fallback; (3) \"HADE-intent, fallback-served\" sessions flagged separately in analytics to preserve A/B cohort purity.",
  target: "Risk level: Medium — all failure modes degrade gracefully",
};

const STACK_RANK_ITEMS: StackRankItem[] = [
  { rank: 1, metric: "Session RPM", rationale: "Direct, lagging revenue signal — most executive-legible for a CTO/VP Growth pitch" },
  { rank: 2, metric: "Incremental Conversion Lift (ICL)", rationale: "Headline ROI metric that directly underpins the investment case" },
  { rank: 3, metric: "RTS Reduction", rationale: "Dual signal: conversion quality improvement and infrastructure compute cost savings" },
  { rank: 4, metric: "Comparison-Phase Compression", rationale: "Validates the core time-to-decision claim quantitatively" },
  { rank: 5, metric: "State Transition Recall", rationale: "Model accuracy gates all downstream value delivery — a failing classifier makes all other metrics meaningless" },
  { rank: 6, metric: "Hesitation-to-Guidance Conversion", rationale: "Validates the hesitation intervention specifically, not just global conversion" },
  { rank: 7, metric: "Choice-Set Narrowing Efficiency", rationale: "UX efficiency signal; secondary to revenue metrics in stakeholder context" },
  { rank: 8, metric: "Intent Resolution Lag", rationale: "Engineering SLA and technical credibility marker — not a business KPI" },
  { rank: 9, metric: "Signal Decay Rate", rationale: "Model tuning parameter; engineering-facing, not relevant to stakeholder pitch" },
];

interface MetricCardProps {
  metric: AuditMetric;
  accent: string;
}

function MetricCard({ metric, accent }: MetricCardProps) {
  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(11,13,18,0.07)",
      }}
    >
      <div>
        <p className="text-sm font-semibold text-ink/75 leading-snug mb-1">{metric.name}</p>
        {metric.note && (
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: hexToRgba(accent, 0.5) }}
          >
            {metric.note}
          </p>
        )}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/30 mb-1">
          Definition
        </p>
        <p className="text-xs text-ink/55 leading-relaxed">{metric.definition}</p>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/30 mb-1">
          Method / Formula
        </p>
        <p className="text-xs text-ink/55 leading-relaxed">{metric.detail}</p>
      </div>

      {metric.target && (
        <div
          className="rounded-md p-3 mt-auto"
          style={{ background: hexToRgba(accent, 0.06) }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1"
            style={{ color: hexToRgba(accent, 0.7) }}
          >
            Target
          </p>
          <p className="text-xs leading-relaxed font-medium" style={{ color: hexToRgba(accent, 0.85) }}>
            {metric.target}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SystemsAuditMetrics({ accent = "#316BFF" }: SystemsAuditMetricsProps) {
  return (
    <div
      className="rounded-xl p-6 md:p-8"
      style={{
        background: hexToRgba(accent, 0.03),
        border: "1px solid rgba(11,13,18,0.08)",
      }}
    >
      {/* Header */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-2">
        Systems Audit & KPI Matrix
      </p>
      <p className="text-sm text-ink/55 leading-relaxed mb-8 max-w-2xl">
        Industry-standard metrics bridging behavioral signal capture to executive GMV impact — structured for a CTO or VP of Growth audit across accuracy, friction, commercial output, and infrastructure risk.
      </p>

      {/* Categories 1–3 */}
      {AUDIT_CATEGORIES.map((category) => (
        <div key={category.number} className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
            {category.sectionLabel}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {category.metrics.map((metric) => (
              <MetricCard key={metric.name} metric={metric} accent={accent} />
            ))}
          </div>
        </div>
      ))}

      {/* Category 4 — Technical & Infrastructure Audit */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
          4 — Technical & Infrastructure Audit
        </p>

        <div className="space-y-3 mb-6">
          {[TECH_PAYLOAD_ASSESSMENT, INFRA_RISK_SPOF].map((item) => (
            <div
              key={item.name}
              className="rounded-lg p-5"
              style={{
                borderLeft: `3px solid ${hexToRgba(accent, 0.4)}`,
                background: hexToRgba(accent, 0.03),
              }}
            >
              <p className="text-sm font-semibold text-ink/75 mb-1.5">{item.name}</p>
              <p className="text-xs text-ink/50 leading-relaxed mb-2">{item.definition}</p>
              <p className="text-xs text-ink/50 leading-relaxed mb-2">{item.detail}</p>
              {item.target && (
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] mt-2"
                  style={{ color: hexToRgba(accent, 0.65) }}
                >
                  {item.target}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Stack-rank list */}
        <div
          className="rounded-lg p-5"
          style={{
            borderLeft: `3px solid ${hexToRgba(accent, 0.25)}`,
            background: hexToRgba(accent, 0.03),
          }}
        >
          <p className="text-sm font-semibold text-ink/75 mb-1.5">
            Roadmap Prioritization — Business Value Stack-Rank
          </p>
          <p className="text-xs text-ink/50 leading-relaxed mb-4">
            Ordered by business value for a stakeholder pitch to a CTO or VP of Growth. Rank 1 is the metric most immediately legible as revenue impact.
          </p>
          <div className="space-y-2.5">
            {STACK_RANK_ITEMS.map((item) => (
              <div key={item.rank} className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: hexToRgba(accent, 0.1) }}
                >
                  <span
                    className="text-[10px] font-black tabular-nums leading-none"
                    style={{ color: hexToRgba(accent, 0.9) }}
                  >
                    {item.rank}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-xs font-semibold text-ink/75 leading-snug">{item.metric}</p>
                  <p className="text-xs text-ink/45 leading-relaxed">{item.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
