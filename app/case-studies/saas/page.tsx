import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";
import SplitSystemIntro from "@/components/travel/SplitSystemIntro";
import PrincipleBlock from "@/components/travel/PrincipleBlock";
import SystemGrid from "@/components/travel/SystemGrid";
import BuildFocusList from "@/components/travel/BuildFocusList";
import SaasActivationEngineClient from "@/components/saas/SaasActivationEngineClient";

export const metadata: Metadata = {
  title: "Adaptive Configuration Engine | HADE Systems",
  description:
    "A behavioral rescue layer that detects configuration friction in real time — and removes it before users abandon setup.",
};

const ACCENT = "#2C7B76";

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

        {/* ── 7. Outcome ────────────────────────────────────────────── */}
        <Reveal delay={280}>
          <section className="mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
              Result
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
                  href: "/case-studies/system",
                  label: "Adaptive System Lab",
                  hook: "A unified behavioral layer connecting onboarding, usage, and retention as a single adaptive system.",
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
