import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { canonicalSchema } from "@/lib/schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { columns } = await req.json();

    if (!columns || !Array.isArray(columns)) {
      return NextResponse.json({ error: "Missing or invalid columns array" }, { status: 400 });
    }

    const prompt = `
You are an AI assistant for insurance data operations. 

Your job is to map uploaded spreadsheet column headers to a canonical insurance schema.

Canonical schema fields:
${canonicalSchema.join(", ")}

Input columns: ${columns.join(", ")}

For each input column, return a JSON array where each object has:
- "input_column": the original column name
- "mapped_to": the canonical field name it maps to, or null if no match
- "confidence": a number from 0.0 to 1.0
- "reasoning": one sentence explaining why

Rules:
- Multiple input columns can map to the same canonical field (flag this as a conflict)
- If confidence is below 0.5, set mapped_to to null
- Never guess randomly — if unsure, say null with low confidence
- Return ONLY valid JSON. No markdown, no explanation outside the array.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response (handle potential markdown blocks)
    let jsonString = text.trim();
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.replace(/^```json\s*/, "").replace(/```$/, "");
    }
    
    const mapping = JSON.parse(jsonString.trim());

    if (!Array.isArray(mapping)) {
      throw new Error("AI returned invalid format (not an array)");
    }

    return NextResponse.json(mapping);
  } catch (error: any) {
    console.error("AI Mapping Error:", error);
    return NextResponse.json({ error: "AI mapping failed", details: error.message }, { status: 500 });
  }
}
