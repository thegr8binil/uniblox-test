import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { canonicalSchema } from "@/lib/schema";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  try {
    const { sourceColumns, sampleData } = await req.json();

    if (!sourceColumns || !sampleData) {
      return NextResponse.json({ error: "Missing sourceColumns or sampleData" }, { status: 400 });
    }

    const prompt = `
      You are an expert data engineer. Your task is to map source columns from a spreadsheet to a canonical HR schema.
      
      Canonical Schema:
      ${JSON.stringify(canonicalSchema, null, 2)}
      
      Source Columns:
      ${JSON.stringify(sourceColumns, null, 2)}
      
      Sample Data (first 3 rows):
      ${JSON.stringify(sampleData.slice(0, 3), null, 2)}
      
      Rules:
      1. For each source column, find the best match in the canonical schema.
      2. If no clear match exists, return null for that column.
      3. Provide a confidence score (0.0 to 1.0) and a brief explanation for each mapping.
      4. Return ONLY a JSON object where keys are source columns and values are objects with { target, confidence, explanation }.
      
      Example Output:
      {
        "Emp ID": { "target": "employee_id", "confidence": 1.0, "explanation": "Direct match for employee identifier." },
        "Salary": { "target": "annual_salary", "confidence": 0.9, "explanation": "Matched based on values resembling annual compensation." }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response (handle potential markdown blocks)
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    const mapping = JSON.parse(jsonString);

    return NextResponse.json(mapping);
  } catch (error: any) {
    console.error("AI Mapping Error:", error);
    return NextResponse.json({ error: "Failed to map columns", details: error.message }, { status: 500 });
  }
}
