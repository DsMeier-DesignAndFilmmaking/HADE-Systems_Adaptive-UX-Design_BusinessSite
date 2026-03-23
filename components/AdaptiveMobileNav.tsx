"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type CTAState, useScrollSection } from "@/hooks/useScrollSection";

// ─── Data ────────────────────────────────────────────────────────────────────

const CTA_CONFIG: Record<CTAState, { label: string; href: string }> = {
  awareness: { label: "Watch Demo", href: "/how-it-works" },
  trust: { label: "View Architecture", href: "/how-it-works#hade-system" },
  conversion: { label: "Book Strategy Call", href: "/contact" },
};

const PILLS: Record<CTAState, { label: string; href: string }[]> = {
  awareness: [
    { label: "For Product Teams", href: "/services" },
    { label: "For Developers", href: "/how-it-works" },
    { label: "Technical Docs", href: "/how-it-works" },
  ],
  trust: [
    { label: "Architecture Deep-Dive", href: "/how-it-works#hade-system" },
    { label: "For Product Owners", href: "/services" },
    { label: "Case Studies", href: "/case-studies" },
  ],
  conversion: [
    { label: "Pricing & Scope", href: "/services" },
    { label: "Book Strategy Call", href: "/contact" },
    { label: "Case Studies", href: "/case-studies" },
  ],
};

const LOG_LINES: Record<CTAState, string[]> = {
  awareness: [
    "> Context: New Visitor",
    "> Intent: Discovery",
    "> CTA: Watch Demo",
    "> Nav: Optimized",
  ],
  trust: [
    "> Context: Engaged Visitor",
    "> Intent: Evaluation",
    "> CTA: View Architecture",
    "> Nav: Optimized",
  ],
  conversion: [
    "> Context: High-Intent Visitor",
    "> Intent: Conversion",
    "> CTA: Book Strategy Call",
    "> Nav: Optimized",
  ],
};

const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M7.5 18V12h5v6" />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="16" height="11" rx="1.5" />
      <path d="M7 5V4a1 1 0 011-1h4a1 1 0 011 1v1" />
      <path d="M2 10h16" />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  );
}

// ─── System Log ───────────────────────────────────────────────────────────────

function SystemLog({ ctaState }: { ctaState: CTAState }) {
  const lines = LOG_LINES[ctaState];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= lines.length) clearInterval(interval);
    }, 220);
    return () => clearInterval(interval);
  }, [ctaState, lines.length]);

  return (
    <div className="border-t border-white/10 px-6 py-4">
      <div className="font-mono text-[10px] leading-relaxed text-white/35">
        {lines.slice(0, visibleCount).map((line, i) => (
          <motion.p
            key={`${ctaState}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdaptiveMobileNav() {
  const ctaState = useScrollSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const cta = CTA_CONFIG[ctaState];
  const pills = PILLS[ctaState];

  // Scroll lock when overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="md:hidden">
      {/* ── Full-Screen Overlay ─────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-slate-900/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <span className="text-sm font-semibold tracking-[0.18em] text-white">
                HADE SYSTEMS
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70"
              >
                <CloseIcon />
              </motion.button>
            </div>

            {/* Contextual Pills */}
            <motion.div
              className="flex gap-2 overflow-x-auto px-6 py-4 scrollbar-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {pills.map((pill, i) => (
                  <motion.div
                    key={`${ctaState}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                  >
                    <Link
                      href={pill.href}
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex shrink-0 items-center rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/65 transition hover:border-white/30 hover:text-white/90"
                    >
                      {pill.label}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Nav Links */}
            <nav className="flex flex-1 flex-col justify-center px-6 py-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.28, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-white/8 py-4 text-xl font-semibold text-white/80 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* System Log */}
            <SystemLog ctaState={ctaState} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Persistent Bottom Bar ───────────────────────────── */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[55] border-t border-line/70 bg-white/85 backdrop-blur-xl"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex h-16 items-center justify-around px-2">
          {/* Home */}
          <motion.div whileTap={{ scale: 0.92 }}>
            <Link href="/" className="flex flex-col items-center gap-0.5 px-3 py-1 text-ink/55">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <HomeIcon />
              </span>
              <span className="text-[10px] font-medium">Home</span>
            </Link>
          </motion.div>

          {/* Work */}
          <motion.div whileTap={{ scale: 0.92 }}>
            <Link href="/how-it-works" className="flex flex-col items-center gap-0.5 px-3 py-1 text-ink/55">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <WorkIcon />
              </span>
              <span className="text-[10px] font-medium">How It Works</span>
            </Link>
          </motion.div>

          {/* FAB — Dynamic CTA */}
          <motion.div whileTap={{ scale: 0.93 }} className="-mt-5">
            <Link
              href={cta.href}
              className="relative flex h-14 min-w-[120px] items-center justify-center overflow-hidden rounded-2xl bg-ink px-4 shadow-[0_4px_20px_rgba(11,13,18,0.25)]"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={cta.label}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="text-center text-[11px] font-semibold leading-tight text-white"
                >
                  {cta.label}
                </motion.span>
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Services */}
          <motion.div whileTap={{ scale: 0.92 }}>
            <Link href="/services" className="flex flex-col items-center gap-0.5 px-3 py-1 text-ink/55">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <ServicesIcon />
              </span>
              <span className="text-[10px] font-medium">Services</span>
            </Link>
          </motion.div>

          {/* Menu */}
          <motion.div whileTap={{ scale: 0.92 }}>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-ink/55"
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <MenuIcon />
              </span>
              <span className="text-[10px] font-medium">Menu</span>
            </button>
          </motion.div>
        </div>

        {/* Safe-area spacer for iPhone home indicator */}
        <div className="h-safe-bottom" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
      </motion.div>
    </div>
  );
}
