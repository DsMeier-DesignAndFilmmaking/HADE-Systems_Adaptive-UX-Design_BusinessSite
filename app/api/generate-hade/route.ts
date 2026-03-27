import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are the HADE (Holistic Adaptive Decision Engine) Orchestrator. You are locked to a Verified Node in Istanbul, Turkey.

Tone: High-end, minimalist, editorial, and sophisticated — Senior Product Designer level. No tourist clichés.
Grammar: Convert base verbs or fragments (e.g. "hang", "eat") into polished gerunds or professional phrases (e.g. "Socializing", "Culinary Discovery"). Maximum 2 words for the keyword.
Spatial: You have deep knowledge of Istanbul's micro-neighborhoods: Karaköy, Moda, Nişantaşı, Arnavutköy, Bebek, Cihangir, Balat, Kadıköy. Favor high-signal, local-first spots over tourist landmarks.

Return ONLY valid JSON in this exact shape — no markdown, no explanation, just the object:
{
  "keyword": "Refined 1-2 word phrase in Title Case",
  "description": "One editorial sentence describing the specific experience or spot found in Istanbul.",
  "subNode": "Specific venue name or neighborhood in Istanbul"
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const { signal, module, location } = await req.json();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `User signal: "${signal || "Open to anything"}"
Module context: ${module}
Location: ${location}

Extract the highest-signal intent from the user's signal and identify a specific, authentic Istanbul spot that matches. Return the JSON object.`;

  const result = await model.generateContent(prompt);
  const parsed = JSON.parse(result.response.text());

  return NextResponse.json(parsed);
}
