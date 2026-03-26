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
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
          A practical system for turning behavior data into conversion gains.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
          Every engagement is structured to reduce decision noise for your team: diagnose, design, ship, and improve with clear ownership and measurable outcomes.
        </p>
      </section>

      <div className="reveal mt-16">
        <HowItWorksVisual />
      </div>

      <div className="reveal mt-16">
        <CTASection
          title="Need a partner to operationalize adaptive UX&nbsp;quickly?"
          body="Use the contact form to share your current funnel and goal metrics. You will get a recommended entry point and clear next&nbsp;actions."
        />
      </div>
    </>
  );
}
