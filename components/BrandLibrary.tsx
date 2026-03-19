"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CTAMode = "awareness" | "action";

// ─── Data ────────────────────────────────────────────────────────────────────

const COLOR_SWATCHES = [
  {
    name: "Obsidian",
    token: "obsidian",
    hex: "#080B11",
    bg: "bg-obsidian",
    description: "Primary dark surface. Backgrounds, overlays.",
    light: false,
  },
  {
    name: "Slate Glass",
    token: "slateGlass",
    hex: "#1C2236",
    bg: "bg-slateGlass",
    description: "Elevated panels. Glass card backgrounds.",
    light: false,
  },
  {
    name: "Signal Amber",
    token: "cyberLime",
    hex: "#F59E0B",
    bg: "bg-cyberLime",
    description: "Action signal. High-intent CTAs, data callouts.",
    light: true,
  },
  {
    name: "Electric Blue",
    token: "electricBlue",
    hex: "#316BFF",
    bg: "bg-electricBlue",
    description: "Brand accent. Links, focus rings, highlights.",
    light: false,
  },
  {
    name: "Ink",
    token: "ink",
    hex: "#0B0D12",
    bg: "bg-ink",
    description: "Body text, primary UI elements.",
    light: false,
  },
  {
    name: "Surface",
    token: "surface",
    hex: "#F6F7F9",
    bg: "bg-surface",
    description: "Page background. Light mode base.",
    light: true,
    border: true,
  },
] as const;

const TYPE_SPECIMENS = [
  {
    label: "Display",
    sample: "Adaptive Systems",
    className: "font-sans text-5xl font-semibold leading-none tracking-tight text-white",
    meta: "Inter 600 · 48px · −0.02em",
  },
  {
    label: "Headline",
    sample: "A four-layer framework for precision UX",
    className: "font-sans text-2xl font-semibold leading-snug text-white",
    meta: "Inter 600 · 24px · −0.01em",
  },
  {
    label: "Body",
    sample:
      "HADE translates real-time user behavior into experience decisions your team can implement, instrument, and improve over time.",
    className: "font-sans text-base font-normal leading-relaxed text-white/70",
    meta: "Inter 400 · 16px · 1.6",
  },
  {
    label: "Caption",
    sample: "Context signal detected · Routing to high-intent path",
    className: "font-sans text-xs font-medium uppercase tracking-[0.14em] text-white/40",
    meta: "Inter 500 · 11px · 0.14em",
  },
  {
    label: "Mono",
    sample: '> intent: "conversion" · CTA: "Book Strategy Call"',
    className: "font-mono text-sm text-cyberLime/90",
    meta: "JetBrains Mono 400 · 14px",
  },
] as const;

// ─── Section shell ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-6 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink/40">
      {children}
    </p>
  );
}

function Divider() {
  return <hr className="border-line/60 my-12" />;
}

// ─── 1. Typography Stack ─────────────────────────────────────────────────────

function TypographySection() {
  return (
    <section>
      <SectionLabel>01 — Typography Stack</SectionLabel>
      <div
        className="overflow-hidden rounded-2xl"
        style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.08)" }}
      >
        {/* Dark "Deep Field" stage */}
        <div className="bg-obsidian px-8 py-10 md:px-12">
          <div className="space-y-8">
            {TYPE_SPECIMENS.map((spec) => (
              <div key={spec.label} className="grid gap-2 md:grid-cols-[120px_1fr]">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white/25 md:pt-1">
                  {spec.label}
                </span>
                <div className="space-y-1">
                  <p className={spec.className}>{spec.sample}</p>
                  <p className="font-mono text-[10px] text-white/20">{spec.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spec footer */}
        <div
          className="bg-slateGlass px-8 py-4 md:px-12"
          style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {["Inter", "JetBrains Mono"].map((f) => (
              <span key={f} className="font-mono text-[11px] text-white/35">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. Color Swatches ────────────────────────────────────────────────────────

function ColorSwatch({ swatch }: { swatch: (typeof COLOR_SWATCHES)[number] }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(swatch.hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <motion.button
      onClick={copy}
      whileTap={{ scale: 0.97 }}
      className="group flex flex-col overflow-hidden rounded-xl text-left"
      style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "border" in swatch && swatch.border ? "#d8dce3" : "rgba(0,0,0,0.08)" }}
    >
      {/* Color field */}
      <div className={`${swatch.bg} relative h-20 w-full`}>
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className={`font-mono text-[11px] font-semibold tracking-wide ${
                  swatch.light ? "text-ink/60" : "text-white/70"
                }`}
              >
                Copied
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Metadata */}
      <div className="flex flex-1 flex-col gap-1 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-ink">{swatch.name}</span>
          <span className="font-mono text-[10px] text-ink/40">{swatch.hex}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-ink/55">{swatch.description}</p>
        <p className="mt-1 font-mono text-[10px] text-ink/30">{swatch.token}</p>
      </div>
    </motion.button>
  );
}

function ColorsSection() {
  return (
    <section>
      <SectionLabel>02 — Color System · Deep Field Palette</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {COLOR_SWATCHES.map((s) => (
          <ColorSwatch key={s.token} swatch={s} />
        ))}
      </div>
      <p className="mt-4 font-mono text-[11px] text-ink/35">
        ↑ Click any swatch to copy the hex value.
      </p>
    </section>
  );
}

// ─── 3. Adaptive CTA Prototype ────────────────────────────────────────────────

const CTA_STATES: Record<CTAMode, { badge: string; headline: string; sub: string; label: string; description: string }> = {
  awareness: {
    badge: "awareness · discovery",
    headline: "Understand the system first.",
    sub: "Explore how HADE's four-layer framework maps intent signals to interface decisions.",
    label: "Explore the System",
    description: "Soft entry. Reduce friction for cold visitors.",
  },
  action: {
    badge: "action · conversion",
    headline: "You've seen enough. Let's build.",
    sub: "Book a 30-minute strategy call and walk away with 2–3 specific adaptive opportunities for your product.",
    label: "Book Strategy Call",
    description: "High signal. High-intent visitors only.",
  },
};

function AdaptiveCTASection() {
  const [mode, setMode] = useState<CTAMode>("awareness");
  const state = CTA_STATES[mode];
  const isAction = mode === "action";

  return (
    <section>
      <SectionLabel>03 — Adaptive CTA Prototype</SectionLabel>

      {/* Toggle */}
      <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-line/80 bg-white/90 p-1">
        {(["awareness", "action"] as CTAMode[]).map((m) => (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            whileTap={{ scale: 0.96 }}
            className={`relative rounded-full px-4 py-1.5 font-mono text-[11px] font-medium tracking-wider transition-colors ${
              mode === m ? "text-white" : "text-ink/50 hover:text-ink"
            }`}
          >
            {mode === m && (
              <motion.span
                layoutId="cta-toggle-bg"
                className={`absolute inset-0 rounded-full ${isAction ? "bg-ink" : "bg-slateGlass"}`}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{m.toUpperCase()}</span>
          </motion.button>
        ))}
      </div>

      {/* Preview stage */}
      <div
        className="overflow-hidden rounded-2xl bg-obsidian"
        style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="px-8 py-10 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Badge */}
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] font-medium tracking-widest ${
                  isAction
                    ? "bg-cyberLime/10 text-cyberLime"
                    : "bg-electricBlue/10 text-electricBlue"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isAction ? "bg-cyberLime" : "bg-electricBlue"}`}
                />
                {state.badge}
              </span>

              {/* Headline */}
              <div className="space-y-3">
                <h3 className="font-sans text-2xl font-semibold leading-snug text-white md:text-3xl">
                  {state.headline}
                </h3>
                <p className="max-w-lg font-sans text-sm leading-relaxed text-white/60">
                  {state.sub}
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  className={`inline-flex items-center justify-center rounded-full px-7 py-3 font-sans text-sm font-semibold transition ${
                    isAction
                      ? "bg-cyberLime text-obsidian hover:bg-cyberLime/90 shadow-glow"
                      : "border bg-white/8 text-white hover:bg-white/12"
                  }`}
                  style={isAction ? undefined : { borderColor: "rgba(255,255,255,0.15)" }}
                >
                  {state.label}
                </motion.button>

                <span className="font-mono text-[10px] text-white/25">{state.description}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* State indicator strip */}
        <div
          className="flex items-center gap-3 bg-slateGlass px-8 py-3 md:px-12"
          style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="font-mono text-[10px] text-white/30">{"> state:"}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={mode}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`font-mono text-[10px] font-semibold ${
                isAction ? "text-cyberLime" : "text-electricBlue"
              }`}
            >
              {mode}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── 4. Card Patterns ─────────────────────────────────────────────────────────

function GlassCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md"
      style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.10)" }}
    >
      <div className="px-6 py-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyberLime/80">
              Layer 01 · Harvest
            </p>
            <h4 className="mt-2 font-sans text-lg font-semibold text-white">
              Behavioral Signal Collection
            </h4>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] text-white/50"
            style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "rgba(255,255,255,0.12)" }}
          >
            Active
          </span>
        </div>
        <p className="font-sans text-sm leading-relaxed text-white/55">
          Passively collects interaction events — scroll depth, hover dwell, click patterns — without blocking the critical render path.
        </p>
      </div>
      <div
        className="flex items-center justify-between gap-4 px-6 py-4"
        style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyberLime" />
          <span className="font-mono text-[10px] text-white/30">Streaming · 14 events/s</span>
        </div>
        <button className="font-mono text-[11px] font-medium text-electricBlue hover:text-electricBlue/80 transition">
          Inspect →
        </button>
      </div>
    </div>
  );
}

function LightCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-white/90 backdrop-blur"
      style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "rgba(11,13,18,0.10)" }}
    >
      <div className="px-6 py-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              Layer 03 · Decide
            </p>
            <h4 className="mt-2 font-sans text-lg font-semibold text-ink">
              Intent Classification Engine
            </h4>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] text-ink/40"
            style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "rgba(11,13,18,0.10)" }}
          >
            Active
          </span>
        </div>
        <p className="font-sans text-sm leading-relaxed text-ink/60">
          Classifies each session into an intent bucket — Discovery, Evaluation, or Conversion — and routes to the corresponding experience variant.
        </p>
      </div>
      <div
        className="flex items-center justify-between gap-4 bg-surface/60 px-6 py-4"
        style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "rgba(11,13,18,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span className="font-mono text-[10px] text-ink/35">Classifying · 3 active sessions</span>
        </div>
        <button className="font-mono text-[11px] font-medium text-accent hover:text-accent/70 transition">
          Inspect →
        </button>
      </div>
    </div>
  );
}

function MetricCard() {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-obsidian"
      style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "rgba(182,255,71,0.15)" }}
    >
      <div className="px-6 py-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
          Outcome Signal
        </p>
        <div className="mt-3 flex items-end gap-3">
          <span className="font-sans text-5xl font-semibold text-white">+43%</span>
          <span className="mb-1.5 font-sans text-sm text-cyberLime">↑ vs baseline</span>
        </div>
        <p className="mt-2 font-sans text-sm text-white/50">
          Activation rate after adaptive onboarding deployment.
        </p>
      </div>
      <div
        className="px-6 py-3"
        style={{ borderTopWidth: "0.5px", borderTopStyle: "solid", borderTopColor: "rgba(182,255,71,0.10)" }}
      >
        <span className="font-mono text-[10px] text-white/25">{"> 6-week cohort · n=1,240 sessions"}</span>
      </div>
    </div>
  );
}

function CardsSection() {
  return (
    <section>
      <SectionLabel>04 — Card Patterns · Glassmorphism System</SectionLabel>
      <div className="space-y-4">
        {/* Dark glass stage */}
        <div className="rounded-2xl bg-obsidian p-6 md:p-8">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">
            Dark surface · glass variant
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard />
            <MetricCard />
          </div>
        </div>

        {/* Light stage */}
        <div className="rounded-2xl border border-line/60 bg-surface/80 p-6 md:p-8">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">
            Light surface · panel variant
          </p>
          <LightCard />
        </div>
      </div>

      {/* Spec footnote */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { token: "border-width", value: "0.5px" },
          { token: "backdrop-blur", value: "blur(12px)" },
          { token: "bg-opacity (dark)", value: "white / 5%" },
        ].map(({ token, value }) => (
          <div
            key={token}
            className="rounded-xl border border-line/50 bg-white/80 px-4 py-3"
          >
            <p className="font-mono text-[10px] text-ink/40">{token}</p>
            <p className="font-mono text-xs font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Brand Library Root ───────────────────────────────────────────────────────

export function BrandLibrary() {
  return (
    <div className="mx-auto max-w-4xl space-y-0 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink/40">
            HADE Systems
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[10px] text-ink/50"
            style={{ borderWidth: "0.5px", borderStyle: "solid", borderColor: "rgba(11,13,18,0.15)" }}
          >
            v1.0 · Systems Branding
          </span>
        </div>
        <h1 className="font-sans text-3xl font-semibold text-ink md:text-4xl">
          Brand Library
        </h1>
        <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-ink/60">
          A living reference for typography, color, components, and interaction patterns. Every token and pattern here is what ships in production.
        </p>
      </div>

      <TypographySection />
      <Divider />
      <ColorsSection />
      <Divider />
      <AdaptiveCTASection />
      <Divider />
      <CardsSection />
    </div>
  );
}
