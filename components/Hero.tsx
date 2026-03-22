import Link from "next/link";
import { HadeAdaptiveHero } from "@/components/HadeAdaptiveHero";

export function Hero() {
  return (
    <section id="hero" className="pt-6 md:pt-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {/* Mono eyebrow */}
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyberLime" />
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink/50">
              Adaptive UX Design · HADE Systems
            </p>
          </div>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.01em] text-ink md:text-[3.5rem] md:leading-[1.1]">
            Your product<br className="hidden md:block" /> shouldn&apos;t feel static.
          </h1>

          {/*
            ── Copy Variant C (active) — Outcome-first, problem-aware ──────────
            Best for high-intent conversion. A/B test against Variant A below.

            Variant A (Acronym-led):
            "HADE is a four-layer decision system — Human Signal Mapping, Adaptive
            Logic Architecture, Decision Layer Orchestration, and Experiment +
            Evolution — built to replace the static, one-size-fits-all flows that
            quietly cost SaaS teams activation and retention. Instead of one
            onboarding path for every user, your product reads live behavior and
            routes each session through the right experience, right now."

            Variant B (Word-origin):
            "In geology, a hade is the precise angle at which a fault plane
            deviates from vertical — the tilt that determines how force moves
            through a system. HADE takes that idea into product design: your
            product stops forcing every user down the same straight path and finds
            the right angle for each person's intent, urgency, and confidence."
          */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/60 md:text-lg">
            HADE builds the adaptive layer between your product and your users: a
            live system that maps real behavior, makes routing decisions in real
            time, and gets measurably better with every experiment cycle.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="cta-button">
              Get a Free Breakdown
            </Link>
            <Link href="/how-it-works" className="secondary-button">
              See How It Works
            </Link>
          </div>

          {/* Stats row */}
          <p className="mt-10 mb-3 font-sans text-xs font-medium uppercase tracking-widest text-ink/40">
            Goal KPIs HADE is designed to move
          </p>
          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              { value: "+20–35%", label: "Task completion lift across adaptive flows" },
              { value: "2–3×", label: "Engagement with contextually adapted UI" },
              { value: "−30–45%", label: "Flow abandonment at key friction points" },
            ].map(({ value, label }) => (
              <div
                key={value}
                className="rounded-xl bg-white/80 px-4 py-3 backdrop-blur"
                style={{ border: "0.5px solid rgba(216, 220, 227, 0.8)" }}
              >
                <p
                  className="font-mono text-xl font-semibold text-cyberLime"
                  style={{ textShadow: "0 0 12px rgba(245,158,11,0.25)" }}
                >
                  {value}
                </p>
                <p className="mt-1 font-sans text-xs leading-snug text-ink/55">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:pl-4">
          <HadeAdaptiveHero />
        </div>
      </div>
    </section>
  );
}
