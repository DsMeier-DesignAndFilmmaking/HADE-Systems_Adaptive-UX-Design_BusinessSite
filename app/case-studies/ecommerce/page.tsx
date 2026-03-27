import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";
import SplitSystemIntro from "@/components/travel/SplitSystemIntro";
import PrincipleBlock from "@/components/travel/PrincipleBlock";
import SystemGrid from "@/components/travel/SystemGrid";
import BuildFocusList from "@/components/travel/BuildFocusList";
import HadeEcommerceEngine from "@/components/ecommerce/HadeEcommerceEngine";

export const metadata: Metadata = {
  title: "Adaptive Purchase Decision Engine | HADE Systems",
  description:
    "A decision system that reads how a user is shopping in real time — detecting state, ranking options, and restructuring the catalog to match.",
};

const ACCENT = "#316BFF";

const PROBLEMS = [
  {
    headline: "Too many choices at once",
    body: "Large catalogs force comparison before intent has formed. The UI adds volume, not signal.",
  },
  {
    headline: "No ranking logic tied to state",
    body: "Every product surfaces with equal weight. The system has no mechanism to prioritize by fit.",
  },
  {
    headline: "Hesitation goes undetected",
    body: "When a user revisits a product or stalls mid-comparison, nothing responds. The moment passes.",
  },
  {
    headline: "Drop-off before checkout",
    body: "Users disengage at the comparison stage — not at payment. The friction is earlier than most teams measure.",
  },
];

const SYSTEM_ITEMS = [
  {
    tag: "Signal Layer",
    title: "Behavioral Capture",
    body: "Dwell time per product, comparison stacking, return visits, and exit timing are tracked continuously — building a live picture of purchase intent.",
  },
  {
    tag: "State Detection",
    title: "Purchase State Engine",
    body: "Three states: Browsing (wide scan, low dwell), Evaluating (active comparisons, deep attention), Hesitating (revisits with no action — intent present, friction blocking).",
  },
  {
    tag: "HADE Decision Engine",
    title: "Option Ranking",
    body: "Scores products against detected state. Reduces the visible list to highest-fit matches. Deprioritizes noise without removing catalog depth.",
  },
  {
    tag: "Output Layer",
    title: "Adaptive UI",
    body: "The interface restructures around the decision. A recommendation surfaces during hesitation. The path to purchase narrows as confidence increases.",
  },
];

const FLOW_STEPS = [
  "Behavior Signals",
  "State Detected",
  "HADE Decision Engine",
  "Options Ranked",
  "Adaptive UI",
  "Conversion",
];

const EXPERIENCE_MOMENTS = [
  {
    label: "Browsing → Narrowing",
    detail:
      "User scans widely. Dwell time is low across many products. HADE detects Browsing state and begins surfacing a tighter set based on engagement patterns.",
  },
  {
    label: "Comparing → Converging",
    detail:
      "User stacks two or three products. HADE detects Evaluating state. The catalog contracts — lower-fit options deprioritize. The gap between options becomes clearer.",
  },
  {
    label: "Hesitating → Guided",
    detail:
      "User returns to the same product twice without acting. HADE detects Hesitation. A direct recommendation surfaces — the best fit, with rationale. The comparison loop breaks.",
  },
  {
    label: "Decision → Conversion",
    detail:
      "Path to purchase narrows. No re-navigation, no restart. The interface has already cleared the way.",
  },
];

const OUTCOME_ITEMS = [
  {
    tag: "Clarity",
    title: "Decisions get faster",
    body: "Users spend less time comparing and more time choosing. The catalog narrows before they ask it to.",
  },
  {
    tag: "Confidence",
    title: "Hesitation resolves",
    body: "When state signals stall, HADE surfaces a recommendation. Users move forward with visible rationale.",
  },
  {
    tag: "Conversion",
    title: "Drop-off decreases",
    body: "The highest-friction point — comparison fatigue before checkout — is where the system intervenes most.",
  },
];

export default function Page() {
  return (
    <main className="w-full">
      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-24 md:pb-16">

        {/* ── Back ──────────────────────────────────────────────────── */}
        <Reveal>
          <Link
            href="/case-studies"
            className="text-sm text-muted hover:underline mb-8 inline-block"
          >
            ← Back to Case Studies
          </Link>
        </Reveal>

        {/* ── 1. Hero ───────────────────────────────────────────────── */}
        <Reveal delay={40}>
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span
                className="rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{
                  background: `rgba(49,107,255,0.08)`,
                  border: `1px solid rgba(49,107,255,0.25)`,
                  color: ACCENT,
                }}
              >
                Concept Build
              </span>
              <span className="rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/45">
                E-Commerce
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-ink leading-snug mb-4">
              Adaptive Purchase Decision Engine
            </h1>
            <p className="text-base text-ink/65 leading-relaxed">
              A decision system that reads how a user is shopping in real time — detecting state,
              ranking options, and restructuring the catalog to match.
            </p>
          </div>
        </Reveal>

        <div className="border-t border-line mb-12" />

        {/* ── 2. Context ────────────────────────────────────────────── */}
        <Reveal delay={80}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-5">
              Context
            </p>
            <SplitSystemIntro
              accent={ACCENT}
              left={{
                label: "The Problem",
                heading: "Catalog without context",
                body: "Products surface equally regardless of intent. Users browse, compare, hesitate — and leave. The system never intervenes.",
              }}
              right={{
                label: "HADE Engine Layer",
                heading: "State-driven decision layer",
                body: "Behavioral signals — dwell time, comparisons, revisits — feed HADE in real time. The system detects state and restructures what the user sees.",
              }}
            />
          </section>
        </Reveal>

        {/* ── 3. Problem ────────────────────────────────────────────── */}
        <Reveal delay={120}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-6">
              Problem
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROBLEMS.map(({ headline, body }) => (
                <div
                  key={headline}
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(11,13,18,0.03)",
                    border: "1px solid rgba(11,13,18,0.08)",
                  }}
                >
                  <h3 className="text-base font-semibold tracking-tight text-ink mb-2 leading-snug">{headline}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 4. Core Principle ─────────────────────────────────────── */}
        <Reveal delay={160}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-5">
              Core Principle
            </p>
            <PrincipleBlock
              accent={ACCENT}
              statement="The catalog should respond to how the user is shopping — not the other way around."
              supporting="HADE reads behavioral signals in real time, classifies purchase state, and restructures the decision environment so the right product surfaces at the right moment."
            />
          </section>
        </Reveal>

        {/* ── 5. System ─────────────────────────────────────────────── */}
        <Reveal delay={200}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
              System
            </p>
            <p className="text-md text-ink/55 leading-relaxed mb-5">
              Signals flow in, state is classified, and the decision engine restructures the interface — continuously, in session.
            </p>
            <SystemGrid items={SYSTEM_ITEMS} accent={ACCENT} />
            <div
              className="mt-4 rounded-xl p-5"
              style={{
                background: "rgba(11,13,18,0.03)",
                border: "1px solid rgba(11,13,18,0.08)",
              }}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-3">
                Decision Flow
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {FLOW_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="rounded-md border border-line/70 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink/70">
                      {step}
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <span className="text-ink/30 text-xs">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <HadeEcommerceEngine />
            </div>
          </section>
        </Reveal>

        {/* ── 6. Experience ─────────────────────────────────────────── */}
        <Reveal delay={240}>
          <section className="mb-12">
            <BuildFocusList
              items={EXPERIENCE_MOMENTS}
              label="Experience"
              accent={ACCENT}
            />
          </section>
        </Reveal>

        {/* ── 7. Outcome ────────────────────────────────────────────── */}
        <Reveal delay={280}>
          <section className="mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
              Outcome
            </p>
            <SystemGrid items={OUTCOME_ITEMS} accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── CTA + Related ─────────────────────────────────────────── */}
        <Reveal delay={320}>
          <CaseStudyPageCTA />
          <div className="mt-16">
            <p className="text-sm font-medium mb-4">Related Case Studies</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: "/case-studies/saas",
                  label: "Adaptive Activation System",
                  hook: "Context-aware guidance that detects where users are in a complex tool and surfaces the right next step.",
                },
                {
                  href: "/case-studies/travel",
                  label: "Travel Decision Engine",
                  hook: "Text and voice signals feed adaptive panels that restructure travel recommendations in real time.",
                },
                {
                  href: "/case-studies/ai-tool",
                  label: "Adaptive AI Interaction",
                  hook: "Task-stage classification that replaces the blank slate with structured scaffolding matched to the user's workflow.",
                },
              ].map(({ href, label, hook }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-xl border border-line bg-white/60 px-5 py-4 hover:border-ink/20 transition-colors"
                >
                  <p className="text-sm font-semibold text-ink mb-1">{label} →</p>
                  <p className="text-xs text-muted leading-relaxed">{hook}</p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
