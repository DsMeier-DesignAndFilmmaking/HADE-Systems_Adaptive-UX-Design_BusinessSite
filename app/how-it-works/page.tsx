import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { SectionWrapper } from "@/components/SectionWrapper";
import { processSteps } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "How It Works | HADE Systems",
  description: "See how HADE Systems diagnoses friction, designs adaptive UX logic, and helps product teams ship measurable improvements."
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="pt-6 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">How It Works</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
          A practical system for turning behavior data into conversion gains.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
          Every engagement is structured to reduce decision noise for your team: diagnose, design, ship, and improve with clear ownership and measurable outcomes.
        </p>
      </section>

      <SectionWrapper title="Delivery flow" intro="A focused path from friction discovery to adaptive system rollout.">
        <div className="space-y-4">
          {processSteps.map((step, index) => (
            <article key={step.title} className="panel flex flex-col gap-4 p-6 md:flex-row md:items-start">
              <div className="rounded-full border border-line bg-accentSoft px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                Step {index + 1}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70 md:text-base">{step.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="What your team receives"
        intro="Each phase creates implementation-ready assets so design, product, and engineering can execute without ambiguity."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Signal map showing where behavior and intended UX diverge",
            "Adaptive logic blueprint with state and routing rules",
            "Component-level UX specs and experiment plan",
            "Metrics dashboard recommendations to track impact"
          ].map((item) => (
            <div key={item} className="panel p-5 text-sm leading-relaxed text-ink/75">
              {item}
            </div>
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        title="Need a partner to operationalize adaptive UX quickly?"
        body="Use the contact form to share your current funnel and goal metrics. You will get a recommended entry point and clear next actions."
      />
    </>
  );
}
