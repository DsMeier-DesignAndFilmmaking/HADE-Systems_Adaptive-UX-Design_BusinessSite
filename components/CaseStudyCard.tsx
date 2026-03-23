import { type CaseStudy } from "@/lib/site-data";
import { AlertCircle, Lightbulb, Layers, TrendingUp, ArrowRight } from "lucide-react";
import Reveal from "@/src/components/hade/animation/Reveal";

/* ─── Tier visual config ─────────────────────────────────────────── */
const TIER = {
  "Adaptive UX Sprint": {
    color: "#316BFF",
    bgChip: "rgba(49,107,255,0.07)",
    borderChip: "rgba(49,107,255,0.22)",
    outcomeBorder: "rgba(49,107,255,0.18)",
    outcomeAccent: "rgba(49,107,255,0.12)",
    labelColor: "#316BFF",
  },
  "Adaptive Module Deployment": {
    color: "#2C7B76",
    bgChip: "rgba(44,123,118,0.08)",
    borderChip: "rgba(44,123,118,0.28)",
    outcomeBorder: "rgba(44,123,118,0.22)",
    outcomeAccent: "rgba(44,123,118,0.12)",
    labelColor: "#5eead4",
  },
  "Adaptive System Lab": {
    color: "#F59E0B",
    bgChip: "rgba(245,158,11,0.07)",
    borderChip: "rgba(245,158,11,0.25)",
    outcomeBorder: "rgba(245,158,11,0.20)",
    outcomeAccent: "rgba(245,158,11,0.10)",
    labelColor: "#F59E0B",
  },
} satisfies Record<CaseStudy["tier"], object>;

/* ─── Signal stage flow indicator ───────────────────────────────── */
const STAGES = ["Problem", "Insight", "System", "Outcome"] as const;

function StageFlow({ tier }: { tier: CaseStudy["tier"] }) {
  const { color } = TIER[tier];
  return (
    <div className="hidden md:flex items-center gap-1 shrink-0">
      {STAGES.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-0.5">
            <div
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: i === STAGES.length - 1 ? color : "rgba(11,13,18,0.18)" }}
            />
            <span className="text-[7px] font-mono uppercase tracking-wide text-ink/30">
              {s[0]}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div className="w-4 h-px bg-ink/10 mb-2" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Content section block ─────────────────────────────────────── */
function Section({
  icon,
  label,
  body,
  iconColor,
  divider = false,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
  iconColor: string;
  divider?: boolean;
}) {
  return (
    <div className={`${divider ? "md:border-l md:border-line md:pl-5" : ""}`}>
      <div className="flex items-center gap-1.5 mb-2.5">
        <span style={{ color: iconColor }}>{icon}</span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/45">
          {label}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-ink/70">{body}</p>
    </div>
  );
}

/* ─── Main card ──────────────────────────────────────────────────── */
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const t = TIER[study.tier];

  return (
    <Reveal>
      <article className="panel overflow-hidden">

      {/* Tier accent bar */}
      <div className="h-[3px] w-full" style={{ background: t.color, opacity: 0.65 }} />

      <div className="p-7 md:p-8">

        {/* Prototype banner */}
        {study.isPrototype && (
          <div
            className="mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-sm text-ink/65"
            style={{
              background: "rgba(245,158,11,0.06)",
              border: "0.5px solid rgba(245,158,11,0.22)",
            }}
          >
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Concept prototype — illustrates the scope and output of a Tier 3 Adaptive System
              Lab. Not a completed engagement.
            </span>
          </div>
        )}

        {/* Header: badges + title + stage flow */}
        <div className="flex items-start justify-between gap-4 mb-7">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="rounded-full border px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  background: t.bgChip,
                  borderColor: t.borderChip,
                  color: t.color,
                }}
              >
                {study.tier}
              </span>
              <span className="rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/50">
                {study.sector}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-ink leading-snug">{study.title}</h2>
          </div>
          <StageFlow tier={study.tier} />
        </div>

        {/* 3-column content: Problem · Insight · System Applied */}
        <div className="grid gap-5 md:grid-cols-3">
          <Section
            icon={<AlertCircle className="w-3.5 h-3.5" />}
            label="Problem"
            body={study.problem}
            iconColor={t.color}
          />
          <Section
            icon={<Lightbulb className="w-3.5 h-3.5" />}
            label="Insight"
            body={study.insight}
            iconColor="#F59E0B"
            divider
          />
          <Section
            icon={<Layers className="w-3.5 h-3.5" />}
            label="System Applied"
            body={study.systemApplied}
            iconColor="#2C7B76"
            divider
          />
        </div>

        {/* Outcome — dark results panel */}
        <div
          className="mt-7 rounded-xl overflow-hidden"
          style={{
            background: "#09090b",
            border: `1px solid ${t.outcomeBorder}`,
          }}
        >
          {/* Outcome header bar */}
          <div
            className="flex items-center gap-2 px-5 py-2.5"
            style={{ borderBottom: `1px solid ${t.outcomeBorder}`, background: t.outcomeAccent }}
          >
            <TrendingUp className="w-3.5 h-3.5" style={{ color: t.labelColor }} />
            <p
  className="text-[10px] font-mono uppercase tracking-[0.24em] text-white"
>
  Outcome
</p>
          </div>

          {/* Outcome items — 3 columns with dividers */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            {study.outcome.map((line, i) => (
              <div key={i} className="flex items-start gap-2.5 px-5 py-4">
                <ArrowRight
                  className="w-3 h-3 shrink-0 mt-0.5"
                  style={{ color: t.labelColor, opacity: 0.6 }}
                />
                <p className="text-xs leading-relaxed text-slate-400">{line}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      </article>
    </Reveal>
  );
}
