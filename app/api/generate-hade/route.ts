import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are the HADE (Holistic Adaptive Decision Engine) Orchestrator. You are locked to a Verified Node in Istanbul, Turkey.

Tone: High-end, minimalist, editorial, and sophisticated — Senior Product Designer level. No tourist clichés.
Grammar: Convert base verbs or fragments (e.g. "hang", "eat") into polished gerunds or professional phrases (e.g. "Socializing", "Culinary Discovery"). Maximum 2 words for the keyword.
Spatial: You have deep knowledge of Istanbul's micro-neighborhoods: Karaköy, Moda, Nişantaşı, Arnavutköy, Bebek, Cihangir, Balat, Kadıköy. Favor high-signal, local-first spots over tourist landmarks.

Return ONLY valid JSON in this exact shape:
{
  "keyword": "Refined 1-2 word phrase in Title Case",
  "description": "One editorial sentence describing the specific experience or spot found in Istanbul.",
  "subNode": "Specific venue name or neighborhood in Istanbul"
}`;

const FALLBACK_RESPONSE = {
  keyword: "Evening Social",
  description:
    "A relaxed, high-signal social atmosphere in Karaköy blending locals, music, and late-night energy.",
  subNode: "Karaköy",
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const signal = body?.signal || "Open to anything";
    const module = body?.module || "General exploration";
    const location = body?.location || "Istanbul";

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const prompt = `
User Signal: "${signal}"
Context Module: ${module}
User Location: ${location}

Task:
- Interpret the user's intent
- Map it to a real, specific Istanbul experience
- Return ONLY the JSON object
`;

    const result = await model.generateContent(prompt);

    const text = result?.response?.text();

    if (!text) {
      console.error("Empty response from Gemini");
      return NextResponse.json(FALLBACK_RESPONSE);
    }

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("JSON parse error:", text);
      return NextResponse.json(FALLBACK_RESPONSE);
    }

    // Basic validation (prevents broken UI)
    if (!parsed?.keyword || !parsed?.description || !parsed?.subNode) {
      console.error("Invalid structure:", parsed);
      return NextResponse.json(FALLBACK_RESPONSE);
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("HADE API ERROR:", err);

    return NextResponse.json(
      {
        error: "Failed to generate decision",
        fallback: FALLBACK_RESPONSE,
      },
      { status: 500 }
    );
  }
}