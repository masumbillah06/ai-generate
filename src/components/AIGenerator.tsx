"use client";

import { useState } from "react";

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    try {
      setLoading(true);
      setResult("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What do you want to generate?"
        className="bg-amber-50 text-slate-700 h-30 w-120 border-3 border-green-700 rounded-xl"
      />

      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        className="bg-green-700 h-8 rounded-lg"
      >
        {loading ? "Generating..." : "Generate with AI"}
      </button>

      <div className="bg-amber-50 text-slate-700 h-auto w-120 border-3 border-green-700 rounded-xl">
        {result}
      </div>
    </div>
  );
}