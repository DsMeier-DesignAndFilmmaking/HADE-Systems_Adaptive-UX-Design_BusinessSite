import type { Metadata } from "next";
import { Activity, GitBranch, Zap } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { StickySprintCTA } from "@/components/StickySprintCTA";
import Reveal from "@/src/components/hade/animation/Reveal";
import CaseStudyCard from "@/src/components/hade/case-studies/CaseStudyCard";

export const metadata: Metadata = {
  title: "Case Studies | HADE Systems — Adaptive UX Results",
  description:
    "Real-world results from HADE adaptive UX systems: +81% activation, +57% retention, +25% expansion revenue across B2B SaaS engagements.",
};

const CASE_STUDIES = [
  {
    title: "Adaptive Trip Discovery",
    description:
      "Travel tools are built for planning. But travel happens in real time — context shifts, plans break, and decisions need to be made in the field. This system reads live location, movement, and behavioral signals to surface the best next move at each moment.",
    metric: "Outcome: context-aware real-time guidance across four in-field user states",
    tag: "Travel · Concept Build",
    href: "/case-studies/travel",
  },
  {
    title: "Activation Recovery: Onboarding Redesign for B2B SaaS",
    description:
      "The onboarding flow treated every user identically — ignoring hesitation signals, role context, and intent depth. No decision logic. No adaptive routing. Users hit friction early and never reached the activation moment.",
    metric: "Modeled outcome: faster time-to-value, measurable activation lift",
    tag: "Activation · Adaptive UX Sprint",
    href: "/case-studies/activation",
  },
  {
    title: "Retention System: Post-Activation Drop-Off in a PLG Analytics Tool",
    description:
      "Users reached initial value but disengaged before it compounded. The product had no mechanism to detect drift, no context-aware re-engagement, and no feedback loop between behavior and interface response. Retention was left to chance.",
    metric: "Modeled outcome: reduced churn window, improved week-4 engagement depth",
    tag: "Retention · Adaptive Module",
    href: "/case-studies/retention",
  },
  {
    title: "End-to-End Adaptive UX System Design",
    description:
      "Onboarding, core usage, and retention operated as isolated layers with no shared behavioral state. Each stage made decisions independently — no signal carried forward, no pattern informed the next. The product couldn't adapt because the system wasn't built to communicate with itself.",
    metric: "Outcome: unified behavioral layer connecting onboarding through retention",
    tag: "System · Adaptive UX Lab",
    href: "/case-studies/system",
  },
];

const HOW_HADE_WORKS = [
  {
    step: "01",
    icon: <Activity className="w-4 h-4" />,
    title: "Detect",
    body: "We capture behavioral and contextual signals — hesitation, usage depth, lifecycle stage, and intent markers in real time.",
  },
  {
    step: "02",
    icon: <GitBranch className="w-4 h-4" />,
    title: "Decide",
    body: "HADE classifies user state and routes to the right experience path based on live behavior — not static assumptions.",
  },
  {
    step: "03",
    icon: <Zap className="w-4 h-4" />,
    title: "Adapt",
    body: "The interface responds dynamically — onboarding, retention, monetization, and re-engagement all adapt in sync.",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <main className="w-full">
        
      <section className="pt-6 md:pt-10">

            {/* ── Intro ───────────────────────────────────────────────── */}
            <Reveal>
              {/* Removed mx-auto to ensure left alignment with the grid below */}
              <div className="mb-12 md:mb-16 max-w-3xl">
              <Reveal delay={0}>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Case Studies</p>
                    </Reveal>
                    <Reveal delay={80}>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
                Adaptive UX Case Studies
                </h1>
                </Reveal>
                <Reveal delay={160}>
                      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/75">
                      Real-world applications of HADE Systems across activation, retention, and full-system transformation.
                      </p>
                    </Reveal>
              </div>
            </Reveal>

{/* ── Case Study Blocks ─────────────────────────────────── */}
<div className="mb-12 md:mb-16">
  <div className="grid gap-6 md:grid-cols-3">
    {CASE_STUDIES.map((cs, i) => (
      /* 1. 'flex' on Reveal ensures the motion div behaves as a flex item 
         2. 'h-full' ensures it takes the full height of the grid row
      */
      <Reveal key={cs.href} delay={i * 80} className="flex h-full">
        <div className="rounded-2xl border border-line bg-white/[.92] p-6 md:p-8 w-full flex flex-col">
          {/* 'flex-1' and 'flex flex-col' here are CRITICAL. 
             They force the CaseStudyCard to fill all available space.
          */}
          <div className="flex-1 flex flex-col">
            <CaseStudyCard {...cs} />
          </div>
        </div>
      </Reveal>
    ))}
  </div>
</div>

{/* ── How HADE Works ────────────────────────────────────── */}
<section className="rounded-2xl border border-line bg-white/[.92] p-6 md:p-8">
  <Reveal delay={120}>
    {/* Removed mx-auto to keep content left-aligned */}
    <div className="mb-8 max-w-3xl">
      <p className="text-xs uppercase tracking-widest text-muted mb-2">The System</p>
      <h2 className="text-2xl font-semibold text-ink mb-2">How HADE Works</h2>
      <p className="text-sm text-ink/60 leading-relaxed">
        A three-layer decision system that replaces static UX with real-time adaptive behavior.
      </p>
    </div>
  </Reveal>

  <div className="grid gap-5 md:grid-cols-3">
    {HOW_HADE_WORKS.map(({ step, icon, title, body }, i) => (
      <Reveal key={step} delay={180 + i * 80} className="h-full">
        <div className="panel flex h-full flex-col p-6">
          <div className="flex items-center justify-between mb-5">
            <p
              className="font-mono text-3xl font-bold leading-none"
              style={{ color: "#316BFF", opacity: 0.25 }}
            >
              {step}
            </p>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: "rgba(49,107,255,0.08)",
                border: "1px solid rgba(49,107,255,0.18)",
                color: "#316BFF",
              }}
            >
              {icon}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
          <p className="text-sm text-ink/60 leading-relaxed">{body}</p>
        </div>
      </Reveal>
    ))}
  </div>
</section>
          </section>
   
      </main>

      {/* ── CTA + Sticky ────────────────────────────────────────────── */}
      <CTASection
        title="Stop Designing Static Experiences"
        body="Start building systems that adapt, learn, and drive revenue."
        primaryLabel="Run an Adaptive UX Sprint"
        secondaryLabel="View Engagement Model"
      />
      <StickySprintCTA />
    </>
  );
}
