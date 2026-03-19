/**
 * HADE Systems — Motion Variants
 *
 * Centralized Framer Motion variants and viewport config.
 * Import these instead of defining inline animation values.
 *
 * Usage:
 *   import { fadeUp, viewport } from "@/branding/motion";
 *   <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
 */

import type { Variants, Transition } from "framer-motion";

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

/** Default section entrance transition — 500ms easeOut */
export const defaultTransition: Transition = {
  duration: 0.5,
  ease: "easeOut",
};

/** Faster card-level transition — 450ms easeOut */
export const cardTransition: Transition = {
  duration: 0.45,
  ease: "easeOut",
};

// ---------------------------------------------------------------------------
// Section variants
// ---------------------------------------------------------------------------

/**
 * Fade-up: primary entrance for sections.
 * Matches SectionWrapper's original inline values exactly.
 * opacity: 0 → 1, y: 14 → 0
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
};

/**
 * Fade-in from right: used for cards/panels that slide in from the side.
 * opacity: 0 → 1, x: 10 → 0, with a small delay.
 */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: 0.1, ease: "easeOut" },
  },
};

// ---------------------------------------------------------------------------
// Stagger variants
// ---------------------------------------------------------------------------

/**
 * Stagger container: parent wrapper that staggers its children.
 * Use with staggerChild on each child element.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

/**
 * Stagger child: card entrance in a staggered grid or list.
 * opacity: 0 → 1, y: 16 → 0
 */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: cardTransition,
  },
};

// ---------------------------------------------------------------------------
// Viewport config
// ---------------------------------------------------------------------------

/** Standard viewport — triggers when 20% of element is visible */
export const viewport = { once: true, amount: 0.2 } as const;

/** Mid viewport — triggers when 25% of element is visible (grids) */
export const viewportMid = { once: true, amount: 0.25 } as const;

/** Card viewport — triggers when 30% of element is visible (inline cards) */
export const viewportCard = { once: true, amount: 0.3 } as const;
