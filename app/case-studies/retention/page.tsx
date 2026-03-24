import type { Metadata } from "next";
import Link from "next/link";
import RetentionCaseStudy from "@/src/components/hade/case-studies/RetentionCaseStudy";
import CaseStudyPageCTA from "@/src/components/hade/case-studies/CaseStudyPageCTA";
import Reveal from "@/src/components/hade/animation/Reveal";

export const metadata: Metadata = {
  title: "Retention System Case Study | HADE Systems",
  description:
    "How HADE's state-based retention module — built on continuous engagement classification and adaptive response triggers — reduces passive churn and sustains product engagement in PLG tools.",
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
          <p className="text-xs text-muted mb-2">Adaptive Module Deployment · Tier 2</p>
          <h1 className="text-2xl md:text-3xl font-semibold mb-3">
            Retention System Design for a PLG Analytics Tool
          </h1>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Users activated but didn&apos;t return. The product had no mechanism to detect drift, classify disengagement, or respond before churn occurred. This system redesign introduces continuous state tracking and behavior-triggered response modules.
          </p>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <div className="flex gap-6 mb-10">
          {[
            { value: "↑ Lift", label: "Week 4 Retention (modeled)" },
            { value: "Wider", label: "Feature Breadth per User" },
            { value: "Earlier", label: "Churn Signal Detection" },
            { value: "State-gated", label: "Expansion Triggers" },
          ].map((m, i) => (
            <div key={i}>
              <p className="text-xl font-semibold">{m.value}</p>
              <p className="text-xs text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={200}>
        <RetentionCaseStudy />
        <CaseStudyPageCTA />
        <div className="mt-16">
          <p className="text-sm font-medium mb-4">Related Case Studies</p>
          <div className="flex flex-col gap-3">
            <Link href="/case-studies/activation" className="text-sm text-muted hover:underline">Activation →</Link>
            <Link href="/case-studies/system" className="text-sm text-muted hover:underline">System →</Link>
          </div>
        </div>
      </Reveal>
      </div>
    </main>
  );
}
