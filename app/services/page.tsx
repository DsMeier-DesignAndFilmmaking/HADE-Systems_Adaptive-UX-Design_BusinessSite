import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { SectionWrapper } from "@/components/SectionWrapper";
import { sprintTiers } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Services | HADE Systems",
  description: "Adaptive UX Systems delivered in stages — Sprint, Module, and System Lab. Start with a rapid prototype in 3–5 days."
};

export default function ServicesPage() {
  return (
    <>
      <section className="pt-6 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Services</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Adaptive UX Systems, Delivered in Stages
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
          Start with a rapid prototype. Scale into a fully adaptive system. Each tier
          is designed to deliver measurable output at a defined scope.
        </p>
      </section>

      <SectionWrapper title="Service tiers" intro="Each tier builds on the last. Start where you are.">
        <div className="space-y-6">
          {sprintTiers.map((tier) => (
            <article
              key={tier.id}
              className="overflow-hidden rounded-2xl backdrop-blur"
              style={{
                background: "rgba(255,255,255,0.92)",
                border: tier.isFeatured
                  ? "0.5px solid rgba(49, 107, 255, 0.35)"
                  : "0.5px solid rgba(216, 220, 227, 0.75)",
                boxShadow: tier.isFeatured ? "0 0 24px rgba(49, 107, 255, 0.22)" : undefined
              }}
            >
              {/* Featured accent top strip */}
              {tier.isFeatured && (
                <div className="h-[2px] w-full bg-gradient-to-r from-accent/60 to-transparent" />
              )}

              <div className="p-7 md:p-8">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                        {tier.priceRange} · {tier.timeline}
                      </p>
                      {tier.isFeatured && (
                        <span
                          className="rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-accent"
                          style={{
                            background: "rgba(49,107,255,0.08)",
                            border: "0.5px solid rgba(49,107,255,0.22)"
                          }}
                        >
                          Start Here
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink/35">
                      {tier.label}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-ink">{tier.name}</h2>
                  </div>
                  <Link
                    href={tier.ctaHref}
                    className={tier.isFeatured ? "cta-button" : "secondary-button"}
                  >
                    {tier.ctaLabel}
                  </Link>
                </div>

                {/* Tagline */}
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/65">
                  {tier.tagline}
                </p>

                {/* Deliverables */}
                <div className="mt-6">
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
                            ? "0.5px solid rgba(49,107,255,0.15)"
                            : "0.5px solid rgba(216,220,227,0.6)",
                          background: tier.isFeatured
                            ? "rgba(49,107,255,0.03)"
                            : "rgba(255,255,255,0.8)"
                        }}
                      >
                        <span
                          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-accent"
                          style={{ background: "rgba(49,107,255,0.09)" }}
                        >
                          ✓
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
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
