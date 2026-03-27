import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HadeDecision = {
  keyword: string;
  description: string;
  subNode: string;
};

type GeminiModelInfo = {
  name?: string;
  displayName?: string;
  version?: string;
  supportedGenerationMethods?: string[];
};

const FALLBACK_RESPONSE: HadeDecision = {
  keyword: "Adaptive Guidance",
  description:
    "HADE surfaced a clear next step to reduce friction and keep the user moving forward.",
  subNode: "Primary Flow",
};

const SYSTEM_INSTRUCTION = [
  "You are HADE (Holistic Adaptive Decision Engine) Orchestrator.",
  "Interpret the input signal and return one decision object.",
  "Return strict JSON only with exactly these keys: keyword, description, subNode.",
  "Do not return markdown or code fences.",
  "keyword must be a short Title Case phrase.",
  "description must be one concise sentence.",
].join("\n");

// Only supported, active models
const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-pro-latest",
].filter((v): v is string => Boolean(v?.trim()));

function log(event: string, data?: Record<string, unknown>) {
  console.log(
    `[generate-hade] ${JSON.stringify({
      ts: new Date().toISOString(),
      event,
      ...(data || {}),
    })}`
  );
}

function logError(event: string, error: unknown, data?: Record<string, unknown>) {
  const errObj =
    error && typeof error === "object"
      ? (error as { message?: string; name?: string; stack?: string })
      : { message: String(error) };
  console.error(
    `[generate-hade] ${JSON.stringify({
      ts: new Date().toISOString(),
      event,
      ...(data || {}),
      error: {
        name: errObj.name,
        message: errObj.message,
        stack: errObj.stack,
      },
    })}`
  );
}

function compact(str: string) {
  return str.replace(/\s+/g, " ").trim();
}

function truncate(str: string, max = 300) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

function normalizeModelName(name: string) {
  return name.replace(/^models\//, "");
}

function buildPrompt(signal: string, moduleName: string, location: string) {
  return [
    "Return JSON only.",
    "{",
    '  "keyword": "string",',
    '  "description": "string",',
    '  "subNode": "string"',
    "}",
    `<signal>${signal}</signal>`,
    `<module>${moduleName}</module>`,
    `<location>${location}</location>`,
  ].join("\n");
}

// Extract JSON even if returned with markdown fences or extra text
function extractJsonCandidate(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  if (fenced) return fenced.trim();

  const firstBrace = trimmed.indexOf("{");
  if (firstBrace === -1) return null;

  let depth = 0, inString = false, escaped = false;
  for (let i = firstBrace; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return trimmed.slice(firstBrace, i + 1).trim();
    }
  }
  return null;
}

function validateDecision(data: unknown): data is HadeDecision {
  if (!data || typeof data !== "object") return false;
  const v = data as Record<string, unknown>;
  return ["keyword", "description", "subNode"].every(k => typeof v[k] === "string" && v[k].trim().length > 0);
}

function safeParse(raw: string): HadeDecision | null {
  const candidate = extractJsonCandidate(raw) || raw;
  try {
    const parsed = JSON.parse(candidate);
    if (!validateDecision(parsed)) return null;
    return {
      keyword: compact(parsed.keyword).slice(0, 80),
      description: compact(parsed.description).slice(0, 280),
      subNode: compact(parsed.subNode).slice(0, 80),
    };
  } catch { return null; }
}

function deterministicFallback(signal: string, moduleName: string, location: string): HadeDecision {
  const merged = `${signal} ${moduleName}`.toLowerCase();
  let keyword = "Adaptive Guidance";
  if (/(activate|onboard|setup|start)/.test(merged)) keyword = "Activation Flow";
  else if (/(stuck|drop|friction|idle|confused)/.test(merged)) keyword = "Friction Recovery";
  else if (/(data|analytics|insight|dashboard)/.test(merged)) keyword = "Insight Mapping";
  const subNode = compact(location) || FALLBACK_RESPONSE.subNode;
  return {
    keyword,
    description: `HADE recommended a ${keyword.toLowerCase()} step for ${subNode} based on current user signal.`,
    subNode,
  };
}

async function listGeminiModels(client: GoogleGenerativeAI, apiKey: string): Promise<GeminiModelInfo[]> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json() as { models?: GeminiModelInfo[] };
    const models = payload?.models || [];
    log("gemini.list_models.rest_success", { count: models.length });
    return models;
  } catch (error) {
    logError("gemini.list_models.failed", error);
    return [];
  }
}

function selectModel(models: GeminiModelInfo[]) {
  const available = new Set(
    models.filter(m => m.supportedGenerationMethods?.includes("generateContent"))
          .map(m => normalizeModelName(m.name || ""))
          .filter(Boolean)
  );
  for (const candidate of MODEL_CANDIDATES) {
    const normalized = normalizeModelName(candidate);
    if (available.has(normalized)) return normalized;
  }
  return Array.from(available)[0] || "gemini-pro";
}

export async function POST(req: NextRequest) {
  try {
    log("request_received");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      log("missing_gemini_api_key");
      return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
    }

    let body: any = {};
    try { body = await req.json(); } catch (err) { logError("request_body_parse_failed", err); }

    log("request_body", { bodyPreview: truncate(JSON.stringify(body || {})) });

    const signal = compact(body.signal ?? "Open to anything");
    const moduleName = compact(body.module ?? "General exploration");
    const location = compact(body.location ?? "Istanbul");

    log("request_normalized", { signal, moduleName, location });

    const client = new GoogleGenerativeAI(apiKey);
    const models = await listGeminiModels(client, apiKey);
    const selectedModel = selectModel(models);

    log("gemini.model_selected", { selectedModel });

    const model = client.getGenerativeModel({
      model: selectedModel,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
    });

    const prompt = buildPrompt(signal, moduleName, location);
    log("gemini.generate_start", { model: selectedModel, promptPreview: truncate(prompt) });

    const result = await model.generateContent(prompt);
    const rawText = result?.response?.text?.() || "";

    log("gemini.generate_response", { model: selectedModel, rawPreview: truncate(rawText) });

    const parsed = safeParse(rawText);
    log("gemini.parse_result", { success: Boolean(parsed), parsed });

    if (parsed) {
      log("response_path_gemini_success", { model: selectedModel });
      return NextResponse.json(parsed, { status: 200 });
    }

    const fallback = deterministicFallback(signal, moduleName, location);
    log("response_path_fallback_parse_failed", { fallback });
    return NextResponse.json(fallback, { status: 200 });

  } catch (error) {
    logError("route_unhandled_error", error);
    log("response_path_fallback_exception");
    return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
  }
}