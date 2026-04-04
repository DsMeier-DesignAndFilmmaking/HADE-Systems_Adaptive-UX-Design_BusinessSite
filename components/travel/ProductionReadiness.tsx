import { hexToRgba } from "./utils";

export interface ChecklistItem {
  status: "validated" | "in-progress" | "planned";
  label: string;
}

export interface RoadmapStep {
  index: string;
  label: string;
  detail: string;
}

interface ProductionReadinessProps {
  checklist: ChecklistItem[];
  roadmap: RoadmapStep[];
  scalabilityStatement: string;
  accent?: string;
}

const STATUS_CONFIG = {
  validated: {
    label: "Validated",
    dot: "#22C55E",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
    text: "#4ADE80",
  },
  "in-progress": {
    label: "In Progress",
    dot: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    text: "#FCD34D",
  },
  planned: {
    label: "Planned",
    dot: "rgba(255,255,255,0.2)",
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    text: "rgba(255,255,255,0.3)",
  },
};

export default function ProductionReadiness({
  checklist,
  roadmap,
  scalabilityStatement,
  accent = "#0891B2",
}: ProductionReadinessProps) {
  return (
    <div
      className="rounded-xl p-6 md:p-8 font-mono"
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
            System Deployment Spec
          </span>
        </div>
        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">
          From Prototype to Production
        </p>
        <p className="text-xs text-white/35 leading-relaxed max-w-2xl" style={{ fontFamily: "inherit" }}>
          Engineering audit of current deployment state and a five-step roadmap to move this architecture from validated concept to enterprise-ready infrastructure.
        </p>
      </div>

      {/* ── 1. System Status Audit ─────────────────────────── */}
      <div className="relative mb-8">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: hexToRgba(accent, 0.6) }}>
          // 01 — Current State Audit
        </p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {checklist.map(({ status, label }) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <div
                key={label}
                className="flex items-center gap-3 rounded-md px-3 py-2.5"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
                />
                <span className="text-[11px] text-white/55 leading-snug flex-1" style={{ fontFamily: "inherit" }}>
                  {label}
                </span>
                <span
                  className="text-[9px] font-black uppercase tracking-[0.1em] flex-shrink-0"
                  style={{ color: cfg.text }}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. Production Readiness Roadmap ───────────────── */}
      <div className="relative mb-8">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-4" style={{ color: hexToRgba(accent, 0.6) }}>
          // 02 — Production Readiness Path
        </p>
        <div className="space-y-0">
          {roadmap.map(({ index, label, detail }, i) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-[9px] font-black"
                  style={{
                    background: hexToRgba(accent, 0.15),
                    color: hexToRgba(accent, 0.9),
                    border: `1px solid ${hexToRgba(accent, 0.25)}`,
                  }}
                >
                  {index}
                </div>
                {i < roadmap.length - 1 && (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{ background: `${hexToRgba(accent, 0.2)}`, minHeight: "20px", borderLeft: `1px dashed ${hexToRgba(accent, 0.2)}` }}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className="text-xs font-black uppercase tracking-[0.1em] mb-1"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {label}
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)", fontFamily: "inherit" }}>
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Technical Scalability Statement ────────────── */}
      <div className="relative">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-3" style={{ color: hexToRgba(accent, 0.6) }}>
          // 03 — Technical Scalability Statement
        </p>
        <div
          className="rounded-md p-4"
          style={{
            background: hexToRgba(accent, 0.07),
            borderLeft: `2px solid ${hexToRgba(accent, 0.5)}`,
          }}
        >
          <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "inherit" }}>
            {scalabilityStatement}
          </p>
        </div>
      </div>
    </div>
  );
}
