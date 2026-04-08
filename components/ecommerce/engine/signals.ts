import type { ProductSignals, SessionSignals, SignalMap } from "./types";
import { PRODUCTS, SIGNAL_DECAY_LAMBDA } from "./config";

/* ─── Initialization ────────────────────────────────────────────────── */

export function createInitialSignalMap(): SignalMap {
  return PRODUCTS.reduce<SignalMap>((acc, product) => {
    acc[product.id] = {
      dwellTime: 0,
      clicks: 0,
      revisits: 0,
      lastLeftAt: null,
    };
    return acc;
  }, {});
}

export function createInitialSessionSignals(): SessionSignals {
  return {
    scrollDepth: 0,
    timeOnPage: 0,
    idleTime: 0,
    maxIdleStreak: 0,
    tapCount: 0,
    longPressCount: 0,
    totalInteractions: 0,
  };
}

/* ─── Sanitization (localStorage hydration) ─────────────────────────── */

export function sanitizeSignalMap(signalMap: unknown): SignalMap {
  const initial = createInitialSignalMap();
  if (!signalMap || typeof signalMap !== "object") return initial;

  for (const product of PRODUCTS) {
    const value = (signalMap as Record<string, Partial<ProductSignals>>)[product.id];
    if (!value) continue;

    initial[product.id] = {
      dwellTime: typeof value.dwellTime === "number" ? value.dwellTime : 0,
      clicks: typeof value.clicks === "number" ? value.clicks : 0,
      revisits: typeof value.revisits === "number" ? value.revisits : 0,
      lastLeftAt: typeof value.lastLeftAt === "number" ? value.lastLeftAt : null,
    };
  }

  return initial;
}

export function sanitizeSessionSignals(sessionSignals: unknown): SessionSignals {
  const initial = createInitialSessionSignals();
  if (!sessionSignals || typeof sessionSignals !== "object") return initial;

  const value = sessionSignals as Partial<SessionSignals>;
  return {
    scrollDepth: typeof value.scrollDepth === "number" ? value.scrollDepth : 0,
    timeOnPage: typeof value.timeOnPage === "number" ? value.timeOnPage : 0,
    idleTime: typeof value.idleTime === "number" ? value.idleTime : 0,
    maxIdleStreak: typeof value.maxIdleStreak === "number" ? value.maxIdleStreak : 0,
    tapCount: typeof value.tapCount === "number" ? value.tapCount : 0,
    longPressCount: typeof value.longPressCount === "number" ? value.longPressCount : 0,
    totalInteractions: typeof value.totalInteractions === "number" ? value.totalInteractions : 0,
  };
}

/* ─── Signal Decay ──────────────────────────────────────────────────── */

/**
 * Apply exponential decay to dwell time signals.
 * Discrete events (clicks, revisits) are not decayed — only continuous
 * accumulation signals lose weight over time.
 *
 * decay factor = e^(-λ × Δt)
 * λ = 0.023 ≈ 30-second half-life
 */
export function applySignalDecay(
  signalMap: SignalMap,
  deltaSeconds: number,
  lambda: number = SIGNAL_DECAY_LAMBDA
): SignalMap {
  if (deltaSeconds <= 0) return signalMap;

  const factor = Math.exp(-lambda * deltaSeconds);
  const result: SignalMap = {};

  for (const [id, signals] of Object.entries(signalMap)) {
    result[id] = {
      ...signals,
      dwellTime: Number((signals.dwellTime * factor).toFixed(2)),
    };
  }

  return result;
}
