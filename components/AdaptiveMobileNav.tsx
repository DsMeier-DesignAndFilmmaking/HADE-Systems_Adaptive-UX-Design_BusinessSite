"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { memo, useCallback, useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { type CTAState, useScrollSection } from "@/hooks/useScrollSection";

const MotionLink = motion.create(Link);

const GPU_LAYER: CSSProperties = {
  transform: "translateZ(0)",
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
};

const CTA_CONFIG: Record<CTAState, { label: string; href: string }> = {
  awareness: { label: "View Demo", href: "/how-it-works" },
  trust: { label: "View Architecture", href: "/how-it-works#hade-system" },
  conversion: { label: "Book Strategy Call", href: "/contact" },
};

const PILLS: Record<CTAState, { label: string; href: string }[]> = {
  awareness: [
    { label: "For Product Teams", href: "/services" },
    { label: "For Developers", href: "/how-it-works" },
  ],
  trust: [
    { label: "Architecture", href: "/how-it-works#hade-system" },
    { label: "Case Studies", href: "/case-studies" },
  ],
  conversion: [
    { label: "Pricing", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
};

const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const PANEL = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: { type: "spring", stiffness: 320, damping: 32 },
  },
  exit: {
    y: "100%",
    transition: { duration: 0.22 },
  },
};

// Icons
const HomeIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 10l9-7 9 7" />
    <path d="M5 10v10h14V10" />
  </svg>
));

const HowIcon = memo(() => (
  <svg 
    viewBox="0 0 100 100" // Switching to 100x100 for mathematical precision
    className="h-5 w-5" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="5" // Relative thickness for the 100x100 system
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ overflow: 'visible' }} 
  >
    {/* Central Shaft Hole — Smooth and perfectly round */}
    <circle cx="50" cy="50" r="12" />

    {/* The programmatically generated gear body (8 teeth)
        1. Outer Diameter: ~48px (r=24)
        2. Inner Diameter: ~36px (r=18)
        3. All angles are perfectly subdivided by 360/8 = 45°
    */}
    <path
      d="
        M50,14   A36,36 0 0,1 70.1,23.3   L76.5,12.2 A48,48 0 0,1 86.8,22.5 L75.7,28.9 
        A36,36 0 0,1 85,49           L98,49 A48,48 0 0,1 98,51 L85,51 
        A36,36 0 0,1 76.7,70.1       L87.8,76.5 A48,48 0 0,1 77.5,86.8 L71.1,75.7 
        A36,36 0 0,1 51,85           L51,98 A48,48 0 0,1 49,98 L49,85 
        A36,36 0 0,1 29.9,76.7       L23.5,87.8 A48,48 0 0,1 13.2,77.5 L24.3,71.1 
        A36,36 0 0,1 15,51           L2,51 A48,48 0 0,1 2,49 L15,49 
        A36,36 0 0,1 23.3,29.9       L12.2,23.5 A48,48 0 0,1 22.5,13.2 L28.9,24.3 
        A36,36 0 0,1 49,15           L49,2 A48,48 0 0,1 51,2 L51,15 Z"
    />
  </svg>
));

const ServicesIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M8 20h8" />
  </svg>
));

const MenuIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
));

const CloseIcon = memo(() => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
));

function lockScroll() {
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.body.style.overflow = "";
}

export function AdaptiveMobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const ctaState = useScrollSection(menuOpen);
  const cta = CTA_CONFIG[ctaState];
  const pills = PILLS[ctaState];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (menuOpen) lockScroll(); else unlockScroll();
  }, [menuOpen]);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setContentVisible(false);
  }, []);

  const overlay = (
    <AnimatePresence>
      {menuOpen && (
        <motion.div className="fixed inset-0 z-[60] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            variants={PANEL}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={GPU_LAYER}
            className="absolute bottom-0 left-0 right-0 h-full bg-slate-900 text-white flex flex-col"
            onAnimationComplete={() => setContentVisible(true)}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <span>MENU</span>
              <button onClick={closeMenu}><CloseIcon /></button>
            </div>

            <motion.div animate={{ opacity: contentVisible ? 1 : 0 }} className="flex-1">
              <div className="flex gap-2 px-6 py-4 overflow-x-auto">
                {pills.map((p, i) => (
                  <Link key={i} href={p.href} onClick={closeMenu} className="text-xs border px-3 py-1 rounded-full">
                    {p.label}
                  </Link>
                ))}
              </div>

              <div className="px-6">
                {NAV_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} onClick={closeMenu} className="block py-4 border-b">
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="md:hidden">
      {mounted && createPortal(overlay, document.body)}

      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[55] bg-white border-t"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        style={GPU_LAYER}
      >
        <div className="flex h-16 items-center justify-around">

          <MotionLink href="/" className="flex flex-col items-center justify-center text-[10px] text-ink/70">
            <HomeIcon />
            <span className="mt-0.5">Home</span>
          </MotionLink>

          <MotionLink href="/how-it-works" className="flex flex-col items-center justify-center text-[10px] text-ink/70">
            <HowIcon />
            <span className="mt-0.5 text-center leading-tight">How It Works</span>
          </MotionLink>

          <div className="-mt-5 flex flex-col items-center">
          <Link 
            href={cta.href} 
            className="bg-black text-white px-6 h-14 flex items-center justify-center rounded-2xl text-[12px] font-semibold text-center leading-tight shadow-lg"
          >
            {cta.label}
          </Link>
        </div>

          <MotionLink href="/services" className="flex flex-col items-center justify-center text-[10px] text-ink/70">
            <ServicesIcon />
            <span className="mt-0.5">Services</span>
          </MotionLink>

          <button onClick={openMenu} className="flex flex-col items-center justify-center text-[10px] text-ink/70">
            <MenuIcon />
            <span className="mt-0.5">Menu</span>
          </button>

        </div>
      </motion.div>
    </div>
  );
}
