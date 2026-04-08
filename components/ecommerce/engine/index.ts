export type {
  Product,
  ProductSignals,
  SessionSignals,
  SignalMap,
  RankDeltaMap,
  BehaviorState,
  SignalEvent,
  SessionAdjustment,
  RankedProduct,
  LeaderChangeSummary,
  SignalContribution,
  StateAssessment,
  StateTransition,
  ModelMetric,
  PipelineLogEntry,
  PseudoModelOutput,
  MicroFeedbackEntry,
  PersistedSession,
} from "./types";

export { GOLD, PRODUCTS, STORAGE_KEY } from "./config";
export { rankProducts, calculateProductScore, applyRankingStability } from "./scoring";
export { buildPseudoModelOutput } from "./state-classifier";
export {
  createInitialSignalMap,
  createInitialSessionSignals,
  sanitizeSignalMap,
  sanitizeSessionSignals,
  applySignalDecay,
} from "./signals";
export {
  buildDynamicNarrative,
  buildCauseEffectMessage,
  buildLeaderChangeSummary,
  getBehaviorShiftStep,
  formatTransitionTime,
} from "./narrative";
