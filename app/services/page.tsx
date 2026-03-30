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
      <section className="pt-6 md:pt-10">
        <Reveal delay={0}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Services</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Adaptive UX Systems, Delivered in Stages
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
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
  className="overflow-hidden rounded-2xl backdrop-blur"
  style={{
    background: "rgba(255,255,255,0.92)",
    border: tier.isFeatured
      ? "0.5px solid rgba(49, 107, 255, 0.35)"
      : "0.5px solid rgba(216, 220, 227, 0.75)",
    boxShadow: tier.isFeatured ? "0 0 24px rgba(49, 107, 255, 0.22)" : undefined
  }}
>
  {tier.isFeatured && (
    <div className="h-[2px] w-full bg-gradient-to-r from-accent/60 to-transparent" />
  )}

  <div className="flex flex-col p-7 md:p-8">
    {/* Header row: Flex-col on mobile, Flex-row on desktop */}
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      {/* 1. Brand & Title Info */}
      <div className="order-1">
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

      {/* 2. The Single CTA: Last on mobile (order-4), first-ish on desktop (md:order-2) */}
      <Link
        href={tier.ctaHref}
        className={`${
          tier.isFeatured ? "cta-button" : "secondary-button"
        } order-4 mt-2 justify-center md:order-2 md:mt-0 md:inline-flex`}
      >
        {tier.ctaLabel}
      </Link>

      {/* 3. Tagline & Deliverables Wrapper (remains in the middle) */}
      <div className="order-2 md:order-3 md:w-full">
        {/* Tagline section */}
        <div className="relative mt-5 max-w-xl pl-6">
          <div 
            className="absolute left-0 top-1 h-full w-[1.5px] rounded-full"
            style={{
              background: tier.isFeatured
                ? "linear-gradient(to bottom, #316BFF 0%, rgba(49, 107, 255, 0.1) 100%)"
                : "linear-gradient(to bottom, rgba(28, 31, 38, 0.3) 0%, rgba(28, 31, 38, 0.05) 100%)",
            }}
          />
          <p className="text-[17px] leading-relaxed text-ink/80 text-balance tracking-tight">
            {tier.tagline}
          </p>
        </div>

        {/* Deliverables */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
            What you get
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {tier.deliverables.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 rounded-xl p-4 text-sm leading-relaxed text-ink/75 text-pretty"
                style={{
                  border: tier.isFeatured
                    ? "0.5px solid rgba(49, 107, 255, 0.15)"
                    : "0.5px solid rgba(216, 220, 227, 0.6)",
                  background: tier.isFeatured
                    ? "rgba(49, 107, 255, 0.03)"
                    : "rgba(255, 255, 255, 0.8)"
                }}
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-accent" style={{ background: "rgba(49,107,255,0.09)" }}>
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
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
