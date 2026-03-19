"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeUp, fadeInRight, viewport, viewportCard } from "@/branding/motion";

const deliverables = [
  "Rapid UX + behavior audit",
  "1 working adaptive prototype",
  "1–2 micro-experiments designed and ready to run",
  "Delivered in 3–5 days"
];

export function SprintCTASection() {
  return (
    <motion.section
      id="sprint-cta"
      className="mt-[100px] overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #EEF3FF 0%, #E7EEFF 60%, #F0F4FF 100%)",
        border: "0.5px solid rgba(49, 107, 255, 0.18)"
      }}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {/* Eyebrow strip */}
      <div
        className="flex items-center gap-3 px-8 py-4 md:px-10"
        style={{ borderBottom: "0.5px solid rgba(49, 107, 255, 0.1)" }}
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent/60">
          Recommended Start · Adaptive UX Sprint
        </p>
      </div>

      {/* Body */}
      <div className="grid gap-8 px-8 py-10 md:px-10 md:py-12 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left: headline + CTAs */}
        <div>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.01em] text-ink md:text-4xl">
            Start with an Adaptive UX Sprint
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/60 md:text-lg">
            In 3–5 days, get a working adaptive UX prototype embedded into your
            product — designed to respond to real user behavior.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="cta-button">
              Book Sprint
            </Link>
            <Link href="/how-it-works" className="secondary-button">
              View Demo
            </Link>
          </div>
        </div>

        {/* Right: deliverables highlight card */}
        <motion.div
          className="self-start rounded-2xl bg-white/90 p-6 backdrop-blur"
          style={{
            border: "0.5px solid rgba(49, 107, 255, 0.22)",
            boxShadow: "0 0 24px rgba(49, 107, 255, 0.10)"
          }}
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportCard}
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              $4k – $7k · 3–5 days
            </p>
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-accent"
              style={{
                background: "rgba(49, 107, 255, 0.08)",
                border: "0.5px solid rgba(49, 107, 255, 0.2)"
              }}
            >
              Start Here
            </span>
          </div>
          <h3 className="text-base font-semibold text-ink">What you get</h3>
          <ul className="mt-4 space-y-3">
            {deliverables.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-accent"
                  style={{ background: "rgba(49,107,255,0.09)" }}
                >
                  ✓
                </span>
                <span className="text-sm leading-snug text-ink/70">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Bottom mono line */}
      <div
        className="px-8 py-4 md:px-10"
        style={{ borderTop: "0.5px solid rgba(49, 107, 255, 0.08)" }}
      >
        <p className="font-mono text-[10px] text-ink/25">
          {"> Sprint → Module → System · scale at your pace"}
        </p>
      </div>
    </motion.section>
  );
}
