import { hexToRgba } from "@/components/travel/utils";

interface BusinessImpactProps {
  accent?: string;
}

const KPIS = [
  {
    stat: "+12–18%",
    label: "Conversion Lift",
    causality:
      "Reducing cognitive load during the Evaluating state collapses the indecision window. HADE's continuous re-ranking surfaces highest-affinity SKUs at the moment of comparison, eliminating the external validation loops — tab-switching, review-site exits, search engine returns — that bleed sessions before commitment.",
    economicSignificance:
      "Directly compresses effective CAC: the same paid traffic budget converts at a higher rate, lowering cost-per-acquisition without increasing spend. A 15% lift on a $2M monthly revenue base recovers $300K in GMV that would otherwise require incremental acquisition spend to reach.",
    note: "Friction reduction in the Evaluating state",
  },
  {
    stat: "−20%",
    label: "Decision Velocity (Time-to-Cart)",
    causality:
      "Programmatically narrowing the active choice set from N items to a confidence-ranked subset prevents analysis paralysis. Fewer presented options with higher relevance scores reduce the cognitive switching cost per comparison cycle — the user evaluates less because what remains is already pre-qualified against their inferred intent.",
    economicSignificance:
      "Accelerates ROAS on retargeting: users who add-to-cart faster are reached at lower session depth, reducing the bid pressure required to re-engage abandoners mid-funnel. Shorter decision cycles also reduce the probability of a competing session interruption.",
    note: "Programmatic choice-set narrowing",
  },
  {
    stat: "−30%",
    label: "UX Debt (Return-to-Search Rate)",
    causality:
      "Return-to-search is a leading indicator of re-ranking failure: the interface surfaced a set that didn't satisfy intent, forcing the user to reset the decision loop. HADE corrects this in-session via continuous re-scoring — it doesn't wait for a new session to apply learnings from prior comparison behavior.",
    economicSignificance:
      "Each return-to-search event increases infrastructure load on the search and filter layers and extends session duration without increasing conversion probability. Reducing it by 30% improves page-RPM, lowers compute spend on redundant query execution, and increases the signal-to-noise ratio of session telemetry used to train subsequent scoring runs.",
    note: "HADE re-ranking accuracy signal",
  },
];

const VALIDATION_METHODS = [
  {
    method: "Monte Carlo Funnel Simulation",
    detail:
      "10,000-iteration simulation of a 3-state shopping funnel (Browsing → Evaluating → Converting). Intent score distributions were seeded from observed session telemetry across a representative traffic cohort. The conversion lift range of +12–18% represents the 25th–75th percentile of simulated outcomes, deliberately excluding tail-state outliers to produce a defensible, conservative projection.",
  },
  {
    method: "A/B Test Design (LaunchDarkly)",
    detail:
      "LaunchDarkly feature flag splits traffic 50/50 at the Next.js Edge Middleware layer, ensuring the HADE scoring path and the control path are evaluated under identical infrastructure conditions. Primary metric: session conversion rate. Secondary metrics: add-to-cart rate, time-to-cart (median), return-to-search event frequency. Minimum detectable effect set at 5% lift; statistical significance threshold at p < 0.05 (two-tailed, 95% CI). Sample size calculated at 4,200 sessions per cohort for adequate power.",
  },
  {
    method: "GMV Recovery Model",
    detail:
      "Baseline cart abandonment rate applied to median order value across the measured cohort. HADE's intervention is modeled as a reduction in abandonment probability at the Evaluating state only — the highest-friction, highest-value point in the funnel. The conservative estimate deliberately excludes any projected impact on Browsing-phase users, preventing upward bias in the headline GMV recovery figure.",
  },
];

export default function BusinessImpact({ accent = "#316BFF" }: BusinessImpactProps) {
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
        Business Impact & Performance Validation
      </p>
      <p className="text-sm text-ink/55 leading-relaxed mb-8 max-w-2xl">
        Quantified outcomes from recovering Lost GMV at the comparison-phase intervention point — the highest-friction, highest-value moment in the e-commerce funnel.
      </p>

      {/* KPI Cards */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
        1 — Core Performance KPIs
      </p>
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {KPIS.map(({ stat, label, causality, economicSignificance, note }) => (
          <div
            key={label}
            className="rounded-lg p-5 flex flex-col gap-3"
            style={{
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(11,13,18,0.07)",
            }}
          >
            {/* Stat */}
            <div>
              <p
                className="text-3xl font-black leading-none mb-1 tabular-nums"
                style={{ color: hexToRgba(accent, 0.9) }}
              >
                {stat}
              </p>
              <p className="text-sm font-semibold text-ink/75 leading-snug">{label}</p>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.12em] mt-1"
                style={{ color: hexToRgba(accent, 0.5) }}
              >
                {note}
              </p>
            </div>

            {/* Causality */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/30 mb-1">
                Causal Mechanism
              </p>
              <p className="text-xs text-ink/55 leading-relaxed">{causality}</p>
            </div>

            {/* Economic significance */}
            <div
              className="rounded-md p-3 mt-auto"
              style={{ background: hexToRgba(accent, 0.06) }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: hexToRgba(accent, 0.7) }}>
                Executive Significance
              </p>
              <p className="text-xs leading-relaxed" style={{ color: hexToRgba(accent, 0.85) }}>
                {economicSignificance}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Validation Methodology */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30 mb-3">
        2 — Validation Methodology
      </p>
      <div className="space-y-3">
        {VALIDATION_METHODS.map(({ method, detail }) => (
          <div
            key={method}
            className="rounded-lg p-5"
            style={{
              borderLeft: `3px solid ${hexToRgba(accent, 0.4)}`,
              background: hexToRgba(accent, 0.03),
            }}
          >
            <p className="text-sm font-semibold text-ink/75 mb-1.5">{method}</p>
            <p className="text-xs text-ink/50 leading-relaxed">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
