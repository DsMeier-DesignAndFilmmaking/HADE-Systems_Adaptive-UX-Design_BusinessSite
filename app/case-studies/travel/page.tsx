import type { Metadata } from "next";
import Link from "next/link";
import TravelCaseStudy from "@/src/components/hade/case-studies/TravelCaseStudy";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";

export const metadata: Metadata = {
  title: "Travel Case Study | HADE Systems",
  description:
    "How HADE's real-time adaptive discovery system helps travelers decide what to do next — classifying live context signals to surface the best next move at the right moment.",
};

export default function Page() {
  return (
    <main className="w-full">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <Reveal>
          <Link
            href="/case-studies"
            className="text-sm text-muted hover:underline mb-6 inline-block"
          >
            ← Back to Case Studies
          </Link>
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted mb-2">
              Case Study
            </p>
            <p className="text-xs text-muted mb-2">
              Adaptive UX Sprint · Travel · Concept Build
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
              Adaptive Trip Discovery System
            </h1>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              Travel tools are built for planning. But travel happens in real time — context shifts constantly, plans break, and decisions need to be made in the field with no guidance. This system redesign introduces a live adaptive layer that reads location, movement, and behavioral signals to surface the best next move at each moment.
            </p>
          </div>
        </Reveal>

        {/* ── Directional Signals Strip ─────────────────────────────── */}
        <Reveal delay={100}>
          <div className="flex gap-6 mb-10">
            {[
              { value: "Live", label: "Context-Aware Response" },
              { value: "↓ Fewer", label: "Interface Interruptions In Motion" },
              { value: "Faster", label: "Time at Decision Moment" },
              { value: "Adapts", label: "When Context Changes" },
            ].map((m, i) => (
              <div key={i}>
                <p className="text-xl font-semibold">{m.value}</p>
                <p className="text-xs text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Problem Section ───────────────────────────────────────── */}
        <Reveal delay={150}>
          <div className="mb-10">

            {/* Section header */}
            <div className="mb-5">
              <p
                className="text-xs font-mono uppercase tracking-[0.2em] mb-2"
                style={{ color: "#0891B2" }}
              >
                The Problem
              </p>
              <h2 className="text-xl font-semibold text-ink">
                Why existing travel tools fail in the field
              </h2>
            </div>

            {/* Problem cards — 1 col mobile · 2 col sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  index: "01",
                  headline: "Too many options",
                  description:
                    "Users are presented with every available option at once — no prioritization, no context, no signal about what actually fits this moment.",
                },
                {
                  index: "02",
                  headline: "No real-time awareness",
                  description:
                    "Tools don't respond to location, time of day, movement, or energy level. Context changes constantly. The interface doesn't.",
                },
                {
                  index: "03",
                  headline: "Decisions happen in motion",
                  description:
                    "Travelers make decisions continuously — while walking, pausing, changing plans. Not in a single pre-trip planning session.",
                },
                {
                  index: "04",
                  headline: "Static tools, dynamic reality",
                  description:
                    "Current products are built for the night before. They go silent the moment the trip begins.",
                },
              ].map(({ index, headline, description }) => (
                <div
                  key={index}
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(11,13,18,0.03)",
                    border: "1px solid rgba(11,13,18,0.08)",
                  }}
                >
                  {/* Index label */}
                  <p
                    className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3"
                    style={{ color: "#0891B2", opacity: 0.7 }}
                  >
                    {index}
                  </p>

                  {/* Headline */}
                  <h3 className="text-base font-semibold text-ink leading-snug mb-2">
                    {headline}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-ink/60 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Core Case Study Card ───────────────────────────────────── */}
        <Reveal delay={200}>
          <TravelCaseStudy />
        </Reveal>

        {/* ── Experience Walkthrough ────────────────────────────────── */}
        <Reveal delay={260}>
          <div
            className="mt-10 rounded-2xl px-7 py-8"
            style={{
              background: "rgba(8,145,178,0.03)",
              border: "1px solid rgba(8,145,178,0.12)",
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-[0.2em] mb-3"
              style={{ color: "#0891B2" }}
            >
              Experience Walkthrough · Four Moments
            </p>
            <h2 className="text-lg font-semibold text-ink mb-2">
              How the System Behaves in the Field
            </h2>
            <p className="text-sm text-ink/55 leading-relaxed mb-6 max-w-2xl">
              The system reads context continuously. These four moments show how state classification changes what the interface does — without any input from the user.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  moment: "01 · Walking",
                  state: "Exploring Area",
                  what: "User is moving through an unfamiliar neighborhood at a slow pace with no specific intent.",
                  response: "The system surfaces 3 nearby options clustered by experience type. No search required. No ranked list. Low cognitive load.",
                },
                {
                  moment: "02 · Pausing",
                  state: "Evaluating Options",
                  what: "User slows, stops, and opens two restaurant results in quick succession. The system detects proximity and comparison behavior.",
                  response: "The interface collapses to a side-by-side view of both options. One attribute — current wait time — is foregrounded. Everything else is hidden.",
                },
                {
                  moment: "03 · Moving Again",
                  state: "In Motion",
                  what: "User begins walking toward a destination. Velocity and direction signals confirm active transit.",
                  response: "The interface goes quiet. No new recommendations surface. Navigation is shown. The system holds all suggestions until a stop is detected.",
                },
                {
                  moment: "04 · Choosing",
                  state: "Decision Moment",
                  what: "User stops outside a specific venue. High dwell time, repeated view, high proximity — all three signals align.",
                  response: "One option fills the screen. One action: Walk Here. The system has resolved the decision. The user only needs to confirm.",
                },
              ].map(({ moment, state, what, response }) => (
                <div
                  key={moment}
                  className="rounded-xl px-5 py-5"
                  style={{
                    background: "rgba(8,145,178,0.05)",
                    border: "1px solid rgba(8,145,178,0.13)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p
                      className="text-xs font-mono font-semibold uppercase tracking-[0.16em]"
                      style={{ color: "#0891B2" }}
                    >
                      {moment}
                    </p>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(8,145,178,0.10)",
                        border: "1px solid rgba(8,145,178,0.22)",
                        color: "#0891B2",
                      }}
                    >
                      {state}
                    </span>
                  </div>
                  <p className="text-xs text-ink/55 leading-relaxed mb-2">{what}</p>
                  <p className="text-sm text-ink/80 leading-relaxed font-medium">{response}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Demo Build Placeholder ────────────────────────────────── */}
        <Reveal delay={320}>
          <div
            className="mt-6 rounded-2xl px-7 py-8"
            style={{
              background: "rgba(8,145,178,0.04)",
              border: "1px dashed rgba(8,145,178,0.30)",
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-[0.2em] mb-3"
              style={{ color: "#0891B2" }}
            >
              Interactive Demo · In Progress
            </p>
            <h2 className="text-lg font-semibold text-ink mb-3">
              Real-Time Adaptive Travel Interface — 0 → 1 Build
            </h2>
            <p className="text-sm text-ink/60 leading-relaxed mb-5 max-w-2xl">
              A working prototype is in development. The demo will simulate live context changes — movement, location, time of day — and show in real time how the system shifts between states and adapts the interface accordingly. No filter input. No search required.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Real-Time Adaptive Interface",
                  detail: "Live state-responsive UI that transitions between Exploring, Evaluating, In Motion, and Decision Moment without user-initiated navigation",
                },
                {
                  label: "Context Simulation System",
                  detail: "Simulated location, movement velocity, and time-of-day inputs to demonstrate adaptive responses across all four user states",
                },
                {
                  label: "Dynamic UI State Demo",
                  detail: "Walkthrough of how the interface changes at each moment — from open discovery to single-action decision — with state labels visible",
                },
              ].map(({ label, detail }) => (
                <div
                  key={label}
                  className="rounded-xl px-4 py-4"
                  style={{
                    background: "rgba(8,145,178,0.06)",
                    border: "1px solid rgba(8,145,178,0.14)",
                  }}
                >
                  <p className="text-sm font-semibold text-ink mb-1">{label}</p>
                  <p className="text-xs text-ink/55 leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Visual System Placeholder ─────────────────────────────── */}
        <Reveal delay={380}>
          <div
            className="mt-6 rounded-2xl px-7 py-8"
            style={{
              background: "rgba(11,13,18,0.02)",
              border: "1px dashed rgba(11,13,18,0.12)",
            }}
          >
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-ink/35 mb-3">
              Diagram + System Visuals · Coming Soon
            </p>
            <h2 className="text-lg font-semibold text-ink mb-3">
              System Architecture Visuals
            </h2>
            <p className="text-sm text-ink/55 leading-relaxed mb-5 max-w-2xl">
              The following diagrams are in production and will be added when the concept build is complete.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Real-Time System Flow",
                  detail: "Live signal-to-output flow: context detected → signals captured → state classified → engine decision → response surfaced → action taken",
                },
                {
                  label: "Context → Decision Diagram",
                  detail: "Maps each contextual input (location, velocity, time, behavior) to its corresponding state classification and interface output",
                },
                {
                  label: "State Transition Map",
                  detail: "Visual representation of all four states — Exploring Area, Evaluating Options, In Motion, Decision Moment — with real-time transition triggers and conditions between each",
                },
              ].map(({ label, detail }) => (
                <div
                  key={label}
                  className="rounded-xl px-4 py-4"
                  style={{
                    background: "rgba(11,13,18,0.03)",
                    border: "1px solid rgba(11,13,18,0.08)",
                  }}
                >
                  <p className="text-sm font-semibold text-ink mb-1">{label}</p>
                  <p className="text-xs text-ink/50 leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── CTA + Related ─────────────────────────────────────────── */}
        <Reveal delay={440}>
          <CaseStudyPageCTA />
          <div className="mt-16">
            <p className="text-sm font-medium mb-4">Related Case Studies</p>
            <div className="flex flex-col gap-3">
              <Link href="/case-studies/activation" className="text-sm text-muted hover:underline">
                Activation →
              </Link>
              <Link href="/case-studies/retention" className="text-sm text-muted hover:underline">
                Retention →
              </Link>
              <Link href="/case-studies/ai-tool" className="text-sm text-muted hover:underline">
                AI Tool →
              </Link>
              <Link href="/case-studies/system" className="text-sm text-muted hover:underline">
                System →
              </Link>
            </div>
          </div>
        </Reveal>

      
    </main>
  );
}
