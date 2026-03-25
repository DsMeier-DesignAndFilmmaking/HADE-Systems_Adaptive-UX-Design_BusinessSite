import type { Metadata } from "next";
import Link from "next/link";
import SystemCaseStudy from "@/src/components/hade/case-studies/SystemCaseStudy";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";

export const metadata: Metadata = {
  title: "Adaptive System Design Case Study | HADE Systems",
  description:
    "How HADE's unified behavioral layer connects onboarding, retention, and expansion into a single adaptive system — eliminating isolated decision-making across the product lifecycle.",
};

export default function Page() {
  return (
    <main className="w-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-24 md:pb-10">
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
          <p className="text-xs text-muted mb-2">Adaptive System Lab · Tier 3 · Reference Architecture</p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-3">
            End-to-End Adaptive UX System Design
          </h1>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Onboarding, usage, and retention operated as isolated stages with no shared user model. Each made decisions independently — no signal carried forward, no outcome informed the next. This reference architecture introduces a unified behavioral layer that connects all three.
          </p>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <div className="flex gap-6 mb-10">
          {[
            { value: "Unified", label: "User State Layer" },
            { value: "Adaptive", label: "Decision Routing" },
            { value: "Continuous", label: "System Feedback Loop" },
          ].map((m, i) => (
            <div key={i}>
              <p className="text-xl font-semibold">{m.value}</p>
              <p className="text-xs text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={200}>
        <SystemCaseStudy />
        <CaseStudyPageCTA />
        <div className="mt-16">
          <p className="text-sm font-medium mb-4">Related Case Studies</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/case-studies/activation", label: "Activation Recovery", hook: "Adaptive onboarding that classifies user intent in real time and routes each user to the fastest path to value." },
              { href: "/case-studies/retention", label: "Retention System", hook: "State-based engagement tracking with behavioral triggers — 38% to 54% week-4 retention." },
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
