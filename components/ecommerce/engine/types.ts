/* ─── Core Domain Types ─────────────────────────────────────────────── */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  material: string;
}

export interface ProductSignals {
  dwellTime: number;
  clicks: number;
  revisits: number;
  lastLeftAt: number | null;
}

export interface SessionSignals {
  scrollDepth: number;
  timeOnPage: number;
  idleTime: number;
  maxIdleStreak: number;
  tapCount: number;
  longPressCount: number;
  totalInteractions: number;
}

export type SignalMap = Record<string, ProductSignals>;
export type RankDeltaMap = Record<string, number>;
export type BehaviorState = "Browsing" | "Evaluating" | "Hesitating" | "Deciding";

/* ─── Signal Event (event log schema) ───────────────────────────────── */

export interface SignalEvent {
  type: "dwell" | "click" | "revisit" | "scroll" | "idle" | "tap" | "longPress";
  productId: string | null;
  value: number;
  timestamp: number;
}

/* ─── Scoring & Ranking ─────────────────────────────────────────────── */

export interface SessionAdjustment {
  scrollContribution: number;
  timeContribution: number;
  idleContribution: number;
  tapContribution: number;
  longPressContribution: number;
}

export interface RankedProduct extends Product {
  score: number;
  signals: ProductSignals;
  isCompared: boolean;
}

export interface LeaderChangeSummary {
  id: string;
  headline: string;
  detail: string;
}

/* ─── State Classification ──────────────────────────────────────────── */

export interface SignalContribution {
  label: string;
  value: string;
  weight: string;
  contribution: number;
}

export interface StateAssessment {
  state: BehaviorState;
  confidence: number;
  rationale: string;
  lowConfidence: boolean;
  conflictSignals: string[];
  topSignals: SignalContribution[];
  inferenceLatencyMs: number;
}

export interface StateTransition {
  id: string;
  state: BehaviorState;
  timestamp: string;
}

/* ─── Model Output ──────────────────────────────────────────────────── */

export interface ModelMetric {
  label: string;
  value: string;
  detail: string;
}

export interface PipelineLogEntry {
  stage: string;
  summary: string;
  detail: string;
}

export interface PseudoModelOutput {
  assessment: StateAssessment;
  metrics: ModelMetric[];
  logs: PipelineLogEntry[];
}

/* ─── UI Feedback ───────────────────────────────────────────────────── */

export interface MicroFeedbackEntry {
  id: string;
  message: string;
  tone: "neutral" | "positive" | "alert";
}

/* ─── Persistence ───────────────────────────────────────────────────── */

export interface PersistedSession {
  signalMap: SignalMap;
  comparedProductIds: string[];
  sessionSignals: SessionSignals;
  stateTimeline: StateTransition[];
}
