import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { SectionWrapper } from "@/components/SectionWrapper";
import { caseStudies } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Case Studies | HADE Systems",
  description: "See how adaptive UX systems improve activation, time-to-value, and onboarding efficiency across Sprint, Module, and System Lab engagements."
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="pt-6 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Case Studies</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
          From Sprint to System: results at every stage.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
          Each case study maps to a service tier. See what adaptive UX delivers from a
          rapid Sprint prototype through a full System Lab engagement.
        </p>
      </section>

      <SectionWrapper
        title="Case studies by tier"
        intro="Composite examples based on repeat patterns from SaaS product teams. Tier 3 is a concept prototype."
      >
        <div className="space-y-6">
          {caseStudies.map((study) => (
            <article key={study.title} className="panel p-7 md:p-8">

              {/* Prototype warning banner */}
              {study.isPrototype && (
                <div
                  className="mb-5 rounded-xl px-4 py-3 text-sm font-medium text-ink/70"
                  style={{
                    background: "rgba(245,158,11,0.07)",
                    border: "0.5px solid rgba(245,158,11,0.25)"
                  }}
                >
                  This is a concept prototype, not a completed engagement. It illustrates
                  the scope and output of a Tier 3 Adaptive System Lab.
                </div>
              )}

              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-ink">{study.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-accent"
                    style={{
                      background: "rgba(49,107,255,0.07)",
                      border: "0.5px solid rgba(49,107,255,0.22)"
                    }}
                  >
                    {study.tier}
                  </span>
                  <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-ink/60">
                    {study.sector}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-line bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Problem</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{study.problem}</p>
                </div>
                <div className="rounded-xl border border-line bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Insight</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{study.insight}</p>
                </div>
                <div className="rounded-xl border border-line bg-white/70 p-5 md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">System Applied</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{study.systemApplied}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Outcome</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {study.outcome.map((line) => (
                    <div key={line} className="rounded-xl border border-accent/20 bg-accentSoft p-4 text-sm font-medium text-ink/85">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        title="Ready to start with a Sprint?"
        body="Share your product and current activation metrics. You will get a Sprint scope recommendation and a clear first-week plan."
      />
    </>
  );
}
