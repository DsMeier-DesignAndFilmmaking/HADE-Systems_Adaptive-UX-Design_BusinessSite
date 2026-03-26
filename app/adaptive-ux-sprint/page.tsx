import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  TrendingDown,
  Search,
  ClipboardList,
  GitBranch,
  Layers,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SectionWrapper } from "@/components/SectionWrapper";
import { CTASection } from "@/components/CTASection";
import Reveal from "@/src/components/hade/animation/Reveal";

export const metadata: Metadata = {
  title: "Adaptive UX Sprint | HADE Systems — Fix UX Bottlenecks in 2–3 Weeks",
  description:
    "Identify, design, and validate the highest-impact UX changes for your B2B SaaS product. Fixed-scope sprint — $10K–$25K, delivered in 2–3 weeks.",
};

/* ─── Sprint Flow Diagram ────────────────────────────────────────── */
function SprintFlowDiagram() {
  return (
    <div className="glass-panel p-6 w-full max-w-xs mx-auto">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30 mb-5 text-center">
        HADE · Adaptive UX Sprint
      </p>

      {/* Input node */}
      <div
        className="rounded-xl px-4 py-3 text-center mb-3"
        style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)" }}
      >
        <p className="font-mono text-[10px] text-white/50 uppercase tracking-[0.16em]">Input</p>
        <p className="text-sm font-semibold text-white mt-0.5">Your Product</p>
      </div>

      {/* Connector */}
      <div className="flex justify-center mb-3">
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-4 bg-white/15" />
          <ArrowRight className="w-3 h-3 rotate-90" style={{ color: "rgba(49,107,255,0.6)" }} />
        </div>
      </div>

      {/* Core engine node */}
      <div
        className="rounded-xl px-4 py-3.5 text-center mb-3"
        style={{
          background: "rgba(49,107,255,0.14)",
          border: "1px solid rgba(49,107,255,0.4)",
        }}
      >
        <p
          className="font-mono text-[9px] uppercase tracking-[0.2em] mb-1"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          sprint analysis
        </p>
        <p className="text-sm font-semibold text-white">Sprint Analysis</p>
        <div className="mt-2 space-y-1">
          {["UX Audit", "Friction Mapping", "HADE Logic Design"].map((item) => (
            <p key={item} className="font-mono text-[9px] text-white/40">
              · {item}
            </p>
          ))}
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center mb-3">
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-4 bg-white/15" />
          <ArrowRight className="w-3 h-3 rotate-90" style={{ color: "rgba(49,107,255,0.6)" }} />
        </div>
      </div>

      {/* Output node */}
      <div
        className="rounded-xl p-3"
        style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)" }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 text-center mb-2.5">
          Deliverables
        </p>
        <div className="space-y-1.5">
          {["Adaptive Prototype", "Decision Map", "System Blueprint"].map((item) => (
            <div
              key={item}
              className="rounded-lg px-2 py-1.5 text-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.08)" }}
            >
              <p className="font-mono text-[9px] text-white/55">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="font-mono text-[8px] text-white/20 text-center mt-4">
        {"→ 2–3 weeks · fixed scope · production-ready"}
      </p>
    </div>
  );
}

/* ─── Metric tile (results section) ─────────────────────────────── */
function MetricTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="panel flex h-full flex-col px-4 py-3">
      <p className="text-2xl font-bold font-mono leading-none" style={{ color: "#316BFF" }}>
        {value}
      </p>
      <p className="text-[11px] text-ink/55 mt-1 leading-snug">{label}</p>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function AdaptiveUXSprintPage() {
  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <section className="pt-6 md:pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">

          {/* Left: copy + CTAs */}
          <div>
            <Reveal delay={0}>
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyberLime animate-pulse" />
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink/50">
                  Adaptive UX Sprint · Tier 1
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="text-4xl font-semibold leading-tight tracking-[-0.015em] text-ink md:text-5xl md:leading-[1.08]">
                Fix Your Highest-Impact
                <br className="hidden md:block" /> UX Bottlenecks in <span style={{ color: "#316BFF" }}>2–3 Weeks</span>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/60 md:text-lg">
                A focused sprint to identify, design, and validate the changes that increase activation, retention, and
                revenue.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="cta-button">
                  Start Adaptive UX Sprint
                </Link>
                <Link href="/case-studies" className="secondary-button">
                  View Case Studies
                </Link>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <p className="mt-3 text-xs text-ink/40">
                Fixed-scope · $10K–$25K · Delivered in 2–3 weeks
              </p>
            </Reveal>
          </div>

          {/* Right: sprint flow diagram */}
          <Reveal delay={180} className="hidden items-center justify-center lg:flex">
            <SprintFlowDiagram />
          </Reveal>

        </div>
      </section>

      {/* ── 2. Problem ──────────────────────────────────────────────── */}
      <SectionWrapper
        eyebrow="The Problem"
        title="Most Products Leak Revenue Without Knowing Where"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: <AlertCircle className="w-5 h-5" />,
              title: "Users Drop Off Before Activation",
              body: "New users hit static onboarding that doesn't respond to their intent or urgency.",
            },
            {
              icon: <TrendingDown className="w-5 h-5" />,
              title: "Retention Stalls After Week 1–2",
              body: "Engagement drops before users experience core value, leaving money on the table.",
            },
            {
              icon: <Search className="w-5 h-5" />,
              title: "Teams Guess Instead of Knowing",
              body: "Without signal-level data, fixes are based on opinion rather than behavioral evidence.",
            },
          ].map(({ icon, title, body }, i) => (
            <Reveal key={title} delay={i * 80} className="h-full">
              <div className="panel flex h-full flex-col p-6">
                <span
                  className="mb-5 flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(49,107,255,0.08)",
                    border: "1px solid rgba(49,107,255,0.18)",
                    color: "#316BFF",
                  }}
                >
                  {icon}
                </span>
                <h3 className="mb-2 text-base font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-ink/60">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      {/* ── 3. What You Get ─────────────────────────────────────────── */}
      <SectionWrapper
        eyebrow="Deliverables"
        title="What You Get in a Sprint"
      >
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: <ClipboardList className="w-5 h-5" />,
              title: "UX Audit",
              body: "Identify friction across onboarding and lifecycle with signal-level analysis and a prioritized opportunity backlog.",
            },
            {
              icon: <GitBranch className="w-5 h-5" />,
              title: "Decision System Design",
              body: "Map where HADE logic improves user routing, step completion, and downstream conversion.",
            },
            {
              icon: <Layers className="w-5 h-5" />,
              title: "Adaptive Prototypes",
              body: "Testable UX solutions — production-ready components and specs, ready for implementation in days.",
            },
          ].map(({ icon, title, body }, i) => (
            <Reveal key={title} delay={i * 80} className="h-full">
              <div className="panel flex h-full flex-col p-6">
                <span
                  className="mb-5 flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(49,107,255,0.08)",
                    border: "1px solid rgba(49,107,255,0.18)",
                    color: "#316BFF",
                  }}
                >
                  {icon}
                </span>
                <h3 className="mb-2 text-base font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-ink/60">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionWrapper>

      {/* ── 4. Timeline ─────────────────────────────────────────────── */}
      <SectionWrapper
        eyebrow="Timeline"
        title="How It Works"
      >
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-[2.75rem] left-[16.5%] right-[16.5%] h-px bg-line/60" aria-hidden />

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                week: "Week 1",
                title: "Diagnose",
                step: "01",
                items: [
                  "Data + UX audit",
                  "Session and event analysis",
                  "Identify key drop-off points",
                  "Map behavioral signal patterns",
                ],
              },
              {
                week: "Week 2",
                title: "Design",
                step: "02",
                items: [
                  "Design adaptive flows",
                  "Build decision logic map",
                  "Prototype targeted solutions",
                ],
              },
              {
                week: "Week 3",
                title: "Deliver",
                step: "03",
                items: [
                  "Validate with usability testing",
                  "Deliver system blueprint",
                  "Handoff specs + Loom walkthrough",
                ],
              },
            ].map(({ week, title, step, items }, i) => (
              <Reveal key={step} delay={i * 80} className="h-full">
                <div className="panel relative flex h-full flex-col p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <p
                      className="font-mono text-3xl font-bold leading-none"
                      style={{ color: "#316BFF", opacity: 0.2 }}
                    >
                      {step}
                    </p>
                    <span
                      className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{
                        background: "rgba(49,107,255,0.08)",
                        border: "1px solid rgba(49,107,255,0.18)",
                        color: "#316BFF",
                      }}
                    >
                      {week}
                    </span>
                  </div>
                  <h3 className="mb-4 text-lg font-semibold text-ink">{title}</h3>
                  <ul className="flex-1 space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink/60">
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                          style={{ background: "#316BFF", opacity: 0.6 }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── 5. Results ──────────────────────────────────────────────── */}
      <SectionWrapper
        eyebrow="Results Driven"
        title="Goal KPIs HADE is designed to move"
      >
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { value: "+20–35%", label: "Activation Lift" },
            { value: "2–3×", label: "Retention Increase" },
            { value: "30–45%", label: "Expansion Revenue" },
          ].map((metric, i) => (
            <Reveal key={metric.label} delay={i * 80} className="h-full">
              <MetricTile value={metric.value} label={metric.label} />
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink/35">
          Composite results from Adaptive UX Sprint engagements. Individual results vary.
        </p>
      </SectionWrapper>

      {/* ── 6. Ideal Clients ────────────────────────────────────────── */}
      <SectionWrapper
        eyebrow="Who This Is For"
        title="Built for teams moving beyond static interfaces toward agentic orchestration"
      >
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40 mb-4">
              Right fit
            </p>
            <ul className="space-y-3">
              {[
                "B2B SaaS companies",
                "PLG products",
                "Teams with 1K–100K active users",
                "Products with onboarding or retention issues",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#316BFF", opacity: 0.7 }} />
                  <p className="text-sm text-ink/70">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40 mb-4">
              Common trigger moments
            </p>
            <ul className="space-y-3">
              {[
                "Activation rate below 30%",
                "Retention drops after week 1–2",
                "Preparing for a growth push or fundraise",
                "Running experiments without clear signal",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: "#316BFF", opacity: 0.5 }} />
                  <p className="text-sm text-ink/70">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      {/* ── 7. Pricing ──────────────────────────────────────────────── */}
      <SectionWrapper
        eyebrow="Investment"
        title="Fixed-Scope. High Impact."
      >
        <div className="max-w-2xl mx-auto">
          <div className="panel overflow-hidden">
            {/* Accent bar */}
            <div className="h-[3px] w-full" style={{ background: "#316BFF", opacity: 0.75 }} />

            <div className="p-8 md:p-10">
              {/* Price */}
              <div className="text-center mb-8">
                <p
                  className="text-4xl font-bold font-mono leading-none md:text-5xl"
                  style={{ color: "#316BFF" }}
                >
                  $10,000 – $25,000
                </p>
                <p className="mt-2 text-base text-ink/55">2–3 Week Engagement</p>
                <span
                  className="inline-block mt-3 rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    background: "rgba(49,107,255,0.1)",
                    border: "1px solid rgba(49,107,255,0.3)",
                    color: "#316BFF",
                  }}
                >
                  Fixed-scope · No retainer
                </span>
              </div>

              {/* Included */}
              <div
                className="rounded-xl p-6 mb-8"
                style={{ background: "rgba(11,13,18,0.03)", border: "1px solid rgba(11,13,18,0.08)" }}
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 mb-4">
                  What's included
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Full UX + behavior audit",
                    "Decision logic map",
                    "1–2 adaptive prototypes",
                    "1–2 micro-experiments designed",
                    "System blueprint for engineering handoff",
                    "Loom walkthrough + async Q&A",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: "#316BFF", opacity: 0.65 }}
                      />
                      <p className="text-sm text-ink/70">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <Link href="/contact" className="cta-button">
                  Start Adaptive UX Sprint
                </Link>
                <p className="mt-3 text-xs text-ink/40">
                  Scoped per product. Final price confirmed after intake call.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── 8. Final CTA ────────────────────────────────────────────── */}
      <CTASection
        title="Start Building an Adaptive Product"
        body="Share your product and current metrics. We'll send a Sprint scope recommendation and a clear first-week plan within 1 business day."
        primaryLabel="Start Adaptive UX Sprint"
        secondaryLabel="View Case Studies"
        secondaryHref="/case-studies"
      />
    </>
  );
}
