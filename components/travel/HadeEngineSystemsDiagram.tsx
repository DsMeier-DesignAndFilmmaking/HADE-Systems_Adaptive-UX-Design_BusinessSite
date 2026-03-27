"use client";

import React, { useState, useEffect, useCallback, useRef, startTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";


/* --- 1. Enhanced HADE Types & Theme --- */
type StepId = "input" | "processing" | "result" | "mapping";
type LlmChoice = "gemini" | "llama" | "mock";

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
    action: "See the Spot"
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
  { id: "llama", label: "Llama", detail: "Open Strategy Layer" },
  { id: "mock", label: "Mock", detail: "Deterministic Fallback" },
];

/* --- 3. UI Sub-Components --- */

function EngineSettings({ signal, setSignal }: any) {
  return (
    <div className="mt-6 rounded-2xl border border-ink/10 bg-white/70 p-3">
      <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">
        Neural Backbone
      </p>
      <div className="grid grid-cols-3 gap-2">
        {LLM_OPTIONS.map((option) => {
          const active = signal.llmChoice === option.id;
          return (
            <button
              key={option.id}
              onClick={() =>
                setSignal((p: SignalState) => ({ ...p, llmChoice: option.id }))
              }
              className="relative overflow-hidden rounded-xl border border-ink/10 px-3 py-3 text-left"
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-ink text-white"
                />
              )}
              <div className="relative z-10">
                <p
                  className={`text-[11px] font-black uppercase tracking-widest ${
                    active ? "text-white" : "text-ink/70"
                  }`}
                >
                  {option.label}
                </p>
                <p
                  className={`mt-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                    active ? "text-white/60" : "text-ink/30"
                  }`}
                >
                  {option.detail}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UnifiedInputStep({ signal, setSignal, onNext, isLoading }: any) {
  const theme = MODULE_THEMES[signal.moduleContext as ModuleContext];
  return (
    <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 backdrop-blur-2xl shadow-xl md:p-12">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: theme.primary }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">HADE Live</span>
        </div>
        <h3 className="mt-4 text-4xl font-bold tracking-tight text-ink">What’s the vibe?</h3>
        <p className="mt-2 text-sm text-ink/50 max-w-2xl">HADE checks the local pulse and how you’re feeling to suggest the perfect next move.</p>
        
        <textarea
          value={signal.combinedSignal}
          onChange={(e) => setSignal((p: any) => ({ ...p, combinedSignal: e.target.value }))}
          className="mt-10 w-full resize-none rounded-[1.5rem] border-none bg-ink/[0.03] p-6 text-xl outline-none transition-all focus:bg-ink/[0.05] placeholder:text-ink/10"
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

        <EngineSettings signal={signal} setSignal={setSignal} />
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="group flex items-center gap-3 rounded-full px-10 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: theme.primary }}
        >
          {isLoading ? "Thinking..." : "Explore the Moment →"}
        </button>
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

function ResultStep({ signal, generatedOutput, onRestart, onGo }: any) {
  const theme = MODULE_THEMES[signal.moduleContext as ModuleContext];

  return (
    <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] bg-ink p-8 text-white shadow-2xl md:p-12">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-1 w-12 rounded-full" style={{ background: theme.primary }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{theme.tagline} Output</span>
        </div>
        <h4 className="text-5xl font-bold tracking-tighter leading-tight max-w-xl">{theme.resultTitle}</h4>
        <p className="mt-8 text-2xl text-white/50 leading-relaxed font-light max-w-2xl italic">
          "We've tuned the Istanbul pulse for{' '}
          <span style={{ textDecorationLine: 'underline', textDecorationColor: theme.primary, textDecorationThickness: '1px', textUnderlineOffset: '8px', color: 'white', opacity: 1 }}>{generatedOutput.keyword}</span>
          . {generatedOutput.description}"
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
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center gap-6 border-t border-white/5 pt-10">
        <button onClick={onGo} className="group w-full md:w-auto flex items-center justify-center gap-4 rounded-full bg-white px-12 py-6 text-[13px] font-black uppercase tracking-[0.15em] text-ink transition-all hover:scale-[1.05]">
          {theme.action}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <button onClick={onRestart} className="text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-white transition">Ignore Recommendation</button>
      </div>
    </div>
  );
}

function VectorMapFallback({ theme, generatedOutput, onRestart, reason }: any) {
  return (
    <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[3rem] bg-[#0A0C10] text-white border border-white/5">
      <div className="absolute inset-0 opacity-40">
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill={`radial-gradient(circle, ${theme.primary}22 0%, transparent 70%)`} />
          {[...Array(6)].map((_, i) => (
            <motion.path
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.15 }}
              transition={{ duration: 2, delay: i * 0.2 }}
              d={`M ${400 + (Math.random() - 0.5) * 400} ${300 + (Math.random() - 0.5) * 300} L 400 300`}
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

function TacticalMapStep({ signal, generatedOutput, onRestart }: any) {
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

  if (!googleMapsApiKey) {
    return (
      <VectorMapFallback
        theme={theme}
        generatedOutput={generatedOutput}
        onRestart={onRestart}
        reason="Google Maps key missing. Using vector fallback."
      />
    );
  }

  if (loadError) {
    return (
      <VectorMapFallback
        theme={theme}
        generatedOutput={generatedOutput}
        onRestart={onRestart}
        reason="Google Maps load failed. Using vector fallback."
      />
    );
  }

  if (!isLoaded) {
    return (
      <VectorMapFallback
        theme={theme}
        generatedOutput={generatedOutput}
        onRestart={onRestart}
        reason="Loading map layer..."
      />
    );
  }

  return (
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

/* --- 4. Main Controller --- */

export default function HadeEngineSystemsDiagram({ accent }: HadeEngineProps) {
  const [step, setStep] = useState<StepId>("input");
  const [signal, setSignal] = useState<SignalState>(DEFAULT_SIGNAL);
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedOutput>(DEFAULT_OUTPUT);
  const [timerDone, setTimerDone] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = MODULE_THEMES[signal.moduleContext as ModuleContext];

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Tracks the wall-clock moment processing started — used by the Race Guard.
  const processingStartRef = useRef<number>(0);

  const handleTimerComplete = useCallback(() => setTimerDone(true), []);

  // Gate: advance to "result" only when both the processing timer and API call are done.
  // Race Guard: enforce a minimum 1000ms on-screen display regardless of data arrival speed.
  // This gives Framer Motion a stable AnimatePresence frame before transitioning.
  useEffect(() => {
    let transitionTimer: NodeJS.Timeout;
    if (step === "processing" && timerDone && dataReady) {
      const elapsed = Date.now() - processingStartRef.current;
      const MIN_DISPLAY_MS = 1000;
      // floor at 50ms so the exit animation always has a starting point
      const remaining = Math.max(50, MIN_DISPLAY_MS - elapsed);
      transitionTimer = setTimeout(() => {
        startTransition(() => setStep("result"));
      }, remaining);
    }
    return () => clearTimeout(transitionTimer);
  }, [step, timerDone, dataReady]);

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
    setTimerDone(false);
    setDataReady(false);
    setIsLoading(true);
    setStep("processing");
    processingStartRef.current = Date.now();

    try {
      const requestPayload = {
        signal: signal.combinedSignal,
        module: signal.moduleContext,
        location: signal.location,
        llmChoice: signal.llmChoice,
      };
      // Async fix: await fetch + await response parse with full error handling.
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

      const parsedCardData = mapApiResponseToOutput(
        rawData,
        signal.moduleContext,
        signal.combinedSignal,
      );
      console.log("FINAL MAPPED DATA:", parsedCardData);
      if (isMountedRef.current) {
        startTransition(() => {
          setGeneratedOutput(() => parsedCardData);
        });
      }
    } catch (error) {
      console.error("[HADE Demo] Failed to generate decision", error);
      if (isMountedRef.current) {
        setGeneratedOutput(() => buildClientFallback(signal.moduleContext, signal.combinedSignal));
      }
    } finally {
      if (isMountedRef.current) {
        setDataReady(true);
        setIsLoading(false);
      }
    }
  };

  const restart = () => {
    setStep("input");
    setSignal(DEFAULT_SIGNAL);
    setGeneratedOutput(DEFAULT_OUTPUT);
    setTimerDone(false);
    setDataReady(false);
    setIsLoading(false);
  };

  const safeOutput =
    generatedOutput.keyword && generatedOutput.description && generatedOutput.subNode
      ? generatedOutput
      : DEFAULT_OUTPUT;

  const themeColor = accent || "#10B981"; // Fallback to a default if not provided

  return (
    <section className="w-full py-12 px-6 md:px-0 mx-auto max-w-7xl">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-ink/5 bg-ink/[0.02] px-6 py-2 mb-6">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: theme.primary }} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Spontaneity Engine v4.2</p>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">HADE Orchestration</h2>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}>
          {step === "input" && <UnifiedInputStep signal={signal} setSignal={setSignal} onNext={handleExplore} isLoading={isLoading} />}
          {step === "processing" && (
            <ProcessingStep
              signal={signal}
              onComplete={handleTimerComplete}
              duration={signal.llmChoice === "llama" ? 1200 : 3200}
            />
          )}
          {step === "result" && <ResultStep signal={signal} generatedOutput={safeOutput} onRestart={restart} onGo={() => setStep("mapping")} />}
          {step === "mapping" && <TacticalMapStep signal={signal} generatedOutput={safeOutput} onRestart={restart} />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex justify-center gap-3">
        {(["input", "processing", "result", "mapping"] as StepId[]).map((s) => (
          <div key={s} className={`h-1.5 rounded-full transition-all duration-700 ${step === s ? 'w-12' : 'w-3 bg-ink/10'}`} style={{ backgroundColor: step === s ? theme.primary : undefined }} />
        ))}
      </div>
    </section>
  );
}
