import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HadeDecision = {
  keyword: string;
  description: string;
  subNode: string;
};

const PROVIDER_TIMEOUT_MS = 10_000;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const GEMINI_MODEL_CANDIDATES = Array.from(
  new Set(
    [
      process.env.GEMINI_MODEL,
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-pro",
    ].filter((value): value is string => Boolean(value)),
  ),
);

const SYSTEM_INSTRUCTION = [
  "You are HADE (Holistic Adaptive Decision Engine) Orchestrator.",
  "Interpret user signals and return one decision object.",
  "Output requirements:",
  '- Return valid JSON with exactly 3 keys: "keyword", "description", "subNode".',
  "- No markdown, no code fences, no prose before/after JSON.",
  "- keyword: concise Title Case phrase (1-3 words).",
  "- description: one sentence (max 22 words).",
  "- subNode: specific node or location string.",
  "If uncertain, make a reasonable best effort but still return valid JSON.",
].join("\n");

const STATIC_FALLBACK: HadeDecision = {
  keyword: "Adaptive Guidance",
  description:
    "HADE is surfacing a clear next step so users can continue forward without friction.",
  subNode: "Primary Flow",
};

const PLACE_NODES = [
  "Karaköy",
  "Moda",
  "Nişantaşı",
  "Bebek",
  "Cihangir",
  "Kadıköy",
  "Beşiktaş",
  "Galata",
];

function logEvent(
  level: "info" | "warn" | "error",
  event: string,
  meta: Record<string, unknown> = {},
) {
  const payload = {
    ts: new Date().toISOString(),
    route: "/api/generate-hade",
    event,
    ...meta,
  };

  const line = `[generate-hade] ${JSON.stringify(payload)}`;
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}

function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, length = 220) {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length)}...`;
}

function buildPrompt(signal: string, moduleName: string, location: string) {
  return [
    "<request>",
    `signal="${signal}"`,
    `module="${moduleName}"`,
    `location="${location}"`,
    "</request>",
    "",
    "Return JSON only.",
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

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const taggedMatch = trimmed.match(/<json>\s*([\s\S]*?)\s*<\/json>/i);
  if (taggedMatch?.[1]) {
    return taggedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  if (firstBrace === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < trimmed.length; i += 1) {
    const char = trimmed[i];

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
        return trimmed.slice(firstBrace, i + 1).trim();
      }
    }
  }

  return null;
}

function regexExtractFields(raw: string): Partial<HadeDecision> {
  const keywordMatch = raw.match(/"keyword"\s*:\s*"([^"]{1,120})"/i);
  const descriptionMatch = raw.match(/"description"\s*:\s*"([^"]{1,400})"/i);
  const subNodeMatch = raw.match(/"subNode"\s*:\s*"([^"]{1,120})"/i);

  return {
    keyword: keywordMatch?.[1],
    description: descriptionMatch?.[1],
    subNode: subNodeMatch?.[1],
  };
}

function isValidDecision(value: unknown): value is HadeDecision {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.keyword === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.subNode === "string" &&
    candidate.keyword.trim().length > 0 &&
    candidate.description.trim().length > 0 &&
    candidate.subNode.trim().length > 0
  );
}

function normalizeDecision(value: HadeDecision): HadeDecision {
  return {
    keyword: compactWhitespace(value.keyword).slice(0, 80),
    description: compactWhitespace(value.description).slice(0, 280),
    subNode: compactWhitespace(value.subNode).slice(0, 80),
  };
}

function parseDecision(raw: string): HadeDecision | null {
  const candidate = extractJsonCandidate(raw) || raw;

  try {
    const parsed = JSON.parse(candidate);
    if (isValidDecision(parsed)) {
      return normalizeDecision(parsed);
    }
  } catch {
    // Falls back to regex extraction below.
  }

  const extracted = regexExtractFields(candidate);
  if (isValidDecision(extracted)) {
    return normalizeDecision(extracted);
  }

  return null;
}

function deriveStaticDecision(
  signal: string,
  moduleName: string,
  location: string,
): HadeDecision {
  const merged = compactWhitespace(`${signal} ${moduleName}`).toLowerCase();

  let keyword = "Adaptive Guidance";
  if (/(onboard|setup|activate|start)/i.test(merged)) {
    keyword = "Activation Flow";
  } else if (/(stuck|idle|confused|drop|blocked)/i.test(merged)) {
    keyword = "Friction Recovery";
  } else if (/(analytics|insight|data|dashboard)/i.test(merged)) {
    keyword = "Insight Mapping";
  } else if (/(team|collab|share)/i.test(merged)) {
    keyword = "Team Enablement";
  }

  const matchedNode = PLACE_NODES.find((node) =>
    new RegExp(node, "i").test(`${signal} ${location}`),
  );

  const subNode = matchedNode || compactWhitespace(location) || "Primary Flow";
  const description = `HADE identified a ${keyword.toLowerCase()} opportunity and recommended a clear next step for ${subNode}.`;

  return normalizeDecision({ keyword, description, subNode });
}

function serializeError(error: unknown) {
  if (error && typeof error === "object") {
    const unknownError = error as {
      message?: string;
      status?: number;
      code?: string;
      name?: string;
      type?: string;
    };

    return {
      name: unknownError.name,
      type: unknownError.type,
      status: unknownError.status,
      code: unknownError.code,
      message: unknownError.message,
    };
  }

  return { message: String(error) };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  provider: string,
): Promise<T> {
  let timeoutRef: NodeJS.Timeout | null = null;

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

async function tryGemini(prompt: string): Promise<HadeDecision | null> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    logEvent("warn", "gemini_skipped_missing_key");
    return null;
  }

  const client = new GoogleGenerativeAI(geminiKey);

  for (const modelName of GEMINI_MODEL_CANDIDATES) {
    try {
      logEvent("info", "gemini_attempt", { model: modelName });

      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      const result = await withTimeout(
        model.generateContent(prompt),
        PROVIDER_TIMEOUT_MS,
        "gemini",
      );
      const rawText = result.response.text();
      const parsed = parseDecision(rawText);

      if (parsed) {
        logEvent("info", "gemini_success", { model: modelName });
        return parsed;
      }

      logEvent("warn", "gemini_parse_failed", {
        model: modelName,
        rawPreview: truncate(rawText),
      });
    } catch (error) {
      logEvent("warn", "gemini_failed", {
        model: modelName,
        error: serializeError(error),
      });
    }
  }

  return null;
}

async function tryOpenAI(prompt: string): Promise<HadeDecision | null> {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    logEvent("warn", "openai_skipped_missing_key");
    return null;
  }

  const client = new OpenAI({ apiKey: openaiKey });

  try {
    logEvent("info", "openai_attempt", { model: OPENAI_MODEL });

    const completion = await withTimeout(
      client.chat.completions.create({
        model: OPENAI_MODEL,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt },
        ],
      }),
      PROVIDER_TIMEOUT_MS,
      "openai",
    );

    const rawText = completion.choices?.[0]?.message?.content ?? "";
    const parsed = parseDecision(rawText);

    if (parsed) {
      logEvent("info", "openai_success", { model: OPENAI_MODEL });
      return parsed;
    }

    logEvent("warn", "openai_parse_failed", {
      model: OPENAI_MODEL,
      rawPreview: truncate(rawText),
    });

    return null;
  } catch (error) {
    const parsedError = serializeError(error);
    logEvent("warn", "openai_failed", {
      model: OPENAI_MODEL,
      error: parsedError,
      quotaIssue:
        parsedError.status === 429 ||
        /quota|insufficient_quota|rate/i.test(parsedError.message || ""),
    });
    return null;
  }
}

function getString(input: unknown, fallback: string) {
  if (typeof input !== "string") {
    return fallback;
  }
  const value = compactWhitespace(input);
  return value || fallback;
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown = {};

    try {
      body = await req.json();
    } catch (error) {
      logEvent("warn", "invalid_request_json", { error: serializeError(error) });
    }

    const payload = (body && typeof body === "object" ? body : {}) as Record<
      string,
      unknown
    >;
    const signal = getString(payload.signal, "Open to anything");
    const moduleName = getString(payload.module, "General exploration");
    const location = getString(payload.location, "Istanbul");

    const prompt = buildPrompt(signal, moduleName, location);

    const geminiDecision = await tryGemini(prompt);
    if (geminiDecision) {
      return NextResponse.json(geminiDecision, { status: 200 });
    }

    const openaiDecision = await tryOpenAI(prompt);
    if (openaiDecision) {
      return NextResponse.json(openaiDecision, { status: 200 });
    }

    const adaptiveFallback = deriveStaticDecision(signal, moduleName, location);
    logEvent("warn", "fallback_used", { reason: "all_providers_failed" });
    return NextResponse.json(adaptiveFallback, { status: 200 });
  } catch (error) {
    logEvent("error", "fatal_route_error", { error: serializeError(error) });
    return NextResponse.json(STATIC_FALLBACK, { status: 200 });
  }
}
