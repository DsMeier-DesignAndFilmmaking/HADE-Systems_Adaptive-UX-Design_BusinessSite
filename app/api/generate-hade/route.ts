import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Mood = "exploratory" | "relaxed" | "rushed";
type Urgency = "high" | "medium" | "low";

// Removed 'mock' from type choices
type llmChoiceType = "gemini" | "llama" | "claude";

type UserProfile = {
  interests?: string[];
  pastActions?: string[];
};

type TravelConstraints = {
  budget?: number;
  timeAvailable?: string;
};

type Companions = {
  type?: string;
  count?: number;
};

type DecisionNode = {
  keyword: string;
  description: string;
  subNode: string;
};

type HadeDecisionResponse = {
  primary: DecisionNode;
  alternatives: DecisionNode[];
  tags: string[];
  urgency?: Urgency;
  novelty?: number;
};

type HadeRequestPayload = {
  signal?: string;
  module?: string;
  location?: string;
  model?: llmChoiceType;
  llmChoice?: llmChoiceType;
  userProfile?: UserProfile;
  currentMood?: Mood;
  travelConstraints?: TravelConstraints;
  companions?: Companions;
  engagementMetrics?: {
    clicks?: number;
    completions?: number;
    skippedRecommendations?: number;
  };
};

const SYSTEM_INSTRUCTION = [
  "You are HADE, a real-time adaptive travel decision engine.",
  "You turn short user signals into concrete travel actions.",
  "You must return STRICT JSON only (no markdown, no code fences, no prose).",
  "Output object keys allowed: primary, alternatives, tags, urgency, novelty.",
  "primary must include keyword, description, subNode.",
  "alternatives must include 1-2 options with keyword, description, subNode.",
  "tags must be semantic kebab-case strings.",
  "Keep recommendations concise, location-specific, and quirky when appropriate.",
  "Descriptions should be actionable and under 24 words.",
].join("\n");

const CLAUDE_ARCHITECT_INSTRUCTION = [
  "### CLAUDE SPATIAL ARCHITECT MODE ENABLED ###",
  "1. ADAPTIVE TONE: Shift focus to 'Urban Archeology' and 'Spatial Design'.",
  "2. KEYWORD FOCUS: Prioritize locations with architectural merit or adaptive reuse (e.g., Mimar Sinan works, Bauhaus influences).",
  "3. DESCRIPTION: Dedicate part of the description to the 'Visual Language' or 'Historical Layering' of the site.",
  "4. Ensure descriptions remain under 24 words despite the technical focus."
].join("\n");

const MODULE_PROMPT_TEMPLATES: Record<string, string> = {
  "weather-vibe": [
    "Module intent: match activity to weather, neighborhood energy, and time context.",
    "Prefer weather-aligned suggestions (indoor/outdoor), smart sequencing, and comfort-aware options.",
    "Include one atmosphere-forward choice and one practical backup.",
  ].join(" "),
  "food-guide": [
    "Module intent: suggest local culinary experiences beyond generic tourist picks.",
    "Prioritize signature dishes, market lanes, neighborhood specialists, and pacing.",
    "Favor high-specificity local flavor over broad category suggestions.",
  ].join(" "),
  "cultural-events": [
    "Module intent: curate culturally rich experiences (music, galleries, talks, workshops).",
    "Favor timely, place-based events and creative pairings in nearby neighborhoods.",
  ].join(" "),
};

const MODEL_FLASH = process.env.GEMINI_MODEL_FLASH || "gemini-1.5-flash";
const DEFAULT_LOCATION = "Istanbul, Turkey";

class QuotaExceededError extends Error {
  constructor(provider: string, detail: string) {
    super(`${provider} quota exceeded: ${detail}`);
    this.name = "QuotaExceededError";
  }
}

// Helper Functions
function logEvent(level: "info" | "warn" | "error", event: string, data: Record<string, unknown> = {}) {
  const message = JSON.stringify({ ts: new Date().toISOString(), route: "/api/generate-hade", event, ...data });
  if (level === "error") console.error(`[generate-hade] ${message}`);
  else console.log(`[generate-hade] ${message}`);
}

function compact(value: string): string { return value.replace(/\s+/g, " ").trim(); }

function sanitizeNode(node: DecisionNode): DecisionNode {
  return {
    keyword: compact(node.keyword).slice(0, 80),
    description: compact(node.description).slice(0, 280),
    subNode: compact(node.subNode).slice(0, 80),
  };
}

function isValidNode(value: unknown): value is DecisionNode {
  if (!value || typeof value !== "object") return false;
  const node = value as Record<string, unknown>;
  return (
    typeof node.keyword === "string" &&
    typeof node.description === "string" &&
    typeof node.subNode === "string" &&
    compact(node.keyword).length > 0
  );
}

function normalizeDecision(raw: unknown): HadeDecisionResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (!isValidNode(obj.primary)) return null;

  const primary = sanitizeNode(obj.primary);
  const alternativesRaw = Array.isArray(obj.alternatives) ? obj.alternatives : [];
  const alternatives = alternativesRaw.filter(isValidNode).map(sanitizeNode).slice(0, 2);
  const tags = (Array.isArray(obj.tags) ? obj.tags : []).map(t => String(t).toLowerCase().replace(/\s+/g, '-')).slice(0, 6);

  return {
    primary,
    alternatives,
    tags,
    urgency: (obj.urgency as Urgency) || "medium",
    novelty: typeof obj.novelty === "number" ? Math.min(1, Math.max(0, obj.novelty)) : 0.5
  };
}

function extractJsonCandidate(raw: string): string | null {
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) return null;
  return raw.slice(firstBrace, lastBrace + 1);
}

function safeParseDecision(rawText: string): HadeDecisionResponse | null {
  const candidate = extractJsonCandidate(rawText) || rawText;
  try {
    const parsed = JSON.parse(candidate);
    return normalizeDecision(parsed);
  } catch {
    return null;
  }
}

function buildPrompt(payload: Required<HadeRequestPayload>): string {
  const moduleGuidance = MODULE_PROMPT_TEMPLATES[payload.module.toLowerCase()] || "Standard mapping mode.";
  return [
    "You must return JSON only.",
    "Exact schema: { primary: { keyword, description, subNode }, alternatives: [], tags: [], urgency, novelty }",
    `Module guidance: ${moduleGuidance}`,
    "<context>",
    `<signal>${payload.signal}</signal>`,
    `<location>${payload.location}</location>`,
    `<mood>${payload.currentMood}</mood>`,
    "</context>"
  ].join("\n");
}

function normalizeIncomingPayload(body: unknown): Required<HadeRequestPayload> {
  const obj = (body && typeof body === "object" ? body : {}) as HadeRequestPayload;
  const choiceRaw = obj.llmChoice || obj.model || "gemini";
  
  // Validating against our new 3-model backbone
  const choice: llmChoiceType = (choiceRaw === "llama" || choiceRaw === "claude") ? choiceRaw : "gemini";
  
  return {
    signal: compact(obj.signal || "Explore nearby"),
    module: obj.module || "weather-vibe",
    location: obj.location || DEFAULT_LOCATION,
    model: choice,
    llmChoice: choice,
    userProfile: obj.userProfile || {},
    currentMood: obj.currentMood || "exploratory",
    travelConstraints: obj.travelConstraints || {},
    companions: obj.companions || {},
    engagementMetrics: obj.engagementMetrics || { clicks: 0, completions: 0, skippedRecommendations: 0 }
  };
}

// LLM Provider Functions
async function generateWithClaude(prompt: string): Promise<{ decision: HadeDecisionResponse; modelUsed: string } | null> {
  const modelId = "anthropic/claude-3.5-sonnet";
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION + "\n" + CLAUDE_ARCHITECT_INSTRUCTION },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      logEvent("warn", "claude_generation_error", { status: response.status, error: data?.error });
      return null;
    }
    const rawText = data?.choices?.[0]?.message?.content ?? "";
    const parsed = safeParseDecision(rawText);
    if (!parsed) logEvent("warn", "claude_parse_failed", { preview: rawText.slice(0, 200) });
    return parsed ? { decision: parsed, modelUsed: modelId } : null;
  } catch (error) {
    logEvent("error", "claude_fetch_failed", { error: String(error) });
    return null;
  }
}

async function generateWithGroq(prompt: string): Promise<{ decision: HadeDecisionResponse; modelUsed: string } | null> {
  const modelId = "llama-3.3-70b-versatile";
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      logEvent("warn", "groq_generation_error", { status: response.status, error: data?.error });
      return null;
    }
    const parsed = safeParseDecision(data?.choices?.[0]?.message?.content || "");
    if (!parsed) logEvent("warn", "groq_parse_failed", { preview: String(data?.choices?.[0]?.message?.content).slice(0, 200) });
    return parsed ? { decision: parsed, modelUsed: modelId } : null;
  } catch (error) {
    logEvent("error", "groq_fetch_failed", { error: String(error) });
    return null;
  }
}

async function generateWithGemini(client: GoogleGenerativeAI, prompt: string, modelName: string): Promise<{ decision: HadeDecisionResponse; modelUsed: string } | null> {
  try {
    const model = client.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
    });
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const parsed = safeParseDecision(rawText);
    if (!parsed) logEvent("warn", "gemini_parse_failed", { model: modelName, preview: rawText.slice(0, 200) });
    return parsed ? { decision: parsed, modelUsed: modelName } : null;
  } catch (error) {
    const msg = String(error);
    const isQuota = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
    logEvent(
      isQuota ? "warn" : "error",
      isQuota ? "gemini_quota_exceeded" : "gemini_fetch_failed",
      { model: modelName, error: msg },
    );
    if (isQuota) throw new QuotaExceededError("gemini", msg);
    return null;
  }
}

function buildFallback(payload: Required<HadeRequestPayload>): HadeDecisionResponse {
  const signalSnippet = payload.signal.trim().length > 0
    ? payload.signal.slice(0, 55)
    : "Explore nearby";
  return {
    primary: {
      keyword: "Discovery",
      description: `Signal noted: '${signalSnippet}' — adaptive node near ${payload.location}.`,
      subNode: "Karaköy",
    },
    alternatives: [],
    tags: ["fallback", payload.llmChoice, "safe-render"],
    urgency: "low",
    novelty: 0.5,
  };
}

function buildQuotaBusy(payload: Required<HadeRequestPayload>): HadeDecisionResponse {
  return {
    primary: {
      keyword: "System Busy",
      description: `Gemini quota reached. Switch to Llama or Claude for your signal.`,
      subNode: "Engine Relay",
    },
    alternatives: [],
    tags: ["quota-exceeded", "system-busy", "retry-with-llama"],
    urgency: "low",
    novelty: 0,
  };
}

// MAIN POST HANDLER
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const payload = normalizeIncomingPayload(body);
  const prompt = buildPrompt(payload);

  // 1. Claude Branch (Spatial Architect)
  if (payload.llmChoice === "claude") {
    if (!process.env.OPENROUTER_API_KEY) {
      logEvent("error", "missing_openrouter_api_key");
      return NextResponse.json(buildFallback(payload));
    }
    const result = await generateWithClaude(prompt);
    if (!result) logEvent("warn", "claude_generation_failed_using_fallback");
    return NextResponse.json(result ? result.decision : buildFallback(payload));
  }

  // 2. Llama Branch (Tactical Speed)
  if (payload.llmChoice === "llama") {
    if (!process.env.GROQ_API_KEY) {
      logEvent("error", "missing_groq_api_key");
      return NextResponse.json(buildFallback(payload));
    }
    const result = await generateWithGroq(prompt);
    if (!result) logEvent("warn", "llama_generation_failed_using_fallback");
    return NextResponse.json(result ? result.decision : buildFallback(payload));
  }

  // 3. Gemini Branch (Default Deep Reasoning)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logEvent("error", "missing_gemini_api_key");
    return NextResponse.json(buildFallback(payload));
  }
  const client = new GoogleGenerativeAI(apiKey);
  try {
    const result = await generateWithGemini(client, prompt, MODEL_FLASH);
    if (!result) logEvent("warn", "gemini_generation_failed_using_fallback");
    return NextResponse.json(result ? result.decision : buildFallback(payload));
  } catch (error) {
    if (error instanceof QuotaExceededError) {
      logEvent("warn", "gemini_quota_exceeded_returning_busy");
      return NextResponse.json(buildQuotaBusy(payload));
    }
    logEvent("error", "gemini_unhandled_error", { error: String(error) });
    return NextResponse.json(buildFallback(payload));
  }
}