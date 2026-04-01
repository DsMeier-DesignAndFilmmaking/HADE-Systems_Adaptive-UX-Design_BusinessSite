"use client";

// ─── Performance Changelog ────────────────────────────────────────────────────
// v2.0 — 2026-03-31
//
// 1. OVERLAY LAYER SPLIT (backdrop-blur removed from panel)
//    Before: Single motion.div carried backdrop-blur-md + all content.
//            Every opacity frame forced a full blur recomposite + content repaint.
//    After:  Two sibling divs in AnimatePresence:
//            – Backdrop (z-60): pure opacity animation, backdrop-blur-md only,
//              will-change: opacity — blur sample cached after frame 1.
//            – Panel   (z-61): translateY + opacity, will-change: transform,
//              no backdrop-blur — independent GPU layer, zero blur cost.
//
// 2. BOTTOM BAR GPU LAYER PROMOTION
//    Before: motion.div animated translateY with no compositor hint.
//            Layer allocated lazily — risked a dropped first frame on cold load.
//    After:  style={{ transform: 'translateZ(0)', willChange: 'transform' }}
//            forces layer promotion before the entrance animation begins.
//
// 3. DEFERRED SYSTEM LOG MOUNT
//    Before: <SystemLog> mounted immediately on menuOpen=true.
//            Its setInterval (220ms cadence) competed with the 180ms open animation.
//    After:  logReady state — set true via setTimeout(260) after menuOpen.
//            SystemLog not mounted until opening animation has settled.
//            Reset to false on close — no background CPU usage when hidden.
//
// 4. TOUCH-ACTION: MANIPULATION ON ALL INTERACTIVE ELEMENTS
//    Before: motion.div wrappers — touchAction never reached the interactive element.
//            iOS Safari applied 300ms tap delay.
//    After:  whileTap moved directly onto motion.button / MotionLink with
//            style={{ touchAction: 'manipulation' }} — first frame fires in <16ms.
//
// 5. ELIMINATED WRAPPER motion.div NODES IN BOTTOM BAR
//    Before: <motion.div whileTap><Link …></motion.div>
//            Extra DOM node, extra reconciliation, whileTap on wrong element.
//    After:  MotionLink (motion(Link)) for anchor items, motion.button for the
//            menu trigger — whileTap + touchAction on the correct element.
// ─────────────────────────────────────────────────────────────────────────────

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type CTAState, useScrollSection } from "@/hooks/useScrollSection";

// Framer Motion factory for Next.js Link — preserves client-side routing while
// allowing whileTap and style props directly on the anchor element.
const MotionLink = motion.create(Link);

// ─── Data ────────────────────────────────────────────────────────────────────

const CTA_CONFIG: Record<CTAState, { label: string; href: string }> = {
  awareness: { label: "View Demo", href: "/how-it-works" },
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
    "> CTA: Demo",
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

// ─── Motion Config ────────────────────────────────────────────────────────────

/**
 * Overlay fade easing — matches globals.css `.reveal-in` cubic-bezier for
 * consistency with the site-wide scroll-reveal system.
 * Pure opacity transitions don't benefit from spring physics (no spatial
 * overshoot), so we use a tuned duration + curve instead.
 */
const OVERLAY_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Spring presets — "Modern Organic" aesthetic.
 *
 * Formula reference: f(t) = e^(-ζωₙt) · cos(ωd·t + φ)
 * All configs are slightly underdamped (damping ratio < 1) for a snappy,
 * physically-plausible deceleration with no visible oscillation.
 *
 * - fabSpring:  Snappiest — micro UI element, near-instant text swap.
 * - pillSpring: Crisp — small pill components, quick contextual swap.
 * - linkSpring: Editorial — each nav link arrives with a distinct, weighted feel.
 * - barSpring:  Heaviest — large bar arriving from off-screen needs extra weight.
 */
const fabSpring  = { type: "spring" as const, stiffness: 420, damping: 36 };
const pillSpring = { type: "spring" as const, stiffness: 300, damping: 28 };
const linkSpring = { type: "spring" as const, stiffness: 260, damping: 26 };
const barSpring  = { type: "spring" as const, stiffness: 240, damping: 26 };

/**
 * Nav stagger container — drives coordinated entrance of all nav links.
 * `staggerChildren` fires each child's variant 55ms after the previous,
 * `delayChildren` gives the overlay opacity fade an 80ms head-start.
 *
 * Exit: the parent overlay's opacity handles the close; no staggered exit
 * is needed (and avoids extending the close animation unnecessarily).
 */
const navContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.08 },
  },
} as const;

/**
 * Individual nav link — spring entrance only.
 * y: 12 → 0 keeps the motion on the compositor thread (transform, not layout).
 * No `exit` key — the parent overlay's `exit={{ opacity: 0 }}` handles closing.
 */
const navLinkVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: linkSpring },
} as const;

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
  const [logReady, setLogReady] = useState(false);
  const cta = CTA_CONFIG[ctaState];
  const pills = PILLS[ctaState];

  // Scroll lock when overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Defer SystemLog mount until opening animation has settled (260ms).
  // Prevents setInterval callbacks from competing with animation frames.
  // Reset immediately on close so no background CPU usage while hidden.
  useEffect(() => {
    if (!menuOpen) { setLogReady(false); return; }
    const t = setTimeout(() => setLogReady(true), 260);
    return () => clearTimeout(t);
  }, [menuOpen]);

  return (
    <div className="md:hidden">

      {/* ── Full-Screen Overlay ─────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/*
              Backdrop layer — blur + tint only, opacity animation.
              will-change: opacity caches the blur sample after frame 1;
              subsequent frames are a cheap alpha-blend on the GPU.
              No content children — zero content repaint cost per frame.
            */}
            <motion.div
              key="overlay-backdrop"
              className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: OVERLAY_EASE }}
              style={{ willChange: "opacity" }}
              aria-hidden="true"
            />

            {/*
              Panel layer — all menu content, no backdrop-blur.
              will-change: transform promotes an independent GPU layer so the
              y + opacity animation composites entirely separately from the
              backdrop blur. z-[61] ensures content paints above the backdrop.
              Subtle y: 10→0 lift-in / y: 6 sink-out for "Modern Organic" feel.
            */}
            <motion.div
              key="overlay-panel"
              className="fixed inset-0 z-[61] flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: OVERLAY_EASE }}
              style={{ willChange: "transform" }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <span className="text-sm font-semibold tracking-[0.18em] text-white">
                  HADE SYSTEMS
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  style={{ touchAction: "manipulation" }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70"
                >
                  <CloseIcon />
                </motion.button>
              </div>

              {/* ── Contextual Pills ──────────────────────────────
                  AnimatePresence (no mode) = default "sync" behaviour:
                  old pills exit and new pills enter simultaneously.
                  Staggered `delay` on each pill provides sequential
                  appearance without the ~370ms queue that `mode="wait"` imposed.
              */}
              <motion.div
                className="flex gap-2 overflow-x-auto px-6 py-4 scrollbar-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                // Spring on the container: y displacement benefits from spring physics.
                transition={{ delay: 0.04, ...pillSpring }}
              >
                <AnimatePresence>
                  {pills.map((pill, i) => (
                    <motion.div
                      key={`${ctaState}-${i}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                      // Per-pill stagger via delay; spring for the y movement.
                      transition={{ delay: i * 0.055, ...pillSpring }}
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

              {/* ── Nav Links ─────────────────────────────────────
                  motion.nav as stagger container: variants propagate to
                  all motion.div children automatically. staggerChildren
                  fires each child 55ms after the previous; delayChildren
                  gives the overlay a brief head-start before links arrive.
                  Only opacity + y (transforms) are animated — no layout
                  properties — keeping the animation on the compositor thread.
              */}
              <motion.nav
                className="flex flex-1 flex-col justify-center px-6 py-2"
                variants={navContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {NAV_LINKS.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={navLinkVariants}
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
              </motion.nav>

              {/* System Log — deferred 260ms so its setInterval doesn't
                  compete with the opening animation frames. */}
              {logReady && <SystemLog ctaState={ctaState} />}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Persistent Bottom Bar ───────────────────────────── */}
      {/*
        translateZ(0) forces compositor layer promotion before the entrance
        animation begins — eliminates the lazy-allocation dropped-first-frame
        risk on cold load. willChange: transform keeps it pre-promoted.
      */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[55] border-t border-line/70 bg-white/85 backdrop-blur-xl"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        // Spring: large bar sliding in from off-screen benefits most from spring
        // physics — the deceleration curve feels weighted and intentional.
        transition={barSpring}
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      >
        <div className="flex h-16 items-center justify-around px-2">
          {/* Home — MotionLink: whileTap + touchAction on the interactive element */}
          <MotionLink
            href="/"
            whileTap={{ scale: 0.92 }}
            style={{ touchAction: "manipulation" }}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-ink/55"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
              <HomeIcon />
            </span>
            <span className="text-[10px] font-medium">Home</span>
          </MotionLink>

          {/* How It Works — MotionLink: whileTap + touchAction on the interactive element */}
          <MotionLink
            href="/how-it-works"
            whileTap={{ scale: 0.92 }}
            style={{ touchAction: "manipulation" }}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-ink/55"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
              <WorkIcon />
            </span>
            <span className="text-[10px] font-medium leading-none text-center">
              How It Works
            </span>
          </MotionLink>

          {/* FAB — Dynamic CTA
              -mt-5 offset must remain on the wrapper div; touchAction goes on
              the Link so the tap delay elimination reaches the correct element.
          */}
          <motion.div whileTap={{ scale: 0.93 }} className="-mt-5">
            <Link
              href={cta.href}
              style={{ touchAction: "manipulation" }}
              className="relative flex h-14 min-w-[120px] items-center justify-center overflow-hidden rounded-2xl bg-ink px-4 shadow-[0_4px_20px_rgba(11,13,18,0.25)]"
            >
              {/*
                mode="wait" is CORRECT here: single child (text span) swaps
                between states. Single-child wait mode is the intended pattern
                and produces no console warning.
              */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={cta.label}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  // Snappiest spring for micro-interaction text swap.
                  transition={fabSpring}
                  className="text-center text-[11px] font-semibold leading-tight text-white"
                >
                  {cta.label}
                </motion.span>
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Services — MotionLink: whileTap + touchAction on the interactive element */}
          <MotionLink
            href="/services"
            whileTap={{ scale: 0.92 }}
            style={{ touchAction: "manipulation" }}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-ink/55"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
              <ServicesIcon />
            </span>
            <span className="text-[10px] font-medium">Services</span>
          </MotionLink>

          {/* Menu — motion.button: whileTap + touchAction on the interactive element */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen(true)}
            style={{ touchAction: "manipulation" }}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-ink/55"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
              <MenuIcon />
            </span>
            <span className="text-[10px] font-medium">Menu</span>
          </motion.button>
        </div>

        {/* Safe-area spacer for iPhone home indicator */}
        <div className="h-safe-bottom" style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
      </motion.div>
    </div>
  );
}
