import type { Metadata } from "next";
import Link from "next/link";
import AIToolCaseStudy from "@/src/components/hade/case-studies/AIToolCaseStudy";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";

export const metadata: Metadata = {
  title: "AI Tool Case Study | HADE Systems",
  description:
    "How HADE's adaptive interaction system eliminates the blank-slate problem in AI tools — classifying task stage in real time and surfacing structured scaffolding that guides users from intent to output.",
};

export default function Page() {
  return (
    <main className="w-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-24 md:pb-10">

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
              Adaptive UX Sprint · AI Tool · Concept Build
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
              Adaptive AI Interaction System
            </h1>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              AI tools are capable but unstructured. Users face a blank input field with no guidance on how to start, refine, or complete a task. This system redesign introduces real-time task state classification and adaptive scaffolding — reducing cognitive load and guiding users from intent to output.
            </p>
          </div>
        </Reveal>

        {/* ── Directional Signals Strip ─────────────────────────────── */}
        <Reveal delay={100}>
          <div className="flex gap-6 mb-10">
            {[
              { value: "↑ Higher", label: "Task Completion Rate (modeled)" },
              { value: "Fewer", label: "Prompts to Useful Output" },
              { value: "↓ Lower", label: "Cognitive Load (modeled)" },
              { value: "Stage-guided", label: "Workflow Structure" },
            ].map((m, i) => (
              <div key={i}>
                <p className="text-xl font-semibold">{m.value}</p>
                <p className="text-xs text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Core Case Study Card ───────────────────────────────────── */}
        <Reveal delay={200}>
          <AIToolCaseStudy />
        </Reveal>

        {/* ── Demo Build Placeholder ────────────────────────────────── */}
        <Reveal delay={280}>
          <div
            className="mt-10 rounded-2xl px-7 py-8"
            style={{
              background: "rgba(124,58,237,0.04)",
              border: "1px dashed rgba(124,58,237,0.30)",
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-[0.2em] mb-3"
              style={{ color: "#7C3AED" }}
            >
              Interactive Demo · In Progress
            </p>
            <h2 className="text-lg font-semibold text-ink mb-3">
              Adaptive AI Workflow Interface — 0 → 1 Build
            </h2>
            <p className="text-sm text-ink/60 leading-relaxed mb-5 max-w-2xl">
              A working prototype of the adaptive AI interaction system is currently in development. The demo will show in real time how the system classifies task stage from prompt behavior, surfaces the appropriate scaffold, and adjusts the interface as the user moves from Starting through Refining to Executing.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Guided AI Workflow Interface",
                  detail: "Task-stage-aware input layer that replaces the blank slate with a structured entry point calibrated to user intent",
                },
                {
                  label: "Multi-Step Agent System",
                  detail: "Agent layer that tracks session context across prompts — preserving established constraints, decisions, and task direction",
                },
                {
                  label: "Context-Aware Prompt Scaffolding",
                  detail: "Dynamically surfaced prompts, refinement controls, and next-step suggestions matched to the current task state",
                },
              ].map(({ label, detail }) => (
                <div
                  key={label}
                  className="rounded-xl px-4 py-4"
                  style={{
                    background: "rgba(124,58,237,0.06)",
                    border: "1px solid rgba(124,58,237,0.14)",
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
        <Reveal delay={340}>
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
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "AI Interaction Flow Diagram",
                  detail: "Full signal-to-output flow: prompt received → signals captured → task state classified → scaffold adapted → output delivered",
                },
                {
                  label: "Agent Decision Tree",
                  detail: "Visual map of the three task states — Starting, Refining, Executing — with transition conditions, trigger thresholds, and adaptive response outputs for each",
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
        <Reveal delay={400}>
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
              <Link href="/case-studies/travel" className="text-sm text-muted hover:underline">
                Travel →
              </Link>
              <Link href="/case-studies/system" className="text-sm text-muted hover:underline">
                System →
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
