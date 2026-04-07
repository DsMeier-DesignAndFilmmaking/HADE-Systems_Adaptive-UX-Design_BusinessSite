"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Plus, Camera, FileText, X, Sparkles, Mic } from "lucide-react";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import SenseVoiceInput from "./SenseVoiceInput";


/* --- Modern Organic Palette (Vibe Creator) --- */
const ORGANIC = {
  cream:       "#F5F2ED",
  charcoalSoft:"#F0EDE8",
  charcoal:    "#2C2C2C",
  sage:        "#7D8B72",
  sageFaint:   "rgba(125,139,114,0.10)",
  sageMid:     "rgba(125,139,114,0.22)",
  warmLine:    "#E8E4DC",
  warmWhite:   "#FEFCF8",
} as const;

/* --- 1. Enhanced HADE Types & Theme --- */
type StepId = "input" | "processing" | "result" | "mapping";

/* Vibe Creator isolated state machine — never shares state with StepId */
type VibeMode = "idle" | "sense" | "documenting" | "confirmed";

interface StoredVibe {
  id: string;
  raw: string;
  chips: string[];
  timestamp: number;
}

interface FieldNote { id: string; text: string; timestamp: number; }

interface InteractionRecord {
  id: string;
  keyword: string;
  subNode: string;
  module: ModuleContext;
  novelty?: number;
  timestamp: number;
}

interface HadeStoredContext {
  vibes: StoredVibe[];
  fieldNotes: FieldNote[];
  interactionHistory: InteractionRecord[];
}
type LlmChoice = "gemini" | "llama" | "claude";

type ModuleContext = "weather-vibe" | "expert-network" | "mood-journey" | "meet-someone" | "the-wildcard";

interface SignalState {
  combinedSignal: string;
  moduleContext: ModuleContext;
  location: string;
  llmChoice: LlmChoice;
}

// 1. Define the Interface
interface HadeEngineProps {
  accent?: string; // The '?' makes it optional
}

const DEFAULT_SIGNAL: SignalState = {
  combinedSignal: "",
  moduleContext: "weather-vibe",
  location: "Istanbul, Turkey",
  llmChoice: "gemini",
};

interface GeneratedOutput {
  keyword: string;
  description: string;
  subNode: string;
  tags: string[];
}

const DEFAULT_OUTPUT: GeneratedOutput = {
  keyword: "Discovery",
  description: "A hidden node along the Bosphorus has been flagged for your current state.",
  subNode: "Karaköy",
  tags: ["adaptive", "fallback"],
};

interface DecisionNode {
  keyword: string;
  description: string;
  subNode: string;
}

interface HadeApiResponse {
  primary?: DecisionNode;
  alternatives?: DecisionNode[];
  tags?: string[];
  urgency?: "high" | "medium" | "low";
  novelty?: number;
}

type EngineStatus = "idle" | "listening" | "understanding" | "adapting";

/* --- UGC Field Notes --- */

const MODULE_THEMES: Record<ModuleContext, { 
  primary: string; 
  label: string; 
  metricLabel: string;
  resultTitle: string;
  baseDesc: string;
  tagline: string;
  action: string;
}> = {
  "weather-vibe": { 
    primary: "#10B981", 
    label: "City Pulse", 
    metricLabel: "Local Conditions",
    resultTitle: "A Change of Plans?",
    baseDesc: "We've found a hidden node along the Bosphorus that holds the exact atmosphere you're after.",
    tagline: "Live Environment",
    action: "Make The Move"
  },
  "expert-network": { 
    primary: "#6366F1", 
    label: "Explore the Network", 
    metricLabel: "Trust Connection",
    resultTitle: "Someone You Should Meet",
    baseDesc: "A verified contact from your extended network is flagged as a high-signal intro window.",
    tagline: "Trusted Connections",
    action: "Go Connect"
  },
  "mood-journey": { 
    primary: "#F43F5E", 
    label: "Mood Journey", 
    metricLabel: "Inspiration Level",
    resultTitle: "A Moment of Zen",
    baseDesc: "We've charted a path through Beyoğlu that mirrors that exact frequency.",
    tagline: "Emotional Arc",
    action: "Follow the Path"
  },
  "meet-someone": { 
    primary: "#8B5CF6", 
    label: "Meet Someone", 
    metricLabel: "Social Match",
    resultTitle: "Spontaneous Coffee?",
    baseDesc: "HADE has surfaced a low-friction window to connect with others nearby organically.",
    tagline: "Organic Meetups",
    action: "Signal Interest"
  },
  "the-wildcard": { 
    primary: "#3B82F6", 
    label: "The Wildcard", 
    metricLabel: "Spontaneity Score",
    resultTitle: "Off the Beaten Path",
    baseDesc: "We've surfaced a node in Kadıköy that no algorithm has indexed yet.",
    tagline: "True Discovery",
    action: "Explore Now"
  },
};

/* --- 2. Heuristic Intent Hook --- */

const HARD_IGNORE = new Set([
  // Tier 1: Modal verbs
  "should","would","could","might","shall","must",
  // Auxiliary verbs
  "am","is","are","was","were","been","being","have","has","had","do","does","did",
  // High-frequency filler
  "really","very","looking","want","wants","please","just","also","even","like",
  // Stop words
  "the","with","for","a","an","i","to","of","near","find","in","at","and",
  "or","but","not","that","this","my","me","we","you","it","as","be",
  "when","some","show","where","there","here","then","than",
]);

const extractHighSignalWord = (input: string): string => {
  if (!input.trim()) return "Discovery";
  const raw = input.toLowerCase().replace(/[^a-zàâçéèêëîïôûùüÿñæœ\s]/g, "").split(/\s+/);
  // Tier 2: 4-char minimum, with exemptions for "cat" and "art"
  const candidates = raw.filter(w =>
    !HARD_IGNORE.has(w) && (w.length >= 4 || w === "cat" || w === "art")
  );
  if (candidates.length === 0) return "Discovery";
  // Tier 3: last qualifying word (intent peaks at end of prompt)
  const word = candidates[candidates.length - 1];
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const ISTANBUL_CENTER = { lat: 41.0082, lng: 28.9784 };

const GOOGLE_MAP_DARK_STYLE: any[] = [
  { elementType: "geometry", stylers: [{ color: "#0A0C10" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0A0C10" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  { featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#111827" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0A0C10" }] },
];

const ISTANBUL_NODE_COORDS: Record<string, { lat: number; lng: number }> = {
  karakoy: { lat: 41.0259, lng: 28.9776 },
  kadikoy: { lat: 40.9901, lng: 29.0289 },
  "nişantaşı": { lat: 41.0505, lng: 28.9927 },
  nisantasi: { lat: 41.0505, lng: 28.9927 },
  bebek: { lat: 41.0766, lng: 29.0439 },
  cihangir: { lat: 41.0317, lng: 28.9854 },
  moda: { lat: 40.9869, lng: 29.0252 },
  besiktas: { lat: 41.0422, lng: 29.0083 },
  galata: { lat: 41.0256, lng: 28.9741 },
  beyoglu: { lat: 41.0369, lng: 28.9851 },
};

const LLM_OPTIONS: Array<{ id: LlmChoice; label: string; detail: string }> = [
  { id: "gemini", label: "Gemini", detail: "Google Deep Reasoning" },
  { id: "llama",  label: "Llama",  detail: "Open Strategy Layer"  },
  { id: "claude", label: "Claude", detail: "Spatial Architect"    },
];

/* --- Vibe Creator Utilities --- */

const VIBE_CHIPS_DEFAULT = ["City Park", "High Energy", "Live Event", "Outdoor"] as const;

const SAMPLE_VIBE_TEXT = "";

/**
 * surfaceUGCContext
 * Pure function. Returns the most recent StoredVibe when the search text
 * contains "active" or "park". No side effects.
 */
function surfaceUGCContext(
  currentSearch: string,
  storedVibes: StoredVibe[]
): StoredVibe | null {
  if (!storedVibes.length || !currentSearch.trim()) return null;
  const lower = currentSearch.toLowerCase();
  if (!lower.includes("active") && !lower.includes("park")) return null;
  return [...storedVibes].sort((a, b) => b.timestamp - a.timestamp)[0];
}

/* --- Persistence Utilities --- */

const HADE_STORAGE_KEY = "hade-context-v1";
const MAX_HISTORY = 50;
const EMPTY_CONTEXT: HadeStoredContext = { vibes: [], fieldNotes: [], interactionHistory: [] };

function loadContext(): HadeStoredContext {
  if (typeof window === "undefined") return EMPTY_CONTEXT;
  try {
    const raw = localStorage.getItem(HADE_STORAGE_KEY);
    if (!raw) return EMPTY_CONTEXT;
    const p = JSON.parse(raw) as Partial<HadeStoredContext>;
    return {
      vibes: Array.isArray(p.vibes) ? p.vibes : [],
      fieldNotes: Array.isArray(p.fieldNotes) ? p.fieldNotes : [],
      interactionHistory: Array.isArray(p.interactionHistory) ? p.interactionHistory : [],
    };
  } catch { return EMPTY_CONTEXT; }
}

function saveContext(ctx: HadeStoredContext): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HADE_STORAGE_KEY, JSON.stringify({
      vibes: ctx.vibes.slice(0, 100),
      fieldNotes: ctx.fieldNotes.slice(0, 100),
      interactionHistory: ctx.interactionHistory.slice(0, MAX_HISTORY),
    }));
  } catch { /* QuotaExceededError — silently fail */ }
}

function buildContextSummary(ctx: HadeStoredContext): string {
  if (ctx.interactionHistory.length === 0) return "";
  const counts: Partial<Record<ModuleContext, number>> = {};
  for (const r of ctx.interactionHistory) counts[r.module] = (counts[r.module] ?? 0) + 1;
  const topModule = (Object.entries(counts) as [ModuleContext, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  const allVibes = ctx.vibes.map(v => v.raw).join(" ").toLowerCase();
  const parts: string[] = [`${ctx.interactionHistory.length} past ${ctx.interactionHistory.length === 1 ? "query" : "queries"}`];
  if (topModule) parts.push(`${MODULE_THEMES[topModule].label} focus`);
  if (/spontan|adventure|surprise|wildcard/.test(allVibes)) parts.push("spontaneous style");
  const s = parts.join(", ");
  return s.length <= 60 ? s : s.slice(0, 57) + "...";
}

function derivePreferences(ctx: HadeStoredContext): string[] {
  const prefs: string[] = [];
  const counts: Partial<Record<ModuleContext, number>> = {};
  for (const r of ctx.interactionHistory) counts[r.module] = (counts[r.module] ?? 0) + 1;
  const top = (Object.entries(counts) as [ModuleContext, number][]).sort((a, b) => b[1] - a[1])[0];
  if (top && top[1] >= 2) prefs.push(`Returns to ${MODULE_THEMES[top[0]].label}`);
  const vibeText = ctx.vibes.map(v => v.raw).join(" ").toLowerCase();
  const noteText = ctx.fieldNotes.map(n => n.text).join(" ").toLowerCase();
  if (/spontan|adventure|surprise/.test(vibeText)) prefs.push("Prefers spontaneous experiences");
  if (/quiet|calm|peace|solo/.test(vibeText + noteText)) prefs.push("Favors quieter settings");
  if (/food|eat|cafe|coffee|restaurant/.test(vibeText + noteText)) prefs.push("Food & cafe signals active");
  if (/night|evening|late/.test(vibeText + noteText)) prefs.push("Evening time preference");
  if (ctx.interactionHistory.some(r => (r.novelty ?? 0) > 0.7)) prefs.push("High novelty tolerance");
  if (ctx.fieldNotes.length >= 3) prefs.push("Active field note contributor");
  return prefs.slice(0, 4);
}

const MODULE_ICONS: Record<ModuleContext, string> = {
  "weather-vibe": "◉",
  "expert-network": "⬡",
  "mood-journey": "◈",
  "meet-someone": "◎",
  "the-wildcard": "◇",
};

/* --- 3. UI Sub-Components --- */

function WhyThisSection({ moduleContext, urgency, novelty, tags, isOpen, onToggle }: {
  moduleContext: ModuleContext;
  urgency?: string;
  novelty?: number;
  tags: string[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const urgencyColor = urgency === "high" ? "text-red-400" : urgency === "medium" ? "text-amber-400" : "text-emerald-400";
  return (
    <div className="border-t border-white/10 mt-4 pt-4">
      <button onClick={onToggle} className="flex items-center gap-2 text-[10px] font-mono text-white/25 hover:text-white/50 transition-colors uppercase tracking-widest">
        <span>Why this?</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-block">↓</motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-2.5 text-[10px] font-mono text-white/35">
              <div className="flex justify-between">
                <span>Module</span>
                <span className="text-white/55">{MODULE_THEMES[moduleContext].label}</span>
              </div>
              {urgency && (
                <div className="flex justify-between">
                  <span>Urgency</span>
                  <span className={urgencyColor}>{urgency}</span>
                </div>
              )}
              {novelty !== undefined && (
                <div className="flex justify-between">
                  <span>Novelty</span>
                  <span>{Math.round(novelty * 100)}%</span>
                </div>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.slice(0, 3).map(tag => (
                    <span key={tag} className="rounded px-2 py-0.5 bg-white/5 border border-white/10">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PassiveSignalsPanel({ isActive }: { isActive: boolean }) {
  const [dwellSeconds, setDwellSeconds] = useState(0);
  const [locationConfidence, setLocationConfidence] = useState(88);
  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => setDwellSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isActive]);
  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setLocationConfidence((v) => Math.min(98, Math.max(78, Math.round(v + (Math.random() - 0.5) * 4))));
    }, 3200);
    return () => clearInterval(id);
  }, [isActive]);
  const now = new Date();
  const localTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  return (
    <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25">Live Context Signals</span>
        <span className="text-[9px] font-mono text-white/15 uppercase tracking-widest">Simulated Layer</span>
      </div>
      <div className="space-y-2 text-[10px] font-mono">
        <div className="flex justify-between text-white/30"><span>Dwell Time</span><span className="text-white/50">{dwellSeconds}s</span></div>
        <div className="flex justify-between text-white/30"><span>Local Time</span><span className="text-white/50">{localTimeStr}</span></div>
        <div className="flex justify-between text-white/30"><span>GPS Confidence</span><span className="text-white/50">{locationConfidence}%</span></div>
      </div>
    </div>
  );
}

function ContextModelPanel({ storedContext, isGrowing }: { storedContext: HadeStoredContext; isGrowing: boolean }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const prefs = mounted ? derivePreferences(storedContext) : [];
  const recent = storedContext.interactionHistory.slice(0, 5);
  return (
    <div
      className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all duration-500"
      style={isGrowing ? { boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 0 12px rgba(255,255,255,0.04)" } : {}}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25">Your Context Model</span>
        {isGrowing && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[9px] font-mono text-white/30 uppercase tracking-widest"
          >
            Context evolving
          </motion.span>
        )}
      </div>

      {/* Signal inventory */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {([
          { label: "Vibes", count: storedContext.vibes.length },
          { label: "Notes", count: storedContext.fieldNotes.length },
          { label: "Queries", count: storedContext.interactionHistory.length },
        ] as const).map(({ label, count }) => (
          <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 text-center">
            <p className="text-[18px] font-black text-white/50 leading-none">{count}</p>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Inferred preferences */}
      {prefs.length > 0 && (
        <div className="mb-4">
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Inferred Preferences</p>
          <div className="flex flex-wrap gap-1.5">
            {prefs.map(pref => (
              <span key={pref} className="rounded-full px-2.5 py-1 text-[9px] font-mono text-white/35 bg-white/[0.04] border border-white/[0.07]">
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent queries */}
      {recent.length > 0 && (
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Recent Signals</p>
          <div className="flex flex-wrap gap-1.5">
            {recent.map(r => (
              <span key={r.id} className="rounded px-2 py-0.5 text-[9px] font-mono text-white/30 bg-white/[0.03] border border-white/[0.06] flex items-center gap-1.5">
                <span className="text-white/20">{MODULE_ICONS[r.module]}</span>
                {r.keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {storedContext.interactionHistory.length === 0 && storedContext.vibes.length === 0 && (
        <p className="text-[10px] font-mono text-white/15 italic">No context accumulated yet. Start exploring.</p>
      )}
    </div>
  );
}

function SignalRefinementBar({ signal, onSignalChange, engineStatus, theme }: {
  signal: string;
  onSignalChange: (v: string) => void;
  engineStatus: EngineStatus;
  theme: typeof MODULE_THEMES[ModuleContext];
}) {
  return (
    <motion.div
      key="refinement-bar"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3 }}
      className="mb-5 rounded-2xl border border-ink/[0.08] bg-ink/[0.04] px-5 py-3.5"
    >
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/30 mb-2.5">Refining Signal</p>
      <input
        value={signal}
        onChange={(e) => onSignalChange(e.target.value)}
        className="w-full bg-transparent text-[12px] font-mono text-ink/60 placeholder-ink/20 outline-none border-none"
        placeholder="Refine your signal..."
      />
      <div className="flex items-center gap-2 mt-2.5">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-1 w-1 flex-shrink-0 rounded-full"
          style={{ backgroundColor: theme.primary }}
        />
        <span className="text-[9px] font-mono uppercase tracking-widest text-ink/30">
          {engineStatus === "idle" ? "Observing" :
           engineStatus === "listening" ? "Listening..." :
           engineStatus === "understanding" ? "Understanding..." : "Adapting..."}
        </span>
      </div>
    </motion.div>
  );
}

function NeuralBackboneSheet({ open, onClose, llmChoice, onSelect }: {
  open: boolean;
  onClose: () => void;
  llmChoice: LlmChoice;
  onSelect: (id: LlmChoice) => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted || !document.body) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            key="backbone-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            key="backbone-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[2.25rem] border-t border-white/50 bg-white/92 shadow-2xl backdrop-blur-3xl"
          >
            {/* Drag handle */}
            <div className="mx-auto mt-3.5 h-[3px] w-9 rounded-full bg-ink/15" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-3 pt-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.26em] text-ink/30">
                  Engine Configuration
                </p>
                <h2
                  className="mt-0.5 text-[1.25rem] font-normal tracking-tight text-ink"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Neural Backbone
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/[0.06] transition hover:bg-ink/[0.12]"
              >
                <X size={13} className="text-ink/45" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-ink/[0.07]" />

            {/* Options */}
            <div className="flex flex-col gap-2.5 px-5 py-5 pb-8">
              {LLM_OPTIONS.map((option) => {
                const active = llmChoice === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => { onSelect(option.id); onClose(); }}
                    className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-ink/[0.08] px-5 py-4 text-left transition-all hover:border-ink/[0.18] active:scale-[0.99]"
                    style={{ background: active ? "#1C1C1E" : "rgba(255,255,255,0.65)" }}
                  >
                    {active && (
                      <motion.div
                        layoutId="backbone-active-pill"
                        className="absolute inset-0 rounded-2xl bg-ink"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10">
                      <p className={`text-[13px] font-black uppercase tracking-widest ${active ? "text-white" : "text-ink/75"}`}>
                        {option.label}
                      </p>
                      <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${active ? "text-white/50" : "text-ink/30"}`}>
                        {option.detail}
                      </p>
                    </div>
                    {active && (
                      <div className="relative z-10 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function UnifiedInputStep({ signal, setSignal, onNext, isLoading, engineStatus, onCaptureContext, onCreateVibe, onOpenBackbone, surfacedVibe, mainInputRef }: any) {
  const theme = MODULE_THEMES[signal.moduleContext as ModuleContext];
  return (
    <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 backdrop-blur-2xl shadow-xl md:p-12">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: theme.primary }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">HADE Live</span>
          </div>
          {/* Create a Vibe — header affordance */}
          <button
            onClick={onCreateVibe}
            className="flex items-center gap-2 rounded-full px-4 py-2 transition-all hover:scale-[1.03]"
            style={{ background: ORGANIC.cream, border: `1px solid ${ORGANIC.warmLine}` }}
          >
            <Sparkles size={12} style={{ color: ORGANIC.charcoal }} />
            <span className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: ORGANIC.charcoal }}>
              Create a Vibe
            </span>
          </button>
        </div>
        <h3 className="mt-4 text-4xl font-bold tracking-tight text-ink">What's the vibe?</h3>
        <p className="mt-2 text-sm text-ink/50 max-w-2xl">HADE checks the local pulse and how you're feeling to suggest the perfect next move.</p>

        {/* Surfaced Field Note — appears when search matches a stored vibe */}
        <AnimatePresence>
          {surfacedVibe && (
            <motion.div
              key="surface-hint"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="mt-5 flex items-start gap-3 rounded-2xl px-5 py-4"
              style={{ background: ORGANIC.cream, border: `1px solid ${ORGANIC.warmLine}` }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: ORGANIC.sage }}
              />
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: ORGANIC.sage }}>
                  Field Note Active
                </p>
                <p className="mt-0.5 truncate text-sm" style={{ color: ORGANIC.charcoal, fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: "italic" }}>
                  "{surfacedVibe.raw}"
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {surfacedVibe.chips.map((chip: string) => (
                    <span key={chip} className="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.14em]"
                      style={{ background: ORGANIC.warmWhite, border: `1px solid ${ORGANIC.warmLine}`, color: ORGANIC.sage }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          ref={mainInputRef}
          value={signal.combinedSignal}
          onChange={(e) => setSignal((p: any) => ({ ...p, combinedSignal: e.target.value }))}
          disabled={isLoading}
          suppressHydrationWarning
          className="relative z-10 mt-10 w-full resize-none rounded-[1.5rem] border-none bg-ink/[0.03] p-6 text-xl outline-none transition-all focus:bg-ink/[0.05] placeholder:text-ink/10 disabled:cursor-not-allowed disabled:opacity-70"
          placeholder="e.g. 'I'm tired of tourist spots, show me where the locals hide when it rains'..."
          rows={3}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm">
            <label className="block text-[10px] font-black uppercase text-ink/20 mb-2">Focus On...</label>
            <select 
              value={signal.moduleContext} 
              onChange={(e) => setSignal((p: any) => ({ ...p, moduleContext: e.target.value as ModuleContext }))} 
              className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer"
            >
              {Object.keys(MODULE_THEMES).map(k => <option key={k} value={k}>{MODULE_THEMES[k as ModuleContext].label}</option>)}
            </select>
          </div>
          {/* Locked Istanbul GPS */}
          <div className="rounded-2xl border border-ink/5 bg-white/40 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-ink/20">GPS Anchor</label>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-bold uppercase text-emerald-500/80 tracking-tighter">Verified Node</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-ink/30" />
              <span className="text-sm font-bold text-ink/80">Istanbul, Turkey</span>
            </div>
          </div>
        </div>

      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        {/* Left affordances */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCaptureContext}
            className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-ink/20"
          >
            <Plus size={13} className="text-ink/40" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/40">Field Notes</span>
          </button>
          <button
            onClick={onOpenBackbone}
            className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-ink/20"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-ink/40">
              {LLM_OPTIONS.find((o) => o.id === signal.llmChoice)?.label ?? "Model"}
            </span>
          </button>
        </div>

        {/* Engine status indicator — replaces submit button */}
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: theme.primary }}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-ink/30">
            {isLoading ? "Orchestrating..." :
             engineStatus === "listening" ? "Listening..." :
             engineStatus === "understanding" ? "Understanding..." :
             engineStatus === "adapting" ? "Adapting..." : "Ready"}
          </span>
        </div>
      </div>
    </div>
  );
}

const ProcessingStep = React.memo(function ProcessingStep({ signal, onComplete, duration = 3200 }: any) {
  const theme = MODULE_THEMES[signal.moduleContext as ModuleContext];
  useEffect(() => { const t = setTimeout(onComplete, duration); return () => clearTimeout(t); }, [onComplete, duration]);

  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center rounded-[2.5rem] bg-white/70 p-12 backdrop-blur-2xl">
      <div className="w-full max-w-sm space-y-12">
        <div className="relative mx-auto h-20 w-20">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-0 rounded-full border-[4px] border-ink/5 border-t-transparent" style={{ borderTopColor: theme.primary }} />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-4 rounded-full" style={{ background: theme.primary }} />
        </div>
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-ink/40">{theme.metricLabel} Check</span>
            <div className="h-1 w-full bg-ink/5 rounded-full overflow-hidden mt-4">
              <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: duration / 1000 }} className="h-full" style={{ background: theme.primary }} />
            </div>
          </div>
          <p className="text-center text-[10px] font-bold text-ink/30 uppercase tracking-[0.3em]">
            Routing {signal.llmChoice} Vector...
          </p>
          <p className="text-center text-[10px] font-bold text-ink/20 uppercase tracking-[0.2em]">
            [{signal.combinedSignal.split(' ').slice(0, 5).join(' ')}
            {signal.combinedSignal.split(' ').length > 5 ? "..." : ""}]
          </p>
        </div>
      </div>
    </div>
  );
});

function ResultStep({
  signal, generatedOutput, onRestart, onGo, resultPulse, ugcInjected, surfacedVibe,
  generatedAlternatives, rawApiMeta, isContextShift, previousOutput,
  rankOrder, isReprocessing, isReranking,
}: any) {
  const theme = MODULE_THEMES[signal.moduleContext as ModuleContext];
  const [whyOpen, setWhyOpen] = useState(false);
  const displayKeyword = generatedOutput?.keyword || generatedOutput?.primary?.keyword || "HADE Node";
  const displayDesc =
    generatedOutput?.description ||
    generatedOutput?.primary?.description ||
    "Processing Istanbul signal...";

  // Derive ordered alternatives from rankOrder
  const orderedResults: DecisionNode[] = Array.isArray(rankOrder) && Array.isArray(generatedAlternatives)
    ? (rankOrder as number[]).map((idx: number) => generatedAlternatives[idx]).filter(Boolean)
    : (generatedAlternatives ?? []);

  return (
    <div>
      {/* Field Note card */}
      <AnimatePresence>
        {surfacedVibe && (
          <motion.div
            key="field-note-card"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            className="mb-5 overflow-hidden rounded-[1.75rem]"
            style={{ background: ORGANIC.warmWhite, border: `1px solid ${ORGANIC.warmLine}`, boxShadow: `0 4px 20px ${ORGANIC.sageFaint}` }}
          >
            <div className="flex items-center gap-3 px-5 py-3" style={{ background: ORGANIC.cream, borderBottom: `1px solid ${ORGANIC.warmLine}` }}>
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="h-1.5 w-1.5 rounded-full" style={{ background: ORGANIC.sage }} />
              <span className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: ORGANIC.sage }}>
                Field Note · Sense Map Match
              </span>
            </div>
            <div className="px-6 py-5">
              <p className="text-base italic leading-snug mb-3" style={{ color: ORGANIC.charcoal, fontFamily: 'Georgia, serif' }}>
                &ldquo;{surfacedVibe.raw}&rdquo;
              </p>
              <div className="flex flex-wrap gap-2">
                {surfacedVibe.chips.map((chip: string) => (
                  <span key={chip} className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"
                    style={{ background: ORGANIC.cream, border: `1px solid ${ORGANIC.warmLine}`, color: ORGANIC.sage }}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UGC injection toast */}
      <AnimatePresence>
        {ugcInjected && (
          <motion.div
            key="result-ugc-toast"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-50/80 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-600 backdrop-blur-sm"
          >
            Field Note Absorbed — Context Orchestration Active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signal delta banner */}
      <AnimatePresence>
        {isContextShift && previousOutput && (
          <motion.div
            key="context-shift"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex items-center gap-2 px-1 text-[9px] font-mono text-white/25"
          >
            <span className="text-white/15">↳ shifted from</span>
            <span className="text-white/40">{previousOutput.keyword}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse + reprocessing wrapper */}
      <motion.div
        animate={resultPulse ? { scale: [1, 1.012, 1] } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] bg-ink p-8 text-white shadow-2xl md:p-12">
          {/* Reprocessing overlay */}
          <AnimatePresence>
            {isReprocessing && (
              <motion.div
                key="reprocessing-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 rounded-[2.5rem] bg-black/50 backdrop-blur-[2px] flex items-center justify-center"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="h-3 w-3 rounded-full border border-white/30 border-t-white/80"
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">
                    Re-processing Signal...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-1 w-12 rounded-full" style={{ background: theme.primary }} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{theme.tagline} Output</span>
            </div>
            <h4 className="text-5xl font-bold tracking-tighter leading-tight max-w-xl">{theme.resultTitle}</h4>
            <p className="mt-8 text-2xl text-white/50 leading-relaxed font-light max-w-2xl italic">
              &ldquo;We&rsquo;ve tuned the Istanbul pulse for{' '}
              <span style={{ textDecorationLine: 'underline', textDecorationColor: theme.primary, textDecorationThickness: '1px', textUnderlineOffset: '8px', color: 'white', opacity: 1 }}>{displayKeyword}</span>
              . {displayDesc}&rdquo;
            </p>
            {generatedOutput.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {generatedOutput.tags.slice(0, 4).map((tag: string) => (
                  <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Why this section */}
            <WhyThisSection
              moduleContext={signal.moduleContext}
              urgency={rawApiMeta?.urgency}
              novelty={rawApiMeta?.novelty}
              tags={rawApiMeta?.tags ?? []}
              isOpen={whyOpen}
              onToggle={() => setWhyOpen(p => !p)}
            />
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center gap-6 border-t border-white/5 pt-10">
            <button onClick={onGo} className="group w-full md:w-auto flex items-center justify-center gap-4 rounded-full bg-white px-12 py-6 text-[13px] font-black uppercase tracking-[0.15em] text-ink transition-all hover:scale-[1.05]">
              {theme.action}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button onClick={onRestart} className="text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-white transition">Try Another Signal</button>
          </div>
        </div>
      </motion.div>

      {/* Alternatives */}
      {orderedResults.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-3 px-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Re-ranked Alternatives</p>
            {/* Reranking banner */}
            <AnimatePresence>
              {isReranking && (
                <motion.div
                  key="rerank-banner"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.18em] text-white/30"
                >
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }}>◈</motion.span>
                  <span>Contextual Re-ranking Applied</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="space-y-2">
            {orderedResults.map((alt: DecisionNode, i: number) => (
              <motion.div
                key={alt.keyword}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <span className="text-[9px] font-black font-mono text-white/20 w-4 flex-shrink-0">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white/60 truncate">{alt.keyword}</p>
                  <p className="text-[10px] text-white/25 truncate">{alt.subNode}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VectorMapFallback({ theme, generatedOutput, onRestart, reason }: any) {
  const vectorRays = React.useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radiusX = 160 + i * 22;
        const radiusY = 120 + i * 18;
        const x = 400 + Math.cos(angle) * radiusX;
        const y = 300 + Math.sin(angle) * radiusY;
        return `M ${x.toFixed(2)} ${y.toFixed(2)} L 400 300`;
      }),
    []
  );

  return (
    <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[3rem] bg-[#0A0C10] text-white border border-white/5">
      <div className="absolute inset-0 opacity-40">
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill={`radial-gradient(circle, ${theme.primary}22 0%, transparent 70%)`} />
          {vectorRays.map((path, i) => (
            <motion.path
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.15 }}
              transition={{ duration: 2, delay: i * 0.2 }}
              d={path}
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          ))}
          <motion.circle
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            cx="50%"
            cy="50%"
            r="30"
            fill={theme.primary}
          />
          <circle cx="50%" cy="50%" r="6" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 p-10 flex flex-col h-full justify-between flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Decision Vector</p>
            <h5 className="text-3xl font-bold tracking-tight">{generatedOutput.subNode}</h5>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{reason}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            ISTANBUL LIVE
          </div>
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full md:w-[400px] rounded-[2.5rem] bg-[#16181D] border border-white/10 p-8 shadow-2xl backdrop-blur-3xl"
        >
          <p className="text-lg font-medium leading-snug mb-8">
            HADE has activated the {generatedOutput.subNode} node based on your current signal.
          </p>
          <div className="flex gap-4">
            <button className="flex-[2] py-5 rounded-2xl bg-white text-ink font-black text-[11px] uppercase tracking-widest">Let's Go</button>
            <button onClick={onRestart} className="flex-1 py-5 rounded-2xl bg-white/5 font-bold text-[11px] uppercase tracking-widest text-white/40">Exit</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function resolveNodeFromDictionary(node: string) {
  const normalized = node.toLowerCase().trim();
  return ISTANBUL_NODE_COORDS[normalized] || null;
}

function TacticalMapStep({ signal, generatedOutput, onRestart, resultPulse, ugcInjected }: any) {
  const theme = MODULE_THEMES[signal.moduleContext as ModuleContext];
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "hade-google-maps",
    googleMapsApiKey,
  });
  const [center, setCenter] = useState(ISTANBUL_CENTER);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);

  useEffect(() => {
    if (!generatedOutput?.subNode) {
      setCenter(ISTANBUL_CENTER);
      return;
    }

    const knownPoint = resolveNodeFromDictionary(generatedOutput.subNode);
    if (knownPoint) {
      setCenter(knownPoint);
      return;
    }

    if (!isLoaded || !(window as any).google?.maps?.Geocoder) {
      setCenter(ISTANBUL_CENTER);
      return;
    }

    let cancelled = false;
    setIsResolvingLocation(true);

    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode(
      { address: `${generatedOutput.subNode}, Istanbul, Turkey` },
      (results: any, status: string) => {
        if (cancelled) return;
        setIsResolvingLocation(false);

        if (status === "OK" && results?.[0]?.geometry?.location) {
          const point = results[0].geometry.location;
          const nextCenter = { lat: point.lat(), lng: point.lng() };
          setCenter(nextCenter);
          return;
        }

        setCenter(ISTANBUL_CENTER);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [generatedOutput?.subNode, isLoaded]);

  useEffect(() => {
    if (!mapInstance || !center) return;
    mapInstance.panTo(center);
  }, [center, mapInstance]);

  // Build map content — single return path enables consistent toast + pulse wrapper
  let mapContent: React.ReactNode;

  if (!googleMapsApiKey) {
    mapContent = (
      <VectorMapFallback
        theme={theme}
        generatedOutput={generatedOutput}
        onRestart={onRestart}
        reason="Google Maps key missing. Using vector fallback."
      />
    );
  } else if (loadError) {
    mapContent = (
      <VectorMapFallback
        theme={theme}
        generatedOutput={generatedOutput}
        onRestart={onRestart}
        reason="Google Maps load failed. Using vector fallback."
      />
    );
  } else if (!isLoaded) {
    mapContent = (
      <VectorMapFallback
        theme={theme}
        generatedOutput={generatedOutput}
        onRestart={onRestart}
        reason="Loading map layer..."
      />
    );
  } else {
    mapContent = (
      <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[3rem] bg-[#0A0C10] text-white border border-white/5">
        <div className="absolute inset-0">
          <GoogleMap
            mapContainerClassName="h-full w-full"
            zoom={13.5}
            center={center}
            onLoad={(map) => setMapInstance(map)}
            options={{
              disableDefaultUI: true,
              clickableIcons: false,
              gestureHandling: "greedy",
              minZoom: 11,
              maxZoom: 16,
              styles: GOOGLE_MAP_DARK_STYLE as any,
              backgroundColor: "#0A0C10",
            }}
          >
            <OverlayView position={center} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
                  transition={{ repeat: Infinity, duration: 1.9, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: `${theme.primary}55` }}
                />
                <div
                  className="relative rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] shadow-xl"
                  style={{
                    borderColor: `${theme.primary}88`,
                    color: "white",
                    background: "rgba(10,12,16,0.88)",
                    boxShadow: `0 12px 32px ${theme.primary}44`,
                  }}
                >
                  {generatedOutput.subNode}
                </div>
              </motion.div>
            </OverlayView>
          </GoogleMap>
        </div>

        <div className="relative z-10 p-10 flex flex-col h-full justify-between flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Decision Vector</p>
              <h5 className="text-3xl font-bold tracking-tight">{generatedOutput.subNode}</h5>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                {isResolvingLocation ? "Resolving neighborhood..." : "Google Maps Synced"}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400">ISTANBUL LIVE</div>
          </div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-10 right-10 w-[320px] rounded-[2rem] bg-[#16181D]/90 border border-white/10 p-6 shadow-2xl backdrop-blur-2xl"
          >
            <p className="text-lg font-medium leading-snug mb-4">
              HADE has activated the {generatedOutput.subNode} node based on your current signal.
            </p>
            <div className="flex gap-3">
              <button className="flex-[2] py-3 rounded-2xl bg-white text-ink font-black text-[11px] uppercase tracking-widest">Let's Go</button>
              <button onClick={onRestart} className="flex-1 py-3 rounded-2xl bg-white/5 font-bold text-[11px] uppercase tracking-widest text-white/40">Exit</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* UGC injection toast */}
      <AnimatePresence>
        {ugcInjected && (
          <motion.div
            key="map-ugc-toast"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-50/80 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-emerald-600 backdrop-blur-sm"
          >
            Field Note Absorbed — Context Orchestration Active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse wrapper */}
      <motion.div
        animate={resultPulse ? { scale: [1, 1.012, 1] } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {mapContent}
      </motion.div>
    </div>
  );
}

/* --- 4. Vibe Creator Sub-Components --- */

function DocumentingAnimation({ rawText, chips }: { rawText: string; chips: readonly string[] }) {
  return (
    <div className="py-2">
      {/* Raw text fades out with scan line */}
      <div
        className="relative mb-6 overflow-hidden rounded-2xl px-5 py-4"
        style={{ background: ORGANIC.cream, border: `1px solid ${ORGANIC.warmLine}` }}
      >
        <motion.p
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.18 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-sm italic leading-relaxed"
          style={{ color: ORGANIC.charcoal, fontFamily: 'Georgia, serif' }}
        >
          {rawText}
        </motion.p>
        <motion.div
          className="absolute inset-0"
          style={{ background: `linear-gradient(90deg, transparent, ${ORGANIC.sage}44, transparent)` }}
          initial={{ x: "-100%" }}
          animate={{ x: "110%" }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
      </div>

      {/* Scan progress bar */}
      <div className="relative mb-5 h-px w-full overflow-hidden rounded-full" style={{ background: ORGANIC.warmLine }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: ORGANIC.sage }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </div>

      {/* Chips pop in */}
      <p className="mb-3 text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: ORGANIC.sage }}>
        Signals Detected
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, scale: 0.82, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.18, duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]"
            style={{ background: ORGANIC.warmWhite, border: `1px solid ${ORGANIC.warmLine}`, color: ORGANIC.charcoal }}
          >
            {chip}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function ConfirmedState({ chips, onClose }: { chips: readonly string[]; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <motion.div
        animate={{ scale: [1, 1.14, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        <Sparkles size={34} style={{ color: ORGANIC.sage }} />
      </motion.div>

      <p
        className="text-lg font-normal leading-snug"
        style={{ color: ORGANIC.charcoal, fontFamily: 'Georgia, serif', maxWidth: 260 }}
      >
        Vibe synchronized to the Discovery Stack.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em]"
            style={{ background: ORGANIC.cream, border: `1px solid ${ORGANIC.warmLine}`, color: ORGANIC.sage }}
          >
            {chip}
          </span>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-1 rounded-full px-8 py-4 text-[11px] font-black uppercase tracking-[0.18em]"
        style={{ background: ORGANIC.charcoal, color: ORGANIC.warmWhite }}
      >
        Done
      </button>
    </div>
  );
}

interface VibeCreationOverlayProps {
  vibeMode: VibeMode;
  activeTab: "voice" | "text";
  setActiveTab: (t: "voice" | "text") => void;
  rawText: string;
  setRawText: (v: string) => void;
  onCapture: () => void;
  onClose: () => void;
}

function VibeCreationOverlay({
  vibeMode,
  activeTab,
  setActiveTab,
  rawText,
  setRawText,
  onCapture,
  onClose,
}: VibeCreationOverlayProps) {
  const chips = VIBE_CHIPS_DEFAULT;
  const isVisible = vibeMode !== "idle";
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted || !document.body) return null;
  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Scrim */}
          <motion.div
            key="vibe-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(44,44,44,0.68)",
              backdropFilter: "blur(10px)",
              pointerEvents: vibeMode === "confirmed" ? "none" : "auto",
            }}
            onClick={vibeMode === "sense" ? onClose : undefined}
          />

          {/* Card panel */}
          <motion.div
            key="vibe-panel"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-5 py-6"
            style={{ pointerEvents: vibeMode === "confirmed" ? "none" : "auto" }}
          >
            <div
              className="relative w-full max-w-sm rounded-[2.5rem] p-6 max-h-[90vh] overflow-y-auto"
              style={{ background: ORGANIC.warmWhite, border: `1px solid ${ORGANIC.warmLine}`, boxShadow: "0 24px 64px rgba(44,44,44,0.18)" }}
            >
              {/* Close */}
              {vibeMode === "sense" && (
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-60"
                  style={{ background: ORGANIC.warmLine }}
                >
                  <X size={13} style={{ color: ORGANIC.charcoal }} />
                </button>
              )}

              {/* Header */}
              <div className="mb-6 pr-10">
                <p className="text-[9px] font-black uppercase tracking-[0.24em]" style={{ color: ORGANIC.sage }}>
                  {vibeMode === "sense" ? "Sense Mode" : vibeMode === "documenting" ? "Orchestrating" : "Synchronized"}
                </p>
                <h3
                  className="mt-1 text-2xl font-normal tracking-wide"
                  style={{ color: ORGANIC.charcoal, fontFamily: 'Georgia, serif' }}
                >
                  {vibeMode === "sense" ? "Create a Vibe" : vibeMode === "documenting" ? "Parsing Signal" : "Vibe Captured"}
                </h3>
              </div>

              {/* Body — switches between sense / documenting / confirmed */}
                {vibeMode === "sense" && (
                    <div>
                    {/* Tab selector */}
                    <div
                      className="mb-7 flex rounded-2xl p-1"
                      style={{ background: ORGANIC.cream, border: `1px solid ${ORGANIC.warmLine}` }}
                    >
                      {(["voice", "text"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className="relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-all"
                          style={{ color: activeTab === tab ? ORGANIC.charcoal : ORGANIC.sage }}
                        >
                          {activeTab === tab && (
                            <motion.div
                              layoutId="vibe-tab"
                              className="absolute inset-0 rounded-xl"
                              style={{ background: ORGANIC.warmWhite, boxShadow: "0 2px 8px rgba(44,44,44,0.08)" }}
                              transition={{ type: "spring", stiffness: 400, damping: 32 }}
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            {tab === "voice" ? <Mic size={12} /> : <FileText size={12} />}
                            {tab === "voice" ? "Voice" : "Text"}
                          </span>
                        </button>
                      ))}
                    </div>

                    {activeTab === "voice" && (
                      <SenseVoiceInput
                        value={rawText}
                        onChange={setRawText}
                        placeholder="A moody rainy night in Tokyo..."
                        silenceDelayMs={2600}
                      />
                    )}

                    {/* Text tab */}
                    {activeTab === "text" && (
                      <div>
                        <textarea
                          value={rawText}
                          onChange={(e) => setRawText(e.target.value)}
                          rows={4}
                          placeholder="What do you want to share...?"
                          className="w-full resize-none rounded-2xl px-5 py-4 text-base outline-none"
                          style={{
                            background: ORGANIC.cream,
                            border: `1px solid ${ORGANIC.warmLine}`,
                            color: ORGANIC.charcoal,
                            fontFamily: 'Georgia, serif',
                            fontStyle: "italic",
                            lineHeight: 1.65,
                          }}
                        />
                        <p className="mt-2 text-right text-[9px]" style={{ color: ORGANIC.sage, opacity: 0.6 }}>
                          {rawText.length} characters
                        </p>
                      </div>
                    )}

                    {/* Capture CTA */}
                    <button
                      onClick={onCapture}
                      className="mt-6 w-full rounded-full py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-90 hover:scale-[1.01]"
                      style={{ background: ORGANIC.charcoal, color: ORGANIC.warmWhite }}
                    >
                      Capture Signal
                    </button>
                  </div>
                )}

                {vibeMode === "documenting" && (
                  <DocumentingAnimation rawText={rawText} chips={chips} />
                )}

                {vibeMode === "confirmed" && (
                  <ConfirmedState chips={chips} onClose={onClose} />
                )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* --- 5. UGC Sub-Components --- */

function UGCBottomSheet({ open, onClose, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (signal: string) => void;
}) {
  const [mounted, setMounted]           = React.useState(false);
  const [inputText, setInputText]       = React.useState("");
  const [photoAttached, setPhotoAttached] = React.useState(false);
  const [submitted, setSubmitted]       = React.useState(false);
  const [isMacPlatform, setIsMacPlatform] = React.useState(false);
  const textareaRef                     = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => {
    setIsMacPlatform(typeof navigator !== "undefined" && navigator.platform.includes("Mac"));
  }, []);

  /* Auto-focus textarea when sheet opens; reset state when it closes */
  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 380);
      return () => clearTimeout(t);
    } else {
      /* Delay reset until exit animation finishes */
      const t = setTimeout(() => {
        setInputText("");
        setPhotoAttached(false);
        setSubmitted(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  /* Auto-resize textarea */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 144) + "px";
  };

  const canSend = inputText.trim().length > 0 || photoAttached;

  const handleSend = () => {
    if (!canSend) return;
    const parts = [
      photoAttached ? "photo signal captured" : "",
      inputText.trim(),
    ].filter(Boolean);
    onSubmit(parts.join(" — "));
    setSubmitted(true);
    setTimeout(() => onClose(), 1400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted || !document.body) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            key="ugc-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            key="ugc-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[2.25rem] border-t border-white/50 bg-white/92 shadow-2xl backdrop-blur-3xl"
          >
            {/* Drag handle */}
            <div className="mx-auto mt-3.5 h-[3px] w-9 rounded-full bg-ink/15" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-3 pt-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.26em] text-ink/30">
                  Capture Context
                </p>
                <h2
                  className="mt-0.5 text-[1.25rem] font-normal tracking-tight text-ink"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Field Notes
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/[0.06] transition hover:bg-ink/[0.12]"
              >
                <X size={13} className="text-ink/45" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-ink/[0.07]" />

            {/* Body */}
            <div className="px-5 pb-8 pt-5">
              <AnimatePresence mode="wait">

                {/* ── Submitted confirmation ── */}
                {submitted ? (
                  <motion.div
                    key="ugc-confirmed"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.26 }}
                    className="flex flex-col items-center gap-3 py-9"
                  >
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.05 }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10"
                    >
                      <Sparkles size={20} className="text-emerald-500" />
                    </motion.div>
                    <p
                      className="text-base font-normal text-ink"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Signal Absorbed
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-ink/28">
                      Context Orchestration Active
                    </p>
                  </motion.div>

                ) : (

                  /* ── Input state ── */
                  <motion.div
                    key="ugc-input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >

                    {/* Photo attachment pill */}
                    <AnimatePresence>
                      {photoAttached && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="mb-3"
                        >
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-ink/[0.05] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-ink/55">
                            <Camera size={10} className="text-ink/40" />
                            Photo Attached
                            <button
                              onClick={() => setPhotoAttached(false)}
                              className="ml-0.5 text-ink/30 transition hover:text-ink/70"
                            >
                              <X size={9} />
                            </button>
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Input card — ChatGPT / Claude style ── */}
                    <div className="rounded-[1.6rem] border border-ink/[0.09] bg-white/75 px-4 pb-2.5 pt-4 shadow-sm backdrop-blur-md">

                      {/* Textarea */}
                      <textarea
                        ref={textareaRef}
                        value={inputText}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        rows={2}
                        placeholder="Describe the vibe, a context signal, or what you are searching for..."
                        className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink/28"
                        style={{ minHeight: "54px", maxHeight: "144px" }}
                      />

                      {/* Bottom action row */}
                      <div className="flex items-center justify-between pt-1 pb-0.5">

                        {/* Secondary — camera + mic */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => setPhotoAttached((v) => !v)}
                            title="Attach photo"
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition
                              ${photoAttached
                                ? "bg-ink/[0.08] text-ink/70"
                                : "text-ink/32 hover:bg-ink/[0.05] hover:text-ink/55"
                              }`}
                          >
                            <Camera size={15} />
                          </button>
                          <button
                            title="Voice input"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/32 transition hover:bg-ink/[0.05] hover:text-ink/55"
                          >
                            <Mic size={15} />
                          </button>
                        </div>

                        {/* Send button — springs in when input exists */}
                        <AnimatePresence>
                          {canSend && (
                            <motion.button
                              key="ugc-send"
                              initial={{ scale: 0.4, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.4, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 460, damping: 22 }}
                              onClick={handleSend}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-ink shadow-sm transition-colors hover:bg-ink/80"
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 10.5V1.5M6 1.5L2 5.5M6 1.5L10 5.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Hint */}
                    <p className="mt-3 text-center text-[8.5px] font-bold uppercase tracking-[0.2em] text-ink/18">
                      {isMacPlatform ? "⌘ Return to send" : "Ctrl + Return to send"}
                      {" · "}Context Orchestration
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* --- 5. Main Controller --- */

export default function HadeEngineSystemsDiagram({ accent }: HadeEngineProps) {
  const [step, setStep] = useState<StepId>("input");
  const [signal, setSignal] = useState<SignalState>(DEFAULT_SIGNAL);
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedOutput>(DEFAULT_OUTPUT);
  const [timerDone, setTimerDone] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const exploreStartRef = useRef<number>(0);
  const mainInputRef = useRef<HTMLTextAreaElement | null>(null);
  const previousVibeModeRef = useRef<VibeMode>("idle");

  // Neural Backbone sheet
  const [backboneSheetOpen, setBackboneSheetOpen] = useState(false);

  // UGC Field Notes state
  const [ugcSheetOpen, setUgcSheetOpen] = useState(false);
  const [ugcSignal, setUgcSignal]       = useState("");   // stored separately — never written to the textarea
  const [ugcInjected, setUgcInjected]   = useState(false);
  const [resultPulse, setResultPulse]   = useState(false);

  // Vibe Creator state — fully isolated from step machine
  const [vibeMode, setVibeMode] = useState<VibeMode>("idle");
  const [vibeRaw, setVibeRaw] = useState(SAMPLE_VIBE_TEXT);
  const [vibeActiveTab, setVibeActiveTab] = useState<"voice" | "text">("voice");
  const [storedVibes, setStoredVibes] = useState<StoredVibe[]>([]);

  // Phase 2: Signal intelligence
  const [generatedAlternatives, setGeneratedAlternatives] = useState<DecisionNode[]>([]);
  const [rawApiMeta, setRawApiMeta] = useState<{ urgency?: "high" | "medium" | "low"; novelty?: number; tags: string[] }>({ tags: [] });
  const [previousOutput, setPreviousOutput] = useState<GeneratedOutput | null>(null);
  const [isContextShift, setIsContextShift] = useState(false);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>("idle");
  const autoTriggerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleExploreRef = useRef<() => void>(() => {});

  // Phase 3: Persistent context
  const [storedContext, setStoredContext] = useState<HadeStoredContext>(EMPTY_CONTEXT);
  const [contextGrowing, setContextGrowing] = useState(false);
  const contextGrowingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Phase 4: Continuous intelligence
  const [rankOrder, setRankOrder] = useState<number[]>([0, 1, 2]);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [isReranking, setIsReranking] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());
  const rerankBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const theme = MODULE_THEMES[signal.moduleContext as ModuleContext];

  // Phase 3: SSR-safe context hydration
  useEffect(() => { setStoredContext(loadContext()); }, []);

  // Phase 3: Context growth pulse
  const triggerContextGrowth = useCallback(() => {
    setContextGrowing(true);
    if (contextGrowingTimerRef.current) clearTimeout(contextGrowingTimerRef.current);
    contextGrowingTimerRef.current = setTimeout(() => setContextGrowing(false), 2000);
  }, []);

  const handleTimerComplete = useCallback(() => {
    // Only mark timer complete if we're still processing.
    // Llama can resolve so quickly that the UI may already be on "result".
    if (step === "processing") {
      setTimerDone(true);
    }
  }, [step]);

  // UGC Context Injection — stores field note separately, never touches the visible textarea
  const handleUGCSubmit = useCallback((newSignal: string) => {
    setUgcSignal((prev) => prev.trim() ? `${prev} — ${newSignal}` : newSignal);
    setUgcInjected(true);

    if (step === "result" || step === "mapping") {
      setResultPulse(true);
      setTimeout(() => setResultPulse(false), 900);
    }

    // Phase 3: Persist field note to localStorage context
    const newNote: FieldNote = { id: `note-${Date.now()}`, text: newSignal, timestamp: Date.now() };
    setStoredContext((prev) => {
      const updated = { ...prev, fieldNotes: [newNote, ...prev.fieldNotes] };
      saveContext(updated);
      return updated;
    });
    triggerContextGrowth();
  }, [step, triggerContextGrowth]);

  // Vibe Creator handler — isolated from all Discovery step-machine state
  const handleVibeCapture = useCallback(() => {
    const capturedVibe = vibeRaw.trim();

    if (!capturedVibe) return;

    setVibeMode("documenting");

    const newVibe: StoredVibe = {
      id: `vibe-${Date.now()}`,
      raw: capturedVibe,
      chips: [...VIBE_CHIPS_DEFAULT],
      timestamp: Date.now(),
    };
    setStoredVibes((prev) => [newVibe, ...prev]);

    // Phase 3: Persist vibe to localStorage context
    setStoredContext((prev) => {
      const updated = { ...prev, vibes: [newVibe, ...prev.vibes] };
      saveContext(updated);
      return updated;
    });
    triggerContextGrowth();

    setTimeout(() => {
      setVibeMode("confirmed");
      setIsLoading(false);

      // Return to idle after a short confirmation beat.
      setTimeout(() => {
        setVibeMode("idle");
      }, 900);
    }, 1900);
  }, [vibeRaw, triggerContextGrowth]);

  // Gate: when data is ready, Llama exits immediately; Gemini waits for timer pulse.
  // Claude uses its own setTimeout path in handleExplore and is excluded here.
  useEffect(() => {
    if (step === "processing" && dataReady) {
      if (signal.llmChoice === "llama") {
        setStep("result");
      } else if (signal.llmChoice !== "claude" && timerDone) {
        setStep("result");
      }
    }
  }, [step, dataReady, timerDone, signal.llmChoice]);

  // Release interaction lock only after result transition is initiated.
  useEffect(() => {
    if (step === "result") {
      setIsLoading(false);
    }
  }, [step]);

  // Phase 2: Auto-trigger — fires 800ms after typing stops (input OR result step)
  useEffect(() => {
    if ((step !== "input" && step !== "result") || isLoading || isReprocessing) {
      if (step !== "input" && step !== "result") setEngineStatus("idle");
      return;
    }
    const trimmed = signal.combinedSignal.trim();
    if (trimmed.length < 8) {
      setEngineStatus("idle");
      if (autoTriggerRef.current) clearTimeout(autoTriggerRef.current);
      return;
    }
    // Only auto-trigger from input step; result step uses the SignalRefinementBar
    if (step === "input") {
      setEngineStatus("listening");
      if (autoTriggerRef.current) clearTimeout(autoTriggerRef.current);
      autoTriggerRef.current = setTimeout(() => {
        setEngineStatus("understanding");
        handleExploreRef.current();
      }, 800);
    }
    return () => { if (autoTriggerRef.current) clearTimeout(autoTriggerRef.current); };
  }, [signal.combinedSignal, signal.moduleContext, step, isLoading, isReprocessing]);

  // Phase 4: Activity tracker — keeps lastActivityRef updated
  useEffect(() => {
    const update = () => { lastActivityRef.current = Date.now(); };
    window.addEventListener("mousemove", update);
    window.addEventListener("keydown", update);
    window.addEventListener("touchstart", update);
    return () => {
      window.removeEventListener("mousemove", update);
      window.removeEventListener("keydown", update);
      window.removeEventListener("touchstart", update);
    };
  }, []);

  // Phase 4: Background re-ranker — swaps top-2 alternatives after 8s inactivity
  useEffect(() => {
    if (step !== "result" || generatedAlternatives.length < 2) return;
    const id = setInterval(() => {
      const inactive = Date.now() - lastActivityRef.current > 8000;
      if (!inactive) return;
      setRankOrder((prev) => {
        const next = [...prev];
        [next[0], next[1]] = [next[1], next[0]];
        return next;
      });
      setIsReranking(true);
      triggerContextGrowth();
      if (rerankBannerTimerRef.current) clearTimeout(rerankBannerTimerRef.current);
      rerankBannerTimerRef.current = setTimeout(() => setIsReranking(false), 2500);
    }, 12500);
    return () => clearInterval(id);
  }, [step, generatedAlternatives.length, triggerContextGrowth]);

  // Focus restoration after the modal closes.
  useEffect(() => {
    const previous = previousVibeModeRef.current;
    previousVibeModeRef.current = vibeMode;
    if (vibeMode !== "idle" || previous === "idle") return;

    const focusTimer = window.setTimeout(() => {
      mainInputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(focusTimer);
  }, [vibeMode]);

  const openVibeCreator = useCallback(() => {
    // Strict silo: modal state is initialized independently from main input state.
    setVibeRaw(SAMPLE_VIBE_TEXT);
    setVibeActiveTab("voice");
    setVibeMode("sense");
  }, []);

  const closeVibeCreator = useCallback(() => {
    setVibeMode("idle");
    setIsLoading(false);
    setVibeRaw(SAMPLE_VIBE_TEXT);
  }, []);

  const isValidDecisionNode = (value: unknown): value is DecisionNode => {
    if (!value || typeof value !== "object") return false;
    const node = value as Record<string, unknown>;
    return (
      typeof node.keyword === "string" &&
      typeof node.description === "string" &&
      typeof node.subNode === "string" &&
      node.keyword.trim().length > 0 &&
      node.description.trim().length > 0 &&
      node.subNode.trim().length > 0
    );
  };

  const buildClientFallback = (moduleContext: ModuleContext, inputSignal: string): GeneratedOutput => ({
    keyword: extractHighSignalWord(inputSignal),
    description: MODULE_THEMES[moduleContext].baseDesc,
    subNode: "Karaköy",
    tags: ["fallback", "local-context", "safe-render"],
  });

  const mapApiResponseToOutput = (response: unknown, moduleContext: ModuleContext, inputSignal: string): GeneratedOutput => {
    const typed = response as HadeApiResponse & Partial<DecisionNode>;

    // Direct check: response has a .primary object (standard shape)
    const node: DecisionNode | null = isValidDecisionNode(typed?.primary)
      ? typed.primary!
      // Flattened check: response itself carries keyword/description/subNode at root
      : isValidDecisionNode(typed)
        ? (typed as unknown as DecisionNode)
        : null;

    if (!node) {
      return buildClientFallback(moduleContext, inputSignal);
    }

    const tags = Array.isArray(typed.tags)
      ? typed.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0).slice(0, 4)
      : [];

    return {
      keyword: node.keyword?.trim() || DEFAULT_OUTPUT.keyword,
      description: node.description?.trim() || DEFAULT_OUTPUT.description,
      subNode: node.subNode?.trim() || DEFAULT_OUTPUT.subNode,
      tags: tags.length > 0 ? tags : ["adaptive", "generated"],
    };
  };

  const handleExplore = async () => {
    // Interaction guard: prevent overlapping requests/transitions.
    if (isLoading || isReprocessing) return;

    const inResultMode = step === "result";

    // Phase 4: In-result reprocessing — update in-place, skip timing gates
    if (inResultMode) {
      setIsReprocessing(true);
      try {
        const combinedForRequest = [signal.combinedSignal, ugcSignal]
          .map((s) => s.trim())
          .filter(Boolean)
          .join(" — ");
        const contextSummary = buildContextSummary(storedContext);
        const enrichedSignal = contextSummary ? `${combinedForRequest} [ctx: ${contextSummary}]` : combinedForRequest;
        const requestPayload = {
          signal: enrichedSignal,
          module: signal.moduleContext,
          location: signal.location,
          llmChoice: signal.llmChoice,
        };
        const res = await fetch("/api/generate-hade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        });
        const rawData: unknown = await res.json().catch(() => null);
        if (!res.ok) throw new Error(`API error (${res.status})`);

        const typedRaw = rawData as HadeApiResponse | null;
        const parsedCardData = mapApiResponseToOutput(rawData, signal.moduleContext, signal.combinedSignal);
        const rawAlternatives = Array.isArray(typedRaw?.alternatives) ? typedRaw!.alternatives : [];

        setGeneratedOutput(parsedCardData);
        setGeneratedAlternatives(rawAlternatives);
        setRawApiMeta({
          urgency: typedRaw?.urgency,
          novelty: typeof typedRaw?.novelty === "number" ? typedRaw.novelty : undefined,
          tags: Array.isArray(typedRaw?.tags) ? typedRaw!.tags : [],
        });
        setRankOrder([0, 1, 2]);
        setEngineStatus("adapting");
        setTimeout(() => setEngineStatus("idle"), 1200);

        // Save interaction record
        const newInteraction: InteractionRecord = {
          id: `interaction-${Date.now()}`,
          keyword: parsedCardData.keyword,
          subNode: parsedCardData.subNode,
          module: signal.moduleContext,
          novelty: typeof typedRaw?.novelty === "number" ? typedRaw.novelty : undefined,
          timestamp: Date.now(),
        };
        setStoredContext((prev) => {
          const updated = { ...prev, interactionHistory: [newInteraction, ...prev.interactionHistory] };
          saveContext(updated);
          return updated;
        });
        triggerContextGrowth();
      } catch (error) {
        console.error("[HADE Demo] Re-processing failed", error);
      } finally {
        setIsReprocessing(false);
      }
      return;
    }

    // Standard mode: full step-machine flow
    setApiError(null);
    exploreStartRef.current = Date.now();
    setTimerDone(false);
    setDataReady(false);
    setIsLoading(true);
    setStep("processing");

    try {
      const combinedForRequest = [signal.combinedSignal, ugcSignal]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" — ");

      // Phase 3: Enrich signal with stored context summary
      const contextSummary = buildContextSummary(storedContext);
      const enrichedSignal = contextSummary ? `${combinedForRequest} [ctx: ${contextSummary}]` : combinedForRequest;

      const requestPayload = {
        signal: enrichedSignal,
        module: signal.moduleContext,
        location: signal.location,
        llmChoice: signal.llmChoice,
      };
      console.log("[HADE Demo] Request payload", requestPayload);

      const res = await fetch("/api/generate-hade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      const rawData: unknown = await res.json().catch(() => null);
      console.log("[HADE Demo] Raw API response", rawData);

      if (!res.ok) {
        throw new Error(`API error (${res.status})`);
      }

      const typedRaw = rawData as HadeApiResponse | null;
      const parsedCardData = mapApiResponseToOutput(rawData, signal.moduleContext, signal.combinedSignal);

      // Phase 2: Capture alternatives + meta from raw response
      const rawAlternatives = Array.isArray(typedRaw?.alternatives) ? typedRaw!.alternatives : [];
      setGeneratedAlternatives(rawAlternatives);
      setRawApiMeta({
        urgency: typedRaw?.urgency,
        novelty: typeof typedRaw?.novelty === "number" ? typedRaw.novelty : undefined,
        tags: Array.isArray(typedRaw?.tags) ? typedRaw!.tags : [],
      });
      if (previousOutput) {
        setIsContextShift(previousOutput.keyword !== parsedCardData.keyword);
      }
      setPreviousOutput(parsedCardData);
      setRankOrder([0, 1, 2]); // Reset rank for fresh results

      console.log("FINAL MAPPED DATA:", parsedCardData);
      setGeneratedOutput(parsedCardData);
      setDataReady(true); // Only set on success — prevents stale timer-gate transitions on error.

      // Phase 3: Save interaction record (use typedRaw directly — rawApiMeta is batched/stale here)
      const newInteraction: InteractionRecord = {
        id: `interaction-${Date.now()}`,
        keyword: parsedCardData.keyword,
        subNode: parsedCardData.subNode,
        module: signal.moduleContext,
        novelty: typeof typedRaw?.novelty === "number" ? typedRaw.novelty : undefined,
        timestamp: Date.now(),
      };
      setStoredContext((prev) => {
        const updated = { ...prev, interactionHistory: [newInteraction, ...prev.interactionHistory] };
        saveContext(updated);
        return updated;
      });
      triggerContextGrowth();

      // Llama fast-path: bypass timer gate immediately once data is available.
      if (signal.llmChoice === "llama") {
        setStep("result");
        setTimerDone(true);
        setIsLoading(false);
      } else if (signal.llmChoice === "claude") {
        // Claude medium-path: ensure at least 1800ms display, then add 150ms safety gap.
        const elapsed = Date.now() - exploreStartRef.current;
        const delay = Math.max(0, 1800 - elapsed) + 150;
        setTimeout(() => {
          setStep("result");
          setTimerDone(true);
          setIsLoading(false);
        }, delay);
      }
      // Gemini: useEffect gate handles transition via dataReady + timerDone — no action here.
    } catch (error) {
      console.error("[HADE Demo] Failed to generate decision", error);
      // Return to input — do NOT advance to result with stale/fallback data.
      // setDataReady intentionally stays false: prevents the timer-gate useEffect from firing.
      setStep("input");
      setIsLoading(false);
      setApiError("The HADE engine couldn't reach the API. Please try again.");
    }
  };

  // Phase 2: Keep handleExploreRef current every render so setTimeout closures are never stale
  // Must be after handleExplore to avoid TypeScript use-before-declaration
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { handleExploreRef.current = handleExplore; });

  const restart = () => {
    setStep("input");
    setSignal(DEFAULT_SIGNAL);
    setGeneratedOutput(DEFAULT_OUTPUT);
    setTimerDone(false);
    setDataReady(false);
    setIsLoading(false);
    setApiError(null);
    setUgcSignal("");
    setUgcInjected(false);
    setResultPulse(false);
    setVibeMode("idle");
    // Phase 2+4 resets
    setGeneratedAlternatives([]);
    setRawApiMeta({ tags: [] });
    setPreviousOutput(null);
    setIsContextShift(false);
    setEngineStatus("idle");
    setRankOrder([0, 1, 2]);
    setIsReprocessing(false);
    setIsReranking(false);
    if (rerankBannerTimerRef.current) clearTimeout(rerankBannerTimerRef.current);
    if (autoTriggerRef.current) clearTimeout(autoTriggerRef.current);
    // storedVibes + storedContext intentionally preserved — context persists across restarts
  };

  const safeOutput =
    generatedOutput.keyword && generatedOutput.description && generatedOutput.subNode
      ? generatedOutput
      : DEFAULT_OUTPUT;

  const themeColor = accent || "#10B981"; // Fallback to a default if not provided

  // Derived — no extra state. Recalculates whenever search text or stored vibes change.
  const surfacedVibe = surfaceUGCContext(signal.combinedSignal, storedVibes);

  return (
    <section className="w-full py-12 px-6 md:px-0 mx-auto max-w-7xl">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-ink/5 bg-ink/[0.02] px-6 py-2 mb-6">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: theme.primary }} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Spontaneity Engine v4.2</p>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">HADE Orchestration</h2>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-ink/20 italic">
        Interface Prototype • Production Environment in Development
      </p>
      </div>

      <AnimatePresence>
        {apiError && step === "input" && (
          <motion.div
            key="api-error-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mb-4 rounded-2xl border border-red-200/60 bg-red-50/80 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-red-500 backdrop-blur-sm"
          >
            ⚠ Engine Offline — {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: Signal refinement bar — visible when result is showing */}
      <AnimatePresence>
        {step === "result" && (
          <SignalRefinementBar
            signal={signal.combinedSignal}
            onSignalChange={(v) => setSignal((prev: SignalState) => ({ ...prev, combinedSignal: v }))}
            engineStatus={engineStatus}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}>
          {step === "input" && (
            <UnifiedInputStep
              signal={signal}
              setSignal={setSignal}
              onNext={handleExplore}
              isLoading={isLoading}
              engineStatus={engineStatus}
              onCaptureContext={() => setUgcSheetOpen(true)}
              onCreateVibe={openVibeCreator}
              onOpenBackbone={() => setBackboneSheetOpen(true)}
              surfacedVibe={surfacedVibe}
              mainInputRef={mainInputRef}
            />
          )}
          {step === "processing" && (
            <ProcessingStep
              key={`processing-${signal.llmChoice}`}
              signal={signal}
              onComplete={handleTimerComplete}
              duration={signal.llmChoice === "llama" ? 0 : signal.llmChoice === "claude" ? 1800 : 3200}
            />
          )}
          {step === "result" && (
            <ResultStep
              signal={signal}
              generatedOutput={safeOutput}
              onRestart={restart}
              onGo={() => setStep("mapping")}
              resultPulse={resultPulse}
              ugcInjected={ugcInjected}
              surfacedVibe={surfacedVibe}
              generatedAlternatives={generatedAlternatives}
              rawApiMeta={rawApiMeta}
              isContextShift={isContextShift}
              previousOutput={previousOutput}
              rankOrder={rankOrder}
              isReprocessing={isReprocessing}
              isReranking={isReranking}
            />
          )}
          {step === "mapping" && <TacticalMapStep signal={signal} generatedOutput={safeOutput} onRestart={restart} resultPulse={resultPulse} ugcInjected={ugcInjected} />}
        </motion.div>
      </AnimatePresence>

      {/* Phase 2+3: Passive signals + context model — dark container for visual continuity with result card */}
      <AnimatePresence>
        {step === "result" && (
          <motion.div
            key="intelligence-panels"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 rounded-[2.5rem] bg-ink px-8 py-8 text-white"
          >
            <PassiveSignalsPanel isActive={step === "result"} />
            <ContextModelPanel storedContext={storedContext} isGrowing={contextGrowing} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vibe Creator overlay — isolated Vibe state machine, never touches StepId */}
      <VibeCreationOverlay
        vibeMode={vibeMode}
        activeTab={vibeActiveTab}
        setActiveTab={setVibeActiveTab}
        rawText={vibeRaw}
        setRawText={setVibeRaw}
        onCapture={handleVibeCapture}
        onClose={closeVibeCreator}
      />

      <UGCBottomSheet
        open={ugcSheetOpen}
        onClose={() => setUgcSheetOpen(false)}
        onSubmit={handleUGCSubmit}
      />

      <NeuralBackboneSheet
        open={backboneSheetOpen}
        onClose={() => setBackboneSheetOpen(false)}
        llmChoice={signal.llmChoice}
        onSelect={(id) => setSignal((p: SignalState) => ({ ...p, llmChoice: id }))}
      />

      <div className="mt-12 flex justify-center gap-3">
        {(["input", "processing", "result", "mapping"] as StepId[]).map((s) => (
          <div key={s} className={`h-1.5 rounded-full transition-all duration-700 ${step === s ? 'w-12' : 'w-3 bg-ink/10'}`} style={{ backgroundColor: step === s ? theme.primary : undefined }} />
        ))}
      </div>
    </section>
  );
}
