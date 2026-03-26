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
    "A real, working offline-first travel system. HADE Decision Engine integration is the next phase — currently in active design.",
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
    title: "Offline-First Core",
    body: "11 structured city packs with arrival flows, safety data, transit logic, and environmental context — fully usable without connectivity.",
  },
  {
    tag: "Built Module",
    title: "Arrival Intelligence",
    body: "Multi-stage tactical guides from pre-arrival through airport exit — time-sensitive decisions pre-loaded and accessible offline.",
  },
  {
    tag: "Built Module",
    title: "Live City Pulse",
    body: "Real-time AQI, weather, traffic delay, and pollen data overlaid on city context when online.",
  },
  {
    tag: "Integration Point",
    title: "Spontaneity Engine Slot",
    body: "A reserved UI component exists in the city guide view. No HADE logic is wired yet — this is the integration target.",
  },
];

const BUILD_ITEMS = [
  {
    label: "Defining the HADE Context Contract",
    detail: "Specifying the exact JSON payload Field Notes will send to HADE: city slug, coordinates, arrival stage, AQI, neighborhood, transit state, and time-of-day.",
  },
  {
    label: "Designing the Integration Layer",
    detail: "Building the API endpoint, context transformer, and UI injection that replace the placeholder component with a live-data connection.",
  },
  {
    label: "Offline vs. Live Tradeoff",
    detail: "Deciding whether HADE recommendations are online-only, IDB-cached from last fetch, or pre-generated at pack-download time — each with different UX and architecture implications.",
  },
  {
    label: "Identifying Missing Context",
    detail: "GPS location, user intent, trip duration, and identity layer are not present in the current system — evaluating what to build vs. accept as v1 constraints.",
  },
  {
    label: "GPS + Location UX",
    detail: "Browser Geolocation opt-in within the city guide — enabling within-city spatial precision for HADE recommendations without requiring a native app.",
  },
];

const CURRENT_REALITY = [
  {
    headline: "HADE is not yet integrated",
    body: "The product runs entirely without HADE today. The only HADE-facing element is a static 'Coming Soon' placeholder component with no backend, no API hooks, and no data contract.",
  },
  {
    headline: "The slot exists",
    body: "SpontaneityEnginePromo.tsx reserves the injection point inside the city guide view. It is the target — not the implementation.",
  },
  {
    headline: "This is the transition phase",
    body: "The system audit has mapped what Field Notes can provide to HADE and what gaps must be resolved before integration can begin.",
  },
];

const SYSTEM_GAPS = [
  "No real-time GPS — city-level coordinates only; within-city precision requires Geolocation API opt-in",
  "No user identity — personalization is impossible without an auth or anonymous session layer",
  "No trip dates or departure context — temporal relevance of recommendations is impaired",
  "No visited-places tracking — the system has no memory of where the user has already been",
  "Offline-first vs. live AI — a fundamental tension; HADE requires connectivity, offline users get nothing",
  "No events or POI data feed — HADE cannot recommend specific venues without a real-time data source",
  "No user preference profile — no way to know if a user prefers food, culture, or outdoor activity",
];

const WHATS_NEXT = [
  "Define and lock the HADE context contract (input schema)",
  "Build /api/hade-recommend endpoint or proxy to HADE service",
  "Replace SpontaneityEnginePromo with a live-data connected component",
  "Add Geolocation API opt-in for within-city spatial precision",
  "Implement offline fallback strategy (IDB cache or graceful degradation)",
  "Field test first HADE integration in a real travel environment",
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
                heading: "A deployed, working product",
                body: "Field Notes is a live PWA with 11 city packs, offline-first architecture, arrival intelligence, environmental data, and live city pulse modules. It works without HADE.",
              }}
              right={{
                label: "What Comes Next",
                heading: "HADE integration — in design",
                body: "The HADE Decision Engine is the next layer. A placeholder slot exists in the product. The API contract, context payload, and offline fallback strategy are being defined now.",
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
              What the product contains today — before HADE integration begins.
            </p>
            <SystemGrid items={SYSTEM_ITEMS} accent={ACCENT} />
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

        {/* ── 10. Future Product Entry Point ────────────────────────── */}
        <Reveal delay={370}>
          <section className="mb-16">
            <FutureProductCTA accent={ACCENT} />
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
