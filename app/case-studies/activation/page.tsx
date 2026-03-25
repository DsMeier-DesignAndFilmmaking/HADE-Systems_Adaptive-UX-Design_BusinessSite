import type { Metadata } from "next";
import Link from "next/link";
import ActivationCaseStudy from "@/src/components/hade/case-studies/ActivationCaseStudy";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";

export const metadata: Metadata = {
  title: "Activation Recovery Case Study | HADE Systems",
  description:
    "How HADE's adaptive onboarding system — built on real-time intent classification and behavioral routing — reduces activation friction and accelerates time-to-value in B2B SaaS.",
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
          <p className="text-xs text-muted mb-2">Adaptive UX Sprint · Tier 1</p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-3">
            Activation Recovery: Onboarding System Redesign for B2B SaaS
          </h1>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            A static onboarding flow treated every user identically — ignoring role, intent, and hesitation. This system redesign introduces real-time state classification and adaptive path routing to reduce friction and accelerate time-to-value.
          </p>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <div className="flex gap-6 mb-10">
          {[
            { value: "25–40%", label: "Activation lift (modeled)" },
            { value: "2× faster", label: "Time-to-Value" },
            { value: "↑ Lift", label: "Flow Completion (modeled)" },
            { value: "↓ Reduced", label: "Step Drop-off" },
          ].map((m, i) => (
            <div key={i}>
              <p className="text-xl font-semibold">{m.value}</p>
              <p className="text-xs text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={200}>
        <ActivationCaseStudy />
        <CaseStudyPageCTA />
        <div className="mt-16">
          <p className="text-sm font-medium mb-4">Related Case Studies</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/case-studies/retention", label: "Retention System", hook: "State-based engagement tracking that detects and closes churn loops before they open." },
              { href: "/case-studies/system", label: "Adaptive System Lab", hook: "A unified behavioral layer connecting onboarding, usage, and retention as a single adaptive system." },
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
