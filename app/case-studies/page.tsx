import type { Metadata } from "next";
import Link from "next/link";
import { Activity, GitBranch, Zap } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { SectionWrapper } from "@/components/SectionWrapper";
import { flagshipCaseStudy, retentionCaseStudy, systemLabCaseStudy } from "@/lib/site-data";
import { FlagshipCaseStudyCard } from "@/components/FlagshipCaseStudyCard";
import { CaseStudiesHero } from "@/components/CaseStudiesHero";
import { StickySprintCTA } from "@/components/StickySprintCTA";
import Reveal from "@/src/components/hade/animation/Reveal";
import VerticalCaseStudyNav from "@/src/components/hade/navigation/VerticalCaseStudyNav";

export const metadata: Metadata = {
  title: "Case Studies | HADE Systems — Adaptive UX Results",
  description:
    "Real-world results from HADE adaptive UX systems: +81% activation, +57% retention, +25% expansion revenue across B2B SaaS engagements.",
};

/* ─── How HADE Works — 3 steps ───────────────────────────────────── */
const HOW_IT_WORKS = [
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

/* ─── Tier divider between case studies ─────────────────────────── */
function TierDivider({ label, tier }: { label: string; tier: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="h-px flex-1 bg-line/70" />
      <div className="text-center">
        <p className="mono-label text-ink/45">{label}</p>
        <p className="text-[9px] font-mono text-ink/28 mt-0.5">{tier}</p>
      </div>
      <span className="h-px flex-1 bg-line/70" />
    </div>
  );
}

export default function CaseStudiesPage() {
  return (
    <>

      {/* ── Mobile vertical nav (right side) ─────────────────────────── */}
      <VerticalCaseStudyNav
        sections={[
          { id: "activation", label: "Activation", color: "#316BFF" },
          { id: "retention", label: "Retention",   color: "#28A745" },
          { id: "system",     label: "System",      color: "#FF8A00" },
        ]}
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <CaseStudiesHero />

      {/* ── 2. Trust Strip ──────────────────────────────────────────── */}
      <div
        className="mt-16 py-5"
        style={{
          borderTop: "0.5px solid rgba(11,13,18,0.08)",
          borderBottom: "0.5px solid rgba(11,13,18,0.08)",
        }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="mono-label text-ink/32">Built using frameworks inspired by</p>
          {["Amplitude", "Reforge", "Stripe", "OpenAI Systems Thinking"].map((name) => (
            <span
              key={name}
              className="text-[11px] font-semibold text-ink/38 tracking-wide"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. Case Study Stack ─────────────────────────────────────── */}
      <SectionWrapper
        eyebrow="Results by Tier"
        title="From Sprint to System: Proven at Every Stage"
        intro="Composite examples drawn from repeat patterns across B2B SaaS product teams."
      >
        <div className="space-y-5">

          {/* Flagship — extra visual prominence */}
          <div id="activation">
            <Reveal delay={0}>
              <div className="relative">
                <div
                  className="absolute -inset-[1px] rounded-[22px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(49,107,255,0.22) 0%, transparent 55%)",
                    opacity: 0.7,
                  }}
                  aria-hidden
                />
                <FlagshipCaseStudyCard study={flagshipCaseStudy} />
              </div>
            </Reveal>
          </div>

          {/* Interstitial CTA */}
          <Reveal delay={120}>
            <div
              className="rounded-2xl px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
              style={{
                background: "#080b11",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/28 mb-2">
                  Activation Gap
                </p>
                <h3 className="text-xl font-semibold text-white leading-snug max-w-md">
                  Most Products Leak Revenue at Activation
                </h3>
                <p className="mt-2 text-sm text-white/50 max-w-md">
                  We identify and fix the highest-impact friction points in weeks, not months.
                </p>
              </div>
              <Link href="/adaptive-ux-sprint" className="cta-button shrink-0">
                Start Adaptive UX Sprint
              </Link>
            </div>
          </Reveal>

          {/* Secondary study */}
          <TierDivider
            label="Revenue Growth Engine"
            tier="Tier 2 · Adaptive Module Deployment"
          />
          <div id="retention">
            <Reveal delay={220}>
              <FlagshipCaseStudyCard study={retentionCaseStudy} />
            </Reveal>
          </div>

          {/* Tertiary study */}
          <TierDivider
            label="Reference Architecture"
            tier="Tier 3 · Adaptive System Lab"
          />
          <div id="system">
            <Reveal delay={320}>
              <FlagshipCaseStudyCard study={systemLabCaseStudy} />
            </Reveal>
          </div>

        </div>
      </SectionWrapper>

      {/* ── 4. How HADE Works ───────────────────────────────────────── */}
      <SectionWrapper
        eyebrow="The System"
        title="How HADE Works"
        intro="A three-layer decision system that replaces static UX with real-time adaptive behavior."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map(({ step, icon, title, body }, i) => (
            <Reveal key={step} delay={i * 80}>
              <div className="panel p-6">
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
      </SectionWrapper>

      {/* ── 5. Final CTA ────────────────────────────────────────────── */}
      <CTASection
        title="Stop Designing Static Experiences"
        body="Start building systems that adapt, learn, and drive revenue."
        primaryLabel="Run an Adaptive UX Sprint"
        secondaryLabel="View Engagement Model"
      />

      {/* ── 6. Sticky Sprint CTA ────────────────────────────────────── */}
      <StickySprintCTA />

    </>
  );
}
