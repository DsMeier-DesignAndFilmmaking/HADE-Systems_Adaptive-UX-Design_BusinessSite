import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Example request payload:
 * {
 *   "signal": "I want a cozy place with live music tonight",
 *   "module": "cultural-events",
 *   "location": "Istanbul, Turkey",
 *   "userProfile": {
 *     "interests": ["jazz", "hidden spots", "local food"],
 *     "pastActions": ["visited Karakoy cafes", "booked Bosphorus ferry"]
 *   },
 *   "currentMood": "exploratory",
 *   "travelConstraints": { "budget": 40, "timeAvailable": "2 hours" },
 *   "companions": { "type": "friends", "count": 2 }
 * }
 *
 * Expected response shape:
 * {
 *   "primary": {
 *     "keyword": "Rooftop Jazz",
 *     "description": "Catch a compact live set in a rooftop lounge near Galata, then walk to a late-night dessert stop.",
 *     "subNode": "Galata"
 *   },
 *   "alternatives": [
 *     {
 *       "keyword": "Waterfront Vinyl",
 *       "description": "Try a Kadikoy vinyl bar with mellow sets and affordable tasting plates.",
 *       "subNode": "Kadikoy"
 *     }
 *   ],
 *   "tags": ["live-music", "night-activity", "hidden-gem"],
 *   "urgency": "medium",
 *   "novelty": 0.72
 * }
 */

type Mood = "exploratory" | "relaxed" | "rushed";
type Urgency = "high" | "medium" | "low";

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
  llmChoice?: "gemini" | "llama" | "mock";
  userProfile?: UserProfile;
  currentMood?: Mood;
  travelConstraints?: TravelConstraints;
  companions?: Companions;
  // Optional hook for future learning loops:
  // can be persisted/aggregated externally and fed back into prompts.
  engagementMetrics?: {
    clicks?: number;
    completions?: number;
    skippedRecommendations?: number;
  };
};

type GeminiModelInfo = {
  name?: string;
  displayName?: string;
  description?: string;
  version?: string;
  supportedGenerationMethods?: string[];
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

const MODULE_PROMPT_TEMPLATES: Record<string, string> = {
  "weather-vibe": [
    "Module intent: match activity to weather, neighborhood energy, and time context.",
    "Prefer weather-aligned suggestions (indoor/outdoor), smart sequencing, and comfort-aware options.",
    "Include one atmosphere-forward choice and one practical backup.",
  ].join(" "),
  "food-guide": [
    "Module intent: suggest local culinary experiences beyond generic tourist picks.",
    "Prioritize signature dishes, market lanes, neighborhood specialists, and pacing (quick bite vs lingering meal).",
    "Favor high-specificity local flavor over broad category suggestions.",
  ].join(" "),
  "cultural-events": [
    "Module intent: curate culturally rich experiences (music, galleries, talks, performances, workshops).",
    "Favor timely, place-based events and creative pairings in nearby neighborhoods.",
    "Balance novelty with accessibility for the current mood and constraints.",
  ].join(" "),
};

const HIGH_COMPLEXITY_MODULES = new Set([
  "cultural-events",
  "trip-orchestration",
  "itinerary-optimizer",
  "multi-stop-planning",
]);

const MODEL_FLASH = process.env.GEMINI_MODEL_FLASH || "gemini-2.5-flash";
const MODEL_PRO = process.env.GEMINI_MODEL_PRO || "gemini-2.5-pro";
const MODEL_HIGH_COMPLEXITY =
  process.env.GEMINI_MODEL_HIGH_COMPLEXITY || "gemini-pro-latest";

const PROVIDER_TIMEOUT_MS = 12_000;

const DEFAULT_LOCATION = "Istanbul, Turkey";

const FALLBACK_BY_MODULE: Record<string, HadeDecisionResponse> = {
  "weather-vibe": {
    primary: {
      keyword: "Bosphorus Tea Pause",
      description:
        "Take a wind-sheltered tea stop by the water, then continue with a short neighborhood walk.",
      subNode: "Besiktas",
    },
    alternatives: [
      {
        keyword: "Gallery Reset",
        description:
          "Move indoors to a compact contemporary gallery route with nearby coffee options.",
        subNode: "Galata",
      },
    ],
    tags: ["weather-aware", "calm-route", "indoor-option"],
    urgency: "low",
    novelty: 0.56,
  },
  "food-guide": {
    primary: {
      keyword: "Street Bite Loop",
      description:
        "Start with a local specialty stall, then finish at a neighborhood dessert spot within walking distance.",
      subNode: "Kadikoy",
    },
    alternatives: [
      {
        keyword: "Market Counter Trail",
        description:
          "Follow three small counters in one district for a progressive tasting route.",
        subNode: "Karakoy",
      },
    ],
    tags: ["local-food", "quick-win", "hidden-gem"],
    urgency: "medium",
    novelty: 0.62,
  },
  "cultural-events": {
    primary: {
      keyword: "Evening Culture Stack",
      description:
        "Pair an intimate performance with a late gallery stop to create a compact culture-forward night.",
      subNode: "Cihangir",
    },
    alternatives: [
      {
        keyword: "Workshop Window",
        description:
          "Join a short local creative workshop and end with a live conversation venue nearby.",
        subNode: "Moda",
      },
    ],
    tags: ["cultural-depth", "night-activity", "creative-local"],
    urgency: "medium",
    novelty: 0.74,
  },
};

const DEFAULT_FALLBACK: HadeDecisionResponse = {
  primary: {
    keyword: "Adaptive City Move",
    description:
      "Take one high-signal local action now, then expand with a nearby optional stop if energy allows.",
    subNode: "Karakoy",
  },
  alternatives: [
    {
      keyword: "Neighborhood Pivot",
      description:
        "Switch to an adjacent district with shorter queues and denser options for quick momentum.",
      subNode: "Galata",
    },
  ],
  tags: ["adaptive", "next-best-action", "local-context"],
  urgency: "medium",
  novelty: 0.5,
};

function logEvent(
  level: "info" | "warn" | "error",
  event: string,
  data: Record<string, unknown> = {},
) {
  const message = JSON.stringify({
    ts: new Date().toISOString(),
    route: "/api/generate-hade",
    event,
    ...data,
  });

  if (level === "error") {
    console.error(`[generate-hade] ${message}`);
    return;
  }
  if (level === "warn") {
    console.warn(`[generate-hade] ${message}`);
    return;
  }
  console.log(`[generate-hade] ${message}`);
}

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, max = 260): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max)}...`;
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => compact(item))
    .filter(Boolean);
}

function toKebabTag(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function sanitizeNode(node: DecisionNode): DecisionNode {
  return {
    keyword: compact(node.keyword).slice(0, 80),
    description: compact(node.description).slice(0, 280),
    subNode: compact(node.subNode).slice(0, 80),
  };
}

function isValidNode(value: unknown): value is DecisionNode {
  if (!value || typeof value !== "object") {
    return false;
  }

  const node = value as Record<string, unknown>;
  return (
    typeof node.keyword === "string" &&
    typeof node.description === "string" &&
    typeof node.subNode === "string" &&
    compact(node.keyword).length > 0 &&
    compact(node.description).length > 0 &&
    compact(node.subNode).length > 0
  );
}

function normalizeDecision(raw: unknown): HadeDecisionResponse | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const obj = raw as Record<string, unknown>;
  if (!isValidNode(obj.primary)) {
    return null;
  }

  const primary = sanitizeNode(obj.primary);

  const alternativesRaw = Array.isArray(obj.alternatives) ? obj.alternatives : [];
  const alternatives = alternativesRaw
    .filter(isValidNode)
    .map(sanitizeNode)
    .filter((node) => node.keyword !== primary.keyword)
    .slice(0, 2);

  const tagsRaw = toStringList(obj.tags);
  const tags = Array.from(
    new Set(tagsRaw.map(toKebabTag).filter((tag) => tag.length > 0)),
  ).slice(0, 6);

  const urgencyCandidate = obj.urgency;
  const urgency: Urgency | undefined =
    urgencyCandidate === "high" ||
    urgencyCandidate === "medium" ||
    urgencyCandidate === "low"
      ? urgencyCandidate
      : undefined;

  const noveltyCandidate = obj.novelty;
  const novelty =
    typeof noveltyCandidate === "number" && Number.isFinite(noveltyCandidate)
      ? clamp(Number(noveltyCandidate), 0, 1)
      : undefined;

  if (alternatives.length === 0 || tags.length === 0) {
    return null;
  }

  return {
    primary,
    alternatives,
    tags,
    ...(urgency ? { urgency } : {}),
    ...(typeof novelty === "number" ? { novelty } : {}),
  };
}

function extractJsonCandidate(raw: string): string | null {
  const text = raw.trim();
  if (!text) {
    return null;
  }

  if (text.startsWith("{") && text.endsWith("}")) {
    return text;
  }

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  if (fenced) {
    return fenced.trim();
  }

  const firstBrace = text.indexOf("{");
  if (firstBrace === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < text.length; i += 1) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(firstBrace, i + 1).trim();
      }
    }
  }

  return null;
}

function safeParseDecision(rawText: string): HadeDecisionResponse | null {
  const candidate = extractJsonCandidate(rawText) || rawText;

  try {
    const parsed = JSON.parse(candidate) as unknown;
    return normalizeDecision(parsed);
  } catch {
    return null;
  }
}

function modulePromptBlock(moduleName: string): string {
  const key = moduleName.toLowerCase();
  if (MODULE_PROMPT_TEMPLATES[key]) {
    return MODULE_PROMPT_TEMPLATES[key];
  }
  return [
    "Module intent: map user intent to a concrete next action with one nearby backup.",
    "Favor local specificity, short travel hops, and clear progression.",
  ].join(" ");
}

function buildPrompt(payload: Required<HadeRequestPayload>): string {
  const profileBlock = JSON.stringify(payload.userProfile);
  const constraintsBlock = JSON.stringify(payload.travelConstraints);
  const companionsBlock = JSON.stringify(payload.companions);
  const engagementBlock = JSON.stringify(payload.engagementMetrics || {});

  return [
    "You must return JSON only.",
    "Exact schema:",
    "{",
    '  "primary": {',
    '    "keyword": "string",',
    '    "description": "string",',
    '    "subNode": "string"',
    "  },",
    '  "alternatives": [',
    "    {",
    '      "keyword": "string",',
    '      "description": "string",',
    '      "subNode": "string"',
    "    }",
    "  ],",
    '  "tags": ["string"],',
    '  "urgency": "high|medium|low",',
    '  "novelty": 0.0',
    "}",
    "",
    `Module guidance: ${modulePromptBlock(payload.module)}`,
    "",
    "<context>",
    `<signal>${payload.signal}</signal>`,
    `<module>${payload.module}</module>`,
    `<location>${payload.location}</location>`,
    `<userProfile>${profileBlock}</userProfile>`,
    `<mood>${payload.currentMood}</mood>`,
    `<travelConstraints>${constraintsBlock}</travelConstraints>`,
    `<companions>${companionsBlock}</companions>`,
    `<engagementMetrics>${engagementBlock}</engagementMetrics>`,
    "</context>",
    "",
    "Output quality rules:",
    "- Keep recommendations concise and actionable.",
    "- Be location-specific and a little quirky when appropriate.",
    "- Alternatives should be meaningfully different from primary.",
    "- tags must be semantic and kebab-case.",
  ].join("\n");
}

function fallbackFromPayload(payload: Required<HadeRequestPayload>): HadeDecisionResponse {
  const moduleKey = payload.module.toLowerCase();
  const base = FALLBACK_BY_MODULE[moduleKey] || DEFAULT_FALLBACK;
  const locationLabel = compact(payload.location) || DEFAULT_LOCATION;

  const primary = {
    ...base.primary,
    description: base.primary.description,
    subNode: locationLabel.split(",")[0] || base.primary.subNode,
  };

  const alternatives = base.alternatives.map((item) => ({
    ...item,
    subNode: locationLabel.split(",")[0] || item.subNode,
  }));

  return {
    ...base,
    primary,
    alternatives,
  };
}

function normalizeIncomingPayload(body: unknown): Required<HadeRequestPayload> {
  const obj = body && typeof body === "object" ? (body as HadeRequestPayload) : {};

  const signal =
    typeof obj.signal === "string" && compact(obj.signal)
      ? compact(obj.signal)
      : "Find me a good next move nearby.";
  const moduleName =
    typeof obj.module === "string" && compact(obj.module)
      ? compact(obj.module)
      : "weather-vibe";
  const location =
    typeof obj.location === "string" && compact(obj.location)
      ? compact(obj.location)
      : DEFAULT_LOCATION;
  const llmChoice =
    obj.llmChoice === "gemini" || obj.llmChoice === "llama" || obj.llmChoice === "mock"
      ? obj.llmChoice
      : "gemini";

  const profileInterests = toStringList(obj.userProfile?.interests).slice(0, 12);
  const profilePastActions = toStringList(obj.userProfile?.pastActions).slice(0, 20);

  const currentMood: Mood =
    obj.currentMood === "exploratory" ||
    obj.currentMood === "relaxed" ||
    obj.currentMood === "rushed"
      ? obj.currentMood
      : "exploratory";

  const budget =
    typeof obj.travelConstraints?.budget === "number" &&
    Number.isFinite(obj.travelConstraints.budget)
      ? Math.max(0, obj.travelConstraints.budget)
      : undefined;
  const timeAvailable =
    typeof obj.travelConstraints?.timeAvailable === "string"
      ? compact(obj.travelConstraints.timeAvailable).slice(0, 40)
      : undefined;

  const companionType =
    typeof obj.companions?.type === "string"
      ? compact(obj.companions.type).slice(0, 30)
      : undefined;
  const companionCount =
    typeof obj.companions?.count === "number" && Number.isFinite(obj.companions.count)
      ? clamp(Math.round(obj.companions.count), 0, 50)
      : undefined;

  const engagementMetrics = {
    clicks:
      typeof obj.engagementMetrics?.clicks === "number"
        ? Math.max(0, Math.floor(obj.engagementMetrics.clicks))
        : 0,
    completions:
      typeof obj.engagementMetrics?.completions === "number"
        ? Math.max(0, Math.floor(obj.engagementMetrics.completions))
        : 0,
    skippedRecommendations:
      typeof obj.engagementMetrics?.skippedRecommendations === "number"
        ? Math.max(0, Math.floor(obj.engagementMetrics.skippedRecommendations))
        : 0,
  };

  return {
    signal,
    module: moduleName,
    location,
    llmChoice,
    userProfile: {
      interests: profileInterests,
      pastActions: profilePastActions,
    },
    currentMood,
    travelConstraints: {
      ...(typeof budget === "number" ? { budget } : {}),
      ...(timeAvailable ? { timeAvailable } : {}),
    },
    companions: {
      ...(companionType ? { type: companionType } : {}),
      ...(typeof companionCount === "number" ? { count: companionCount } : {}),
    },
    engagementMetrics,
  };
}

function scoreComplexity(payload: Required<HadeRequestPayload>): number {
  let score = 0;

  if (payload.signal.length > 90) {
    score += 1;
  }
  if ((payload.userProfile.interests || []).length > 0) {
    score += 1;
  }
  if ((payload.userProfile.pastActions || []).length > 0) {
    score += 1;
  }
  if (payload.travelConstraints.budget !== undefined) {
    score += 1;
  }
  if (payload.travelConstraints.timeAvailable) {
    score += 1;
  }
  if (payload.companions.type || payload.companions.count !== undefined) {
    score += 1;
  }
  if (payload.currentMood === "rushed") {
    score += 1;
  }

  return score;
}

function choosePrimaryModel(payload: Required<HadeRequestPayload>): string {
  const moduleKey = payload.module.toLowerCase();
  if (HIGH_COMPLEXITY_MODULES.has(moduleKey)) {
    return MODEL_HIGH_COMPLEXITY;
  }

  const complexityScore = scoreComplexity(payload);
  const alternativesRequested = /alternative|options|compare|versus|vs/i.test(
    payload.signal,
  );

  if (complexityScore >= 4 || alternativesRequested) {
    return MODEL_PRO;
  }

  return MODEL_FLASH;
}

function orderedModelAttempts(primary: string): string[] {
  const order = [primary, MODEL_PRO, MODEL_FLASH, MODEL_HIGH_COMPLEXITY].filter(
    Boolean,
  );
  return Array.from(new Set(order));
}

function parseModelName(name: string): string {
  return name.replace(/^models\//, "");
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  provider: string,
): Promise<T> {
  let timeoutRef: ReturnType<typeof setTimeout> | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutRef = setTimeout(() => {
      reject(new Error(`${provider} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
  }
}

async function listGeminiModels(
  client: GoogleGenerativeAI,
  apiKey: string,
): Promise<GeminiModelInfo[]> {
  const dynamicClient = client as unknown as {
    listModels?: () => Promise<{ models?: GeminiModelInfo[] }>;
  };

  if (typeof dynamicClient.listModels === "function") {
    try {
      const sdkList = await dynamicClient.listModels();
      const models = sdkList.models || [];
      logEvent("info", "gemini_list_models_sdk_success", {
        count: models.length,
      });
      models.forEach((model, index) => {
        logEvent("info", "gemini_model_capability", {
          index,
          endpoint: model.name,
          displayName: model.displayName,
          methods: model.supportedGenerationMethods,
        });
      });
      return models;
    } catch (error) {
      logEvent("warn", "gemini_list_models_sdk_failed", {
        error: String(error),
      });
    }
  } else {
    logEvent("warn", "gemini_list_models_sdk_unavailable");
  }

  try {
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models";
    const response = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as
      | { models?: GeminiModelInfo[]; error?: unknown }
      | null;

    if (!response.ok) {
      logEvent("warn", "gemini_list_models_rest_failed", {
        status: response.status,
        statusText: response.statusText,
        payload: data,
      });
      return [];
    }

    const models = data?.models || [];
    logEvent("info", "gemini_list_models_rest_success", {
      count: models.length,
      endpoint,
    });
    models.forEach((model, index) => {
      logEvent("info", "gemini_model_capability", {
        index,
        endpoint: model.name,
        displayName: model.displayName,
        methods: model.supportedGenerationMethods,
      });
    });
    return models;
  } catch (error) {
    logEvent("warn", "gemini_list_models_rest_error", { error: String(error) });
    return [];
  }
}

function filterSupportedModels(
  attempts: string[],
  discoveredModels: GeminiModelInfo[],
): string[] {
  if (discoveredModels.length === 0) {
    return attempts;
  }

  const supported = new Set(
    discoveredModels
      .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
      .map((model) => parseModelName(model.name || ""))
      .filter(Boolean),
  );

  const filtered = attempts.filter((attempt) => supported.has(parseModelName(attempt)));
  return filtered.length > 0 ? filtered : attempts;
}

async function generateWithGemini(
  client: GoogleGenerativeAI,
  prompt: string,
  modelAttempts: string[],
): Promise<{ decision: HadeDecisionResponse; modelUsed: string } | null> {
  for (const modelName of modelAttempts) {
    try {
      logEvent("info", "gemini_generation_attempt", { model: modelName });

      const model = client.getGenerativeModel({
        model: parseModelName(modelName),
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.55,
        },
      });

      const result = await withTimeout(
        model.generateContent(prompt),
        PROVIDER_TIMEOUT_MS,
        "gemini",
      );
      const rawText = result.response.text();

      logEvent("info", "gemini_generation_raw", {
        model: modelName,
        preview: truncate(rawText),
      });

      const parsed = safeParseDecision(rawText);
      if (!parsed) {
        logEvent("warn", "gemini_parse_failed", {
          model: modelName,
          preview: truncate(rawText),
        });
        continue;
      }

      logEvent("info", "gemini_generation_success", {
        model: modelName,
        tags: parsed.tags,
        urgency: parsed.urgency,
        novelty: parsed.novelty,
      });
      return { decision: parsed, modelUsed: modelName };
    } catch (error) {
      const errorObj = error as { message?: string; status?: number; code?: string };
      logEvent("warn", "gemini_generation_error", {
        model: modelName,
        message: errorObj?.message || String(error),
        status: errorObj?.status,
        code: errorObj?.code,
      });
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  logEvent("info", "request_received");

  let body: unknown = {};
  try {
    body = await req.json();
  } catch (error) {
    logEvent("warn", "request_body_parse_failed", { error: String(error) });
  }

  logEvent("info", "request_body_received", {
    preview: truncate(JSON.stringify(body ?? {}), 600),
  });

  const payload = normalizeIncomingPayload(body);
  logEvent("info", "request_body_normalized", {
    signal: payload.signal,
    module: payload.module,
    location: payload.location,
    llmChoice: payload.llmChoice,
    mood: payload.currentMood,
    interestsCount: payload.userProfile.interests?.length || 0,
    pastActionsCount: payload.userProfile.pastActions?.length || 0,
    companions: payload.companions,
    travelConstraints: payload.travelConstraints,
    engagementMetrics: payload.engagementMetrics,
  });

  if (payload.llmChoice === "mock") {
    const mockDecision = fallbackFromPayload(payload);
    logEvent("info", "mock_mode_response_returned", {
      llmChoice: payload.llmChoice,
      primary: mockDecision.primary,
      tags: mockDecision.tags,
    });
    return NextResponse.json(mockDecision, { status: 200 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    logEvent("error", "missing_gemini_api_key");
    return NextResponse.json(fallbackFromPayload(payload), { status: 200 });
  }

  try {
    if (payload.llmChoice === "llama") {
      logEvent("warn", "llama_mode_not_configured_using_gemini", {
        llmChoice: payload.llmChoice,
      });
    }

    const client = new GoogleGenerativeAI(apiKey);
    const discoveredModels = await listGeminiModels(client, apiKey);

    const primaryModel = choosePrimaryModel(payload);
    const attemptList = filterSupportedModels(
      orderedModelAttempts(primaryModel),
      discoveredModels,
    );

    logEvent("info", "model_strategy_selected", {
      primaryModel,
      attemptList,
      complexityScore: scoreComplexity(payload),
    });

    const prompt = buildPrompt(payload);
    logEvent("info", "prompt_built", {
      preview: truncate(prompt, 700),
      moduleTemplate: modulePromptBlock(payload.module),
    });

    const generated = await generateWithGemini(client, prompt, attemptList);
    if (generated) {
      logEvent("info", "response_returned_gemini", {
        modelUsed: generated.modelUsed,
        primary: generated.decision.primary,
        tags: generated.decision.tags,
      });
      return NextResponse.json(generated.decision, { status: 200 });
    }

    const fallbackDecision = fallbackFromPayload(payload);
    logEvent("warn", "response_returned_fallback_after_generation_failures", {
      fallbackTags: fallbackDecision.tags,
      module: payload.module,
      fallbackPrimary: fallbackDecision.primary,
    });
    return NextResponse.json(fallbackDecision, { status: 200 });
  } catch (error) {
    logEvent("error", "route_fatal_error", { error: String(error) });
    const fallbackDecision = fallbackFromPayload(payload);
    logEvent("warn", "response_returned_fallback_after_fatal_error", {
      fallbackPrimary: fallbackDecision.primary,
      fallbackTags: fallbackDecision.tags,
    });
    return NextResponse.json(fallbackDecision, { status: 200 });
  }
}
