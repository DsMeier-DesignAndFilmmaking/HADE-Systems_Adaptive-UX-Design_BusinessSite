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
            { value: "↑ Lift", label: "Activation Rate (modeled)" },
            { value: "Faster", label: "Time-to-Value" },
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
          <div className="flex flex-col gap-3">
            <Link href="/case-studies/retention" className="text-sm text-muted hover:underline">Retention →</Link>
            <Link href="/case-studies/system" className="text-sm text-muted hover:underline">System →</Link>
          </div>
        </div>
      </Reveal>
      </div>
    </main>
  );
}
