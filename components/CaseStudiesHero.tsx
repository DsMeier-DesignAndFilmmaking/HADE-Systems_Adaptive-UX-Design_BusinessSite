import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/src/components/hade/animation/Reveal";

const PROOF_METRICS = [
  { value: "+81%", label: "Activation Lift" },
  { value: "+57%", label: "Retention Increase" },
  { value: "+25%", label: "Expansion Revenue" },
];

function HadeMiniDiagram() {
  const modules = ["Onboarding", "Retention", "Expansion", "Re-engagement"];

  return (
    <div className="glass-panel mx-auto w-full max-w-xs p-6">
      <p className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/100">
        HADE · Live Adaptive System
      </p>

      <div
        className="mb-3 rounded-xl px-4 py-3 text-center"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">Input</p>
        <p className="mt-0.5 text-sm font-semibold text-white">Behavioral Signals</p>
      </div>

      <div className="mb-3 flex justify-center">
        <div className="flex flex-col items-center gap-1">
          <div className="h-4 w-px bg-white/30" />
          <ArrowRight className="h-3 w-3 rotate-90" style={{ color: "rgba(120,160,255,0.9)" }} />
        </div>
      </div>

      <div
        className="mb-3 rounded-xl px-4 py-3.5 text-center"
        style={{
          background: "rgba(49,107,255,0.2)",
          border: "1px solid rgba(120,160,255,0.5)",
        }}
      >
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
          Core Engine
        </p>
        <p className="text-sm font-semibold text-white">HADE Decision Engine</p>
        <p className="mt-1 font-mono text-[10px] text-white/70">Real-time routing · 99.2%</p>
      </div>

      <div className="mb-3 flex justify-center">
        <div className="flex flex-col items-center gap-1">
          <div className="h-4 w-px bg-white/30" />
          <ArrowRight className="h-3 w-3 rotate-90" style={{ color: "rgba(120,160,255,0.9)" }} />
        </div>
      </div>

      <div
        className="rounded-xl p-3"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255, 255, 255, 0.0)" }}
      >
        <p className="mb-2.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
          Adaptive Output
        </p>
        <div className="grid grid-cols-2 gap-2">
          {modules.map((module) => (
            <div
              key={module}
              className="rounded-lg px-2 py-1.5 text-center"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <p className="font-mono text-[10px] text-white/80">{module}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] text-white/60">
        {"→ feedback loop → continuous optimization"}
      </p>
    </div>
  );
}

export function CaseStudiesHero() {
  return (
    <section className="pt-6 md:pt-12">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal delay={0}>
            <div className="mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyberLime" />
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink/50">
                Case Studies · HADE Systems
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl font-semibold leading-tight tracking-[-0.015em] text-ink md:text-5xl md:leading-[1.08]">
              Turn Static Products into
              <br className="hidden md:block" /> Adaptive, <span style={{ color: "#316BFF" }}>Revenue-Generating</span>{" "}
              Systems
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/60 md:text-lg">
              Real-world applications of HADE — a decision engine layer that increases activation, retention, and expansion.
            </p>
          </Reveal>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {PROOF_METRICS.map(({ value, label }, i) => (
              <Reveal key={value} delay={220 + i * 80}>
                <div className="panel px-4 py-3">
                  <p className="text-2xl font-mono font-bold leading-none" style={{ color: "#316BFF" }}>
                    {value}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-ink/55">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={460}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/adaptive-ux-sprint" className="cta-button">
                Run an Adaptive UX Sprint
              </Link>
              <Link href="/services" className="secondary-button">
                View Engagement Model
              </Link>
            </div>
          </Reveal>

          <Reveal delay={540}>
            <p className="mt-3 text-xs text-ink/40">
              Identify your highest-impact growth opportunities in 2–3 weeks.
            </p>
          </Reveal>
        </div>

        <Reveal delay={260} className="hidden items-center justify-center lg:flex">
          <HadeMiniDiagram />
        </Reveal>
      </div>
    </section>
  );
}
