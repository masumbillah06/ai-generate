"use client";

import { useState } from "react";
import { Sparkles, Spinner } from "@/components/icons";

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    try {
      setLoading(true);
      setResult("");
      setError("");

      const res = await fetch("/api/ai/generate", {
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
      setError(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <header>
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Free-form generator
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Describe what you need and let AI draft it for you.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="prompt"
          className="text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What do you want to generate?"
          rows={4}
          className="w-full resize-y rounded-xl border border-stone-300 bg-stone-50 p-3 text-sm text-stone-900 placeholder:text-stone-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:text-stone-900 dark:border-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:placeholder:text-stone-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
        />
      </div>

      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
      >
        {loading ? (
          <>
            <Spinner /> Generating...
          </>
        ) : (
          <>
            <Sparkles /> Generate with AI
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Result
          </span>
          {result && (
            <button
              onClick={copy}
              className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        <div
          aria-live="polite"
          className="min-h-32 whitespace-pre-wrap rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-relaxed text-stone-800 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200"
        >
          {loading ? (
            <div className="space-y-2" aria-label="Generating">
              <div className="h-3 w-11/12 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-3 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            </div>
          ) : (
            result || (
              <span className="text-stone-400 dark:text-stone-500">
                Your generated content will appear here.
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
