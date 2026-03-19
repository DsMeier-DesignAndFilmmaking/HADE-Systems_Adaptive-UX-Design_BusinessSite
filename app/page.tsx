import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { DiagramHADE } from "@/components/DiagramHADE";
import { DiagramStaticVsAdaptive } from "@/components/DiagramStaticVsAdaptive";
import { Hero } from "@/components/Hero";
import { HowHadeWorks } from "@/components/HowHadeWorks";
import { SectionWrapper } from "@/components/SectionWrapper";
import { SprintCTASection } from "@/components/SprintCTASection";
import { hadeLayers, processSteps, sprintTiers } from "@/lib/site-data";

export default function HomePage() {
  return (
    <>
      <Hero />

      <HowHadeWorks />

      <SprintCTASection />

      <SectionWrapper
        id="problem"
        eyebrow="The Problem"
        title="Static product flows miss real user behavior"
        intro="When onboarding and activation are fixed, teams lose conversions because intent, confidence, and urgency vary from user to user."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "High-intent users are forced through slow setup paths",
            "Uncertain users get too little guidance at key decisions",
            "Teams optimize one funnel while hidden drop-off segments grow",
            "Support volume increases because UX does not adapt to context"
          ].map((point) => (
            <div key={point} className="panel p-5 text-sm leading-relaxed text-ink/75">
              {point}
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="shift"
        eyebrow="The Shift"
        title="From static screens to adaptive systems"
        intro="Adaptive UX treats interface decisions as a system: read behavior, infer intent, and route each user through the right experience in real time."
      >
        <div className="panel p-6 md:p-8">
          <p className="max-w-3xl text-base leading-relaxed text-ink/75 md:text-lg">
            Instead of repeatedly rewriting isolated screens, HADE Systems builds a decision architecture your team can scale. Every improvement compounds because the product learns which path works best for each user state.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="hade-system"
        eyebrow="The HADE System"
        title="A four-layer framework for adaptive UX"
        intro="HADE stands for Human Signal Mapping, Adaptive Logic Architecture, Decision Layer Orchestration, and Experiment + Evolution — four interconnected layers that make your product respond to real user behavior instead of forcing a fixed path."
      >
        {/* Word-origin callout */}
        <div
          className="mb-6 rounded-xl bg-white/70 px-5 py-4 backdrop-blur"
          style={{ border: "0.5px solid rgba(216, 220, 227, 0.7)" }}
        >
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink/35">
            Origin
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            In geology, a{" "}
            <em className="not-italic font-medium text-ink/80">hade</em> is the
            angle at which a fault plane deviates from vertical — the precise tilt
            that determines how force moves through a system. We chose it because
            adaptive UX isn&apos;t about a straight path. It&apos;s about finding
            the right angle for each user&apos;s intent, urgency, and confidence.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <DiagramHADE />
          <div className="grid gap-4">
            {hadeLayers.map((layer) => (
              <article key={layer.letter} className="panel p-5">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-accent">
                  {layer.letter} — {layer.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{layer.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="visual-proof"
        eyebrow="Visual Proof"
        title="Static funnels break. Adaptive systems branch intelligently."
        intro="This is the practical difference between one-size UX and behavior-aware UX."
      >
        <DiagramStaticVsAdaptive />
      </SectionWrapper>

      <SectionWrapper
        id="services"
        eyebrow="Services"
        title="Adaptive UX Systems, Delivered in Stages"
        intro="Start with a rapid prototype. Scale into a fully adaptive system."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {sprintTiers.map((tier) => (
            <article
              key={tier.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/[.92] backdrop-blur"
              style={{
                border: tier.isFeatured
                  ? "0.5px solid rgba(49, 107, 255, 0.35)"
                  : "0.5px solid rgba(216, 220, 227, 0.75)",
                boxShadow: tier.isFeatured ? "0 0 24px rgba(49, 107, 255, 0.22)" : undefined
              }}
            >
              {/* Price strip */}
              <div
                className="px-5 py-4"
                style={{
                  borderBottom: tier.isFeatured
                    ? "0.5px solid rgba(49, 107, 255, 0.15)"
                    : "0.5px solid rgba(216, 220, 227, 0.6)"
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40">
                    {tier.priceRange} · {tier.timeline}
                  </p>
                  {tier.isFeatured && (
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-accent"
                      style={{
                        background: "rgba(49,107,255,0.08)",
                        border: "0.5px solid rgba(49,107,255,0.2)"
                      }}
                    >
                      Start Here
                    </span>
                  )}
                </div>
              </div>
              {/* Content */}
              <div className="flex flex-1 flex-col px-5 py-5">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink/40">
                  {tier.label}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-ink">
                  {tier.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">
                  {tier.tagline}
                </p>
                <Link
                  href="/services"
                  className="mt-5 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-electricBlue transition hover:text-ink"
                >
                  View Details <span className="text-[10px]">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="process"
        eyebrow="Process"
        title="Simple delivery, high signal output"
        intro="You get senior-level product thinking, concrete assets, and execution-ready recommendations."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {processSteps.map((step, index) => (
            <article key={step.title} className="panel p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Step {index + 1}</p>
              <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{step.detail}</p>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        title="Book an Adaptive UX Sprint"
        body="In 3–5 days, get a working adaptive UX prototype embedded into your product — with a behavior audit, live experiment design, and a clear path to scale."
      />
    </>
  );
}
