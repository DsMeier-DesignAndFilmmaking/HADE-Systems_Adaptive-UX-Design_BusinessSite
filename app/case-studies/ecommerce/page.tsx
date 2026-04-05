import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";
import SplitSystemIntro from "@/components/travel/SplitSystemIntro";
import PrincipleBlock from "@/components/travel/PrincipleBlock";
import SystemGrid from "@/components/travel/SystemGrid";
import HadeEcommerceEngine from "@/components/ecommerce/HadeEcommerceEngine";
import IntentStack from "@/components/ecommerce/IntentStack";
import BusinessImpact from "@/components/ecommerce/BusinessImpact";
import SystemsAuditMetrics from "@/components/ecommerce/SystemsAuditMetrics";
import ProductionReadiness from "@/components/travel/ProductionReadiness";
import type { ChecklistItem, RoadmapStep } from "@/components/travel/ProductionReadiness";

export const metadata: Metadata = {
  title: "Adaptive Purchase Decision Engine | HADE Systems",
  description:
    "An infrastructure-level decision layer designed to recover mid-funnel drop-off. By classifying shopper intent in real-time, the system dynamically restructures PLG (Product-Led Growth) catalogs to reduce choice fatigue and accelerate the path to checkout.",
};

const ACCENT = "#316BFF";

const ECOMMERCE_CHECKLIST: ChecklistItem[] = [
  { status: "validated", label: "UX & Interaction Models — Behavioral capture, decision engine, adaptive catalog flows" },
  { status: "validated", label: "Signal Architecture & Mapping — Intent Stack schema, behavioral telemetry event model" },
  { status: "validated", label: "Edge Middleware Re-ordering Logic — Next.js edge intercept, payload optimization spec" },
  { status: "validated", label: "Intent Score Formula — Weighted normalization across 8-signal behavioral matrix" },
  { status: "in-progress", label: "HADE Scoring Microservice — Node.js/Python session scoring endpoint" },
  { status: "in-progress", label: "Real-time Segment/RudderStack Integration — Client-side event stream connection" },
  { status: "in-progress", label: "LaunchDarkly A/B Test Configuration — Flag setup, cohort targeting, metric binding" },
  { status: "planned", label: "Production Load Testing — Scoring throughput under peak catalog traffic" },
];

const ECOMMERCE_ROADMAP: RoadmapStep[] = [
  {
    index: "01",
    label: "Instrumentation",
    detail:
      "Deploy Segment or RudderStack SDK to emit structured events on back-navigation, price-filter interactions, cart add/remove deltas, and PDP dwell. Inject idempotency keys at the SDK layer to prevent duplicate scoring on network retry. All events carry session ID, product SKU context, and funnel-stage classification.",
  },
  {
    index: "02",
    label: "Scoring Endpoint",
    detail:
      "Stand up a Node.js middleware service on Vercel Edge or Cloudflare Workers. The service accepts the session event buffer, runs the HADE intent scoring model, and writes the scored payload to edge KV (Vercel KV or Cloudflare KV) within a 200ms SLA. The endpoint is stateless; session context is reconstructed from the ordered event buffer.",
  },
  {
    index: "03",
    label: "UI Triggers",
    detail:
      "Connect the HADE intent payload to a Next.js Edge Middleware intercept that re-orders the product array before SSR. No client-side reflow; catalog order is resolved at the edge before initial DOM paint. Product arrays are field-projected to ≤ 4KB before serialization to prevent TTFB degradation.",
  },
  {
    index: "04",
    label: "A/B Validation",
    detail:
      "Gate the adaptive catalog path behind a LaunchDarkly flag (50/50 split at edge). Primary metric: session conversion rate. Secondary: add-to-cart rate, time-to-cart median, return-to-search frequency. Run to p < 0.05 at 95% CI with a minimum of 4,200 sessions per cohort for adequate statistical power.",
  },
  {
    index: "05",
    label: "Threshold Iteration",
    detail:
      "Extract Intent Score distributions from the A/B treatment cohort. Recalibrate signal weights and the Evaluating-state detection threshold using observed conversion correlation data. Target: maximize precision of the high-intent re-ordering trigger while minimizing false-positive catalog mutations on low-intent sessions.",
  },
];

const ECOMMERCE_SCALABILITY =
  "Designed for headless commerce deployment via API-first architecture. The HADE scoring layer is fully decoupled from the storefront rendering layer, enabling integration with any Shopify, Commercetools, or custom Next.js stack via Edge Middleware or server-side product API. The intent model is independently versioned, rollback-safe, and multi-tenant capable. Edge-cached scoring payloads add zero latency to TTFB; catalog re-ordering occurs entirely within the existing SSR pipeline without frontend SDK changes.";

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

        {/* ── 5b. Technical Infrastructure & Signal Stack ───────────── */}
        <Reveal delay={220}>
          <section className="mb-12">
            <IntentStack accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── 7b. Business Impact ───────────────────────────────────── */}
        <Reveal delay={275}>
          <section className="mb-12">
            <BusinessImpact accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── Systems Audit & KPI Matrix ──────────────────────────── */}
        <Reveal delay={278}>
          <section className="mb-12">
            <SystemsAuditMetrics accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── From Prototype to Production ─────────────────────────── */}
        <Reveal delay={310}>
          <section className="mb-16">
            <ProductionReadiness
              accent={ACCENT}
              checklist={ECOMMERCE_CHECKLIST}
              roadmap={ECOMMERCE_ROADMAP}
              scalabilityStatement={ECOMMERCE_SCALABILITY}
            />
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
