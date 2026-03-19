"use client";

import { motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type StageType = "input" | "foundational" | "applied";

type Stage = {
  index: number;
  label: string;
  subtitle: string;
  detail: string;
  type: StageType;
  role: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const STAGES: Stage[] = [
  {
    index: 1,
    label: "Sensing",
    subtitle: "Geospatial & Contextual Signals",
    detail:
      "Captures geospatial position, local time, ambient weather, and session cadence without active user input.",
    type: "input",
    role: "Sensor Layer",
  },
  {
    index: 2,
    label: "Spontaneity Engine",
    subtitle: "Intent Validation",
    detail:
      "The decision-making core — determines when and whether to surface a recommendation based on contextual confidence.",
    type: "foundational",
    role: "Core System",
  },
  {
    index: 3,
    label: "Trust Layer",
    subtitle: "Algorithmic Transparency",
    detail:
      "Filters every candidate through a social-graph validator and verified discovery layer before any output.",
    type: "foundational",
    role: "Validator",
  },
  {
    index: 4,
    label: "Tactical Delivery",
    subtitle: "Offline-Ready Interface",
    detail:
      "Delivers frictionless discoveries through adaptive presentation touchpoints, optimised for low-latency environments.",
    type: "applied",
    role: "Output",
  },
];

// ─── Theme per type ───────────────────────────────────────────────────────────

const TYPE_THEME = {
  input: {
    accent: "#0d9488",
    accentSoft: "rgba(13,148,136,0.07)",
    particle: "#2dd4bf",
    border: "rgba(13,148,136,0.18)",
    label: "#0f766e",
    flowDuration: 1.8,
    strip: "from-teal-400/60 to-transparent",
  },
  foundational: {
    accent: "#4f46e5",
    accentSoft: "rgba(79,70,229,0.06)",
    particle: "#818cf8",
    border: "rgba(79,70,229,0.16)",
    label: "#4338ca",
    flowDuration: 3.4,
    strip: "from-indigo-400/60 to-transparent",
  },
  applied: {
    accent: "#d97706",
    accentSoft: "rgba(217,119,6,0.07)",
    particle: "#f59e0b",
    border: "rgba(217,119,6,0.18)",
    label: "#b45309",
    flowDuration: 2.0,
    strip: "from-amber-400/60 to-transparent",
  },
} as const;

// ─── Particle ─────────────────────────────────────────────────────────────────

function FlowParticle({
  color,
  delay,
  duration,
  axis,
}: {
  color: string;
  delay: number;
  duration: number;
  axis: "x" | "y";
}) {
  const isHorizontal = axis === "x";
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: 4,
        height: 4,
        background: color,
        boxShadow: `0 0 6px ${color}`,
        ...(isHorizontal
          ? { top: "50%", marginTop: -2, left: 0 }
          : { left: "50%", marginLeft: -2, top: 0 }),
      }}
      animate={
        isHorizontal
          ? { left: ["0%", "100%"], opacity: [0, 0.85, 0.85, 0] }
          : { top: ["0%", "100%"], opacity: [0, 0.85, 0.85, 0] }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

// ─── Horizontal connector ─────────────────────────────────────────────────────

function HorizontalConnector({ from, to }: { from: Stage; to: Stage }) {
  const ft = TYPE_THEME[from.type];
  const tt = TYPE_THEME[to.type];
  const duration = (ft.flowDuration + tt.flowDuration) / 2;

  return (
    <div className="relative mx-2 flex shrink-0 items-center" style={{ width: 48 }}>
      {/* Track */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(to right, ${ft.accent}35, ${tt.accent}35)`,
        }}
      />
      {/* Arrowhead */}
      <div
        className="absolute right-0"
        style={{
          width: 0,
          height: 0,
          borderTop: "3.5px solid transparent",
          borderBottom: "3.5px solid transparent",
          borderLeft: `5px solid ${tt.accent}55`,
        }}
      />
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <FlowParticle
            key={i}
            color={ft.particle}
            delay={i * (duration / 3)}
            duration={duration}
            axis="x"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Vertical connector ───────────────────────────────────────────────────────

function VerticalConnector({ from, to }: { from: Stage; to: Stage }) {
  const ft = TYPE_THEME[from.type];
  const tt = TYPE_THEME[to.type];
  const duration = (ft.flowDuration + tt.flowDuration) / 2;

  return (
    <div
      className="relative mx-auto my-1 shrink-0"
      style={{ width: 2, height: 36 }}
    >
      <div
        className="h-full w-px mx-auto"
        style={{
          background: `linear-gradient(to bottom, ${ft.accent}35, ${tt.accent}35)`,
        }}
      />
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1].map((i) => (
          <FlowParticle
            key={i}
            color={ft.particle}
            delay={i * (duration / 2)}
            duration={duration}
            axis="y"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Stage Card ───────────────────────────────────────────────────────────────

function StageCard({ stage }: { stage: Stage }) {
  const theme = TYPE_THEME[stage.type];
  const isFoundational = stage.type === "foundational";

  return (
    <motion.article
      className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl"
      style={{
        border: `0.5px solid ${theme.border}`,
        boxShadow: "0 1px 20px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.03)",
      }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: isFoundational ? 0.65 : 0.4,
        ease: "easeOut",
        delay: (stage.index - 1) * 0.08,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Accent gradient strip */}
      <div
        className={`h-[2px] w-full bg-gradient-to-r ${theme.strip}`}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Row: index + badge */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span
            className="font-mono text-[11px] font-semibold tracking-[0.12em]"
            style={{ color: theme.accent }}
          >
            0{stage.index}
          </span>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]"
            style={{
              background: theme.accentSoft,
              color: theme.label,
              border: `0.5px solid ${theme.border}`,
            }}
          >
            {stage.role}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-[15px] font-normal leading-snug text-gray-900"
          style={{
            fontFamily: "'tiempos-headline-regular', Georgia, 'Times New Roman', serif",
            letterSpacing: "-0.01em",
          }}
        >
          {stage.label}
        </h3>

        {/* Subtitle */}
        <p
          className="mt-1 text-[11px] font-medium text-gray-400"
          style={{ fontFamily: "'Roboto', Helvetica, Arial, sans-serif" }}
        >
          {stage.subtitle}
        </p>

        {/* Detail */}
        <p
          className="mt-3 flex-1 text-[11px] leading-relaxed text-gray-400"
          style={{ fontFamily: "'Roboto', Helvetica, Arial, sans-serif" }}
        >
          {stage.detail}
        </p>

        {/* Status pulse — foundational systems only */}
        {isFoundational && (
          <div className="mt-4 flex items-center gap-1.5">
            <motion.span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: theme.accent }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span
              className="text-[10px] text-gray-300"
              style={{ fontFamily: "'Roboto', Helvetica, Arial, sans-serif" }}
            >
              Always active
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ─── Learning Loop Footer ─────────────────────────────────────────────────────

function LearningLoop() {
  return (
    <motion.div
      className="mt-5 flex items-start gap-3 rounded-xl px-4 py-3"
      style={{
        background: "rgba(79,70,229,0.04)",
        border: "0.5px solid rgba(79,70,229,0.10)",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <motion.span
        className="mt-px font-mono text-sm text-indigo-300/70"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ display: "inline-block" }}
      >
        ↺
      </motion.span>
      <p
        className="text-[11px] leading-relaxed text-gray-400"
        style={{ fontFamily: "'Roboto', Helvetica, Arial, sans-serif" }}
      >
        <span className="font-medium text-gray-500">Learning loop active —</span>{" "}
        Output signals from Tactical Delivery feed back into the Spontaneity Engine to recalibrate
        intent confidence over time. Each interaction makes the next recommendation more precise.
      </p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContextAwareLoop() {
  return (
    <section
      className="overflow-hidden rounded-3xl"
      style={{
        background:
          "linear-gradient(145deg, #E8FBF8 0%, rgba(238,242,255,0.75) 60%, #f0f4ff 100%)",
        border: "0.5px solid rgba(13,148,136,0.12)",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-start justify-between gap-4 px-6 py-7 md:px-10"
        style={{ borderBottom: "0.5px solid rgba(0,0,0,0.05)" }}
      >
        <div>
          <div className="mb-3 flex items-center gap-2">
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-teal-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span
              className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-teal-600/60"
            >
              System Architecture
            </span>
          </div>

          <h2
            className="text-2xl text-gray-900 md:text-[1.75rem]"
            style={{
              fontFamily:
                "'tiempos-headline-regular', Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
            }}
          >
            Context-Aware Agentic Loop
          </h2>
          <p
            className="mt-2 max-w-sm text-sm text-gray-400"
            style={{ fontFamily: "'Roboto', Helvetica, Arial, sans-serif" }}
          >
            The intelligence architecture behind every recommendation
          </p>
        </div>

        {/* Live badge */}
        <div
          className="flex flex-col items-end gap-1.5 rounded-xl px-3 py-2.5"
          style={{
            background: "rgba(79,70,229,0.05)",
            border: "0.5px solid rgba(79,70,229,0.12)",
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-indigo-400/60">
            v1.0 · Phase 1 MVP
          </span>
          <div className="flex items-center gap-1.5">
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-teal-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="font-mono text-[10px] text-indigo-400/50">System live</span>
          </div>
        </div>
      </div>

      {/* ── Diagram ─────────────────────────────────────────────────────── */}
      <div className="px-6 py-7 md:px-10">
        {/* Desktop: horizontal flow */}
        <div className="hidden items-stretch lg:flex">
          {STAGES.map((stage, i) => (
            <div key={stage.label} className="flex min-w-0 flex-1 items-center">
              <div className="min-w-0 flex-1 self-stretch">
                <StageCard stage={stage} />
              </div>
              {i < STAGES.length - 1 && (
                <HorizontalConnector from={stage} to={STAGES[i + 1]} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical stack */}
        <div className="flex flex-col lg:hidden">
          {STAGES.map((stage, i) => (
            <div key={stage.label}>
              <StageCard stage={stage} />
              {i < STAGES.length - 1 && (
                <VerticalConnector from={stage} to={STAGES[i + 1]} />
              )}
            </div>
          ))}
        </div>

        <LearningLoop />
      </div>
    </section>
  );
}
