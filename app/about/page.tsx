import type { Metadata } from "next";
import { SectionWrapper } from "@/components/SectionWrapper";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | HADE Systems",
  description:
    "HADE Systems was built from a decade of adaptive thinking across 41 countries. I build UX decision systems that respond to real user context."
};

export default function AboutPage() {
  return (
    <>
      {/* ─── Section 1: The Story ─────────────────────────────────────────────── */}
      <section className="reveal pt-6 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The Story</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.01em] text-ink md:text-5xl">
        How HADE Was Born
        </h1>

        <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-ink/75 md:text-lg">
          <p>
            I&rsquo;ve spent the last decade traveling through 41 countries, many with a camera
            in hand. A family dinner invitation in the Medina of Fez after a
            chance encounter. A local kid running me through his family&rsquo;s stores and businesses on the
            way to the tanneries, showing me the real Morocco. Deciding on a whim to jump to Hong Kong for
            my first time in Asia, booking a flight with just one day&rsquo;s notice. A casual afternoon at
            a tapas bar where a stranger invited me to join his family&rsquo;s <em>la comida</em>. And then
            there was that wild night in Bangkok that started as an easy afternoon stroll.
          </p>
          <p>
            These weren&rsquo;t accidents. They came from a simple philosophy: let the context of the
            moment guide you, not the plan you made yesterday.
          </p>
          <p>
            When people ask how I always come across these random and spontaneous experiences, I usually explain that it
            wasn&rsquo;t luck. It was a willingness to pay attention to what was actually happening around
            me and respond in real time. The energy of a place. A stranger&rsquo;s genuine invitation. An
            opportunity that appeared out of nowhere because I was paying attention. It was being adaptive.
          </p>
        </div>

        {/* Pull quote */}
        <blockquote className="mt-8 max-w-2xl border-l-2 border-sage pl-5">
          <p className="text-lg italic leading-relaxed text-ink/80 md:text-xl">
            &ldquo;Could technology help people do this better? Not replace intuition, but amplify it.
            Could I build systems that help people make smarter decisions based on the actual context
            they&rsquo;re in, rather than the plan they made yesterday?&rdquo;
          </p>
        </blockquote>

        <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-ink/75 md:text-lg">
          <p>
            That question led me back to technology. After years in tech and design, I realized most
            systems were built on the same assumption: predict what users want, then push it to them.
            Static interfaces designed for an average user that doesn&rsquo;t exist. Personalization as a
            one-way street.
          </p>
          <p>
            But real life doesn&rsquo;t work that way. The best decisions come from understanding where you
            are right now. The best experiences come from systems that respond to what&rsquo;s actually
            happening.
          </p>
          <p className="font-medium text-ink">That&rsquo;s where HADE Systems came from.</p>
        </div>
      </section>

      {/* ─── Section 2: Built for UX to Perform Like a System ────────────────── */}
      <SectionWrapper
        className="reveal"
        eyebrow="The Bridge"
        title="Built for UX to Perform Like a System"
      >
        <div className="grid gap-6 md:grid-cols-[3fr_2fr]">
          <div className="space-y-4 text-base leading-relaxed text-ink/75 md:text-lg">
            <p>
              HADE Systems combines product strategy and adaptive UX design to help improve onboarding,
              activation, and retention with measurable rigor. But it&rsquo;s built on something deeper:
              the belief that growth doesn&rsquo;t come from prettier screens. It comes from interfaces
              that respond to real user context.
            </p>
            <p>
              Instead of designing for an imaginary average user, I build decision engines that understand
              what&rsquo;s actually happening with your users right now. Are they confused during
              onboarding? The system adapts. Losing interest at a critical moment? The system responds.
              About to churn? The system intervenes.
            </p>
          </div>
          
        </div>
      </SectionWrapper>

      {/* ─── Section 3: My Belief System ────────────────────────────────────── */}
      <SectionWrapper
        className="reveal"
        eyebrow="Values"
        title="The Belief System"
        intro="Growth does not come from prettier screens. It comes from systems that respond intelligently to context."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Systems Over Screens */}
          <article className="panel p-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 shrink-0 text-accent">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-ink">Systems Over Screens</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  I design adaptive decision systems, not isolated page-level tweaks. A beautiful screen
                  isn&rsquo;t enough. Great experiences come from systems that respond intelligently to
                  context across your entire product.
                </p>
              </div>
            </div>
          </article>

          {/* Evidence Over Opinion */}
          <article className="panel p-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 shrink-0 text-accent">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="20" x2="5" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="19" y1="20" x2="19" y2="14" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-ink">Evidence Over Opinion</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  Behavior signals and outcome metrics guide every recommendation. I don&rsquo;t guess.
                  I measure. I look at real user data and let your product tell me what works.
                </p>
              </div>
            </div>
          </article>

          {/* Clarity Over Complexity */}
          <article className="panel p-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 shrink-0 text-accent">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-ink">Clarity Over Complexity</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  Teams receive implementation-ready plans with clear priorities and ownership. I
                  translate data into something useful: a clear strategy and specific next steps.
                </p>
              </div>
            </div>
          </article>

          {/* Sustainability as Strategy — sage green */}
          <article
            className="panel p-6"
            style={{ borderColor: "rgba(107,142,111,0.35)" }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5 shrink-0 text-sage">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 22c0-5.5 4.5-10 10-10 0 5.5-4.5 10-10 10z" />
                  <path d="M22 2c0 9-7 16-16 16" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-sage">Sustainability as Strategy</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  The best systems are built on foundations that last. Sustainable infrastructure,
                  local-first computing, and technology that respects your autonomy. I build systems that
                  are powerful, efficient, and under your control.
                </p>
              </div>
            </div>
          </article>
        </div>
      </SectionWrapper>

      {/* ─── Section 4: Who This Is For ──────────────────────────────────────── */}
      <SectionWrapper
        className="reveal"
        eyebrow="Ideal Partners"
        title="Who This Is For"
        intro="I work best with teams that have active product usage and clear growth goals — teams serious about growth and willing to challenge conventional approaches."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article className="panel p-5">
            <h3 className="text-sm font-semibold text-ink">Seed to Series B SaaS</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              You have data but the path forward isn&rsquo;t clear. I help you translate behavior signals
              into actionable strategy for onboarding and activation.
            </p>
          </article>

          <article className="panel p-5">
            <h3 className="text-sm font-semibold text-ink">Growth-Stage Founders</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              You&rsquo;ve found product-market fit. Now you need systems that help you scale without
              losing what made your product special.
            </p>
          </article>

          <article className="panel p-5">
            <h3 className="text-sm font-semibold text-ink">Product Orgs with Event Data</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              You know your bottlenecks. You&rsquo;re ready to move beyond guessing. I help you build
              adaptive systems that move the needle.
            </p>
          </article>

          <article className="panel p-5">
            <h3 className="text-sm font-semibold text-ink">AI-Driven Personalization Teams</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              You understand the future is adaptive and context-aware. I help you build it with the right
              architecture from day one.
            </p>
          </article>

          <article className="panel p-5 md:col-span-2 lg:col-span-1" style={{ borderColor: "rgba(107,142,111,0.3)" }}>
            <h3 className="text-sm font-semibold text-sage">Sustainability-Minded Organizations</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              You don&rsquo;t want vendor lock-in. You want infrastructure that reflects your values and
              systems that last.
            </p>
          </article>
        </div>
      </SectionWrapper>

      {/* ─── Section 5: How I Work ──────────────────────────────────────────── */}
      <SectionWrapper
        className="reveal"
        eyebrow="Process"
        title="How We Collaborate"
        intro="No templates. No black boxes. Just a clear process that keeps you in control."
      >
        <div className="max-w-2xl space-y-6">
          {[
            {
              n: "01",
              title: "Listen",
              body: "I understand your product, your users, your goals, and your constraints. No templates. Just curiosity."
            },
            {
              n: "02",
              title: "Analyze",
              body: "I look at your data and identify where users are stuck, where they're thriving, and where the biggest opportunities are."
            },
            {
              n: "03",
              title: "Strategize",
              body: "I develop a clear plan showing exactly where adaptive UX will have the most impact. I prioritize ruthlessly."
            },
            {
              n: "04",
              title: "Implement",
              body: "I provide implementation-ready specs and design systems. Your team executes with my support. You stay in control."
            },
            {
              n: "05",
              title: "Measure",
              body: "I track what matters: activation rates, retention improvements, cost savings, infrastructure efficiency. I measure impact and iterate."
            }
          ].map((step) => (
            <div key={step.n} className="flex items-start gap-5">
              <span className="w-8 shrink-0 pt-0.5 font-mono text-sm font-medium text-accent">
                {step.n}
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ─── Section 6: The Infrastructure Story ─────────────────────────────── */}
      <section
        className="reveal mt-[100px] overflow-hidden rounded-2xl bg-obsidian"
        style={{ border: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        {/* Top strip */}
        <div
          className="flex items-center gap-3 px-8 py-4 md:px-10"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
            Sustainable Infrastructure · Local-First
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-10 md:px-10 md:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            The Infrastructure Story
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.01em] text-white md:text-4xl">
            I practice what I preach.
          </h2>

          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-white/75 md:text-lg">
            <p>
            When I built the infrastructure powering HADE, I had a choice. I could use cloud infrastructure like everyone else. Easier. Automatic scaling. Less maintenance. But it would lock me into vendor dependency, recurring fees, and shared infrastructure.
            </p>
            <p>
            Instead, I did something different. I took a 2013 iMac that I had in storage, and transformed it into a functional AI compute node. I connected it to modern AI models and built a system that handles real-time inference with production-ready performance.
            </p>
            <p>
            <strong>I was reminded of something important:</strong> you don’t need wasteful consumption of new hardware to run cutting-edge AI. This infrastructure is now the backbone of HADE. It’s not just technical; it’s a statement about my values. When you work with HADE, you’re getting a partner that practices what I preach.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Complete Autonomy",
                body: "Local-first infrastructure means your data stays with you. No vendor lock-in. No recurring cloud fees. You own your systems.",
                sage: false
              },
              {
                title: "Sustainable by Design",
                body: "By reusing existing hardware, I reduce e-waste and carbon footprint. Your infrastructure reflects your values.",
                sage: true
              },
              {
                title: "Cost-Effective",
                body: "Lower initial investment. Minimal recurring costs. No per-use cloud fees. Predictable economics.",
                sage: false
              },
              {
                title: "Production-Ready",
                body: "Model load time: 15 seconds. Output quality: High-fidelity AI content. System uptime: 24/7.",
                sage: false
              }
            ].map((point) => (
              <div
                key={point.title}
                className="glass-panel p-5"
                style={point.sage ? { borderColor: "rgba(107,142,111,0.3)" } : undefined}
              >
                <h3
                  className={`text-sm font-semibold ${point.sage ? "text-sage" : "text-white/90"}`}
                >
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{point.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom mono line */}
        <div
          className="px-8 py-4 md:px-10"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
        >
          <p className="font-mono text-[10px] text-white/20">
            {"> hade.systems · local-first · sustainable infrastructure"}
          </p>
        </div>
      </section>

      {/* ─── Section 7: Next Steps (inline CTA — 3 links) ────────────────────── */}
      <section
        className="reveal mt-[100px] overflow-hidden rounded-2xl bg-obsidian"
        style={{ border: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        {/* Top strip */}
        <div
          className="flex items-center gap-3 px-8 py-4 md:px-10"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyberLime" />
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
            Next Step · Conversation
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-10 md:px-10 md:py-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.01em] text-white md:text-4xl">
              If your product feels static, we should talk.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
              Share your product and goals. Tell me what you&rsquo;re trying to solve. You&rsquo;ll get an
              honest assessment and a practical plan for introducing adaptive systems where they&rsquo;ll
              matter most. I&rsquo;m not here to make things prettier. I&rsquo;m here to make them
              work better &mdash; for your users, for your business, for your values.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="cta-button">
                Get a Free Breakdown
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-sans text-sm font-semibold text-white/70 transition hover:text-white"
                style={{ border: "0.5px solid rgba(255,255,255,0.15)" }}
              >
                View Services
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-sans text-sm font-semibold text-white/70 transition hover:text-white"
                style={{ border: "0.5px solid rgba(255,255,255,0.15)" }}
              >
                Learn About HADE Infrastructure
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom mono line */}
        <div
          className="px-8 py-4 md:px-10"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
        >
          <p className="font-mono text-[10px] text-white/20">
            {"> hade.systems · adaptive ux design"}
          </p>
        </div>
      </section>
    </>
  );
}