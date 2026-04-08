import type { Product } from "./types";

/* ─── Visual ────────────────────────────────────────────────────────── */

export const GOLD = "#C4922A";

/* ─── Persistence ───────────────────────────────────────────────────── */

export const STORAGE_KEY = "hade-ecommerce-session-v2";

/* ─── Signal Weights ────────────────────────────────────────────────── */

export const DWELL_WEIGHT = 0.5;
export const CLICK_WEIGHT = 0.3;
export const REVISIT_WEIGHT = 0.2;
export const COMPARE_STACK_BONUS = 0.35;
export const SCROLL_WEIGHT = 0.18;
export const TIME_WEIGHT = 0.14;
export const IDLE_WEIGHT = 0.16;
export const TAP_WEIGHT = 0.12;
export const LONG_PRESS_WEIGHT = 0.18;

/* ─── Timing ────────────────────────────────────────────────────────── */

export const DWELL_INCREMENT = 0.2;
export const DWELL_INTERVAL_MS = 200;
export const RANKING_THROTTLE_MS = 700;
export const LONG_PRESS_DELAY_MS = 350;

/* ─── Decay ─────────────────────────────────────────────────────────── */

/** Exponential decay rate. λ = 0.023 ≈ 30s half-life. */
export const SIGNAL_DECAY_LAMBDA = 0.023;

/* ─── Ranking Stability ─────────────────────────────────────────────── */

/** Minimum score delta required to swap two adjacent ranks. */
export const RANK_STABILITY_THRESHOLD = 0.08;

/* ─── Products ──────────────────────────────────────────────────────── */

export const PRODUCTS: Product[] = [
  { id: "jacket", name: "Merino Wool Jacket", category: "Outerwear", price: "$425", material: "100% Merino" },
  { id: "knit", name: "Cashmere Turtleneck", category: "Knitwear", price: "$295", material: "Grade-A Cashmere" },
  { id: "boots", name: "Chelsea Boots", category: "Footwear", price: "$510", material: "Full-Grain Leather" },
];
