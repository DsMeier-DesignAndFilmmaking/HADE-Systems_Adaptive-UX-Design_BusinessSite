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
  description?: string;
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

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-pro",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
].filter((value): value is string => Boolean(value?.trim()));

function log(event: string, data?: Record<string, unknown>) {
  console.log(
    `[generate-hade] ${JSON.stringify({
      ts: new Date().toISOString(),
      event,
      ...(data || {}),
    })}`,
  );
}

function logError(event: string, error: unknown, data?: Record<string, unknown>) {
  const errObj =
    error && typeof error === "object"
      ? (error as {
          message?: string;
          status?: number;
          code?: string | number;
          name?: string;
          stack?: string;
        })
      : { message: String(error) };

  console.error(
    `[generate-hade] ${JSON.stringify({
      ts: new Date().toISOString(),
      event,
      ...(data || {}),
      error: {
        name: errObj.name,
        message: errObj.message,
        status: errObj.status,
        code: errObj.code,
      },
    })}`,
  );
}

function compact(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, max = 300) {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max)}...`;
}

function normalizeModelName(modelName: string) {
  return modelName.replace(/^models\//, "");
}

function buildPrompt(signal: string, moduleName: string, location: string) {
  return [
    "Return JSON only.",
    "{",
    '  "keyword": "string",',
    '  "description": "string",',
    '  "subNode": "string"',
    "}",
    "",
    `<signal>${signal}</signal>`,
    `<module>${moduleName}</module>`,
    `<location>${location}</location>`,
  ].join("\n");
}

function extractJsonCandidate(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  if (fenced) {
    return fenced.trim();
  }

  const firstBrace = trimmed.indexOf("{");
  if (firstBrace === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < trimmed.length; i += 1) {
    const ch = trimmed[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return trimmed.slice(firstBrace, i + 1).trim();
      }
    }
  }

  return null;
}

function validateDecision(data: unknown): data is HadeDecision {
  if (!data || typeof data !== "object") {
    return false;
  }

  const value = data as Record<string, unknown>;
  return (
    typeof value.keyword === "string" &&
    typeof value.description === "string" &&
    typeof value.subNode === "string" &&
    value.keyword.trim().length > 0 &&
    value.description.trim().length > 0 &&
    value.subNode.trim().length > 0
  );
}

function safeParse(rawText: string): HadeDecision | null {
  const candidate = extractJsonCandidate(rawText) || rawText;

  try {
    const parsed = JSON.parse(candidate);
    if (!validateDecision(parsed)) {
      return null;
    }
    return {
      keyword: compact(parsed.keyword).slice(0, 80),
      description: compact(parsed.description).slice(0, 280),
      subNode: compact(parsed.subNode).slice(0, 80),
    };
  } catch {
    return null;
  }
}

function deterministicFallback(
  signal: string,
  moduleName: string,
  location: string,
): HadeDecision {
  const merged = `${signal} ${moduleName}`.toLowerCase();
  let keyword = "Adaptive Guidance";

  if (/(activate|onboard|setup|start)/.test(merged)) {
    keyword = "Activation Flow";
  } else if (/(stuck|drop|friction|idle|confused)/.test(merged)) {
    keyword = "Friction Recovery";
  } else if (/(data|analytics|insight|dashboard)/.test(merged)) {
    keyword = "Insight Mapping";
  }

  const subNode = compact(location) || FALLBACK_RESPONSE.subNode;
  return {
    keyword,
    description: `HADE recommended a ${keyword.toLowerCase()} step for ${subNode} based on current user signal.`,
    subNode,
  };
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
      const response = await dynamicClient.listModels();
      const models = response?.models || [];
      log("gemini.list_models.sdk_success", {
        count: models.length,
      });
      models.forEach((model, index) => {
        log("gemini.model", {
          index,
          name: model.name,
          displayName: model.displayName,
          version: model.version,
          supportedGenerationMethods: model.supportedGenerationMethods,
        });
      });
      return models;
    } catch (error) {
      logError("gemini.list_models.sdk_failed", error);
    }
  } else {
    log("gemini.list_models.sdk_unavailable");
  }

  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models";

  try {
    const response = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
      method: "GET",
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as
      | { models?: GeminiModelInfo[]; error?: unknown }
      | null;

    if (!response.ok) {
      log("gemini.list_models.rest_failed", {
        status: response.status,
        statusText: response.statusText,
        payload,
      });
      return [];
    }

    const models = payload?.models || [];
    log("gemini.list_models.rest_success", {
      endpoint,
      count: models.length,
    });
    models.forEach((model, index) => {
      log("gemini.model", {
        index,
        endpoint: model.name,
        displayName: model.displayName,
        version: model.version,
        supportedGenerationMethods: model.supportedGenerationMethods,
      });
    });

    return models;
  } catch (error) {
    logError("gemini.list_models.rest_error", error, { endpoint });
    return [];
  }
}

function selectModel(models: GeminiModelInfo[]) {
  const available = new Set(
    models
      .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
      .map((model) => normalizeModelName(model.name || ""))
      .filter(Boolean),
  );

  for (const candidate of MODEL_CANDIDATES) {
    const normalized = normalizeModelName(candidate);
    if (available.size === 0 || available.has(normalized)) {
      return normalized;
    }
  }

  if (available.size > 0) {
    return Array.from(available)[0];
  }

  return "gemini-pro";
}

export async function POST(req: NextRequest) {
  try {
    log("request_received");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      log("missing_gemini_api_key");
      return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
    }

    let body: unknown = {};
    try {
      body = await req.json();
    } catch (error) {
      logError("request_body_parse_failed", error);
    }

    log("request_body", {
      bodyPreview: truncate(JSON.stringify(body ?? {})),
    });

    const payload = (body && typeof body === "object" ? body : {}) as Record<
      string,
      unknown
    >;

    const signal =
      typeof payload.signal === "string" && compact(payload.signal)
        ? compact(payload.signal)
        : "Open to anything";
    const moduleName =
      typeof payload.module === "string" && compact(payload.module)
        ? compact(payload.module)
        : "General exploration";
    const location =
      typeof payload.location === "string" && compact(payload.location)
        ? compact(payload.location)
        : "Istanbul";

    log("request_normalized", { signal, moduleName, location });

    const client = new GoogleGenerativeAI(apiKey);
    const modelList = await listGeminiModels(client, apiKey);
    const selectedModel = selectModel(modelList);

    log("gemini.model_selected", { selectedModel });

    const model = client.getGenerativeModel({
      model: selectedModel,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const prompt = buildPrompt(signal, moduleName, location);
    log("gemini.generate_start", {
      model: selectedModel,
      promptPreview: truncate(prompt),
    });

    const result = await model.generateContent(prompt);
    const rawText = result?.response?.text?.() || "";

    log("gemini.generate_response", {
      model: selectedModel,
      rawPreview: truncate(rawText),
    });

    const parsed = safeParse(rawText);
    log("gemini.parse_result", {
      success: Boolean(parsed),
      parsed,
    });

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
