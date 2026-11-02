import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { productName, features } = await req.json();

    if (!productName || !Array.isArray(features)) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL!,
      instructions: `
        You are an expert e-commerce copywriter.
        Generate professional, engaging product descriptions.
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