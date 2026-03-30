import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { HowItWorksVisual } from "@/components/HowItWorksVisual";

export const metadata: Metadata = {
  title: "How It Works | HADE Systems",
  description: "See how HADE Systems diagnoses friction, designs adaptive UX logic, and helps product teams ship measurable improvements."
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="reveal pt-6 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">How It Works</p>
        <h1 className="mt-4 max-w-4xl text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-ink">
          A practical system for turning behavior data into conversion gains.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75 tracking-tight font-normal">
        Every engagement is structured to reduce decision noise for your team: diagnose, design, ship, and improve with clear ownership and measurable&nbsp;outcomes.
      </p>
      </section>

      <div className="reveal mt-16">
        <HowItWorksVisual />
      </div>

      <div className="reveal mt-16">
  <CTASection
    title={
      <span className="text-2xl md:text-3xl font-semibold tracking-tight text-white leading-tight block">
        Need a partner to operationalize adaptive UX&nbsp;quickly?
      </span>
    }
    body="Use the contact form to share your current funnel and goal metrics. You will get a recommended entry point and clear next&nbsp;actions."
  />
</div>
    </>
  );
}
