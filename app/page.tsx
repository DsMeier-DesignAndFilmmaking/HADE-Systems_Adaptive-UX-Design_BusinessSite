import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { DiagramHADE } from "@/components/DiagramHADE";
import { DiagramStaticVsAdaptive } from "@/components/DiagramStaticVsAdaptive";
import { Hero } from "@/components/Hero";
import PhilosophyLayer from "@/components/PhilosophyLayer";
import { SectionWrapper } from "@/components/SectionWrapper";
import { SprintCTASection } from "@/components/SprintCTASection";

/**
 * String-based utility to prevent single-word orphans.
 * Returns a plain string using the Unicode non-breaking space (\u00A0).
 */
const orphanProof = (text: string): string => {
  const words = text.split(" ");
  if (words.length <= 1) return text;
  const lastWord = words.pop();
  return `${words.join(" ")}\u00A0${lastWord}`;
};

const engagementTiers = [
  {
    id: "01",
    label: "Stage 01: The Sprint",
    name: "Audit + Prototype",
    priceRange: "$4k – $7k",
    timeline: "3–5 Days",
    tagline: "Identify high-friction patterns and deploy an agentic prototype that infers intent to assist users in real time.",
    isFeatured: true,
  },
  {
    id: "02",
    label: "Stage 02: Deployment",
    name: "Adaptive Runtime",
    priceRange: "$8k – $15k",
    timeline: "1–3 Weeks",
    tagline: "Transition from prototype to a production-ready adaptive layer that orchestrates the interface based on live behavior signals.",
    isFeatured: false,
  },
  {
    id: "03",
    label: "Stage 03: The Lab",
    name: "Agentic Ecosystem",
    priceRange: "Custom",
    timeline: "Ongoing",
    tagline: "A long-term partnership to transform the product into a self-optimizing environment that evolves with every customer interaction.",
    isFeatured: false,
  }
];

export const EngagementModel = () => {
  return (
    <SectionWrapper
      id="services"
      eyebrow="The Engagement Model"
      title={orphanProof("Start small. Scale with confidence.")}
      intro={orphanProof("Three stages. One agentic system. Scale at the necessary pace.")}
    >
      <div className="grid gap-px overflow-hidden rounded-[32px] border border-[#E5E5E7] bg-[#E5E5E7] md:grid-cols-3 shadow-sm">
        {engagementTiers.map((tier) => (
          <article
            key={tier.id}
            className="group relative flex h-full flex-col bg-white p-8 transition-colors hover:bg-[#F9F9FB]"
          >
            <div className="mb-10 flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-ink/20 group-hover:text-cyberLime transition-colors">
                  {tier.id}
                </p>
                <p className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/40">
                  {tier.label}
                </p>
              </div>
              
              {tier.isFeatured && (
                <div className="flex items-center gap-1.5 rounded-full border border-cyberLime/30 bg-cyberLime/5 px-3 py-1">
                  <div className="h-1 w-1 animate-pulse rounded-full bg-cyberLime shadow-[0_0_8px_#A3E635]" />
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-cyberLime">
                    Recommended Start
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <h3 className="text-2xl font-semibold tracking-tight text-ink">
                {tier.name}
              </h3>
              
              <div className="mt-3 flex items-center gap-3">
                <p className="font-mono text-[10px] font-bold text-ink/40">
                  {tier.priceRange}
                </p>
                <div className="h-1 w-1 rounded-full bg-ink/10" />
                <p className="font-mono text-[10px] font-bold text-ink/40 italic">
                  {tier.timeline}
                </p>
              </div>

              <p className="mt-6 flex-1 text-sm leading-relaxed text-ink/60">
                {orphanProof(tier.tagline)}
              </p>

              <div className="mt-10 pt-6 border-t border-ink/5">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition-all hover:gap-3 hover:text-cyberLime"
                >
                  View Methodology <span className="text-xs">→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <PhilosophyLayer />

      <SectionWrapper
        id="problem"
        eyebrow="The Observation"
        title={orphanProof("Static logic fails to capture high-dimensional intent")}
        intro={orphanProof("Most interfaces rely on fixed rules that ignore the nuances of human behavior. When a system cannot infer context, conversions vanish.")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Power users are restricted by redundant guidance meant for beginners",
            "Friction occurs when the interface fails to anticipate user needs",
            "Static funnels ignore the variance in urgency and confidence",
            "Drop-off increases when a journey fails to adapt to live signals"
          ].map((point) => (
            <div key={point} className="panel p-6 text-sm leading-relaxed text-ink/70 border-[#E5E5E7] bg-white">
              {orphanProof(point)}
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="visual-proof"
        eyebrow="The Shift"
        title={orphanProof("From hard-coded funnels to agentic orchestration.")}
        intro={orphanProof("The transition from rigid paths to an intent-aware environment that orchestrates the interface in real time.")}
      >
        <DiagramStaticVsAdaptive />
      </SectionWrapper>

      <EngagementModel />

      <SectionWrapper
        id="process"
        eyebrow="The Methodology"
        title={orphanProof("How intent-aware systems are refined")}
        intro={orphanProof("A structured approach to observing behavioral patterns and shaping agentic tools that respond to them.")}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Observe", detail: "Behavioral analysis identifies exactly where users hesitate during navigation." },
            { title: "Map", detail: "New logic defines triggers that provide different support for varying states." },
            { title: "Build", detail: "Responsive elements transform a static screen into a living experience." },
            { title: "Refine", detail: "Constant measurement ensures the new path continues to sharpen performance." }
          ].map((step, index) => (
            <article key={step.title} className="panel p-6 border-[#E5E5E7] bg-white">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink/20 mb-4">Step 0{index + 1}</p>
              <h3 className="text-base font-semibold text-ink leading-tight">{step.title}</h3>
              <p className="mt-4 text-[13px] leading-relaxed text-ink/60">{orphanProof(step.detail)}</p>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        title={orphanProof("Deploy an Adaptive Sprint")}
        body={orphanProof("Transition from observing friction to a working agentic prototype that changes how users experience the product.")}
      />
    </>
  );
}