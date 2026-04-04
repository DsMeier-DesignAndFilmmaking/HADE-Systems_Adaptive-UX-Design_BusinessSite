import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";
import SplitSystemIntro from "@/components/travel/SplitSystemIntro";
import PrincipleBlock from "@/components/travel/PrincipleBlock";
import SystemGrid from "@/components/travel/SystemGrid";
import BuildFocusList from "@/components/travel/BuildFocusList";
import SaasActivationEngineClient from "@/components/saas/SaasActivationEngineClient";
import CognitiveLoadArchitecture from "@/components/saas/CognitiveLoadArchitecture";
import ProductionReadiness from "@/components/travel/ProductionReadiness";
import type { ChecklistItem, RoadmapStep } from "@/components/travel/ProductionReadiness";

export const metadata: Metadata = {
  title: "Adaptive Configuration Engine | HADE Systems",
  description:
    "A behavioral rescue layer that detects configuration friction in real time — and removes it before users abandon setup.",
};

const ACCENT = "#2C7B76";

const SAAS_CHECKLIST: ChecklistItem[] = [
  { status: "validated", label: "UX & Interaction Models — Onboarding flow, friction state taxonomy, rescue layer design" },
  { status: "validated", label: "Cognitive Load Signal Architecture — Four-signal telemetry schema, Friction Score formula" },
  { status: "validated", label: "Abandonment Threshold Model — Four-band state machine (Configuring → Blocked)" },
  { status: "validated", label: "Rescue Layer Command Set — Auto-Connect, template injection, guided mode escalation" },
  { status: "in-progress", label: "HADE Scoring Microservice — Node.js Friction Score computation endpoint" },
  { status: "in-progress", label: "Real-time WebSocket Integration — Session telemetry bridge to onboarding client" },
  { status: "in-progress", label: "Rescue Trigger Automation — Event-driven intervention dispatch on threshold breach" },
  { status: "planned", label: "Multi-tenant Isolation — Per-account scoring context, no cross-session data leakage" },
];

const SAAS_ROADMAP: RoadmapStep[] = [
  {
    index: "01",
    label: "Instrumentation",
    detail:
      "Deploy low-level event listeners to the onboarding client to capture input volatility (edit/delete rate), field stall duration, context-switch events (tab focus/blur), and cursor velocity vectors. Emit structured events to the HADE ingestion endpoint with session ID, step-level context, and field complexity classification.",
  },
  {
    index: "02",
    label: "Scoring Endpoint",
    detail:
      "Stand up a Node.js Friction Score service. The endpoint accepts the session event buffer, applies the weighted signal normalization formula, and emits the current Friction Score and state classification (Configuring / Struggling / Blocked / Abandonment Imminent) in real time. Recompute target: ≤ 200ms end-to-end.",
  },
  {
    index: "03",
    label: "UI Triggers",
    detail:
      "Wire the HADE state output to the onboarding client's rescue layer via a lightweight React hook or SDK listener. State transitions above threshold dispatch the appropriate intervention: inline micro-assist, pre-fill template injection, guided mode modal, or human handoff escalation — in order of signal severity.",
  },
  {
    index: "04",
    label: "A/B Validation",
    detail:
      "Gate the HADE rescue layer behind a feature flag. Control cohort receives the standard onboarding flow; treatment cohort receives adaptive rescue interventions. Primary metric: onboarding completion rate. Secondary metrics: time-to-first-value, support ticket volume, activation-to-paid conversion rate.",
  },
  {
    index: "05",
    label: "Threshold Iteration",
    detail:
      "Analyze Friction Score distributions from completed and abandoned sessions in the treatment cohort. Recalibrate the Blocked state threshold (currently 56) and per-signal weight coefficients using observed abandonment correlation data. Objective: reduce false-positive intervention triggers without increasing undetected abandonment events.",
  },
];

const SAAS_SCALABILITY =
  "Designed for in-app SDK deployment with a minimal client footprint. The HADE rescue layer exposes a lightweight event-listener API compatible with any SaaS front-end framework — React, Vue, Angular, or vanilla JS. The Friction Score microservice is stateless and session-scoped, enabling multi-tenant deployment with per-account scoring isolation and no cross-session data leakage. The signal ingestion layer is framework-agnostic; existing analytics pipelines (Segment, Amplitude, Mixpanel) can serve as the event source without SDK replacement, lowering adoption cost for enterprise clients with established telemetry infrastructure.";

const PROBLEMS = [
  {
    headline: "The Integration Wall",
    body: "60% of new users abandon during technical setup. API keys, schema mapping, data routing — each step compounds cognitive load until the cost of completing setup outweighs the perceived value of the product.",
  },
  {
    headline: "Configuration complexity",
    body: "Technical setup requires users to hold multiple mental models simultaneously: their own data schema, the product's data model, and the mapping logic between them. Most never make it through.",
  },
  {
    headline: "Micro-hesitation is invisible",
    body: "Hover dwell on unfamiliar fields, idle time before a required input, and documentation tab-switching all signal approaching abandonment. No standard analytics layer captures them.",
  },
  {
    headline: "The Setup Tax",
    body: "Every minute of manual configuration is time borrowed against trust. A 15-minute setup task that could be automated is not a UX problem — it's a conversion the product never had.",
  },
];

const SYSTEM_ITEMS = [
  {
    tag: "Signal Layer",
    title: "Micro-Hesitation Capture",
    body: "Cursor dwell on required input fields, idle intervals during schema definition, documentation tab-switches, and form backtracking are captured continuously — building a live cognitive load profile.",
  },
  {
    tag: "State Detection",
    title: "Cognitive Load Engine",
    body: "Four states: Configuring (active setup, low friction), Confused (idle + hover clusters on unfamiliar fields), Blocked (repeated backtrack — intent stalled at a single step), Abandoned (session exit from setup flow).",
  },
  {
    tag: "HADE Decision Engine",
    title: "Behavioral Rescue Layer",
    body: "Matches detected load state to the right intervention. Auto-fills predictable fields. Surfaces the shortcut path. Removes the step that was never necessary — triggered at the exact moment friction peaks.",
  },
  {
    tag: "Output Layer",
    title: "Friction-to-Flow Adapter",
    body: "The interface restructures around the rescue: pre-populated connection fields, smart defaults applied silently, and an Auto-Connect trigger that replaces a 15-minute manual task with a 2-second automated unlock.",
  },
];

const FLOW_STEPS = [
  "Cursor Signals",
  "Load State Detected",
  "HADE Rescue Layer",
  "Shortcut Matched",
  "Adaptive UI",
  "First Value",
];

const EXPERIENCE_MOMENTS = [
  {
    label: "Signup → Integration Prompt",
    detail:
      "User enters the product. HADE detects the configuration entry point. The setup flow narrows — only the fields required for first connection are shown. Nothing else surfaces.",
  },
  {
    label: "Configuration → Confusion Signal",
    detail:
      "User idles on the API key field for 8 seconds. Cursor moves to the documentation tab. HADE detects the hesitation cluster and queues a rescue intervention — before the session ends.",
  },
  {
    label: "Hesitation → Adaptive Shortcut",
    detail:
      "HADE triggers the rescue layer. A pre-populated connection path appears. The manual schema mapping step is bypassed by a single Auto-Connect action — 2 seconds instead of 15 minutes.",
  },
  {
    label: "Shortcut → First Value",
    detail:
      "User completes the connection. Time-to-first-value drops. The product opens from the point of successful configuration — not from the moment of signup.",
  },
];

const IMPLEMENTATION_PATH_ITEMS = [
  {
    label: "Instrumentation",
    detail:
      "Low-overhead Mouse, Keyboard, and Focus listeners capture micro-interactions through Event Buffering with debounced streams and `requestIdleCallback`, preserving UI responsiveness while building a Friction Stream.",
  },
  {
    label: "Orchestration",
    detail:
      "A lightweight Edge Function (Vercel Edge Function or AWS Lambda) processes buffered friction signals and returns a compact rescue payload optimized for minimal transfer and fast recovery decisions.",
  },
  {
    label: "Trigger Hook: useHadeRescue()",
    detail:
      "Hook Abstraction standardizes rescue consumption across configuration surfaces: `const { command, payload } = useHadeRescue();`. Components subscribe once, then execute rescue commands such as `AUTO_FILL`, `SKIP_STEP`, or `INJECT_TEMPLATE` without custom wiring per flow.",
  },
  {
    label: "Deployment Protocol",
    detail:
      "Segment or RudderStack forwards telemetry and rescue outcomes into LaunchDarkly experiment cohorts, enabling Payload Optimization and controlled A/B measurement between static-control and HADE-enabled variants.",
  },
];

const OUTCOME_ITEMS = [
  {
    tag: "TTFV",
    title: "Time-to-First-Value decreases",
    body: "Behavioral rescue removes configuration friction before it becomes abandonment. Users reach their first connected state faster — without needing to understand the full setup model.",
  },
  {
    tag: "Drop-off",
    title: "Onboarding abandonment falls",
    body: "Micro-hesitation detection intervenes at the precise moment users are about to exit setup. The shortcut path narrows the gap before the decision to leave is made.",
  },
  {
    tag: "Support",
    title: "Setup ticket volume drops",
    body: "When the system handles predictable configuration friction automatically, the questions that generate support tickets never arise. The rescue layer closes the loop before users escalate.",
  },
];

const IMPACT_MODELING_METRICS = [
  {
    metric: "Onboarding Recovery",
    modeled: "15-25% reduction in setup exits",
    detail:
      "Rescue intervention is triggered at hesitation clusters (idle + focus churn + docs tab-switching), intercepting abandonment intent before session termination.",
  },
  {
    metric: "TTFV Acceleration",
    modeled: "40% faster time-to-first-value",
    detail:
      "Auto-Connect triggers bypass manual 1:1 field mapping and schema handoff steps, compressing integration latency for first successful activation.",
  },
  {
    metric: "Support Deflection",
    modeled: "20% drop in integration-related tickets",
    detail:
      "Programmatic friction resolution reduces preventable setup failures, lowering support-assisted onboarding volume and associated servicing cost.",
  },
];

const PERSONA_VALIDATION = [
  {
    flow: "Friction-Heavy Manual Flow (Non-Technical Operator)",
    profile:
      "User stalls on API credential and mapping requirements, context-switches to documentation, and exits before first successful connection.",
  },
  {
    flow: "HADE-Augmented Rescue Flow",
    profile:
      "The same hesitation pattern triggers rescue commands that auto-fill predictable values, skip low-leverage mapping steps, and inject a guided template to complete activation in-session.",
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
                  background: `rgba(44,123,118,0.08)`,
                  border: `1px solid rgba(44,123,118,0.25)`,
                  color: ACCENT,
                }}
              >
                Concept Build
              </span>
              <span className="rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/45">
                B2B SaaS
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-ink leading-snug mb-4">
              Adaptive Configuration Engine
            </h1>
            <p className="text-base text-ink/65 leading-relaxed">
              A system that reads how users move through technical setup — detecting micro-hesitations
              before they become exits, and replacing friction with automated shortcuts.
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
                heading: "The Integration Wall",
                body: "60% of SaaS users abandon during initial setup. Not because the product is wrong — because the configuration cost is too high to justify continuing.",
              }}
              right={{
                label: "HADE Behavioral Rescue",
                heading: "Micro-hesitation detection",
                body: "Hover patterns, idle intervals on input fields, and documentation tab-switching feed HADE continuously. The system reads cognitive load in real time — and triggers a shortcut before friction becomes an exit.",
              }}
            />
          </section>
        </Reveal>

        {/* ── 3. Problem ────────────────────────────────────────────── */}
        <Reveal delay={120}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-6">
              Challenge
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
              statement="Configuration friction is not a UX problem. It's a behavioral event — and it can be detected."
              supporting="HADE monitors the micro-signals that precede abandonment: idle time on a required field, repeated returns to documentation, cursor retreat from a form. When the pattern arrives, the system doesn't surface a tooltip — it removes the step entirely."
            />
          </section>
        </Reveal>

        {/* ── 5. System ─────────────────────────────────────────────── */}
        <Reveal delay={200}>
          <section className="mb-12">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
              Approach
            </p>
            <p className="text-md text-ink/55 leading-relaxed mb-5">
              Micro-hesitation signals flow in, cognitive load state is classified, and the rescue layer matches the right shortcut — before the session ends.
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
            <CognitiveLoadArchitecture accent={ACCENT} />
            <div className="mt-6">
              <SaasActivationEngineClient />
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

        {/* ── 7. Implementation Path ────────────────────────────────── */}
        <Reveal delay={260}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
              Implementation Path (Engineering Credibility)
            </p>
            <p className="text-md text-ink/55 leading-relaxed mb-5">
              The HADE Behavioral Rescue layer deploys as a modern React/Next.js architecture with Event Buffering on the client, Edge Execution for real-time decisions, and Hook Abstraction for deterministic rescue delivery.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {IMPLEMENTATION_PATH_ITEMS.map(({ label, detail }) => (
                <div
                  key={label}
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(11,13,18,0.03)",
                    border: "1px solid rgba(11,13,18,0.08)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink/45 mb-2">
                    {label}
                  </p>
                  <p className="text-sm text-ink/60 leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 8. Outcome ────────────────────────────────────────────── */}
        <Reveal delay={280}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
              Result
            </p>
            <SystemGrid items={OUTCOME_ITEMS} accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── 9. Impact Modeling ───────────────────────────────────── */}
        <Reveal delay={300}>
          <section className="mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
              Impact Modeling &amp; ROI
            </p>
            <p className="text-md text-ink/55 leading-relaxed mb-5">
              RevOps impact model: by converting micro-hesitation signals into rescue actions, the onboarding funnel recovers otherwise lost sessions, improves CAC efficiency, and increases paid activation yield without increasing acquisition spend.
            </p>

            <div className="rounded-xl p-5 mb-4" style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.08)" }}>
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-ink/45 mb-4">
                Modeled Performance Outcomes
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {IMPACT_MODELING_METRICS.map(({ metric, modeled, detail }) => (
                  <div
                    key={metric}
                    className="rounded-lg p-4"
                    style={{
                      background: "rgba(255,255,255,0.65)",
                      border: "1px solid rgba(11,13,18,0.08)",
                    }}
                  >
                    <p className="text-xs text-ink/50 mb-2 leading-relaxed">{metric}</p>
                    <p className="text-sm font-semibold text-ink mb-2">{modeled}</p>
                    <p className="text-sm text-ink/60 leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-5 mb-4" style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.08)" }}>
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-ink/45 mb-4">
                Causality Analysis
              </p>
              <p className="text-sm text-ink/60 leading-relaxed">
                Signal-level causality chain: hesitation detection (idle bursts, focus churn, and documentation switching) increases rescue trigger precision; rescue precision increases successful step completion; step completion raises onboarding conversion and shortens activation windows. At the business layer, this shifts conversion forward in the funnel, reducing payback risk on CAC and improving expansion-qualified account volume.
              </p>
            </div>

            <div className="rounded-xl p-5" style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.08)" }}>
              <p className="text-xs font-semibold tracking-[0.08em] uppercase text-ink/45 mb-4">
                Persona Validation (Non-Technical User)
              </p>
              <div className="space-y-3">
                {PERSONA_VALIDATION.map(({ flow, profile }) => (
                  <div key={flow} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.65)", border: "1px solid rgba(11,13,18,0.08)" }}>
                    <p className="text-sm font-semibold text-ink mb-1">{flow}</p>
                    <p className="text-sm text-ink/60 leading-relaxed">{profile}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── From Prototype to Production ─────────────────────────── */}
        <Reveal delay={310}>
          <section className="mb-16">
            <ProductionReadiness
              accent={ACCENT}
              checklist={SAAS_CHECKLIST}
              roadmap={SAAS_ROADMAP}
              scalabilityStatement={SAAS_SCALABILITY}
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
                  href: "/case-studies/ecommerce",
                  label: "Adaptive Purchase Decision Engine",
                  hook: "State detection that reads how a user is shopping and restructures the catalog to match their intent.",
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
