import Link from "next/link";
import { type FlagshipCaseStudy } from "@/lib/site-data";
import { Radio, Tag, Zap, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import Reveal from "@/src/components/hade/animation/Reveal";

/* ─── Color helper ───────────────────────────────────────────────── */
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const PILLAR_ICONS = [
  <Radio key="radio" className="w-4 h-4" />,
  <Tag key="tag" className="w-4 h-4" />,
  <Zap key="zap" className="w-4 h-4" />,
];

/* ─── Diagram sub-components ─────────────────────────────────────── */
function DiagramNode({
  step,
  isEngine,
  isLast,
  color,
}: {
  step: string;
  isEngine: boolean;
  isLast: boolean;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center px-3 py-2 rounded-lg text-center"
      style={{
        background: isEngine
          ? hexToRgba(color, 0.12)
          : isLast
          ? hexToRgba(color, 0.06)
          : "rgba(11,13,18,0.04)",
        border: isEngine
          ? `1px solid ${hexToRgba(color, 0.35)}`
          : isLast
          ? `1px solid ${hexToRgba(color, 0.22)}`
          : "1px solid rgba(11,13,18,0.1)",
        minWidth: isEngine ? "120px" : "80px",
      }}
    >
      {isEngine && (
        <span
          className="block text-[7px] font-mono uppercase tracking-[0.16em] mb-0.5"
          style={{ color, opacity: 0.7 }}
        >
          core
        </span>
      )}
      <span
        className="text-[10px] font-mono leading-tight"
        style={{
          color: isEngine || isLast ? color : "rgba(11,13,18,0.65)",
          fontWeight: isEngine || isLast ? 600 : 400,
        }}
      >
        {step}
      </span>
    </div>
  );
}

function ArrowSep() {
  return (
    <div className="flex items-center px-1.5">
      <ArrowRight className="w-3 h-3 shrink-0" style={{ color: "rgba(11,13,18,0.25)" }} />
    </div>
  );
}

/* ─── System Diagram ─────────────────────────────────────────────── */
function SystemDiagram({
  steps,
  color,
  modules,
}: {
  steps: string[];
  color: string;
  modules?: string[];
}) {
  /* Hub layout ─ engine fans out to modules column */
  if (modules) {
    const engineIdx = steps.findIndex((s) => s === "HADE Decision Engine");
    const before = engineIdx >= 0 ? steps.slice(0, engineIdx + 1) : steps.slice(0, 2);
    const after = engineIdx >= 0 ? steps.slice(engineIdx + 1) : steps.slice(2);

    return (
      <div className="overflow-x-auto -mx-1 px-1 pb-1">
        <div className="flex items-center gap-0 min-w-max">
          {/* Steps before + engine */}
          {before.map((step) => (
            <div key={step} className="flex items-center gap-0">
              <DiagramNode
                step={step}
                isEngine={step === "HADE Decision Engine"}
                isLast={false}
                color={color}
              />
              <ArrowSep />
            </div>
          ))}

          {/* Modules column */}
          <div
            className="flex flex-col gap-1.5 px-1.5 py-1.5 rounded-lg"
            style={{
              border: `1px solid ${hexToRgba(color, 0.2)}`,
              background: hexToRgba(color, 0.04),
            }}
          >
            {modules.map((m) => (
              <div
                key={m}
                className="px-2.5 py-1.5 rounded-md text-[10px] font-mono text-center"
                style={{
                  background: hexToRgba(color, 0.08),
                  border: `1px solid ${hexToRgba(color, 0.2)}`,
                  color,
                  minWidth: "88px",
                  fontWeight: 500,
                }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Steps after modules */}
          {after.map((step, i) => (
            <div key={step} className="flex items-center gap-0">
              <ArrowSep />
              <DiagramNode
                step={step}
                isEngine={false}
                isLast={i === after.length - 1}
                color={color}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* Linear layout (default) */
  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div className="flex items-center gap-0 min-w-max">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step} className="flex items-center gap-0">
              <DiagramNode
                step={step}
                isEngine={step === "HADE Decision Engine"}
                isLast={isLast}
                color={color}
              />
              {!isLast && <ArrowSep />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Metrics cell ───────────────────────────────────────────────── */
function MetricCell({
  label,
  from,
  to,
  delta,
}: {
  label: string;
  from: string;
  to: string;
  delta: string;
}) {
  return (
    <div
      className="flex flex-col gap-3 px-5 py-5"
      style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-white leading-none">{to}</span>
        {to !== delta && (
          <span
            className="mb-0.5 rounded-md px-2 py-0.5 text-[11px] font-mono font-semibold"
            style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}
          >
            {delta}
          </span>
        )}
      </div>
      {from !== "—" && from !== "Baseline" && (
        <p className="text-[11px] text-slate-600">
          <span className="line-through">{from}</span>
        </p>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function FlagshipCaseStudyCard({
  study,
  href,
}: {
  study: FlagshipCaseStudy;
  href?: string;
}) {
  const color = study.accentColor;

  return (
    <article className="panel overflow-hidden">

      {/* Tier accent bar */}
      <div className="h-[3px] w-full" style={{ background: color, opacity: 0.75 }} />

      <div className="p-7 md:p-10">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {study.badge && (
              <span
                className="rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{
                  background: hexToRgba(color, 0.1),
                  border: `1px solid ${hexToRgba(color, 0.3)}`,
                  color,
                }}
              >
                {study.badge}
              </span>
            )}
            <span
              className="rounded-full border px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: hexToRgba(color, 0.07),
                borderColor: hexToRgba(color, 0.22),
                color,
              }}
            >
              {study.subtitle}
            </span>
            <span className="rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50">
              {study.sector}
            </span>
          </div>

          <h2 className="text-3xl font-semibold text-ink leading-snug md:text-4xl">
            {study.title}
          </h2>
        </div>

       {/* ── Problem Block ───────────────────────────────────────── */}
<section className="mb-12">
  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
    The Problem
  </p>

  <div
    className="rounded-xl p-6"
    style={{
      background: "rgba(11,13,18,0.03)",
      border: "1px solid rgba(11,13,18,0.08)",
    }}
  >
    <p className="text-sm text-ink/70 mb-6 max-w-xl leading-relaxed">
      {study.problemSentence}
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {study.problemStats.map(({ stat, label }) => (
        <div key={stat} className="rounded-lg border border-line/60 bg-white/40 p-4 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-ink">{stat}</h3>
          <p className="text-sm text-ink/60 leading-relaxed">{label}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── HADE Approach ───────────────────────────────────────── */}
<section className="mb-10">
  {/* Section Label */}
  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
    HADE Approach
  </p>

  {/* Intro Paragraph */}
  <p className="text-base text-ink/70 mb-6 leading-relaxed">
    {study.approachIntro}
  </p>

  {/* Pillars Grid */}
  <div className="grid gap-6 md:grid-cols-3">
    {study.approachPillars.map(({ title, body, items }, i) => (
      <div
        key={title}
        className="flex flex-col rounded-xl p-5"
        style={{
          background: hexToRgba(color, 0.04),
          border: `1px solid ${hexToRgba(color, 0.14)}`,
        }}
      >
        {/* Pillar Header */}
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color }}>{PILLAR_ICONS[i]}</span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">
            {title}
          </p>
        </div>

        {/* Body or Sentence Blocks */}
        {items ? (
          <div className="flex flex-col gap-3 mt-1">
            {items.map((item) => {
              // Split first few words for bolding
              const firstWords = item.split(' ').slice(0, 3).join(' ')
              const rest = item.split(' ').slice(3).join(' ')
              return (
                <p key={item} className="text-sm text-ink/60 leading-relaxed">
                  <span className="font-semibold">{firstWords}</span> {rest}
                </p>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-ink/60 leading-relaxed mt-1">{body}</p>
        )}
      </div>
    ))}
  </div>
</section>

       {/* ── System Diagram Hero ─────────────────────────────────────── */}
<section className="mb-16 relative">
  {/* Section Label */}
  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-1">
    System Flow
  </p>

  {/* Headline */}
  <h2 className="text-2xl md:text-3xl font-bold text-ink mb-6 max-w-4xl">
    HADE Adaptive System in Action
  </h2>

  {/* Diagram Container */}
  <div className="relative w-full rounded-3xl p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-xl overflow-visible">
    {/* Optional floating background layers for depth */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-10 -left-10 w-60 h-60 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-10 -right-20 w-72 h-72 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
    </div>

    {/* System Diagram */}
    <SystemDiagram
      steps={study.diagramSteps || []} // safe fallback
      color={color}
      modules={study.diagramModules || []} // safe fallback
    />
  </div>

  {/* Diagram Module Legend */}
  {(study.diagramModules || []).length > 0 && (
    <div className="mt-6 max-w-3xl flex flex-wrap gap-3">
      {(study.diagramModules || []).map((mod) => (
        <div key={mod} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
          <p className="text-sm font-medium text-ink/70">{mod}</p>
        </div>
      ))}
    </div>
  )}
</section>

        {/* ── Key Interventions / Example Behaviors ───────────────── */}
        <section className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
            {study.interventionsLabel ?? "Key Interventions"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {study.interventions.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg px-4 py-3"
                style={{
                  background: "rgba(11,13,18,0.03)",
                  border: "1px solid rgba(11,13,18,0.08)",
                }}
              >
                <ArrowRight
                  className="w-3.5 h-3.5 shrink-0 mt-0.5"
                  style={{ color, opacity: 0.6 }}
                />
                <p className="text-sm text-ink/70">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Metrics Grid ────────────────────────────────────────── */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Outcome</p>
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#09090b", border: `1px solid ${hexToRgba(color, 0.18)}` }}
          >
            <div
              className="flex items-center gap-2 px-5 py-3"
              style={{
                borderBottom: `1px solid ${hexToRgba(color, 0.14)}`,
                background: hexToRgba(color, 0.08),
              }}
            >
              <TrendingUp className="w-3.5 h-3.5" style={{ color }} />
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-white">
                Results
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
              {study.metrics.map(({ label, from, to, delta }, i) => (
                <Reveal key={label} delay={i * 80} className="h-full">
                  <MetricCell label={label} from={from} to={to} delta={delta} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Business Impact ─────────────────────────────────────── */}
        <section className="mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
            Business Impact
          </p>
          <div className="flex flex-col gap-2">
            {study.businessImpact.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color, opacity: 0.7 }}
                />
                <p className="text-sm text-ink/70">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Closing Insight ─────────────────────────────────────── */}
        <blockquote
          className="mb-10 rounded-xl px-6 py-5"
          style={{
            background: hexToRgba(color, 0.05),
            borderLeft: `3px solid ${hexToRgba(color, 0.4)}`,
          }}
        >
          <p className="text-base font-medium text-ink/75 leading-relaxed italic">
            &ldquo;{study.closingInsight}&rdquo;
          </p>
        </blockquote>

        {/* ── CTA Block ───────────────────────────────────────────── */}
        <div
          className="rounded-xl px-7 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
          style={{ background: "#080b11", border: `1px solid ${hexToRgba(color, 0.15)}` }}
        >
          <div>
            <p className="text-base font-semibold text-white mb-1">{study.ctaTitle}</p>
            <p className="text-sm text-slate-400">{study.ctaSubtext}</p>
          </div>
          <Link href="/contact" className="cta-button shrink-0 text-center">
            {study.ctaButton}
          </Link>
        </div>


      </div>
    </article>
  );
}
