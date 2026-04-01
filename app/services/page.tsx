import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { SectionWrapper } from "@/components/SectionWrapper";
import { sprintTiers } from "@/lib/site-data";
import Reveal from "@/src/components/hade/animation/Reveal";

export const metadata: Metadata = {
  title: "Services | HADE Systems",
  description: "Adaptive UX Systems delivered in stages — Sprint, Module, and System Lab. Start with a rapid prototype in 3–5 days."
};

export default function ServicesPage() {
  return (
    <>
      <section className="pt-6 md:pt-10 px-4 sm:px-6 md:px-0">
        <Reveal delay={0}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Services</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 max-w-full text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Adaptive UX Systems, Delivered in Stages
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-full text-lg leading-relaxed text-ink/75">
            Start with a rapid prototype. Scale into a fully adaptive system. Each tier
            is designed to deliver measurable output at a defined scope.
          </p>
        </Reveal>
      </section>

      <SectionWrapper title="Service tiers" intro="Each tier builds on the last. Start where you are.">
        <div className="space-y-6">
          {sprintTiers.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 80}>
              <article
                className="overflow-hidden rounded-2xl backdrop-blur flex flex-col"
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  border: tier.isFeatured
                    ? '0.5px solid rgba(49, 107, 255, 0.35)'
                    : '0.5px solid rgba(216, 220, 227, 0.75)',
                  boxShadow: tier.isFeatured ? '0 0 24px rgba(49, 107, 255, 0.22)' : undefined,
                }}
              >
                {tier.isFeatured && (
                  <div className="h-[2px] w-full bg-gradient-to-r from-accent/60 to-transparent" />
                )}

                <div className="flex-1 flex flex-col p-5 sm:p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">

                    {/* Brand & Title */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                          {tier.priceRange} · {tier.timeline}
                        </p>
                        {tier.isFeatured && (
                          <span
                            className="rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-accent"
                            style={{
                              background: 'rgba(49,107,255,0.08)',
                              border: '0.5px solid rgba(49,107,255,0.22)',
                            }}
                          >
                            Start Here
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink/35">
                        {tier.label}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-ink">
                        {tier.name}
                      </h2>
                    </div>

                  </div>

                  {/* Tagline & Deliverables */}
                  <div className="mt-6 md:mt-8 relative md:pl-6 flex-1">
                    <div
                      className="hidden md:block absolute left-0 top-0 h-full w-[1.5px] rounded-full"
                      style={{
                        background: tier.isFeatured
                          ? 'linear-gradient(to bottom, #316BFF 0%, rgba(49, 107, 255, 0.1) 100%)'
                          : 'linear-gradient(to bottom, rgba(28, 31, 38, 0.3) 0%, rgba(28, 31, 38, 0.05) 100%)',
                      }}
                    />
                    <p className="text-[17px] leading-relaxed text-ink/80 text-balance tracking-tight md:ml-4">
                      {tier.tagline}
                    </p>

                    <div className="mt-6 md:mt-8 md:ml-4">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                        What you get
                      </h3>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {tier.deliverables.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-2.5 rounded-xl p-4 text-sm leading-relaxed text-ink/75"
                            style={{
                              border: tier.isFeatured
                                ? '0.5px solid rgba(49, 107, 255, 0.15)'
                                : '0.5px solid rgba(216, 220, 227, 0.6)',
                              background: tier.isFeatured
                                ? 'rgba(49, 107, 255, 0.03)'
                                : 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            <span
                              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-accent"
                              style={{ background: 'rgba(49,107,255,0.09)' }}
                            >
                              ✓
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button at Bottom */}
                  <div className="mt-6 md:mt-8">
                    <Link
                      href={tier.ctaHref}
                      className={`${tier.isFeatured ? 'cta-button' : 'secondary-button'} w-full md:w-auto inline-flex items-center justify-center`}
                    >
                      {tier.ctaLabel}
                    </Link>
                  </div>

                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        title="Not sure which tier fits your stage?"
        body="Share your product and current growth goals. You will get a recommended entry point with a clear scope and expected outcome."
      />
    </>
  );
}