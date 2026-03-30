import { Fragment } from "react";
import { SectionWrapper } from "@/components/SectionWrapper";
import Reveal from "@/src/components/hade/animation/Reveal";

const steps = [
  {
    number: "01",
    title: "Audit + Prototype",
    description: "Identify UX friction + deploy a working adaptive prototype",
    detail:
      "We map real user behavior against your current flows, isolate the highest-impact friction points, and ship a working adaptive prototype in 3–5 days.",
    tierLabel: "Sprint",
  },
  {
    number: "02",
    title: "Deploy Adaptive Module",
    description: "Turn prototype into a live, measurable system",
    detail:
      "The prototype becomes a production module: integrated with your analytics stack, running live experiments, with engineering-ready specs for your team.",
    tierLabel: "Module",
  },
  {
    number: "03",
    title: "Scale System",
    description: "Expand into a full adaptive UX ecosystem",
    detail:
      "Extend the system across onboarding, in-app, and lifecycle surfaces. Each module shares a decision layer so behavior signals compound across the product.",
    tierLabel: "Lab",
  },
];

export function HowHadeWorks() {
  return (
    <SectionWrapper
      id="how-hade-works"
      eyebrow="How It Works"
      title="Three stages. One adaptive system."
      intro="Start small. Scale with confidence."
    >
      <div className="flex flex-col gap-0 md:hidden">
        {steps.map((step, index) => (
          <Fragment key={step.number}>
            <Reveal delay={index * 80}>
              <article
                className="flex flex-col bg-white/[.92] p-6 backdrop-blur first:rounded-t-2xl last:rounded-b-2xl"
                style={{ border: "0.5px solid rgba(216, 220, 227, 0.75)" }}
              >
                <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-accent">{step.number}</p>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-1 text-xs font-medium text-ink/50">{step.description}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/65">{step.detail}</p>
                <div className="mt-6">
                  <span
                    className="inline-block rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40"
                    style={{ border: "0.5px solid rgba(216, 220, 227, 0.8)" }}
                  >
                    {step.tierLabel}
                  </span>
                </div>
              </article>
            </Reveal>
            {index < steps.length - 1 && (
              <div className="h-px" style={{ background: "rgba(216,220,227,0)" }} />
            )}
          </Fragment>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-[1fr_1px_1fr_1px_1fr]">
        {steps.map((step, index) => (
          <Fragment key={`desktop-${step.number}`}>
            <Reveal delay={index * 80} className="h-full">
              <article
                className={`flex h-full flex-col bg-white/[.92] p-6 backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 ${
                  index === 0 ? "rounded-l-2xl" : index === steps.length - 1 ? "rounded-r-2xl" : ""
                }`}
                style={{ border: "0.5px solid rgba(216, 220, 227, 0.75)" }}
              >
                <p className="font-mono text-[11px] font-semibold tracking-[0.14em] text-accent">{step.number}</p>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-ink">{step.title}</h3>
                <p className="mt-1 text-xs font-medium text-ink/50">{step.description}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/65">{step.detail}</p>
                <div className="mt-6">
                  <span
                    className="inline-block rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40"
                    style={{ border: "0.5px solid rgba(216, 220, 227, 0.8)" }}
                  >
                    {step.tierLabel}
                  </span>
                </div>
              </article>
            </Reveal>
            {index < steps.length - 1 && (
              <div
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(216,220,227,0.6) 20%, rgba(216,220,227,0.6) 80%, transparent)",
                }}
              />
            )}
          </Fragment>
        ))}
      </div>
    </SectionWrapper>
  );
}
