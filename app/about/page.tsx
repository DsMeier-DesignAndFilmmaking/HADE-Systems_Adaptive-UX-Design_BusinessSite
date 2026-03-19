import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { SectionWrapper } from "@/components/SectionWrapper";

export const metadata: Metadata = {
  title: "About | HADE Systems",
  description: "HADE Systems helps founders and product teams move from static UX patterns to adaptive product systems."
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-6 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About HADE Systems</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Built for teams that need UX to perform like a system.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
          HADE Systems combines product strategy and adaptive UX design to help teams improve onboarding, activation, and retention with measurable rigor.
        </p>
      </section>

      <SectionWrapper title="What we believe" intro="Growth does not come from prettier screens. It comes from interfaces that respond to real user context.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Systems over screens",
              text: "We design adaptive decision systems, not isolated page-level tweaks."
            },
            {
              title: "Evidence over opinion",
              text: "Behavior signals and outcome metrics guide every recommendation."
            },
            {
              title: "Clarity over complexity",
              text: "Teams receive implementation-ready plans with clear priorities and ownership."
            }
          ].map((item) => (
            <article key={item.title} className="panel p-5">
              <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.text}</p>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper title="Who this is for" intro="HADE engagements are best for teams with active product usage and clear growth goals.">
        <div className="panel p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Seed to Series B SaaS teams optimizing activation",
              "Founders preparing for growth-stage product scale",
              "Product orgs with event data but unclear UX priorities",
              "Teams looking to operationalize AI-driven personalization"
            ].map((item) => (
              <div key={item} className="rounded-xl border border-line bg-white/80 p-4 text-sm leading-relaxed text-ink/75">
                {item}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTASection
        title="If your product feels static, we should talk"
        body="Share your product and goals. You will get an objective assessment and a practical plan to introduce adaptive UX where it will matter most."
      />
    </>
  );
}
