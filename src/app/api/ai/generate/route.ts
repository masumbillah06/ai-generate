import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (
      typeof prompt !== "string" ||
      !prompt.trim() ||
      prompt.length > 5000
    ) {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL!,
      instructions:
        "You are a professional content writer. Generate helpful, clear content.",
      input: prompt,
    });

    return NextResponse.json({
      result: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}