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

        {/* ── CTA + Related ─────────────────────────────────────────── */}
        <Reveal delay={300}>
          <CaseStudyPageCTA />
          <div className="mt-16">
            <p className="text-sm font-medium mb-4">Related Case Studies</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: "/case-studies/ecommerce", label: "E-Commerce", hook: "Real-time intent classification that routes B2B SaaS users to the fastest path to their first value moment." },
                { href: "/case-studies/saas", label: "SaaS · Concept Build", hook: "Behavior-triggered engagement that detects drift and responds before churn occurs — 38% to 54% week-4 retention." },
                { href: "/case-studies/travel", label: "A Multi-Model Neural Backbone for Adaptive Urban Discovery", hook: "Live context classification that replaces static travel plans with real-time in-field guidance across four user states." },
              ].map(({ href, label, hook }) => (
                <Link key={href} href={href} className="group rounded-xl border border-line bg-white/60 px-5 py-4 hover:border-ink/20 transition-colors">
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
