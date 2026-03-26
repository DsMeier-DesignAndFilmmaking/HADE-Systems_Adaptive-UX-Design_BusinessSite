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
import HadeEngineSystemsDiagram from "@/components/travel/HadeEngineSystemsDiagram";

export const metadata: Metadata = {
  title: "Travel Packs | HADE Systems",
  description:
    "UX-focused Field Notes case study showing how HADE Engine turns text + voice user signals into adaptive panels and real-time travel decisions.",
};

const ACCENT = "#0891B2";

const PROBLEMS = [
  {
    headline: "Static interfaces during dynamic travel moments",
    body: "Most travel products remain locked to pre-planned content and do not adapt once user intent shifts in real time.",
  },
  {
    headline: "Low-fidelity intent capture",
    body: "Traveler context is often reduced to taps and page views, missing high-value user-generated text and voice signals.",
  },
  {
    headline: "Recommendation slots without decision logic",
    body: "UI containers exist, but without trust-weighted signal ingestion and scoring, suggestions stay generic and low-confidence.",
  },
  {
    headline: "No live adaptation in motion",
    body: "When weather, transit, or user preference changes, panels do not re-rank quickly enough to support on-the-go decisions.",
  },
];

const SYSTEM_ITEMS = [
  {
    tag: "Field Notes Module",
    title: "Offline-First Core",
    body: "Foundational city packs and guidance remain available without connectivity to keep baseline utility resilient.",
  },
  {
    tag: "Field Notes Module",
    title: "Arrival Intelligence",
    body: "Time-sensitive arrival flows provide tactical next actions from landing through initial city movement.",
  },
  {
    tag: "Field Notes Module",
    title: "Live City Pulse",
    body: "Live AQI, weather, and city-state context enriches recommendations when connectivity is available.",
  },
  {
    tag: "HADE Integration Point",
    title: "Adaptive Recommendation Slot",
    body: "Dedicated UI slot in Field Notes where HADE-scored recommendations are injected and continuously re-ranked.",
  },
];

const BUILD_ITEMS = [
  {
    label: "User-Generated Signal Capture (Text + Voice)",
    detail: "Define how traveler text notes and voice snippets are captured, normalized, and prepared for inference.",
  },
  {
    label: "Signal Ingestion + Trust/Intent Weighting",
    detail: "Implement a weighting layer that scores reliability, urgency, and intent confidence before decision scoring.",
  },
  {
    label: "Real-Time Decisioning in Field Notes",
    detail: "Map ingestion outputs into recommendation scores and route top candidates to adaptive UI panels in-session.",
  },
  {
    label: "Adaptive Panel Orchestration",
    detail: "Define panel rules for reorder, replacement, and confidence labels as context changes mid-journey.",
  },
  {
    label: "API-Ready Integration Hook",
    detail: "Ship a safe client preview mode today while preparing transport contracts for live HADE endpoint connection.",
  },
];

const CURRENT_REALITY = [
  {
    headline: "Field Notes modules are live but being tested",
    body: "Offline-first core, Arrival Intelligence, and Live City Pulse are usable today and define the baseline traveler experience.",
  },
  {
    headline: "HADE decision loop is in preview mode",
    body: "UI placeholders now simulate text + voice signal handling and recommendation scoring without requiring live backend availability.",
  },
  {
    headline: "Real-time panel adaptation is staged",
    body: "Adaptive panel logic is framed in the UX flow and ready for endpoint-driven decision outputs.",
  },
];

const SYSTEM_GAPS = [
  "Voice transcription + confidence scoring is still mocked in the client preview layer",
  "Trust weighting schema needs persistent memory to refine recommendations session-over-session",
  "Within-city GPS precision is opt-in and not yet consistently available across flows",
  "No production HADE endpoint is wired yet for live recommendation scoring",
  "Adaptive panel telemetry is not yet connected to a closed-loop learning pipeline",
  "Offline fallback strategy for HADE recommendations needs explicit finalization",
  "POI freshness and source reliability controls still need operational guardrails",
];

const WHATS_NEXT = [
  "Finalize the HADE input schema for text, voice, location, and module context",
  "Connect the preview hook to a live HADE recommendation endpoint",
  "Implement trust + intent weighting service in the ingestion layer",
  "Deploy adaptive panel ranking logic in the Field Notes recommendation slot",
  "Run real-world pilot sessions and validate confidence-scored recommendation quality",
  "Promote decision telemetry into a repeatable optimization loop",
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
                label: "What Exists Today",
                heading: "Field Notes running in production",
                body: "Offline-first core, Arrival Intelligence, and Live City Pulse are already usable in a deployed PWA experience.",
              }}
              right={{
                label: "HADE Engine Layer",
                heading: "Signal-driven adaptive UX",
                body: "User-generated text + voice signals flow into HADE scoring to drive adaptive recommendation panels in real time.",
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
              statement="The interface should listen first, then adapt."
              supporting="HADE turns user-generated signals into ranked decisions so travelers spend less time searching and more time moving through the city."
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
              The full UX decision loop: Field Notes modules, HADE signal ingestion, adaptive panels, and recommendation output.
            </p>
            <SystemGrid items={SYSTEM_ITEMS} accent={ACCENT} />
            <div className="mt-6">
              <HadeEngineSystemsDiagram accent={ACCENT} />
            </div>
          </section>
        </Reveal>

        {/* ── 6. Current Reality ────────────────────────────────────── */}
        <Reveal delay={240}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-6">
              Current Reality
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {CURRENT_REALITY.map(({ headline, body }) => (
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

        {/* ── 7. Current Build Focus ────────────────────────────────── */}
        <Reveal delay={280}>
          <section className="mb-12">
            <BuildFocusList items={BUILD_ITEMS} accent={ACCENT} />
          </section>
        </Reveal>

        {/* ── 8. Gaps Identified ────────────────────────────────────── */}
        <Reveal delay={310}>
          <section className="mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-5">
              Gaps Identified
            </p>
            <div className="space-y-3">
              {SYSTEM_GAPS.map((gap, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-ink/25 shrink-0" />
                  <p className="text-sm text-ink/60 leading-relaxed">{gap}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 9. What's Next ────────────────────────────────────────── */}
        <Reveal delay={340}>
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

        {/* ── 10. Live Product ──────────────────────────────────────── */}
        <Reveal delay={370}>
          <section className="mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-5">
              Live Product
            </p>
            <FutureProductCTA
              accent={ACCENT}
              heading="Field Notes PWA — Active Build Surface"
              description="Field Notes is live with core travel modules today. HADE integration is staged to convert user-generated signals into adaptive recommendations in-session."
              subtext="Current build supports offline core + module context while HADE backend connection is being finalized."
              buttonLabel="View Live Product"
            />
          </section>
        </Reveal>

        {/* ── CTA + Related ─────────────────────────────────────────── */}
        <Reveal delay={400}>
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
