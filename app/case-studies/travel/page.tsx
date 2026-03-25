import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";
import CaseStudyHero from "@/components/travel/CaseStudyHero";
import SplitSystemIntro from "@/components/travel/SplitSystemIntro";
import PrincipleBlock from "@/components/travel/PrincipleBlock";
import SystemGrid from "@/components/travel/SystemGrid";
import BuildFocusList from "@/components/travel/BuildFocusList";
import FutureProductCTA from "@/components/travel/FutureProductCTA";

export const metadata: Metadata = {
  title: "Travel Packs | HADE Systems",
  description:
    "An adaptive, offline-first travel system powered by the HADE Decision Engine—designed to help travelers make better decisions in real time without constant phone use.",
};

const ACCENT = "#0891B2";

const PROBLEMS = [
  {
    headline: "Overloaded tools",
    body: "Apps optimized for planning go silent the moment you're in motion. The tool stops working exactly when you need it most.",
  },
  {
    headline: "Generic recommendations",
    body: "Same suggestions regardless of context, time, or what you've already done. No memory. No prioritization.",
  },
  {
    headline: "High screen dependency",
    body: "Finding anything requires active searching, pulling you out of the experience and back into your phone.",
  },
  {
    headline: "Loss of spontaneity",
    body: "Decision overload leads to paralysis, not exploration. The overhead of deciding kills the desire to move.",
  },
];

const SYSTEM_ITEMS = [
  {
    tag: "Input Layer",
    title: "Travel Packs",
    body: "Structured destination units that embed curated decisions offline—no connectivity required.",
  },
  {
    tag: "Engine Trigger",
    title: "Moment-Based Prompts",
    body: "Context-aware suggestions surfaced at the right moment without asking the user to search.",
  },
  {
    tag: "Offline-First",
    title: "Offline Decision Layer",
    body: "Full usability without connectivity—all decision logic and content runs entirely on-device.",
  },
  {
    tag: "System Layer",
    title: "Adaptive Logic",
    body: "The system evolves based on behavior, location, and environment signals over time.",
  },
];

const BUILD_ITEMS = [
  {
    label: "Pack Data Model",
    detail: "Defining what fields, structure, and constraints make a pack functional and portable across destinations.",
  },
  {
    label: "Ultra-Fast Interaction Flows",
    detail: "Every tap path designed to complete in under 3 interactions—minimizing the cost of each decision.",
  },
  {
    label: "Attention Cost Reduction",
    detail: "Measuring and minimizing the cognitive load of each decision moment surfaced by the system.",
  },
  {
    label: "Offline-First Architecture",
    detail: "Ensuring all decision logic and content runs fully on-device without a network dependency.",
  },
  {
    label: "HADE Logic Application",
    detail: "Applying Decision Engine rules to real travel scenarios and validating output in field conditions.",
  },
];

const WHATS_NEXT = [
  "Launch MVP for first destination",
  "Field testing in real travel environments",
  "Refining decision timing and relevance",
  "Expanding HADE system integration",
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
          <CaseStudyHero accent={ACCENT} />
        </Reveal>

        <div className="border-t border-line mb-12" />

        {/* ── 2. Product + System Framing ───────────────────────────── */}
        <Reveal delay={80}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-5">
              Product + System
            </p>
            <SplitSystemIntro
              accent={ACCENT}
              left={{
                label: "What This Is",
                heading: "A real product in active development",
                body: "Travel Packs is an actively developed product where the HADE Decision Engine is applied directly to real travel scenarios—shaping how decisions are surfaced, prioritized, and experienced.",
              }}
              right={{
                label: "System Layer",
                heading: "Powered by HADE Decision Engine",
                body: "The HADE Decision Engine powers how information is filtered, timed, and delivered—turning complex travel decisions into simple, actionable moments.",
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
                  <h3 className="text-sm font-semibold text-ink mb-2 leading-snug">{headline}</h3>
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
              statement="The goal is not to replace spontaneity — it's to enable it."
              supporting="Travel Packs is built around minimal screen time, fast decisions, and a fast return to the real world. Every design choice reduces the cost of deciding—so more of the trip can be lived."
            />
          </section>
        </Reveal>

        {/* ── 5. System in Action ───────────────────────────────────── */}
        <Reveal delay={200}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
              System in Action
            </p>
            <p className="text-sm text-ink/55 leading-relaxed mb-5">
              This product is where the HADE Decision Engine is being actively applied.
            </p>
            <SystemGrid items={SYSTEM_ITEMS} accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── 6. Current Build Focus ────────────────────────────────── */}
        <Reveal delay={240}>
          <section className="mb-12">
            <BuildFocusList items={BUILD_ITEMS} accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── 7. What's Next ────────────────────────────────────────── */}
        <Reveal delay={280}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-5">
              What&apos;s Next
            </p>
            <div className="space-y-3">
              {WHATS_NEXT.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-ink/25 shrink-0" />
                  <p className="text-sm text-ink/60 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 8. Future Product Entry Point ─────────────────────────── */}
        <Reveal delay={320}>
          <section className="mb-16">
            <FutureProductCTA accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── CTA + Related ─────────────────────────────────────────── */}
        <Reveal delay={360}>
          <CaseStudyPageCTA />
          <div className="mt-16">
            <p className="text-sm font-medium mb-4">Related Case Studies</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: "/case-studies/activation",
                  label: "Activation Recovery",
                  hook: "Real-time intent classification that routes B2B SaaS users to the fastest path to their first value moment.",
                },
                {
                  href: "/case-studies/ai-tool",
                  label: "Adaptive AI Interaction",
                  hook: "Task-stage classification that replaces the blank slate with structured scaffolding matched to where the user is in their workflow.",
                },
                {
                  href: "/case-studies/retention",
                  label: "Retention System",
                  hook: "Behavior-triggered engagement that detects drift and responds before churn occurs.",
                },
                {
                  href: "/case-studies/system",
                  label: "Adaptive System Lab",
                  hook: "A unified behavioral layer that connects onboarding, usage, and retention as a single adaptive system.",
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
