import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TONES = ["professional", "friendly", "luxury", "playful", "technical"];

export async function POST(req: Request) {
  try {
    const { productName, features, tone = "professional" } = await req.json();

    if (
      typeof productName !== "string" ||
      !productName.trim() ||
      productName.length > 200 ||
      !Array.isArray(features) ||
      features.length === 0 ||
      features.length > 20 ||
      features.some((f) => typeof f !== "string" || f.length > 200) ||
      !TONES.includes(tone)
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL!,
      instructions: `
        You are an expert e-commerce copywriter.
        Generate engaging product descriptions in a ${tone} tone.
        Do not invent product specifications.
        Keep the description under 150 words.
      `,
      input: `
        Product: ${productName}
        Features: ${features.join(", ")}
      `,
    });

    return NextResponse.json({
      success: true,
      description: response.output_text,
    });
  } catch (error) {
    console.error("AI generation failed:", error);

    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}