import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are the HADE (Holistic Adaptive Decision Engine) Orchestrator. You are locked to a Verified Node in Istanbul, Turkey.

Tone: High-end, minimalist, editorial, and sophisticated — Senior Product Designer level. No tourist clichés.
Grammar: Convert base verbs into refined gerunds (e.g. "Socializing", "Culinary Discovery"). Max 2 words.
Spatial: Use real Istanbul neighborhoods: Karaköy, Moda, Nişantaşı, Bebek, Cihangir, Kadıköy, etc.

Return ONLY valid JSON:
{
  "keyword": "Title Case phrase",
  "description": "One editorial sentence",
  "subNode": "Real place or neighborhood"
}`;

const FALLBACK_RESPONSE = {
  keyword: "Evening Social",
  description:
    "A relaxed, high-signal social atmosphere in Karaköy blending locals, music, and late-night energy.",
  subNode: "Karaköy",
};

function buildPrompt(signal: string, module: string, location: string) {
  return `
User Signal: "${signal}"
Context Module: ${module}
User Location: ${location}

Interpret intent → map to a real Istanbul experience → return JSON only.
`;
}

function safeParse(text: string) {
  try {
    const parsed = JSON.parse(text);
    if (parsed?.keyword && parsed?.description && parsed?.subNode) {
      return parsed;
    }
  } catch {}
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const signal = body?.signal || "Open to anything";
  const module = body?.module || "General exploration";
  const location = body?.location || "Istanbul";

  const prompt = buildPrompt(signal, module, location);

  // -------------------------
  // 1. GEMINI (PRIMARY)
  // -------------------------
  try {
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      const genAI = new GoogleGenerativeAI(geminiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result?.response?.text();

      const parsed = text ? safeParse(text) : null;

      if (parsed) {
        console.log("✅ Gemini success");
        return NextResponse.json(parsed);
      }

      console.error("⚠️ Gemini returned invalid JSON:", text);
    } else {
      console.warn("⚠️ Missing GEMINI_API_KEY");
    }
  } catch (err) {
    console.error("❌ Gemini failed:", err);
  }

  // -------------------------
  // 2. OPENAI (FALLBACK)
  // -------------------------
  try {
    const openaiKey = process.env.OPENAI_API_KEY;

    if (openaiKey) {
      const openai = new OpenAI({ apiKey: openaiKey });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt },
        ],
      });

      const text = completion.choices?.[0]?.message?.content || "";

      const parsed = safeParse(text);

      if (parsed) {
        console.log("✅ OpenAI fallback success");
        return NextResponse.json(parsed);
      }

      console.error("⚠️ OpenAI returned invalid JSON:", text);
    } else {
      console.warn("⚠️ Missing OPENAI_API_KEY");
    }
  } catch (err) {
    console.error("❌ OpenAI failed:", err);
  }

  // -------------------------
  // 3. STATIC HADE (FINAL FALLBACK)
  // -------------------------
  console.warn("🧱 Using static fallback response");

  return NextResponse.json(FALLBACK_RESPONSE);
}