import Link from "next/link";
import { navLinks } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="bg-obsidian" style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* Brand block */}
          <div className="max-w-sm">
            <p className="font-mono text-sm font-semibold tracking-[0.18em] text-white">
              HADE SYSTEMS
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              Adaptive UX design for product teams that want onboarding, activation, and retention systems that respond in real time.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-white/40 transition hover:text-white/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-6"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
        >
          <p className="font-mono text-[10px] text-white/20">
            {"> © 2026 HADE Systems · All rights reserved"}
          </p>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-cyberLime/60" />
            <p className="font-mono text-[10px] text-white/20">Systems Branding · v1.0</p>
          </span>
        </div>
      </div>
    </footer>
  );
}
